import { useState, useEffect } from "react";
import ProjectCard from "../components/portfolio/ProjectCard";
import Button from "../components/common/Button";
import { getProjects } from "../services/api";
import { useSearchParams } from "react-router-dom";

const PROJECTS_PER_PAGE = 3;

export default function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [portfolioData, setPortfolioData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjects();
      if (result.success) {
        setPortfolioData(result.data.filter((p) => p.visible));
      }
    };
    fetchProjects();
  }, []);

  const categories = [
    "Todos",
    ...new Set(portfolioData.map((p) => p.category)),
  ];

  const filteredProjects =
    activeCategory === "Todos"
      ? portfolioData
      : portfolioData.filter((p) => p.category === activeCategory);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setSearchParams({ page: totalPages }, { replace: true });
    }
  }, [totalPages, currentPage]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ page: 1 });
  };

  const irAPagina = (page) => {
    const destino = Math.min(Math.max(page, 1), totalPages);
    setSearchParams({ page: destino });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleNextPage = () => irAPagina(currentPage + 1);
  const handlePrevPage = () => irAPagina(currentPage - 1);
  const handlePageClick = (page) => irAPagina(page);

  return (
    <main className="bg-gray">
      {/* Hero Section */}
      <section className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-16 md:py-24 text-slate-900 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabecera del portafolio */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16">
            {/* Título y etiqueta */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-amber-500"></div>
                <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                  Portafolio
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight">
                Proyectos <br></br> destacados
              </h2>
            </div>

            {/* Descripción al lado derecho */}
            <div className="md:col-span-5">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                Cada proyecto refleja nuestro compromiso con la excelencia
                académica y el diseño profesional. Explora la galería completa
                de cada entrega.
              </p>
            </div>
          </div>

          {/* Tarjeta de Estadísticas */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 overflow-hidden">
            {/* Item 1 */}
            <div className="p-8 text-left">
              <div className="text-2xl md:text-3xl font-serif font-bold text-azul mb-1">
                +240
              </div>
              <div className="text-[11px] md:text-xs tracking-wider text-slate-500 uppercase">
                Proyectos entregados
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-8 text-left">
              <div className="text-2xl md:text-3xl font-serif font-bold text-azul mb-1">
                98%
              </div>
              <div className="text-[11px] md:text-xs font-bold tracking-wider text-slate-500 uppercase">
                Clientes satisfechos
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-8 text-left">
              <div className="text-2xl md:text-3xl font-serif font-bold text-azul mb-1">
                72 h
              </div>
              <div className="text-[11px] md:text-xs font-bold tracking-wider text-slate-500 uppercase">
                Entrega más rápida
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-8 text-left">
              <div className="text-2xl md:text-3xl font-serif font-bold text-azul mb-1">
                3
              </div>
              <div className="text-[11px] md:text-xs font-bold tracking-wider text-slate-500 uppercase">
                Rondas de ajustes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-start max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto my-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-2 font-semibold rounded-full transition-all duration-200 ${
              activeCategory === category
                ? "bg-blue-900 text-white shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900 hover:text-blue-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Section */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Projects List - Vertical Layout */}
          <div className="space-y-8 mb-12">
            {currentProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {filteredProjects.length > 0 && (
            <div className="flex flex-col items-center md:items-end gap-6">
              {/* Pagination Info */}
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-bold">{startIndex + 1}</span> -{" "}
                <span className="font-bold">
                  {Math.min(endIndex, filteredProjects.length)}
                </span>{" "}
                de <span className="font-bold">{filteredProjects.length}</span>{" "}
                proyectos
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
                      : "bg-azul text-white hover:bg-azul/80"
                  }`}
                >
                  ← Anterior
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-azul text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-azul text-white hover:bg-azul/80"
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 md:pb-32 mx-5">
        <div className="degradado max-w-7xl mx-auto py-8 md:py-10 text-center rounded-4xl">
          <h2 className="text-lg md:text-3xl font-bold text-white mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-xs md:text-sm text-white/60 mb-8 mx-8">
            Cuéntanos qué necesitas y preparamos una propuesta con referencias visuales, <br></br>
            tiempos y costo en menos de 24 horas.
          </p>
          <Button variant="primary" size="md" className="text-black">
            Solicitar Cotización
          </Button>
        </div>
      </section>
    </main>
  );
}
