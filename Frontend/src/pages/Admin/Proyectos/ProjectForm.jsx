import { useState } from "react";
import { PROJECT_CATEGORIES } from "../../../data/categories";

// meta es un array posicional: nombrar los índices evita adivinar qué es cada uno.
const META_NIVEL = 0;
const META_ENTREGA = 1;
const META_MATERIA = 2;

const NIVELES = ["Inicial", "Primaria", "Secundaria"];

const labelClass =
  "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-hidden transition-colors focus:border-blue-500 ${
    hasError ? "border-red-400 bg-red-50/40" : "border-slate-200 bg-slate-50"
  }`;

export default function ProjectForm({
  formId,
  formData,
  setFormData,
  errors,
  onSubmit,
}) {
  const [newInclude, setNewInclude] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- meta ---
  const nivel = formData.meta?.[META_NIVEL] || "";
  const materia = formData.meta?.[META_MATERIA] || "";
  const entregaNumero = (formData.meta?.[META_ENTREGA] || "").replace(/\D/g, "");

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
    setMeta(META_ENTREGA, numero ? `${numero} días` : "");
  };

  // --- includes ---
  const handleAddInclude = () => {
    const value = newInclude.trim();
    if (!value || formData.includes.includes(value)) return;
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, value] }));
    setNewInclude("");
  };

  const handleRemoveInclude = (index) =>
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));

  // --- galería ---
  const handleAddImage = () => {
    const ruta = newImage.trim();
    if (!ruta || formData.images.includes(ruta)) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, ruta] }));
    setNewImage("");
  };

  const handleRemoveImage = (index) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  // La primera del array es la portada, por eso el admin necesita reordenar.
  const handleMoveImage = (index, direccion) => {
    const destino = index + direccion;
    if (destino < 0 || destino >= formData.images.length) return;

    const copia = [...formData.images];
    [copia[index], copia[destino]] = [copia[destino], copia[index]];
    setFormData((prev) => ({ ...prev, images: copia }));
  };

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-5">
      {/* Categoría */}
      <div>
        <label className={labelClass}>CATEGORÍA *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`${inputClass(errors.category)} bg-slate-50`}
        >
          <option value="">-- Selecciona una categoría --</option>
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Título */}
      <div>
        <label className={labelClass}>TÍTULO *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Maqueta ADN 3D"
          className={inputClass(errors.title)}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>DESCRIPCIÓN *</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el proyecto en una o dos líneas claras."
          className={`${inputClass(errors.description)} resize-none`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Galería */}
      <div>
        <label className={labelClass}>
          IMÁGENES DEL PROYECTO * ({formData.images.length})
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
            placeholder="/images/projects/mi-foto.webp"
            className={inputClass(false)}
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="shrink-0 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-blue-950 transition-colors hover:bg-amber-300"
          >
            Agregar
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {formData.images.map((ruta, index) => (
              <div
                key={ruta}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <div className="relative">
                  <img
                    src={ruta}
                    alt={`Imagen ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-blue-950 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Portada
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, -1)}
                      disabled={index === 0}
                      aria-label="Mover a la izquierda"
                      className="px-1 text-slate-500 disabled:opacity-25"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, 1)}
                      disabled={index === formData.images.length - 1}
                      aria-label="Mover a la derecha"
                      className="px-1 text-slate-500 disabled:opacity-25"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label={`Quitar imagen ${index + 1}`}
                    className="px-1 text-xs text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-xs">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="m4 17 5-4 4 3 3-2 4 3" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Todavía no agregas imágenes
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Sube los archivos a <code>public/images/projects/</code> y escribe
              aquí la ruta empezando con <code>/</code>.
            </p>
          </div>
        )}

        {errors.images && (
          <p className="mt-2 text-xs text-red-500">{errors.images}</p>
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
            placeholder="Ej: Guía de exposición impresa"
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
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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

      {/* Datos rápidos */}
      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-[11px] font-semibold tracking-wide text-slate-500">
          DATOS RÁPIDOS
        </legend>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>NIVEL</label>
            <select
              value={nivel}
              onChange={(e) => setMeta(META_NIVEL, e.target.value)}
              className={inputClass(false)}
            >
              <option value="">--</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>ENTREGA</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={entregaNumero}
                onChange={handleEntregaChange}
                placeholder="5"
                className={`${inputClass(false)} pr-12`}
              />
              {/* "días" fijo dentro del campo: el admin ve el resultado sin escribirlo */}
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
                días
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>MATERIA</label>
            <input
              type="text"
              value={materia}
              onChange={(e) => setMeta(META_MATERIA, e.target.value)}
              placeholder="Biología"
              className={inputClass(false)}
            />
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Se muestran como etiquetas en la tarjeta del portafolio. Los tres son
          opcionales.
        </p>
      </fieldset>

      {/* Visible */}
      <label
        htmlFor="visible"
        className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-800">
            Mostrar en el portafolio público
          </span>
          <span className="block text-[11px] text-slate-500">
            Puedes ocultarlo mientras preparas las fotos.
          </span>
        </span>

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