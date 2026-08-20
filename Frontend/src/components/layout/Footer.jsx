import { COMPANY_INFO } from "../../data/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-2">{COMPANY_INFO.name}</h3>
            <p className="text-blue-100 text-sm">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-blue-100 text-sm mb-2">📧 hello@educraft.com</p>
            <p className="text-blue-100 text-sm">📱 +51 XXX XXX XXXX</p>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 pt-8">
          <p className="text-center text-blue-100 text-sm">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}