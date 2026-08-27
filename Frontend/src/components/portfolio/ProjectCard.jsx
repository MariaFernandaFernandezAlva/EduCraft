import { useState } from "react";
import { WHATSAPP_NUMBER } from "../../data/constants";

export default function ProjectCard({ project }) {
  const [showMore, setShowMore] = useState(false);

  const handleWhatsApp = () => {
    const message = `Hola, me interesa el proyecto *${project.title}* que vi en tu portafolio.

📋 Proyecto: ${project.title}
📝 Categoría: ${project.category}

✅ Incluye:
${project.includes.map(inc => `• ${inc}`).join("\n")}

¿Cuál sería el costo para un proyecto similar?`;

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
      
      {/* Container Horizontal */}
      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
        
        {/* Image Section */}
        <div className="shrink-0 md:w-1/3">
          <div className="h-48 md:h-64 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-7xl md:text-8xl">{project.image}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grow md:w-2/3 flex flex-col justify-between">
          
          {/* Header */}
          <div className="mb-4">
            {/* Category Badge */}
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${project.categoryColor} mb-3`}>
              {project.category}
            </span>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {project.description}
            </p>
          </div>

          {/* Includes Section */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-3">
              ✓ Qué incluye este proyecto
            </p>
            
            {/* Show first 2 items initially, all if expanded */}
            <ul className="space-y-2">
              {project.includes.slice(0, showMore ? project.includes.length : 2).map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 font-bold text-lg mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Show More Button */}
            {project.includes.length > 2 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-3 text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors"
              >
                {showMore ? "Ver menos ▲" : `Ver ${project.includes.length - 2} más ▼`}
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              💬 Preguntar por este proyecto
            </button>
            <button
              onClick={() => window.location.href = "/quotation"}
              className="flex-1 px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              📋 Solicitar Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}