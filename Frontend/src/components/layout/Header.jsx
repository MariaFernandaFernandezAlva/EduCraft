import { useState } from "react";
import { NAV_LINKS } from "../../data/constants";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-azul">
            Edu<span className="text-amarillo">Craft</span>
          </h1>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-azul hover:text-amarillo font-medium transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-amarillo transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Right Side: Theme + Menu Button */}
        <div className="flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-azul hover:text-amarillo transition-colors"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-azul hover:bg-gray-100 hover:text-amarillo rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}