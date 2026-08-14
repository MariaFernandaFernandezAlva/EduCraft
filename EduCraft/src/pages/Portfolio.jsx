import { useState } from "react";
import SectionTitle from "../components/common/SectionTitle";
import ProjectCard from "../components/portfolio/ProjectCard";
import Button from "../components/common/Button";
import { portfolioData } from "../data/portfolio";

const PROJECTS_PER_PAGE = 3;

export default function Portfolio() {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = Math.ceil(portfolioData.length / PROJECTS_PER_PAGE);

  // Calcular índices para la página actual
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = portfolioData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Desplazar al top de la sección de proyectos
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <main>
      
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-900 to-teal-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Nuestro Portafolio
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Descubre proyectos académicos de alta calidad realizados para estudiantes y educadores
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionTitle
            title="Proyectos Destacados"
            subtitle="Cada proyecto refleja nuestro compromiso con la excelencia académica y el diseño profesional"
            centered={true}
          />

          {/* Projects List - Vertical Layout */}
          <div className="space-y-8 mb-12">
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-6">
            
            {/* Pagination Info */}
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-bold">{startIndex + 1}</span> - <span className="font-bold">{Math.min(endIndex, portfolioData.length)}</span> de <span className="font-bold">{portfolioData.length}</span> proyectos
            </p>

            {/* Pagination Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-900 text-white hover:bg-blue-800"
                }`}
              >
                ← Anterior
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-900 text-white hover:bg-blue-800"
                }`}
              >
                Siguiente →
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            No permitas que la complejidad del proyecto te bloquee. Nuestro equipo está listo para transformar tus ideas en realidades académicas excepcionales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Solicitar Cotización
            </Button>
            <Button variant="secondary" size="lg">
              Explorar Servicios
            </Button>
          </div>

        </div>
      </section>

    </main>
  );
}