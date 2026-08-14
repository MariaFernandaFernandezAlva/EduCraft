import { WHATSAPP_NUMBER } from "../../data/constants";
import Button from "../common/Button";

export default function QuickConsult() {
  
  const quickMessage = "Hola, me gustaría cotizar un proyecto escolar";
  const encodedMessage = encodeURIComponent(quickMessage);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <section className="bg-linear-to-r from-teal-50 to-blue-50 py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          ¿Tienes prisa o una duda rápida?
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Escríbenos directamente y cuéntanos qué necesitas. Te responderemos al instante.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="tertiary" size="lg">
            💬 Contactar por WhatsApp
          </Button>
        </a>

      </div>
    </section>
  );
}