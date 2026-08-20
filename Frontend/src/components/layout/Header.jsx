import { useState } from "react";
import { COMPANY_INFO, NAV_LINKS } from "../../data/constants";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-azul">
            {COMPANY_INFO.name}
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="btnAnimado relative text-azul hover:text-amarillo font-medium transition-colors duration-300 group"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Theme Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="text-azul hover:text-amarillo transition-colors"
        >
          {isDark ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </nav>
    </header>
  );
}