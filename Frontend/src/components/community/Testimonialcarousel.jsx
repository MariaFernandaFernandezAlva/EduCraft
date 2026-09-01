import { useState } from "react";

// Normaliza el item: acepta "ruta.jpg" o { url|src, alt, title|caption }
export const getImageSrc = (image) =>
  typeof image === "string" ? image : image?.url || image?.src || "";

export const getImageLabel = (image) =>
  typeof image === "string"
    ? ""
    : image?.title || image?.caption || image?.alt || "";

export default function TestimonialCarousel({ images, label, onImageClick }) {
  const [index, setIndex] = useState(0);

  const total = images.length;
  const hasMultiple = total > 1;

  // stopPropagation evita que el click en la flecha abra la galería
  const goPrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + total) % total);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % total);
  };

  const goTo = (e, i) => {
    e.stopPropagation();
    setIndex(i);
  };

  // La etiqueta del testimonio manda; si no hay, se usa la de la imagen actual
  const currentLabel = label || getImageLabel(images[index]);

  return (
    <div className="group relative aspect-4/3 overflow-hidden bg-slate-100">
      {/* Riel: se desplaza -100% por cada imagen avanzada */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((image, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onImageClick?.(images, i)}
            className="h-full w-full shrink-0 cursor-zoom-in focus:outline-hidden"
            aria-label={`Ver imagen ${i + 1} de ${total}`}
          >
            <img
              src={getImageSrc(image)}
              alt={getImageLabel(image) || "Trabajo entregado"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Flechas: solo si hay más de una imagen */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Imagen anterior"
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.5 4 7 10l5.5 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Imagen siguiente"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 4 13 10l-5.5 6" />
            </svg>
          </button>

          {/* Puntos indicadores */}
          <div className="absolute right-3 bottom-3 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => goTo(e, i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Etiqueta del trabajo, abajo a la izquierda */}
      {currentLabel && (
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-xs">
          <svg
            className="h-3 w-3 text-slate-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 5h3l1-1.5h4L13 5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          </svg>
          <span className="text-xs font-medium text-slate-700">
            {currentLabel}
          </span>
        </div>
      )}
    </div>
  );
}