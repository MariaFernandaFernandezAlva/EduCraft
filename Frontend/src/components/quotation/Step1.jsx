import { useState } from "react";
import FormError from "../common/FormError";

export default function Step1({ formData, setFormData, onNext }) {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    whatsapp: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Por favor ingresa tu nombre completo (mínimo 2 palabras)";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo válido (ej: usuario@ejemplo.com)";
    }

    // Validar WhatsApp (9 dígitos)
    const whatsappDigits = formData.whatsapp.replace(/\D/g, "");
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "El teléfono es requerido";
    } else if (whatsappDigits.length !== 9) {
      newErrors.whatsapp = "El teléfono debe tener exactamente 9 dígitos";
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

    // Si no hay errores, proceder
    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre Completo
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Ej. Alejandro Martínez"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
            errors.fullName 
              ? "border-red-400 focus:ring-red-300" 
              : "border-gray-300 focus:ring-blue-900"
          }`}
        />
        <FormError message={errors.fullName} />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="alejandro@ejemplo.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
            errors.email 
              ? "border-red-400 focus:ring-red-300" 
              : "border-gray-300 focus:ring-blue-900"
          }`}
        />
        <FormError message={errors.email} />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono (WhatsApp) - 9 dígitos
        </label>
        <input
          type="tel"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="999 999 999"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
            errors.whatsapp 
              ? "border-red-400 focus:ring-red-300" 
              : "border-gray-300 focus:ring-blue-900"
          }`}
        />
        <FormError message={errors.whatsapp} />
        <p className="text-xs text-gray-500 mt-2">
          Te contactaremos por este medio para confirmar detalles
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-300"
      >
        Siguiente Paso →
      </button>

    </form>
  );
}