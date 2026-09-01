import { WHATSAPP_NUMBER } from "../../data/constants";
import Button from "../common/Button";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

export default function QuickConsult() {
  
  const quickMessage = "Hola, me gustaría cotizar un proyecto escolar";
  const encodedMessage = encodeURIComponent(quickMessage);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <section className="pb-20 md:pb-32 mx-5">
      <div className="degradado max-w-7xl mx-auto py-8 md:py-10 text-center rounded-4xl">
        <h2 className="text-lg md:text-3xl font-bold text-white mb-6">
          ¿Tienes prisa o una duda rápida?
        </h2>
        
        <p className="text-xs md:text-sm text-white/60 mb-8 mx-8">
          Escríbenos directamente y cuéntanos qué necesitas. Te responderemos al instante.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md" className="text-black">
            <ChatBubbleLeftRightIcon className="w-4 h-4" strokeWidth={2}/>
            Contactar por WhatsApp
          </Button>
        </a>

      </div>
    </section>
  );
}