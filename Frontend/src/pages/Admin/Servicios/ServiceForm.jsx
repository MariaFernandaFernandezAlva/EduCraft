import { useState } from "react";

const labelClass =
  "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-hidden transition-colors focus:border-blue-500 ${
    hasError ? "border-red-400 bg-red-50/40" : "border-slate-200 bg-slate-50"
  }`;

export default function ServiceForm({
  formId,
  formData,
  setFormData,
  errors,
  onSubmit,
}) {
  const [newInclude, setNewInclude] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInclude = () => {
    const value = newInclude.trim();
    if (!value || formData.includes.includes(value)) return;
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, value] }));
    setNewInclude("");
  };

  const handleRemoveInclude = (index) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-5">
      {/* Categoría + Entrega en la misma fila */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CATEGORÍA *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Maquetas"
            className={inputClass(errors.category)}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
          <p className="mt-1 text-[11px] text-slate-400">
            Define el color con el que se agrupa en el panel.
          </p>
        </div>

        <div>
          <label className={labelClass}>TIEMPO DE ENTREGA *</label>
          <input
            type="text"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            placeholder="5–8 días"
            className={inputClass(errors.deliveryTime)}
          />
          {errors.deliveryTime && (
            <p className="mt-1 text-xs text-red-500">{errors.deliveryTime}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>TÍTULO *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Maquetas Profesionales 3D"
          className={inputClass(errors.title)}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>DESCRIPCIÓN *</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el servicio en una o dos líneas claras."
          className={`${inputClass(errors.description)} resize-none`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Qué incluye */}
      <div>
        <label className={labelClass}>
          QUÉ INCLUYE ({formData.includes.length} AGREGADOS)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddInclude();
              }
            }}
            placeholder="Ej: Investigación histórica"
            className={inputClass(false)}
          />
          <button
            type="button"
            onClick={handleAddInclude}
            className="shrink-0 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-blue-950 transition-colors hover:bg-amber-300"
          >
            Agregar
          </button>
        </div>

        {formData.includes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.includes.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pr-1.5 pl-3 text-xs text-slate-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInclude(index)}
                  aria-label={`Quitar ${item}`}
                  className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400 italic">
            No hay elementos agregados aún
          </p>
        )}

        {errors.includes && (
          <p className="mt-2 text-xs text-red-500">{errors.includes}</p>
        )}
      </div>

      {/* Imagen */}
      <div>
        <label className={labelClass}>RUTA DE LA IMAGEN *</label>
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          {formData.image ? (
            <img
              src={formData.image}
              alt="Vista previa"
              className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="m4 17 5-4 4 3 3-2 4 3" />
              </svg>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/services/maqueta.webp"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-hidden ${
                errors.image ? "border-red-400" : "border-slate-200"
              }`}
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Sube el archivo a <code>public/images/services/</code> y escribe
              la ruta empezando con <code>/</code>.
            </p>
          </div>
        </div>
        {errors.image && (
          <p className="mt-1 text-xs text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Visible */}
      <label
        htmlFor="visible"
        className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-800">
            Mostrar en la página pública
          </span>
          <span className="block text-[11px] text-slate-500">
            Puedes ocultarlo mientras lo preparas.
          </span>
        </span>

        {/* Switch: checkbox real oculto + pista visual con peer */}
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            id="visible"
            checked={formData.visible}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, visible: e.target.checked }))
            }
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 peer-focus-visible:ring-offset-2" />
          <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
        </span>
      </label>
    </form>
  );
}