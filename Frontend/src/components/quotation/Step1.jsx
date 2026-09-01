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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Por favor ingresa tu nombre completo (mínimo 2 palabras)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo válido";
    }

    const whatsappDigits = formData.whatsapp.replace(/\D/g, "");
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "El teléfono es requerido";
    } else if (whatsappDigits.length !== 9) {
      newErrors.whatsapp = "Debe tener exactamente 9 dígitos";
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
            Paso 1 de 3
          </span>
          <h2 className="font-serif text-3xl font-bold text-azul mt-1">
            Cuéntanos quién eres
          </h2>
        </div>
        <span className="text-xs font-semibold text-marron bg-amarillo/10 px-4 py-2 rounded-full">
          11% completo
        </span>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="María Fernanda Fernández"
          className={`w-full px-4 py-3.5 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 ${
            errors.fullName 
              ? "border-red-400 focus:ring-red-300" 
              : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
          }`}
        />
        <FormError message={errors.fullName} />
      </div>

      {/* Grid para Correo y WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tucorreo@upc.edu.pe"
            className={`w-full px-4 py-3.5 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 ${
              errors.email 
                ? "border-red-400 focus:ring-red-300" 
                : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
            }`}
          />
          <FormError message={errors.email} />
        </div>

        {/* WhatsApp */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-azul">
              WhatsApp (9 dígitos)
            </label>
            <span className="text-[11px] text-slate-600">
              Te contactaremos por este medio
            </span>
          </div>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="902597619"
            className={`w-full px-4 py-3.5 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 ${
              errors.whatsapp 
                ? "border-red-400 focus:ring-red-300" 
                : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
            }`}
          />
          <FormError message={errors.whatsapp} />
        </div>
      </div>

      {/* Línea divisoria y Botones de navegación */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          disabled
          className="px-6 py-3 rounded-full border border-slate-200 text-slate-300 font-semibold cursor-not-allowed flex items-center gap-2"
        >
          ← Anterior
        </button>

        <button
          type="submit"
          className="px-8 py-3.5 bg-slate-400 hover:bg-azul text-white font-semibold rounded-full transition-all duration-300 flex items-center gap-2 shadow-sm text-sm md:text-lg"
        >
          Siguiente paso →
        </button>
      </div>

    </form>
  );
}