import { useMemo, useState } from "react";
import ImageGallery from "../common/ImageGallery";
import TestimonialCard from "./Testimonialcard";

const ALL = "Todos";

export default function TestimonialsList({ testimonials = [] }) {
  const [activeRole, setActiveRole] = useState(ALL);
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    images: [],
  });

  // Los filtros salen de los datos, no de una lista fija:
  // si mañana agregas un rol nuevo, el chip aparece solo.
  const roles = useMemo(() => {
    const unique = new Set(
      testimonials.map((t) => t.role).filter(Boolean)
    );
    return [ALL, ...unique];
  }, [testimonials]);

  const filtered = useMemo(() => {
    if (activeRole === ALL) return testimonials;
    return testimonials.filter((t) => t.role === activeRole);
  }, [testimonials, activeRole]);

  const openGallery = (images) => {
    if (images?.length) setGalleryState({ isOpen: true, images });
  };

  const closeGallery = () => setGalleryState({ isOpen: false, images: [] });

  return (
    <>
      {/* Filtros */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {roles.map((role) => {
          const isActive = role === activeRole;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setActiveRole(role)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-blue-900 hover:ring-blue-300"
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {/* Masonry: columnas CSS + break-inside-avoid en cada tarjeta */}
      {filtered.length > 0 ? (
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {filtered.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onImageClick={openGallery}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-500">
          Todavía no hay testimonios de {activeRole.toLowerCase()}.
        </p>
      )}

      <ImageGallery
        images={galleryState.images}
        isOpen={galleryState.isOpen}
        onClose={closeGallery}
      />
    </>
  );
}