// src/pages/Admin/Proyectos/AddProyecto.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../../services/api';
import ProjectForm from './ProjectForm';

export default function AddProyecto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    images: [],
    includes: [],
    visible: true
  });

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
      const result = await createProject(formData);

      if (result.success) {
        alert('✅ Proyecto creado exitosamente');
        navigate('/admin/proyectos');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'Error al crear el proyecto' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate('/admin/proyectos')}
          className="text-blue-900 font-semibold hover:text-blue-800 mb-4 flex items-center gap-1"
        >
          ← Volver a Proyectos
        </button>
        <h1 className="text-3xl font-bold text-gray-900">➕ Crear Nuevo Proyecto</h1>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {errors.submit}</p>
        </div>
      )}

      <ProjectForm
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