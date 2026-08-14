import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";

export default function PriceSection() {
  return (
    <section id="cotizacion" className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="COTIZACIÓN"
          title="Solicita tu Cotización"
          subtitle="Cuéntanos sobre tu proyecto y te responderemos en máximo 24 horas"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          
          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <form className="space-y-6">
              
              {/* Row 1: Nombre y Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ana García"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="ana@ejemplo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Tipo de Proyecto y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Proyecto
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none">
                    <option>Maqueta</option>
                    <option>Tríptico</option>
                    <option>Cuaderno</option>
                    <option>Lámina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción del Proyecto
                </label>
                <textarea
                  rows="5"
                  placeholder="Cuéntanos más detalles sobre lo que necesitas..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <Button variant="primary" size="lg" className="w-full">
                Enviar Solicitud
              </Button>

            </form>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="flex justify-center">
            <div className="bg-linear-to-br from-blue-900 to-teal-500 rounded-3xl p-8 shadow-2xl w-full">
              <div className="bg-white rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">📋</p>
                  <p className="text-gray-600 font-semibold">Imagen del Formulario</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Reemplaza con screenshot real del formulario
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}