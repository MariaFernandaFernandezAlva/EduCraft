import { useState, useEffect } from "react";
import SectionTitle from "../components/common/SectionTitle";
import TestimonialsList from "../components/community/TestimonialsList";
import TestimonialForm from "../components/community/TestimonialForm";
import { getApprovedTestimonials } from "../services/api";

export default function Community() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const result = await getApprovedTestimonials();
      if (result.success) {
        // Más recientes primero.
        setTestimonials(
          [...result.data].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
        );
      }
    };
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = (nuevo) => {
    setTestimonials(prev => [nuevo, ...prev]);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-teal-50 to-blue-50 py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-teal-400 text-teal-900 text-sm font-bold rounded-full uppercase tracking-wide">
              COMUNIDAD EDUCRAFT
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            Voces de nuestra comunidad
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Nuestro compromiso con la excelencia académica va más allá de los resultados: se trata de las historias de éxito, creatividad y aprendizaje que construimos junto a cada estudiante y familia.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="LO QUE DICEN DE NOSOTROS"
            title="Testimonios de la Comunidad"
            subtitle="Historias reales de estudiantes, padres y docentes"
            centered={true}
          />
          {/* Testimonials Grid */}
          <div className="mt-12">
            <TestimonialsList testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialForm onAddTestimonial={handleAddTestimonial} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 md:py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-900 mb-2">
                +500
              </div>
              <p className="text-lg text-gray-600">
                Proyectos completados con éxito
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-teal-600 mb-2">
                98%
              </div>
              <p className="text-lg text-gray-600">
                Clientes satisfechos
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold text-amber-500 mb-2">
                4.9/5
              </div>
              <p className="text-lg text-gray-600">
                Calificación promedio
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}