import { useState } from "react";
import { projectTypes, academicLevels } from "../../data/quotationOptions";
import FormError from "../common/FormError";

export default function Step2({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({
    projectType: "",
    academicLevel: "",
    description: ""
  });

  const [previewOk, setPreviewOk] = useState(null);
  
  const handleProjectTypeSelect = (typeName) => {
    setFormData(prev => ({
      ...prev,
      projectType: typeName
    }));
    if (errors.projectType) {
      setErrors(prev => ({ ...prev, projectType: "" }));
    }
  };

  const handleAcademicLevelSelect = (levelName) => {
    setFormData(prev => ({
      ...prev,
      academicLevel: levelName
    }));
    if (errors.academicLevel) {
      setErrors(prev => ({ ...prev, academicLevel: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const handleReferenceLinkChange = (e) => {
    setFormData(prev => ({
      ...prev,
      referenceLink: e.target.value
    }));
    // Cada vez que cambia el enlace, volvemos a "no sabemos"
    // hasta que el navegador intente cargarlo de nuevo.
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
      newErrors.description = "La descripción debe tener al menos 20 caracteres";
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
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Project Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Tipo de Proyecto
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {projectTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleProjectTypeSelect(type.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                formData.projectType === type.name
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-xs font-semibold text-center">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Academic Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Nivel Académico
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {academicLevels.map(level => (
            <button
              key={level.id}
              type="button"
              onClick={() => handleAcademicLevelSelect(level.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold text-center ${
                formData.academicLevel === level.name
                  ? "border-blue-900 bg-blue-50 text-blue-900"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción Detallada del Proyecto
        </label>
        <textarea
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Especifica materiales (cartón, reciclables, impresión 3D), colores, dimensiones o instrucciones especiales de los docentes..."
          rows="5"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none transition-colors duration-200 ${
            errors.description 
              ? "border-red-400 focus:ring-red-300" 
              : "border-gray-300 focus:ring-blue-900"
          }`}
        />
        <FormError message={errors.description} />
      </div>

      {/* Reference Link */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enlace de Referencia (Opcional)
        </label>
        <input
          type="url"
          value={formData.referenceLink}
          onChange={handleReferenceLinkChange}
          placeholder="https://i.imgur.com/ejemplo.jpg"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-colors duration-200"
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
              className={`w-full max-h-64 object-contain rounded-lg border-2 border-green-300 bg-gray-50 ${
                previewOk === true ? "block" : "hidden"
              }`}
            />

            {previewOk === false && (
              <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-800">
                  ⚠️ No pudimos mostrar esta imagen
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  El enlace debe apuntar directo a la imagen y terminar en
                  .jpg, .png o .webp. Los enlaces de Google Drive o Dropbox
                  no funcionan aquí, pero igual puedes enviarlo: nosotros lo
                  abriremos por nuestra cuenta.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          ¿Tienes imágenes de referencia? Súbelas a un servicio como Imgur y pega
          aquí el enlace. También puedes enviárnoslas por WhatsApp después de
          solicitar tu cotización.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-300"
        >
          Siguiente Paso →
        </button>
      </div>

    </form>
  );
}