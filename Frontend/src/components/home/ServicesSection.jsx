import SectionTitle from "../common/SectionTitle";
import ServiceCard from "./ServiceCard";
import { servicesData } from "../../data/services";
import { CubeIcon, DocumentTextIcon, BookOpenIcon, PhotoIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Button from "../common/Button";

const borderColors = ["border-azul", "border-amarillo", "border-verde", "border-morado"];

const icons = [
  <CubeIcon className="w-6 h-6" />,
  <DocumentTextIcon className="w-6 h-6" />,
  <BookOpenIcon className="w-6 h-6" />,
  <PhotoIcon className="w-6 h-6" />
];

const iconColors = ["text-azul bg-azul/20", "text-amarillo bg-amarillo/20", "text-verde bg-verde/20", "text-morado bg-morado/20"];

export default function ServicesSection() {
  return (
    <section id="servicios" className="bg-gray py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="NUESTROS SERVICIOS"
          badgeColor="amarillo"
          title="Todo lo que necesitas"
          subtitle="Calidad académica con un toque artesanal y profesional, adaptado al nivel de cada estudiante."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              icon={icons[service.id - 1]}
              title={service.title}
              description={service.description}
              borderColor={borderColors[service.id - 1]}
              iconColor={iconColors[service.id - 1]}
            />
          ))}
        </div>

        {/* Ver mas */}
        <div className="flex justify-end mt-8">
          <Button variant="primary" size="md">
            Ver más
          </Button>
        </div>
      </div>
    </section>
  );
}