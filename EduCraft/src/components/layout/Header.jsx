import { COMPANY_INFO, NAV_LINKS } from "../../data/constants";
import Button from "../common/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-blue-900">
            {COMPANY_INFO.name}
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </nav>
    </header>
  );
}