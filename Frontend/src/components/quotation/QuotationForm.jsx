import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function QuotationForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    // Intentar cargar datos guardados en localStorage
    const saved = localStorage.getItem("quotationFormData");
    return saved ? JSON.parse(saved) : {
      fullName: "",
      email: "",
      whatsapp: "",
      projectType: "",
      academicLevel: "",
      description: "",
      referenceFile: null,
      deliveryDate: "",
      deliveryMethod: "",
      address: "",
      acceptTerms: false
    };
  });

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("quotationFormData", JSON.stringify(formData));
  }, [formData]);

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
    // Desplazar suavemente solo al formulario (no al top)
    setTimeout(() => {
      const formElement = document.querySelector('[data-form-container]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setTimeout(() => {
      const formElement = document.querySelector('[data-form-container]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleSubmitForm = async () => {
    // Aquí irá la lógica para enviar datos al backend
    console.log("Datos del formulario:", formData);
    
    // Mostrar notificación de éxito en esquina superior derecha
    addToast(
      "¡Solicitud enviada! Nos contactaremos pronto con tu presupuesto.",
      "success",
      4000
    );
    
    // Limpiar localStorage
    localStorage.removeItem("quotationFormData");
    
    // Resetear formulario
    setCurrentStep(1);
    setFormData({
      fullName: "",
      email: "",
      whatsapp: "",
      projectType: "",
      academicLevel: "",
      description: "",
      referenceFile: null,
      deliveryDate: "",
      deliveryMethod: "",
      address: "",
      acceptTerms: false
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" data-form-container>
      
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              
              {/* Step Circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                currentStep >= step 
                  ? "bg-blue-900" 
                  : "bg-gray-300"
              }`}>
                {currentStep > step ? "✓" : step}
              </div>

              {/* Connector Line */}
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step 
                    ? "bg-blue-900" 
                    : "bg-gray-300"
                }`}></div>
              )}

            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-sm font-semibold text-gray-700">
          <span>Identificación</span>
          <span>Proyecto</span>
          <span>Entrega</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        
        {currentStep === 1 && (
          <Step1 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {currentStep === 3 && (
          <Step3 
            formData={formData} 
            setFormData={setFormData} 
            onPrev={handlePrevStep}
            onSubmit={handleSubmitForm}
          />
        )}

      </div>

    </div>
  );
}