import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { createQuotation } from "../../services/api";
import {
  CheckIcon,
  UserIcon,
  DocumentTextIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

export default function QuotationForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const valoresIniciales = {
      fullName: "",
      email: "",
      whatsapp: "",
      projectType: "",
      academicLevel: "",
      description: "",
      referenceLink: "",
      deliveryDate: "",
      deliveryMethod: "",
      address: "",
      acceptTerms: false,
    };

    const saved = localStorage.getItem("quotationFormData");
    if (!saved) return valoresIniciales;

    try {
      return { ...valoresIniciales, ...JSON.parse(saved) };
    } catch {
      return valoresIniciales;
    }
  });

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("quotationFormData", JSON.stringify(formData));
  }, [formData]);

  // Cálculo dinámico del porcentaje de avance según los campos llenados
  const calcularProgreso = () => {
    const camposTotal = 8; // Campos clave del formulario
    let llenos = 0;
    if (formData.fullName.trim()) llenos++;
    if (formData.email.trim()) llenos++;
    if (formData.whatsapp.trim()) llenos++;
    if (formData.projectType) llenos++;
    if (formData.academicLevel) llenos++;
    if (formData.description.trim()) llenos++;
    if (formData.deliveryDate) llenos++;
    if (formData.deliveryMethod) llenos++;

    return Math.round((llenos / camposTotal) * 100);
  };

  const porcentaje = calcularProgreso();

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      const formElement = document.querySelector("[data-form-container]");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      const formElement = document.querySelector("[data-form-container]");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleSubmitForm = async () => {
    const { acceptTerms, ...datosAEnviar } = formData;
    const result = await createQuotation(datosAEnviar);

    if (!result.success) {
      addToast(
        "No pudimos enviar tu solicitud. Intenta de nuevo en un momento.",
        "error",
        4000,
      );
      return;
    }

    addToast(
      "¡Solicitud enviada! Nos contactaremos pronto con tu presupuesto.",
      "success",
      4000,
    );

    localStorage.removeItem("quotationFormData");
    setCurrentStep(1);
    setFormData({
      fullName: "",
      email: "",
      whatsapp: "",
      projectType: "",
      academicLevel: "",
      description: "",
      referenceLink: "",
      deliveryDate: "",
      deliveryMethod: "",
      address: "",
      acceptTerms: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-form-container>
      {/* Contenedor en Grid de dos columnas (Sidebar izquierdo + Formulario derecho) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Pasos y Resumen en vivo */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Navegación por pasos lateral */}
          <div className="flex flex-col gap-3">
            {/* Paso 1 */}
            <div
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                currentStep === 1
                  ? "bg-white border-azul shadow-sm"
                  : "bg-white/60 border-slate-200/80 opacity-75"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  currentStep > 1
                    ? "bg-verde text-white"
                    : currentStep === 1
                      ? "bg-azul text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {currentStep > 1 ? (
                  <CheckIcon className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <UserIcon className="w-5 h-5" strokeWidth={2} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-azul">Identificación</h4>
                <p className="text-xs text-slate-700">Quién eres</p>
              </div>
            </div>

            {/* Paso 2 */}
            <div
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                currentStep === 2
                  ? "bg-white border-azul shadow-sm"
                  : "bg-white/60 border-slate-200/80 opacity-75"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  currentStep > 2
                    ? "bg-verde text-white"
                    : currentStep === 2
                      ? "bg-azul text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {currentStep > 2 ? (
                  <CheckIcon className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <DocumentTextIcon className="w-5 h-5" strokeWidth={2} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-azul">Proyecto</h4>
                <p className="text-xs text-slate-700">Qué necesitas</p>
              </div>
            </div>

            {/* Paso 3 */}
            <div
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                currentStep === 3
                  ? "bg-white border-azul shadow-sm"
                  : "bg-white/60 border-slate-200/80 opacity-75"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  currentStep > 3
                    ? "bg-verde text-white"
                    : currentStep === 3
                      ? "bg-azul text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {currentStep > 3 ? (
                  <CheckIcon className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <CubeIcon className="w-5 h-5" strokeWidth={2} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-azul">Entrega</h4>
                <p className="text-xs text-slate-700">Cuándo y dónde</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Resumen en Vivo */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-marron uppercase">
                Resumen en vivo
              </span>
              <span className="text-xs font-bold text-slate-500">
                {porcentaje}%
              </span>
            </div>

            {/* Barra de progreso visual */}
            <div className="w-full bg-[#efede5] h-1.5 rounded-full mb-6 overflow-hidden">
              <div
                className="bg-azul h-full transition-all duration-500 rounded-full"
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>

            {/* Datos del resumen */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-700 font-medium uppercase tracking-wider">
                  Solicitante
                </span>
                <span className="font-bold text-slate-900 truncate max-w-32.5">
                  {formData.fullName || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-700 font-medium uppercase tracking-wider">
                  Tipo
                </span>
                <span className="font-bold text-slate-900">
                  {formData.projectType || "Por definir"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-700 font-medium uppercase tracking-wider">
                  Nivel
                </span>
                <span className="font-bold text-slate-900">
                  {formData.academicLevel || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-700 font-medium uppercase tracking-wider">
                  Cantidad
                </span>
                <span className="font-bold text-slate-900">1 und.</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium uppercase tracking-wider">
                  Entrega
                </span>
                <span className="font-bold text-slate-900">
                  {formData.deliveryDate || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Contenedor del formulario */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
          {/* Línea decorativa superior dorada sutil */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

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
    </div>
  );
}
