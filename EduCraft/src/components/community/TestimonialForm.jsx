import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import FormError from "../common/FormError";
import StarRating from "../common/StarRating";

export default function TestimonialForm({ onAddTestimonial }) {
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    rating: 5,
    comment: "",
    projectPhotos: [] // Array de imágenes
  });

  const [errors, setErrors] = useState({
    name: "",
    role: "",
    comment: "",
    projectPhotos: ""
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      // Agregar nuevas fotos a las existentes
      const newPhotos = [...formData.projectPhotos, ...files];
      
      // Limitar a máximo 5 imágenes
      if (newPhotos.length > 5) {
        addToast("Máximo 5 imágenes permitidas", "error", 3000);
        return;
      }

      setFormData(prev => ({
        ...prev,
        projectPhotos: newPhotos
      }));

      // Crear previews de todas las nuevas fotos
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
      
      if (errors.projectPhotos) {
        setErrors(prev => ({
          ...prev,
          projectPhotos: ""
        }));
      }
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      projectPhotos: prev.projectPhotos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllPhotos = () => {
    setFormData(prev => ({
      ...prev,
      projectPhotos: []
    }));
    setPhotoPreviews([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Por favor ingresa tu nombre completo";
    }

    if (!formData.role.trim()) {
      newErrors.role = "La relación con EduCraft es requerida (ej: Madre de familia, Docente)";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "El comentario es requerido";
    } else if (formData.comment.trim().length < 20) {
      newErrors.comment = "El comentario debe tener al menos 20 caracteres";
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

    // Crear nuevo testimonio con todas las imágenes
    const newTestimonial = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      rating: formData.rating,
      comment: formData.comment,
      avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      date: new Date(),
      images: photoPreviews // Array de todas las imágenes
    };

    // Agregar el testimonio
    onAddTestimonial(newTestimonial);

    // Mostrar notificación
    addToast(
      `¡Gracias ${formData.name}! Tu testimonio ha sido publicado exitosamente.`,
      "success",
      4000
    );

    // Limpiar formulario
    setFormData({
      name: "",
      role: "",
      rating: 5,
      comment: "",
      projectPhotos: []
    });
    setPhotoPreviews([]);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
      
      <h3 className="text-2xl font-bold text-blue-900 mb-2">
        Comparte tu experiencia
      </h3>
      <p className="text-gray-600 mb-8">
        ¿Has trabajado con nosotros recientemente? Nos encantaría saber cuál fue el proceso de creación de tu proyecto. Tu opinión ayuda a otros estudiantes y padres a confiar en nuestros servicios.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Rating with StarRating Component */}
        <StarRating 
          value={formData.rating} 
          onChange={(newRating) => 
            setFormData(prev => ({
              ...prev,
              rating: newRating
            }))
          }
        />

        {/* Name and Role - Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Ani García"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
                errors.name 
                  ? "border-red-400 focus:ring-red-300" 
                  : "border-gray-300 focus:ring-blue-900"
              }`}
            />
            <FormError message={errors.name} />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rol / Relación con Educraft
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ej. Madre de familia"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
                errors.role 
                  ? "border-red-400 focus:ring-red-300" 
                  : "border-gray-300 focus:ring-blue-900"
              }`}
            />
            <FormError message={errors.role} />
          </div>

        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tu testimonio
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Cuéntanos sobre tu experiencia..."
            rows="5"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none transition-colors duration-200 ${
              errors.comment 
                ? "border-red-400 focus:ring-red-300" 
                : "border-gray-300 focus:ring-blue-900"
            }`}
          />
          <FormError message={errors.comment} />
          <p className="text-xs text-gray-500 mt-2">
            {formData.comment.length}/300 caracteres
          </p>
        </div>

        {/* Project Photos - MULTIPLE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fotos de tu proyecto (Opcional) - Máximo 5 imágenes
          </label>
          
          {/* Photo Previews */}
          {photoPreviews.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {photoPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200"
                    >
                      <span className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        ✕
                      </span>
                    </button>

                    {/* Image Number */}
                    <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <label htmlFor="projectPhotos" className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotosChange}
                    className="hidden"
                    id="projectPhotos"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('projectPhotos').click()}
                    className="w-full px-4 py-2 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    ➕ Agregar más fotos
                  </button>
                </label>
                
                <button
                  type="button"
                  onClick={handleClearAllPhotos}
                  className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  🗑️ Limpiar todo
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                {photoPreviews.length} / 5 imágenes subidas
              </p>
            </div>
          )}

          {/* Upload Area */}
          {photoPreviews.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-900 hover:bg-blue-50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotosChange}
                className="hidden"
                id="projectPhotos"
                multiple
              />
              <label htmlFor="projectPhotos" className="cursor-pointer block">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm font-semibold text-gray-700">
                  Sube fotos o haz clic para subir
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG o GIF (máx. 5 imágenes)</p>
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          ▶ Enviar Testimonio
        </button>

      </form>
    </div>
  );
}