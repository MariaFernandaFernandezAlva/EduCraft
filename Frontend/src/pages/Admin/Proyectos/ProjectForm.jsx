import { useState } from "react";
import { PROJECT_CATEGORIES } from "../../../data/categories";

export default function ProjectForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  loading,
  isEditing = false,
}) {
  const [newInclude, setNewInclude] = useState("");
  const [newImage, setNewImage] = useState("");
  const NIVELES = ["Inicial", "Primaria", "Secundaria"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Qué incluye ---
  const handleAddInclude = () => {
    if (newInclude.trim() && !formData.includes.includes(newInclude.trim())) {
      setFormData((prev) => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()],
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

  const nivel = formData.meta?.[0] || "";
  const entregaTexto = formData.meta?.[1] || "";
  const materia = formData.meta?.[2] || "";
  const entregaNumero = entregaTexto.replace(/\D/g, "");

  const setMeta = (indice, valor) => {
    setFormData((prev) => {
      const actual = prev.meta || [];
      const nuevo = [actual[0] || "", actual[1] || "", actual[2] || ""];
      nuevo[indice] = valor;
      return { ...prev, meta: nuevo };
    });
  };

  const handleEntregaChange = (e) => {
    const numero = e.target.value.replace(/\D/g, "");
    setMeta(1, numero ? `${numero} días` : "");
  };

  // --- Galería de imágenes ---
  const handleAddImage = () => {
    const ruta = newImage.trim();
    if (ruta && !formData.images.includes(ruta)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ruta] }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Mover una imagen de posición. La primera del array es la portada,
  // así que el admin necesita poder reordenar.
  const handleMoveImage = (index, direccion) => {
    const destino = index + direccion;
    if (destino < 0 || destino >= formData.images.length) return;

    const copia = [...formData.images];
    // Intercambio clásico de dos posiciones.
    [copia[index], copia[destino]] = [copia[destino], copia[index]];
    setFormData((prev) => ({ ...prev, images: copia }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow p-8 space-y-6"
    >
      {/* Categoría: select, no texto libre.
          Así el admin nunca escribe una categoría que no tenga color. */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categoría *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg outline-none bg-white ${errors.category ? "border-red-400" : "border-gray-300"}`}
        >
          <option value="">-- Selecciona una categoría --</option>
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
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

      {/* Galería de imágenes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Imágenes del Proyecto * ({formData.images.length})
        </label>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            // e.preventDefault() evita que Enter envíe el formulario entero.
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddImage())
            }
            placeholder="/images/projects/mi-foto.webp"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold rounded-lg hover:bg-blue-200"
          >
            ➕ Agregar
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formData.images.map((ruta, index) => (
              <div
                key={ruta}
                className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
              >
                {/* Vista previa: si la ruta está mal, no se ve nada.
                    Esa es toda la validación posible sin backend. */}
                <img
                  src={ruta}
                  alt={`Imagen ${index + 1}`}
                  className="h-28 w-full object-cover"
                />

                {/* La primera del array es la portada */}
                {index === 0 && (
                  <span className="absolute top-1 left-1 px-2 py-0.5 bg-blue-900 text-white text-xs rounded">
                    Portada
                  </span>
                )}

                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, -1)}
                      disabled={index === 0}
                      className="px-1 text-gray-600 disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, 1)}
                      disabled={index === formData.images.length - 1}
                      className="px-1 text-gray-600 disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 font-semibold text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">
            Todavía no agregas imágenes. Se necesita al menos una.
          </p>
        )}

        {errors.images && (
          <p className="text-red-500 text-sm mt-2">{errors.images}</p>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Sube los archivos a <code>public/images/projects/</code> y escribe
          aquí la ruta, empezando con <code>/</code>.
        </p>
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
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddInclude())
            }
            placeholder="Ej: Luces LED integradas"
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

      {/* Datos rápidos */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Datos rápidos
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nivel: lista cerrada */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Nivel
            </label>
            <select
              value={nivel}
              onChange={(e) => setMeta(0, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
            >
              <option value="">-- Selecciona --</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Entrega: solo el número */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Entrega
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={entregaNumero}
                onChange={handleEntregaChange}
                placeholder="5"
                className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-lg outline-none"
              />
              {/* La palabra "días" va fija dentro del campo:
                  así el admin ve el resultado sin poder escribirla. */}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                días
              </span>
            </div>
          </div>

          {/* Materia: texto libre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Materia
            </label>
            <input
              type="text"
              value={materia}
              onChange={(e) => setMeta(2, e.target.value)}
              placeholder="Ej: Biología"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Se muestran como etiquetas en la tarjeta del portafolio. Los tres son
          opcionales.
        </p>
      </div>

      {/* Visible */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="visible"
          checked={formData.visible}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, visible: e.target.checked }))
          }
          className="w-5 h-5 rounded border-gray-300"
        />
        <label
          htmlFor="visible"
          className="text-sm font-semibold text-gray-700"
        >
          Mostrar este proyecto en el portafolio público
        </label>
      </div>

      {/* Botón */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Guardando..."
            : isEditing
              ? "💾 Guardar Cambios"
              : "🚀 Crear Proyecto"}
        </button>
      </div>
    </form>
  );
}
