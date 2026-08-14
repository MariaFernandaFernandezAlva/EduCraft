import { useNavigate } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../../data/constants";

export default function ServiceCardFull({ service }) {
  const navigate = useNavigate();

  const handleQuotation = () => {
    navigate("/quotation", {
      state: {
        serviceType: service.category,
        serviceTitle: service.title,
        serviceDescription: service.description
      }
    });
  };

  const handleWhatsApp = () => {
    const message = `Hola, me interesa el servicio de *${service.title}*

📝 Descripción:
${service.description}

✅ Incluye:
${service.includes.map(inc => `• ${inc}`).join("\n")}

⏱️ Tiempo de entrega: ${service.deliveryTime}

¿Cuál sería el precio para mi proyecto?`;

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      
      {/* Image Placeholder */}
      <div className="h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-6xl">{service.image}</div>
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* Includes Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-amber-600 mb-3 uppercase tracking-wide">
            Qué incluye
          </p>
          <ul className="space-y-2">
            {service.includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-teal-600 font-bold text-lg mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery Time */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Entrega
          </p>
          <p className="text-lg font-bold text-blue-900">
            {service.deliveryTime}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleQuotation}
            className="flex-1 px-4 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            Cotizar {service.category}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 px-4 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            WhatsApp
          </button>
        </div>

      </div>

    </div>
  );
}