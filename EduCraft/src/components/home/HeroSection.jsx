import Button from "../common/Button";
import { COMPANY_INFO } from "../../data/constants";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <span className="inline-block mb-6 px-4 py-2 bg-amber-400 text-amber-900 text-sm font-bold rounded-full uppercase tracking-wide">
              Servicios Académicos Premium
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 leading-tight mb-6">
              {COMPANY_INFO.tagline}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Soluciones personalizadas para estudiantes y educadores. Desde maquetas detalladas hasta cuadernos de trabajo profesionalizados.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg">
                Pedir Cotización
              </Button>
              <Button variant="secondary" size="lg">
                Ver Servicios
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* Placeholder for showcase image */}
              <div className="bg-linear-to-br from-blue-900 to-teal-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-6 aspect-square md:aspect-auto md:w-80 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl mb-4">🏗️</p>
                    <p className="text-gray-600 font-semibold">Showcase Image</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Reemplaza con imagen real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}