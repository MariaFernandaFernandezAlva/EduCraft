import Button from "../common/Button";
import Image from "../../assets/maquetaPrincipal.webp";
import SectionTitle from "../common/SectionTitle";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="panel relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <SectionTitle 
              variant="hero"
              as="h1"
              centered={false}
              badgeColor="amber"
              title={<>Transformamos tus ideas en proyectos <span className="text-amarillo italic"> excepcionales </span></>}
              subtitle="Soluciones personalizadas para estudiantes y educadores. Desde maquetas detalladas hasta cuadernos de trabajo profesionalizados." 
            />

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4">
              <Button variant="primary" size="md" onClick={() => handleNavigate("/quotation")}>
                Pedir Cotización
              </Button>
              <Button variant="secondary" size="md" onClick={() => handleNavigate("/services")}>
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