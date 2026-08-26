import { COMPANY_INFO } from "../../data/constants";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d1b4b] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl text-white font-bold mb-2">{COMPANY_INFO.name}</h3>
            <p className="text-white/70 text-sm">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-amarillo">Quick Links</h4>
            <ul className="space-y-2 text-white/90 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cotización</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonios</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-amarillo">Legal</h4>
            <ul className="space-y-2 text-white/90 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Politíca de privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-amarillo">Contacto</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="flex flex-row gap-2">
                <PhoneIcon className="w-5 h-5 text-amarillo" />
                <p>+52 555 123 4567</p>
              </div> 
              <div className="flex flex-row gap-2">
                <EnvelopeIcon className="w-5 h-5 text-amarillo" />
                <p>hola@educraft.mx</p>
              </div>
              <div className="flex flex-row gap-2">
                <MapPinIcon className="w-5 h-5 text-amarillo" />
                <p>Lima, Perú</p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-azul/60 pt-8">
          <p className="text-center text-white/90 text-sm">
            © {currentYear} {COMPANY_INFO.name}. Todos los derechos de reserva.
          </p>
        </div>

      </div>
    </footer>
  );
}