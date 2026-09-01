import SectionTitle from "../common/SectionTitle";
import ServiceCard from "./ServiceCard";
import { useState, useEffect } from "react";
import { getServices } from "../../services/api";
import { CubeIcon, DocumentTextIcon, BookOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const borderColors = ["border-azul", "border-amarillo", "border-verde", "border-morado"];

const icons = [
  <CubeIcon className="w-6 h-6" />,
  <DocumentTextIcon className="w-6 h-6" />,
  <BookOpenIcon className="w-6 h-6" />,
  <PhotoIcon className="w-6 h-6" />
];

const iconColors = ["text-azul bg-azul/20", "text-amarillo bg-amarillo/20", "text-verde bg-verde/20", "text-morado bg-morado/20"];

export default function ServicesSection() {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getServices();
      if (result.success) {
        // Solo 4 en el home: el resto se ve en /services
        setServicesData(result.data.filter((s) => s.visible).slice(0, 4));
      }
    };

    fetchServices();
  }, []);

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={icons[index % icons.length]}
              title={service.title}
              description={service.description}
              borderColor={borderColors[index % borderColors.length]}
              iconColor={iconColors[index % iconColors.length]}
            />
          ))}
        </div>

        {/* Ver mas */}
        <div className="flex justify-end mt-12 md:mt-16">
          <Button variant="primary" size="md" onClick={() => handleNavigate("/services")}>
            Ver más
          </Button>
        </div>
      </div>
    </section>
  );
}