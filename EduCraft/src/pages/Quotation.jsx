import QuotationForm from "../components/quotation/QuotationForm";
import FAQ from "../components/quotation/FAQ";
import QuickConsult from "../components/quotation/QuickConsult";

export default function Quotation() {
  return (
    <main>
      
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-teal-50 py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-2 bg-teal-400 text-teal-900 text-sm font-bold rounded-full uppercase tracking-wide">
              PLANIFICACIÓN ACADÉMICA
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              Solicita tu Cotización Personalizada
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Cuéntanos tus ideas en proyectos escolares excepcionales. Desde maquetas detalladas hasta presentaciones informativas, nuestro equipo académico está listo para ayudarte.
            </p>

            <p className="text-sm text-gray-500 italic">
              ⏱️ Tiempo estimado de llenado: 5-10 minutos
            </p>
          </div>

          {/* Right Image Placeholder */}
          <div className="flex justify-center">
            <div className="bg-linear-to-br from-blue-900 to-teal-600 rounded-3xl p-8 shadow-xl w-full">
              <div className="bg-white rounded-2xl p-8 aspect-square md:aspect-auto md:h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">👩‍💼</p>
                  <p className="text-gray-600 font-semibold">Imagen de Ejemplo</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Reemplaza con tu foto
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-16 md:py-24">
        <QuotationForm />
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Quick Consult Section */}
      <QuickConsult />

    </main>
  );
}