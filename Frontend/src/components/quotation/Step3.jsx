import { useState } from "react";
import { deliveryMethods } from "../../data/quotationOptions";
import FormError from "../common/FormError";
import { RectangleGroupIcon, UserIcon, MapPinIcon, DevicePhoneMobileIcon  } from "@heroicons/react/24/outline"

export default function Step3({ formData, setFormData, onPrev, onSubmit }) {
  const [errors, setErrors] = useState({
    deliveryDate: "",
    deliveryMethod: "",
    address: "",
    acceptTerms: ""
  });
  
  const handleDeliveryMethodSelect = (methodName) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: methodName
    }));
    if (errors.deliveryMethod) {
      setErrors(prev => ({ ...prev, deliveryMethod: "" }));
    }
  };

  const handleDeliveryDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      deliveryDate: e.target.value
    }));
    if (errors.deliveryDate) {
      setErrors(prev => ({ ...prev, deliveryDate: "" }));
    }
  };

  const handleAddressChange = (e) => {
    setFormData(prev => ({
      ...prev,
      address: e.target.value
    }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: "" }));
    }
  };

  const handleTermsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: e.target.checked
    }));
    if (errors.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "Por favor selecciona una fecha de entrega";
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 3);

      if (selectedDate < minDate) {
        newErrors.deliveryDate = "La entrega debe ser en al menos 3 días";
      }
    }

    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = "Por favor selecciona un método de entrega";
    }

    if (formData.deliveryMethod === "Envío a Domicilio" && !formData.address.trim()) {
      newErrors.address = "Por favor ingresa tu dirección";
    } else if (formData.deliveryMethod === "Envío a Domicilio" && formData.address.trim().length < 10) {
      newErrors.address = "Por favor ingresa una dirección completa (mínimo 10 caracteres)";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones para continuar";
    }

    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      
      {/* Cabecera del paso */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-amber-600 uppercase">
            Paso 3 de 3
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Entrega y confirmación
          </h2>
        </div>
        <span className="text-xs font-semibold text-marron bg-amarillo/10 px-4 py-2 rounded-full">
          44% completo
        </span>
      </div>

      {/* Delivery Date */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-azul">
            Fecha de entrega deseada
          </label>
          <span className="text-[11px] text-slate-600">
            Recomendamos al menos 3 días antes de tu presentación
          </span>
        </div>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={handleDeliveryDateChange}
          className={`w-full px-4 py-3.5 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none transition-all duration-200 text-slate-800 ${
            errors.deliveryDate 
              ? "border-red-400 focus:ring-red-300" 
              : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
          }`}
        />
        <FormError message={errors.deliveryDate} />
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-3">
          Método de entrega
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryMethods.map(method => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleDeliveryMethodSelect(method.name)}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 text-left ${
                formData.deliveryMethod === method.name
                  ? "border-slate-900 bg-slate-50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="text-2xl p-2.5 bg-slate-100 rounded-xl shrink-0">{method.icon}</div>
              <div>
                <p className="font-bold text-azul text-sm">{method.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
        <FormError message={errors.deliveryMethod} />
      </div>

      {/* Address (if delivery method is home delivery) */}
      {formData.deliveryMethod === "Envío a Domicilio" && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-azul mb-2">
            Dirección de envío
          </label>
          <textarea
            value={formData.address}
            onChange={handleAddressChange}
            placeholder="Calle, número, departamento, ciudad y referencias..."
            rows="3"
            className={`w-full p-4 bg-white border rounded-2xl focus:ring-2 focus:border-transparent outline-none resize-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 ${
              errors.address 
                ? "border-red-400 focus:ring-red-300" 
                : "border-slate-200 hover:border-slate-300 focus:ring-slate-900"
            }`}
          />
          <FormError message={errors.address} />
        </div>
      )}

      {/* Tarjeta de Revisión Final */}
      <div className="bg-gray border border-slate-200/80 rounded-2xl p-5">
        <h4 className="text-[11px] font-bold tracking-widest text-marron uppercase mb-3">
          Revisión final
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-verde"/>
            <span className="font-semibold text-slate-900">{formData.fullName || "Sin nombre"}</span>
          </div>
          <div className="flex items-center gap-2">
            <RectangleGroupIcon className="w-4 h-4 text-verde"/>
            <span className="font-semibold text-slate-900">
              {formData.projectType || "Tipo pendiente"} {formData.academicLevel ? `· ${formData.academicLevel}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-4 h-4 text-verde"/>
            <span className="font-semibold text-slate-900">{formData.whatsapp || "Sin nombre"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-verde"/>
            <span className="font-semibold text-slate-900">{formData.deliveryMethod || "Método pendiente"}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className={`p-4 rounded-2xl border transition-all duration-200 ${
        errors.acceptTerms 
          ? "bg-red-50 border-red-200" 
          : "bg-white border-slate-200"
      }`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleTermsChange}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            Acepto los <span className="font-bold text-slate-900">Términos y Condiciones</span> y la <span className="font-bold text-slate-900">Política de Reembolsos de Proyectos Personalizados</span>.
          </span>
        </label>
        <FormError message={errors.acceptTerms} />
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-200 flex items-center gap-2"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="px-8 py-3.5 bg-azul hover:bg-azul/80 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          Enviar solicitud<span></span> ✈
        </button>
      </div>

    </form>
  );
}