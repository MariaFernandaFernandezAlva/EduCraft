// src/components/admin/ServiceForm.jsx
import { useState } from "react";

export default function ServiceForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  loading,
  isEditing = false,
}) {
  const [newInclude, setNewInclude] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInclude = () => {
    if (newInclude.trim() && !formData.includes.includes(newInclude)) {
      setFormData((prev) => ({
        ...prev,
        includes: [...prev.includes, newInclude],
      }));
      setNewInclude("");
    }
  };

  const handleRemoveInclude = (index) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow p-8 space-y-6"
    >
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
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.category ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
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
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.title ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
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
          className={`w-full px-4 py-3 border rounded-lg outline-none resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Tiempo de Entrega */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tiempo de Entrega *
        </label>
        <input
          type="text"
          name="deliveryTime"
          value={formData.deliveryTime}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.deliveryTime ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.deliveryTime && (
          <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>
        )}
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
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddInclude())
            }
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
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-gray-900">✓ {item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInclude(index)}
                  className="text-red-600 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay elementos agregados aún</p>
        )}
        {errors.includes && (
          <p className="text-red-500 text-sm mt-2">{errors.includes}</p>
        )}
      </div>

      {/* Imagen (ruta pública) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ruta de la Imagen *
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="/images/services/maqueta.webp"
          className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.image ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Sube el archivo a <code>public/images/services/</code> y escribe aquí
          la ruta, empezando con <code>/</code>.
        </p>

        {/* Vista previa: si la ruta está mal, el navegador no muestra nada */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Vista previa"
            className="mt-3 h-32 w-auto rounded-lg border border-gray-200 object-cover"
          />
        )}
      </div>

      {/* Visible en la landing */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="visible"
          checked={formData.visible}
          onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
          className="w-5 h-5 rounded border-gray-300"
        />
        <label htmlFor="visible" className="text-sm font-semibold text-gray-700">
          Mostrar este servicio en la página pública
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading
            ? "Guardando..."
            : isEditing
              ? "💾 Guardar Cambios"
              : "🚀 Crear Servicio"}
        </button>
      </div>
    </form>
  );
}
