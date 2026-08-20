import Button from "../common/Button";
import { COMPANY_INFO } from "../../data/constants";
import Image from "../../assets/projects/maquetaPrincipal.webp";

export default function HeroSection() {
  return (
    <section className="panel relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <span className="inline-block mb-6 px-4 py-2 bg-amber-400 text-azul text-sm font-bold rounded-full uppercase tracking-wide">
              Servicios Académicos Premium
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              {COMPANY_INFO.tagline}
            </h1>
            
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
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
              <img src={Image} alt="Imagen de una maqueta sobre el salon de clase" width={554} height={400} className="w-auto rounded-4xl rotate-3 hover:rotate-15 duration-150" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}