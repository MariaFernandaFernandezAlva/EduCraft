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
    images: []          // Rutas de texto, ya no archivos
  });

  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Enlace que se está escribiendo antes de agregarlo a la lista.
  const [nuevaFoto, setNuevaFoto] = useState("");
  // null = aún no sabemos, true = cargó, false = el enlace falló
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

    // El mismo enlace dos veces no aporta nada.
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
      newErrors.role = "La relación con EduCraft es requerida (ej: Madre de familia, Docente)";
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

    // El avatar son las iniciales del nombre. Lo calculamos aquí
    // y lo guardamos, para que el panel y la landing muestren lo mismo.
    const avatar = formData.name
      .trim()
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);   // Máximo dos letras, si no se desborda el círculo

    const result = await createTestimonial({ ...formData, avatar });

    setEnviando(false);

    if (!result.success) {
      addToast("No pudimos enviar tu testimonio. Intenta de nuevo.", "error", 4000);
      return;   // Sin limpiar: el usuario conserva lo que escribió.
    }

    // result.data es el testimonio ya guardado, con el id y la fecha
    // que generó el servidor. Usamos ese y no formData, para que la
    // tarjeta muestre exactamente lo que quedó en el db.json.
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
    <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">

      <h3 className="text-2xl font-bold text-blue-900 mb-2">
        Comparte tu experiencia
      </h3>
      <p className="text-gray-600 mb-8">
        ¿Has trabajado con nosotros recientemente? Nos encantaría saber cuál fue el proceso de creación de tu proyecto. Tu opinión ayuda a otros estudiantes y padres a confiar en nuestros servicios.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Calificación */}
        <StarRating
          value={formData.rating}
          onChange={(newRating) =>
            setFormData(prev => ({ ...prev, rating: newRating }))
          }
        />

        {/* Nombre y rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

        {/* Comentario */}
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

        {/* Fotos por enlace */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fotos de tu proyecto (Opcional) — Máximo 5 enlaces
          </label>

          <div className="flex gap-2 mb-3">
            <input
              type="url"
              value={nuevaFoto}
              onChange={(e) => { setNuevaFoto(e.target.value); setPreviewOk(null); }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAgregarFoto())}
              placeholder="https://i.imgur.com/ejemplo.jpg"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <button
              type="button"
              onClick={handleAgregarFoto}
              className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold rounded-lg hover:bg-blue-200"
            >
              ➕
            </button>
          </div>

          {/* Miniatura del enlace que se está escribiendo */}
          {nuevaFoto.trim() && (
            <div className="mb-3">
              <img
                key={nuevaFoto}
                src={nuevaFoto}
                alt="Vista previa"
                onLoad={() => setPreviewOk(true)}
                onError={() => setPreviewOk(false)}
                className={`max-h-40 w-auto rounded-lg border-2 border-green-300 ${
                  previewOk === true ? "block" : "hidden"
                }`}
              />
              {previewOk === false && (
                <p className="text-xs text-amber-700">
                  ⚠️ No pudimos mostrar esta imagen. El enlace debe terminar en
                  .jpg, .png o .webp.
                </p>
              )}
            </div>
          )}

          {/* Enlaces ya agregados */}
          {formData.images.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
                {formData.images.map((ruta, index) => (
                  <div key={ruta} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={ruta} alt={`Foto ${index + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleQuitarFoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {formData.images.length} / 5 imágenes
              </p>
            </>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Sube tus fotos a un servicio como Imgur y pega aquí los enlaces.
          </p>
        </div>

        {/* Enviar */}
        <button
          type="submit"
          disabled={enviando}
          className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {enviando ? "Enviando..." : "▶ Enviar Testimonio"}
        </button>

      </form>
    </div>
  );
}