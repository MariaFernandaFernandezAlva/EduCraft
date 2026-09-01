// src/components/common/Admin/SlideOver.jsx
// Panel deslizante lateral con fondo difuminado.

import { useEffect, useState, useCallback } from "react";

const EXIT_MS = 200;

export default function SlideOver({
  onClose,
  badge,
  title,
  subtitle,
  children,
  footer,
}) {
  // false = fuera de pantalla (a la derecha) | true = en su sitio
  const [entered, setEntered] = useState(false);

  // Entrada: monto desplazado y en el siguiente frame quito el desplazamiento.
  // Sin el frame de espera el navegador no ve dos estados y no hay transición.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Salida: primero animo, después aviso al padre para que desmonte.
  const close = useCallback(() => {
    setEntered(false);
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  // Escape para cerrar + bloqueo del scroll de fondo
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo: oscurece y difumina lo de atrás */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera con el degradado de marca */}
        <div className="relative bg-linear-to-r from-blue-900 to-teal-600 px-6 py-5 text-white">
          {badge && (
            <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide">
              {badge}
            </span>
          )}
          <h2 className="mt-2 font-serif text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-white/70">{subtitle}</p>}

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar panel"
            className="absolute top-5 right-5 rounded-full bg-white/15 p-1.5 transition-colors hover:bg-white/25"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Contenido con scroll propio */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {/* Pie fijo con las acciones */}
        {footer && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}