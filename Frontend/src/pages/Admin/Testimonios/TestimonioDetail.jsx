import { formatearFecha } from "../../../data/quotationStatus";
import SlideOver from "../../../components/common/Admin/SlideOver";

export default function TestimonioDetail({
  testimonial,
  onClose,
  onCambiarEstado,
}) {
  const oculto = testimonial.status === "oculto";

  return (
    <SlideOver
      onClose={onClose}
      badge={oculto ? "OCULTO" : "VISIBLE"}
      title={testimonial.name}
      subtitle={`${testimonial.role} · ${formatearFecha(testimonial.date)}`}
      footer={
        // Un solo botón que alterna: dos botones dejarían siempre uno inútil.
        <button
          onClick={() =>
            onCambiarEstado(testimonial.id, oculto ? "aprobado" : "oculto")
          }
          className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${
            oculto
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-slate-700 hover:bg-slate-800"
          }`}
        >
          {oculto ? "Volver a mostrar en la página" : "Ocultar de la página"}
        </button>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-sm font-bold text-white">
            {testimonial.avatar}
          </div>
          <div>
            <Stars rating={testimonial.rating} size="lg" />
            <p className="mt-0.5 text-xs text-slate-500">
              {testimonial.rating} de 5
            </p>
          </div>
        </div>

        <p className="rounded-lg bg-slate-50 p-4 text-sm whitespace-pre-wrap text-slate-800 italic">
          &ldquo;{testimonial.comment}&rdquo;
        </p>

        {testimonial.images?.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500">
              FOTOS ADJUNTAS ({testimonial.images.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {testimonial.images.map((ruta, i) => (
                <a
                  key={ruta}
                  href={ruta}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir en una pestaña nueva"
                >
                  <img
                    src={ruta}
                    alt={`Foto ${i + 1}`}
                    className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
}

export function Stars({ rating = 0, size = "sm" }) {
  const text = size === "lg" ? "text-lg" : "text-sm";

  return (
    <span className={`${text} whitespace-nowrap`} aria-label={`${rating} de 5 estrellas`}>
      <span className="text-amber-400">{"★".repeat(rating)}</span>
      <span className="text-slate-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}