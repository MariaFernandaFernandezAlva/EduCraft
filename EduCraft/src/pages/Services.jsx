import { useState } from "react";
import { servicesData } from "../data/services";
import ServiceCardFull from "../components/services/ServiceCardFull";

export default function Services() {
  // Obtener categorías únicas
  const categories = ["Todos", ...new Set(servicesData.map(s => s.category))];
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Filtrar servicios según categoría activa
  const filteredServices = activeCategory === "Todos" 
    ? servicesData 
    : servicesData.filter(service => service.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <section className="bg-white py-12 md:py-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wide mb-2">
            SERVICIOS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Todo lo que puedes encargarnos
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl">
            Elige el tipo de trabajo y mira ejemplos reales, qué incluye, cuánto cuesta y en cuánto tiempo lo entregamos.
          </p>
        </div>
      </section>

      {/* Filters/Tabs */}
      <section className="bg-white py-8 border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-3 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-semibold rounded-full transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-blue-900 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          
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
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-12">
            ¿Por qué elegimos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🎓</div>
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