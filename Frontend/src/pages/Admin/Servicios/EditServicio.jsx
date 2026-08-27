// src/pages/Admin/Servicios/EditServicio.jsx
// Formulario para editar un servicio

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceById, updateService } from '../../../utils/adminApi';

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
    image_path: ''
  });

  const [newInclude, setNewInclude] = useState('');

  // Cargar servicio al montar
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
          image_path: result.data.image_path || ''
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddInclude = () => {
    if (newInclude.trim() && !formData.includes.includes(newInclude)) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude]
      }));
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

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
    if (!formData.delivery_time.trim()) {
      newErrors.delivery_time = 'El tiempo de entrega es requerido';
    }
    if (formData.includes.length === 0) {
      newErrors.includes = 'Agrega al menos un elemento al "Qué incluye"';
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
      const result = await updateService(id, formData);

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
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando servicio...</p>
        </div>
      </div>
    );
  }

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
          ✏️ Editar Servicio
        </h1>
      </div>

      {/* Error General */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {errors.submit}</p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        
        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Categoría *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
              errors.category
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-900'
            }`}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
              errors.title
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-900'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none transition-colors ${
              errors.description
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-900'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Tiempo de Entrega */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tiempo de Entrega *
          </label>
          <input
            type="text"
            name="delivery_time"
            value={formData.delivery_time}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
              errors.delivery_time
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-900'
            }`}
          />
          {errors.delivery_time && <p className="text-red-500 text-sm mt-1">{errors.delivery_time}</p>}
        </div>

        {/* Qué Incluye */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Qué Incluye * ({formData.includes.length} agregados)
          </label>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newInclude}
              onChange={(e) => setNewInclude(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
              placeholder="Ej: Investigación histórica"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={handleAddInclude}
              className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
            >
              ➕ Agregar
            </button>
          </div>

          {formData.includes.length > 0 ? (
            <div className="space-y-2">
              {formData.includes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-gray-900">✓ {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclude(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay elementos agregados aún</p>
          )}

          {errors.includes && <p className="text-red-500 text-sm mt-2">{errors.includes}</p>}
        </div>

        {/* Imagen Path */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL de Imagen (Opcional)
          </label>
          <input
            type="text"
            name="image_path"
            value={formData.image_path}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/servicios')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              '💾 Guardar Cambios'
            )}
          </button>
        </div>

      </form>

    </div>
  );
}