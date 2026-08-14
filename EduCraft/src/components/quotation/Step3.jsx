import { useState } from "react";
import { deliveryMethods } from "../../data/quotationOptions";
import FormError from "../common/FormError";

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
    <form onSubmit={handleFormSubmit} className="space-y-8">
      
      {/* Delivery Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fecha de Entrega Deseada
        </label>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={handleDeliveryDateChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors duration-200 ${
            errors.deliveryDate 
              ? "border-red-400 focus:ring-red-300" 
              : "border-gray-300 focus:ring-blue-900"
          }`}
        />
        <FormError message={errors.deliveryDate} />
        <p className="text-xs text-gray-500 mt-2">
          Recomendamos solicitar al menos 3 días antes de tu entrega escolar
        </p>
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Método de Entrega
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryMethods.map(method => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleDeliveryMethodSelect(method.name)}
              className={`p-6 rounded-lg border-2 transition-all duration-300 text-center ${
                formData.deliveryMethod === method.name
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <p className="font-semibold text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Address (if delivery method is home delivery) */}
      {formData.deliveryMethod === "Envío a Domicilio" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dirección de Envío
          </label>
          <textarea
            value={formData.address}
            onChange={handleAddressChange}
            placeholder="Calle, número, departamento, ciudad y referencias..."
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none transition-colors duration-200 ${
              errors.address 
                ? "border-red-400 focus:ring-red-300" 
                : "border-gray-300 focus:ring-blue-900"
            }`}
          />
          <FormError message={errors.address} />
        </div>
      )}

      {/* Terms and Conditions */}
      <div className={`p-6 rounded-lg transition-colors duration-200 ${
        errors.acceptTerms 
          ? "bg-red-50 border border-red-200" 
          : "bg-gray-50"
      }`}>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleTermsChange}
            className="w-5 h-5 mt-1 rounded border-gray-300 focus:ring-2 focus:ring-blue-900"
          />
          <span className="text-sm text-gray-700">
            Acepto los <span className="font-semibold text-blue-900">Términos y Condiciones</span> y la <span className="font-semibold text-blue-900">Política de Reembolsos de Proyectos Personalizados</span>.
          </span>
        </label>
        <FormError message={errors.acceptTerms} />
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
          Enviar Solicitud de Cotización →
        </button>
      </div>

    </form>
  );
}