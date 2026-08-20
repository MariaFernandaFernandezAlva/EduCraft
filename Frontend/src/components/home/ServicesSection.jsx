import SectionTitle from "../common/SectionTitle";
import ServiceCard from "./ServiceCard";
import { servicesData } from "../../data/services";

export default function ServicesSection() {
  return (
    <section id="servicios" className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="NUESTROS SERVICIOS"
          title="Nuestros Servicios"
          subtitle="Calidad académica con un toque artesanal y profesional"
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}