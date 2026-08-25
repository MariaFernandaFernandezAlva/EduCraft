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
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              {COMPANY_INFO.tagline}
            </h1>
            
            <p className="text-base md:text-xl text-white/60 mb-8 leading-relaxed">
              Soluciones personalizadas para estudiantes y educadores. Desde maquetas detalladas hasta cuadernos de trabajo profesionalizados.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4">
              <Button variant="primary" size="md">
                Pedir Cotización
              </Button>
              <Button variant="secondary" size="md">
                Ver Servicios
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative ">
              <div className="absolute inset-0 border-2 border-amarillo rounded-4xl -translate-x-2 -translate-y-2 md:-translate-x-4 md:-translate-y-4"></div>
              <img src={Image} alt="Imagen de una maqueta sobre el salon de clase" width={554} height={400} className="relative z-10 w-86 md:w-full h-auto rounded-4xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}