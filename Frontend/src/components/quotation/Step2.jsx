import { useState } from "react";
import { projectTypes, academicLevels } from "../../data/quotationOptions";
import FormError from "../common/FormError";

export default function Step2({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({
    projectType: "",
    academicLevel: "",
    description: "",
  });

  const [previewOk, setPreviewOk] = useState(null);

  const handleProjectTypeSelect = (typeName) => {
    setFormData((prev) => ({
      ...prev,
      projectType: typeName,
    }));
    if (errors.projectType) {
      setErrors((prev) => ({ ...prev, projectType: "" }));
    }
  };

  const handleAcademicLevelSelect = (levelName) => {
    setFormData((prev) => ({
      ...prev,
      academicLevel: levelName,
    }));
    if (errors.academicLevel) {
      setErrors((prev) => ({ ...prev, academicLevel: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 600) {
      setFormData((prev) => ({
        ...prev,
        description: value,
      }));
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: "" }));
      }
    }
  };

  const handleReferenceLinkChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      referenceLink: e.target.value,
    }));
    setPreviewOk(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectType) {
      newErrors.projectType = "Por favor selecciona un tipo de proyecto";
    }

    if (!formData.academicLevel) {
      newErrors.academicLevel = "Por favor selecciona un nivel académico";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Por favor describe tu proyecto";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "La descripción debe tener al menos 20 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cabecera del paso */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-amber-600 uppercase">
            Paso 2 de 3
          </span>
          <h2 className="font-serif text-3xl font-bold text-azul mt-1">
            Detalles del proyecto
          </h2>
        </div>
        <span className="text-xs font-semibold text-marron bg-amarillo/10 px-4 py-2 rounded-full">
          35% completo
        </span>
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-3">
          Tipo de proyecto
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {projectTypes.map((type) => {
            // 1. Aquí guardamos cada icono del arreglo en una constante con la primera letra en mayúscula
            const IconComponent = type.icon;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleProjectTypeSelect(type.name)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 text-left ${
                  formData.projectType === type.name
                    ? "border-azul bg-white shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="p-2 bg-slate-100/80 rounded-xl text-azul">
                  <IconComponent className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {type.name}
                </span>
              </button>
            );
          })}
        </div>
        <FormError message={errors.projectType} />
      </div>

      {/* Academic Level */}
        <div className="md:col-span-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-3">
            Nivel académico
          </label>
          <div className="flex flex-wrap gap-2">
            {academicLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => handleAcademicLevelSelect(level.name)}
                className={`px-5 py-3 rounded-full border-2 transition-all duration-300 font-semibold text-xs ${
                  formData.academicLevel === level.name
                    ? "border-azul bg-azul text-white shadow-xs"
                    : "border-slate-200 text-slate-700 bg-white hover:border-slate-300"
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
          <FormError message={errors.academicLevel} />
        </div>

      {/* Description */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-azul">
            Descripción detallada
          </label>
          <span className="text-[11px] text-slate-400">
            {formData.description.length}/600 caracteres
          </span>
        </div>
        <textarea
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Materiales (cartón, reciclables, impresión 3D), colores, dimensiones o instrucciones del docente..."
          rows="4"
          className={`w-full p-4 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none resize-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 ${
            errors.description
              ? "border-red-400 focus:ring-red-300"
              : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
          }`}
        />
        <FormError message={errors.description} />
      </div>

      {/* Reference Link (Mantiene tu funcionalidad intacta tal cual la pediste) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-2">
          Referencia visual (opcional)
        </label>
        <input
          type="url"
          value={formData.referenceLink}
          onChange={handleReferenceLinkChange}
          placeholder="https://i.imgur.com/ejemplo.jpg"
          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400"
        />

        {/* Vista previa: solo intentamos si hay algo escrito */}
        {formData.referenceLink.trim() && (
          <div className="mt-4">
            <img
              key={formData.referenceLink}
              src={formData.referenceLink}
              alt="Vista previa de la referencia"
              onLoad={() => setPreviewOk(true)}
              onError={() => setPreviewOk(false)}
              className={`w-full max-h-64 object-contain rounded-xl border-2 border-green-300 bg-slate-50 ${
                previewOk === true ? "block" : "hidden"
              }`}
            />

            {previewOk === false && (
              <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800">
                  ⚠️ No pudimos mostrar esta imagen
                </p>
                <p className="text-[11px] text-amber-700 mt-1">
                  El enlace debe apuntar directo a la imagen y terminar en .jpg,
                  .png o .webp.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-2">
          ¿Tienes imágenes de referencia? Súbelas a un servicio como Imgur y
          pega aquí el enlace.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-full border border-slate-200 text-azul hover:bg-slate-50 font-semibold transition-all duration-200 flex items-center gap-2"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="px-8 py-3.5 bg-azul hover:bg-azul/80 text-white font-semibold rounded-full transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          Siguiente paso →
        </button>
      </div>
    </form>
  );
}
