import { useState } from "react";
import { servicesData } from "../data/services";
import ServiceCardFull from "../components/services/ServiceCardFull";
import SectionTitle from "../components/common/SectionTitle";
import { AcademicCapIcon, DocumentTextIcon, BookOpenIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function Services() {
  // Obtener categorías únicas
  const categories = ["Todos", ...new Set(servicesData.map(s => s.category))];
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Filtrar servicios según categoría activa
  const filteredServices = activeCategory === "Todos" 
    ? servicesData 
    : servicesData.filter(service => service.category === activeCategory);

  const borderColors = ["border-azul", "border-morado", "border-verde"];

  const icons = [
    <AcademicCapIcon className="w-6 h-6" />,
    <DocumentTextIcon className="w-6 h-6" />,
    <BookOpenIcon className="w-6 h-6" />,
  ];

  return (
    <main className="min-h-screen bg-gray">
      
      {/* Header */}
      <section className="bg-gray pt-12 md:pt-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            as="h2"
            variant="sections"
            centered={false}
            badge="Servicios"
            badgeColor="amarillo" 
            title="Todo lo que puedes encargarnos"
            subtitle="Elige el tipo de trabajo y mira ejemplos reales, qué incluye, cuánto cuesta y en cuánto tiempo lo entregamos."
          />
        </div>
      </section>

      {/* Filters/Tabs */}
      <section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-semibold rounded-full transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-azul text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-azul hover:text-azul"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* No results message */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay servicios en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map(service => (
                <ServiceCardFull key={service.id} service={service} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <h2 className="text-3xl md:text-4xl font-bold text-azul text-center mb-12">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-fit p-4 text-5xl mb-6 rounded-lg text-azul bg-azul/20 shadow-md shadow-azul/40">
                <CubeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Alineación Pedagógica
              </h3>
              <p className="text-gray-700">
                Cada material es revisado para alinearse con los objetivos de aprendizaje del nivel escolar correspondiente.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Calidad Artesanal
              </h3>
              <p className="text-gray-700">
                Fusionamos tecnología digital con acabados únicos y durables para crear piezas que trascienden.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Puntualidad
              </h3>
              <p className="text-gray-700">
                Entendemos los tiempos escolares. Garantizamos entregas en las fechas acordadas, en todo.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}