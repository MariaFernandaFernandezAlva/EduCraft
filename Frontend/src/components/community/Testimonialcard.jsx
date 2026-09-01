import TestimonialCarousel from "./TestimonialCarousel";

const ROLE_STYLES = {
  estudiante: {
    badge: "bg-morado/10 text-morado",
    accent: "from-morado/40 to-morado/50",
  },
  "madre de familia": {
    badge: "bg-azul/10 text-azul",
    accent: "from-azul/40 to-azul/50",
  },
  docente: {
    badge: "bg-verde/10 text-verde",
    accent: "from-verde/40 to-verde/50",
  },
};

const DEFAULT_STYLE = {
  badge: "bg-marron/10 text-marron",
  accent: "from-marron/40 to-marron/50",
};

const getRoleStyle = (role) =>
  ROLE_STYLES[role?.toLowerCase().trim()] || DEFAULT_STYLE;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={i < rating ? "text-amber-400" : "text-slate-200"}
      aria-hidden="true"
    >
      ★
    </span>
  ));

export default function TestimonialCard({ testimonial, onImageClick }) {
  const { rating, comment, name, role, avatar, date, images, projectName } =
    testimonial;

  const hasImages = Array.isArray(images) && images.length > 0;
  const style = getRoleStyle(role);

  return (
    <article className="mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-slate-900/5">
      {/* Franja de color: solo en tarjetas con imagen, como en el diseño */}
      {hasImages && (
        <div className={`h-1.5 bg-linear-to-r ${style.accent}`} />
      )}

      {hasImages && (
        <TestimonialCarousel
          images={images}
          label={projectName}
          onImageClick={onImageClick}
        />
      )}

      <div className="p-5">
        {/* Estrellas a la izquierda, badge de rol a la derecha */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div
            className="flex gap-0.5 text-base leading-none"
            aria-label={`${rating} de 5 estrellas`}
          >
            {renderStars(rating)}
          </div>

          {role && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
            >
              {role}
            </span>
          )}
        </div>

        {/* Comilla decorativa */}
        <svg
          className="mb-1 h-4 w-4 text-slate-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7.5 5C5 5 3 7 3 9.5S5 14 7.5 14c.4 0 .8 0 1.1-.2-.5 2.3-2.4 4-4.6 4.2v2C8.2 19.6 11 15.8 11 11.2 11 7.6 9.4 5 7.5 5Zm11 0C16 5 14 7 14 9.5s2 4.5 4.5 4.5c.4 0 .8 0 1.1-.2-.5 2.3-2.4 4-4.6 4.2v2c4.2-.4 7-4.2 7-8.8C22 7.6 20.4 5 18.5 5Z" />
        </svg>

        <p className="text-sm leading-relaxed text-slate-600 italic">
          &ldquo;{comment}&rdquo;
        </p>

        {/* Autor */}
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-xs font-bold text-white">
            {avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {name}
            </p>
            <p className="text-xs text-slate-500">{formatDate(date)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}