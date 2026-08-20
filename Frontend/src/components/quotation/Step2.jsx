import { useState } from "react";
import { projectTypes, academicLevels } from "../../data/quotationOptions";
import FormError from "../common/FormError";

export default function Step2({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({
    projectType: "",
    academicLevel: "",
    description: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData(prev => ({
        ...prev,
        referenceFile: file
      }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      referenceFile: null
    }));
    setImagePreview(null);
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

      {/* Reference Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Referencia de Trabajo (Opcional)
        </label>
        
        {imagePreview ? (
          // Preview cuando hay imagen
          <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                📎 {formData.referenceFile.name}
              </p>
              <p className="text-xs text-gray-600">
                Tamaño: {(formData.referenceFile.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                ✕ Eliminar Imagen
              </button>
              <label htmlFor="referenceFile" className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="referenceFile"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('referenceFile').click()}
                  className="w-full px-4 py-2 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  🔄 Cambiar Imagen
                </button>
              </label>
            </div>
          </div>
        ) : (
          // Área de carga cuando no hay imagen
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-900 hover:bg-blue-50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="referenceFile"
            />
            <label htmlFor="referenceFile" className="cursor-pointer block">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm font-semibold text-gray-700">
                Sube una imagen de referencia
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG o GIF (máx. 5MB)</p>
            </label>
          </div>
        )}
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