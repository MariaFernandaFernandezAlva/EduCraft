// src/pages/Admin/Servicios/AddServicio.jsx
// Formulario para crear nuevo servicio

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../../../services/api';
import ServiceForm from './ServiceForm';

export default function AddServicio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    deliveryTime: '',
    includes: [],
    image: '',
    visible: true
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = 'El tiempo de entrega es requerido';
    }
    if (formData.includes.length === 0) {
      newErrors.includes = 'Agrega al menos un elemento al "Qué incluye"';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'La ruta de la imagen es obligatoria';
    }

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
      const result = await createService(formData);

      if (result.success) {
        alert('✅ Servicio creado exitosamente');
        navigate('/admin/servicios');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al crear el servicio' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/servicios')}
          className="text-blue-900 font-semibold hover:text-blue-800 mb-4 flex items-center gap-1"
        >
          ← Volver a Servicios
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          ➕ Crear Nuevo Servicio
        </h1>
      </div>

      {/* Error General */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {errors.submit}</p>
        </div>
      )}

      {/* Formulario Reutilizable */}
      <ServiceForm 
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        loading={loading}
        isEditing={false}
      />

    </div>
  );
}