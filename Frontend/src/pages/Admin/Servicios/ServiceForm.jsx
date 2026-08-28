// src/components/admin/ServiceForm.jsx
import { useState } from 'react';

export default function ServiceForm({ formData, setFormData, errors, onSubmit, loading, isEditing = false }) {
  const [newInclude, setNewInclude] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
      
      {/* Categoría */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg outline-none resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Tiempo de Entrega */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tiempo de Entrega *</label>
        <input
          type="text"
          name="delivery_time"
          value={formData.delivery_time}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.delivery_time ? 'border-red-400' : 'border-gray-300'}`}
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none"
          />
          <button
            type="button"
            onClick={handleAddInclude}
            className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold rounded-lg hover:bg-blue-200"
          >
            ➕ Agregar
          </button>
        </div>

        {formData.includes.length > 0 ? (
          <div className="space-y-2">
            {formData.includes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">✓ {item}</span>
                <button type="button" onClick={() => handleRemoveInclude(index)} className="text-red-600 font-semibold">✕</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay elementos agregados aún</p>
        )}
        {errors.includes && <p className="text-red-500 text-sm mt-2">{errors.includes}</p>}
      </div>

      {/* Imagen (Archivo real) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {isEditing ? 'Actualizar Imagen (Opcional)' : 'Imagen del Servicio *'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {isEditing ? 'Si no seleccionas una imagen nueva, se mantendrá la actual.' : 'Selecciona una imagen desde tu computadora.'}
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Guardando...' : (isEditing ? '💾 Guardar Cambios' : '🚀 Crear Servicio')}
        </button>
      </div>

    </form>
  );
}