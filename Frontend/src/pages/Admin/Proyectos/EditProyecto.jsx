// src/pages/Admin/Proyectos/EditProyecto.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../../../services/api';
import ProjectForm from './ProjectForm';

export default function EditProyecto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    images: [],
    includes: [],
    visible: true
  });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoadingInitial(true);
      const result = await getProjectById(id);

      if (result.success) {
        setFormData({
          category: result.data.category || '',
          title: result.data.title || '',
          description: result.data.description || '',
          images: result.data.images || [],
          includes: result.data.includes || [],
          visible: result.data.visible ?? true
        });
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al cargar el proyecto' });
    } finally {
      setLoadingInitial(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = 'Selecciona una categoría';
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.includes.length === 0) newErrors.includes = 'Agrega al menos un elemento';
    if (formData.images.length === 0) newErrors.images = 'Agrega al menos una imagen';
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
      const result = await updateProject(id, formData);

      if (result.success) {
        alert('✅ Proyecto actualizado exitosamente');
        navigate('/admin/proyectos');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al actualizar el proyecto' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="text-center py-20">Cargando proyecto...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button onClick={() => navigate('/admin/proyectos')} className="text-blue-900 font-semibold mb-4">
          ← Volver a Proyectos
        </button>
        <h1 className="text-3xl font-bold text-gray-900">✏️ Editar Proyecto</h1>
      </div>

      {errors.submit && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{errors.submit}</div>}

      <ProjectForm
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