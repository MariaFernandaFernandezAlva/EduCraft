import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { createTestimonial } from "../../services/api";
import FormError from "../common/FormError";
import StarRating from "../common/StarRating";

export default function TestimonialForm({ onAddTestimonial }) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    rating: 5,
    comment: "",
    images: []
  });

  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState("");
  const [previewOk, setPreviewOk] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAgregarFoto = () => {
    const ruta = nuevaFoto.trim();
    if (!ruta) return;

    if (formData.images.length >= 5) {
      addToast("Máximo 5 imágenes permitidas", "error", 3000);
      return;
    }

    if (formData.images.includes(ruta)) {
      addToast("Ese enlace ya está agregado", "error", 3000);
      return;
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ruta] }));
    setNuevaFoto("");
    setPreviewOk(null);
  };

  const handleQuitarFoto = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Por favor ingresa tu nombre completo";
    }

    if (!formData.role.trim()) {
      newErrors.role = "La relación con EduCraft es requerida";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "El comentario es requerido";
    } else if (formData.comment.trim().length < 20) {
      newErrors.comment = "El comentario debe tener al menos 20 caracteres";
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

    setEnviando(true);

    const avatar = formData.name
      .trim()
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const result = await createTestimonial({ ...formData, avatar });

    setEnviando(false);

    if (!result.success) {
      addToast("No pudimos enviar tu testimonio. Intenta de nuevo.", "error", 4000);
      return;
    }

    onAddTestimonial(result.data);

    addToast(
      `¡Gracias ${formData.name}! Tu testimonio ya está publicado.`,
      "success",
      4000
    );

    setFormData({ name: "", role: "", rating: 5, comment: "", images: [] });
    setNuevaFoto("");
    setErrors({});
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
      
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Bloque de Calificación Destacado */}
        <div className="bg-[#f5f4f0] rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <StarRating
            value={formData.rating}
            onChange={(newRating) =>
              setFormData(prev => ({ ...prev, rating: newRating }))
            }
          />
        </div>

        {/* Nombre y Rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Ana García"
              className={`w-full px-4 py-3.5 bg-gray-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-sm ${
                errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-900"
              }`}
            />
            <FormError message={errors.name} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Rol / Relación con EduCraft
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ej. Madre de familia"
              className={`w-full px-4 py-3.5 bg-gray-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-sm ${
                errors.role
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-900"
              }`}
            />
            <FormError message={errors.role} />
          </div>
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            Tu testimonio
          </label>
          <div className="relative">
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu experiencia..."
              rows="4"
              className={`w-full px-4 py-3.5 bg-gray-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:border-transparent outline-none resize-none transition-all duration-200 text-sm ${
                errors.comment
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-blue-900"
              }`}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <FormError message={errors.comment} />
            <span className="text-xs text-gray-400 ml-auto">
              {formData.comment.length}/300 caracteres
            </span>
          </div>
        </div>

        {/* Fotos por enlace */}
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-semibold text-blue-900 mb-1">
            Fotos de tu proyecto <span className="text-gray-400 font-normal">(opcional · máx. 5 enlaces)</span>
          </label>

          <div className="flex gap-2 mt-3">
            <input
              type="url"
              value={nuevaFoto}
              onChange={(e) => { setNuevaFoto(e.target.value); setPreviewOk(null); }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAgregarFoto())}
              placeholder="https://i.imgur.com/ejemplo.jpg"
              className="flex-1 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none text-sm transition-all"
            />
            <button
              type="button"
              onClick={handleAgregarFoto}
              className="px-4 py-3 bg-blue-50 text-blue-900 font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center shrink-0 text-2xl"
              title="Agregar foto"
            >
              +
            </button>
          </div>

          {/* Miniatura en tiempo real */}
          {nuevaFoto.trim() && (
            <div className="mt-3">
              <img
                key={nuevaFoto}
                src={nuevaFoto}
                alt="Vista previa"
                onLoad={() => setPreviewOk(true)}
                onError={() => setPreviewOk(false)}
                className={`max-h-32 w-auto rounded-xl border border-green-200 ${
                  previewOk === true ? "block" : "hidden"
                }`}
              />
              {previewOk === false && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ No pudimos mostrar esta imagen. Verifica que el enlace termine en .jpg, .png o .webp.
                </p>
              )}
            </div>
          )}

          {/* Grilla de imágenes agregadas */}
          {formData.images.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-2">
                {formData.images.map((ruta, index) => (
                  <div key={ruta} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img src={ruta} alt={`Foto ${index + 1}`} className="w-full h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleQuitarFoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                {formData.images.length} / 5 imágenes agregadas
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Sube tus fotos a un servicio como Imgur y pega aquí los enlaces directos.
          </p>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={enviando}
          className="w-full mt-4 px-6 py-4 bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold rounded-2xl shadow-lg shadow-amber-400/20 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          {enviando ? "Enviando testimonio..." : "Enviar testimonio"}
        </button>

      </form>
    </div>
  );
}