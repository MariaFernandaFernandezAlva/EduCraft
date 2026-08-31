import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../../data/constants";
import { getCategoryColor, getCategoryAccent } from "../../data/categories";

const META_LABELS = ["Nivel", "Entrega", "Materia"];
const INCLUIDOS_VISIBLES = 4;

const IconoFlecha = ({ hacia = "izquierda" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    {hacia === "izquierda" ? (
      <path d="m15 18-6-6 6-6" />
    ) : (
      <path d="m9 18 6-6-6-6" />
    )}
  </svg>
);

const IconoChat = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </svg>
);

const IconoEnlaceExterno = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const IconoCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */

export default function ProjectCard({ project, index = 0 }) {
  const [showMore, setShowMore] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);
  const navigate = useNavigate();

  const imagenes = project.images ?? [];
  const tieneImagenes = imagenes.length > 0;
  const meta = project.meta ?? [];

  const invertido = index % 2 === 1;
  const numero = String(index + 1).padStart(2, "0");

  const irAnterior = () =>
    setImagenActiva(
      (actual) => (actual - 1 + imagenes.length) % imagenes.length,
    );
  const irSiguiente = () =>
    setImagenActiva((actual) => (actual + 1) % imagenes.length);

  const incluidos = showMore
    ? project.includes
    : project.includes.slice(0, INCLUIDOS_VISIBLES);

  const restantes = project.includes.length - INCLUIDOS_VISIBLES;

  const handleWhatsApp = () => {
    const message = `Hola, me interesa el proyecto *${project.title}* que vi en tu portafolio.

📋 Proyecto: ${project.title}
📝 Categoría: ${project.category}

✅ Incluye:
${project.includes.map((inc) => `• ${inc}`).join("\n")}

¿Cuál sería el costo para un proyecto similar?`;

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="card-proyecto relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-500 hover:shadow-lg">
      {/* Línea superior animada: empieza en 0% de ancho y se expande al 100% al hacer hover en la card */}
      <div className="absolute inset-x-0 top-0 z-10 h-1.5 overflow-hidden">
        <div
          className={`card-proyecto__barra h-full bg-linear-to-r ${getCategoryAccent(project.category)}`}
        />
      </div>

      <div
        className={`flex flex-col ${invertido ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {/* ---------------- Galería ---------------- */}
        <div className="bg-slate-50/70 p-5 md:w-1/2 md:p-6">
          {/* Imagen principal */}
          <div className="relative min-h-60 md:min-h-110 flex-1 overflow-hidden rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
            {tieneImagenes ? (
              <>
                <img
                  src={imagenes[imagenActiva]}
                  alt={`${project.title} — imagen ${imagenActiva + 1} de ${imagenes.length}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Número del proyecto */}
                <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold tracking-widest text-slate-600 backdrop-blur-sm">
                  {numero}
                </span>

                {/* Contador de imágenes */}
                <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                  {imagenActiva + 1}/{imagenes.length}
                </span>

                {/* Flechas */}
                {imagenes.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={irAnterior}
                      aria-label="Imagen anterior"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-950"
                    >
                      <IconoFlecha hacia="izquierda" />
                    </button>
                    <button
                      type="button"
                      onClick={irSiguiente}
                      aria-label="Imagen siguiente"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-950"
                    >
                      <IconoFlecha hacia="derecha" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-slate-400">
                Sin imágenes
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {imagenes.slice(0, 3).map((ruta, i) => (
                <button
                  key={ruta}
                  type="button"
                  onClick={() => setImagenActiva(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={i === imagenActiva}
                  className={`h-16 overflow-hidden rounded-lg border-2 transition-colors md:h-20 ${
                    i === imagenActiva
                      ? "border-blue-950"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <img
                    src={ruta}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- Contenido ---------------- */}
        <div className="flex flex-1 flex-col p-6 md:w-1/2 md:p-8">
          {/* Categoría + conteo de imágenes */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(project.category)}`}
            >
              {project.category}
            </span>
            {tieneImagenes && (
              <span className="text-sm text-slate-500">
                {imagenes.length}{" "}
                {imagenes.length === 1 ? "imagen" : "imágenes"} del proyecto
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="font-serif text-3xl font-bold leading-tight text-blue-950 md:text-4xl">
            {project.title}
          </h3>

          {/* Descripción */}
          <p className="mt-3 leading-relaxed text-slate-600">
            {project.description}
          </p>

          {/* Franja de datos técnicos (Adaptable: 2 columnas/filas en móvil, 3 columnas en desktop) */}
          {meta.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
              {META_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={`px-4 py-3 ${
                    i === 2 ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <dt className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    {label}
                  </dt>
                  <dd className="mt-1 font-semibold text-azul text-sm">
                    {meta[i] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Qué incluye */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-600">
              Qué incluye
            </p>

            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {incluidos.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <IconoCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {restantes > 0 && (
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="mt-3 text-sm font-semibold text-blue-950 transition-colors hover:text-blue-800"
              >
                {showMore ? "Ver menos ▲" : `Ver ${restantes} más ▼`}
              </button>
            )}
          </div>

          {/* Botones */}
          <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl text-sm bg-blue-950 px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-blue-900"
            >
              <IconoChat />
              Preguntar por este proyecto
            </button>

            <button
              type="button"
              onClick={() => navigate("/quotation")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl text-sm border border-slate-300 px-6 py-3.5 font-semibold text-blue-950 transition-colors duration-200 hover:bg-slate-50"
            >
              Solicitar similar
              <IconoEnlaceExterno />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
