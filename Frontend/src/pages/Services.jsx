import { useState, useEffect } from "react";
import { getServices } from "../services/api";
import ServiceCardFull from "../components/services/ServiceCardFull";
import SectionTitle from "../components/common/SectionTitle";
import { AcademicCapIcon, TrophyIcon, TruckIcon } from "@heroicons/react/24/outline";

export default function Services() {
  // Nuevos estados para manejar los datos de la base de datos
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getServices();

      if (result.success) {
        setServicesData(result.data.filter((s) => s.visible));
      } else {
        console.error(result.message);
      }

      setLoading(false);
    };

    fetchServices();
  }, []);

  const categories = ["Todos", ...new Set(servicesData.map(s => s.category))];

  // Filtrar servicios
  const filteredServices = activeCategory === "Todos" 
    ? servicesData 
    : servicesData.filter(service => service.category === activeCategory);

  // Si está cargando, mostramos un mensaje
  if (loading) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray">
      
      {/* Hero Section */}
      <section className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-16 md:py-24 text-slate-900 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabecera del servicios */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Título y etiqueta */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-amber-500"></div>
                <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                  Servicios
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight">
                Todo lo que puedes <br></br> encargarnos para tu proyecto escolar
              </h2>
            </div>

            {/* Descripción al lado derecho */}
            <div className="md:col-span-5">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                Elige el tipo de servicio que necesitas y nosotros nos encargamos de todo. Desde la creación de materiales educativos hasta la entrega puntual, garantizando calidad y satisfacción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters/Tabs */}
      <section>
        <div className="max-w-7xl mx-auto px-6 mt-16">
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

      {/* Why Choose Us (Se mantiene igual) */}
      <section className="bg-gray py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-azul text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-fit p-4 text-5xl mb-6 rounded-lg text-verde bg-verde/20 shadow-md shadow-verde/40">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Alineación Pedagógica
              </h3>
              <p className="text-gray-700">
                Cada material es revisado para alinearse con los objetivos de aprendizaje del nivel escolar correspondiente.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-fit p-4 text-5xl mb-6 rounded-lg text-amarillo bg-amarillo/20 shadow-md shadow-amarillo/40">
                <TrophyIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Calidad Artesanal
              </h3>
              <p className="text-gray-700">
                Fusionamos tecnología digital con acabados únicos y durables para crear piezas que trascienden.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-fit p-4 text-5xl mb-6 rounded-lg text-morado bg-morado/20 shadow-md shadow-morado/40">
                <TruckIcon className="w-6 h-6" />
              </div>
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