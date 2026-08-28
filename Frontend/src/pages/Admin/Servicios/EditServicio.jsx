// src/pages/Admin/Servicios/EditServicio.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceById, updateService } from '../../../utils/adminApi';
import ServiceForm from "./ServiceForm";

export default function EditServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    delivery_time: '',
    includes: [],
    image: null
  });

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoadingInitial(true);
      const result = await getServiceById(id);
      if (result.success) {
        setFormData({
          category: result.data.category,
          title: result.data.title,
          description: result.data.description,
          delivery_time: result.data.delivery_time,
          includes: result.data.includes || [],
          image: null
        });
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al cargar el servicio' });
    } finally {
      setLoadingInitial(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = 'La categoría es requerida';
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.delivery_time.trim()) newErrors.delivery_time = 'El tiempo de entrega es requerido';
    if (formData.includes.length === 0) newErrors.includes = 'Agrega al menos un elemento';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      
      // 👇 ¡ESTO ES LO QUE FALTABA! Enviar el ID para que PHP sepa qué servicio editar
      dataToSend.append('id', id); 
      
      dataToSend.append('category', formData.category);
      dataToSend.append('title', formData.title);
      dataToSend.append('description', formData.description);
      dataToSend.append('delivery_time', formData.delivery_time);
      dataToSend.append('includes', JSON.stringify(formData.includes));
      
      if (formData.image instanceof File) {
        dataToSend.append('image', formData.image);
      }

      const result = await updateService(id, dataToSend);

      if (result.success) {
        alert('✅ Servicio actualizado exitosamente');
        navigate('/admin/servicios');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al actualizar el servicio' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="text-center py-20">Cargando servicio...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button onClick={() => navigate('/admin/servicios')} className="text-blue-900 font-semibold mb-4">
          ← Volver a Servicios
        </button>
        <h1 className="text-3xl font-bold text-gray-900">✏️ Editar Servicio</h1>
      </div>

      {errors.submit && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{errors.submit}</div>}

      <ServiceForm 
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        loading={loading}
        isEditing={true}
      />
    </div>
  );
}