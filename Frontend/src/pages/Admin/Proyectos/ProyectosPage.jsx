import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getProjects, deleteProject } from "../../../services/api";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";
import RowActions from "../../../components/common/Admin/RowActions";
import useIsDesktop from "../../../hooks/useIsDesktop";

export default function ProyectosPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [view, setView] = useState("table");
  const isDesktop = useIsDesktop();
  const effectiveView = isDesktop ? view : "grid";

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProjects();
      if (result.success) {
        setProjects(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => {
    const publicados = projects.filter((p) => p.visible !== false).length;
    const fotos = projects.reduce(
      (total, p) => total + (p.images?.length || 0),
      0
    );

    return {
      total: projects.length,
      publicados,
      ocultos: projects.length - publicados,
      fotos,
    };
  }, [projects]);

  const categories = useMemo(
    () => ["Todas", ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCategory = category === "Todas" || p.category === category;
      const matchSearch =
        !q ||
        [p.title, p.category, p.description, ...(p.meta || [])]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [projects, search, category]);

  const handleDelete = async (id) => {
    const result = await deleteProject(id);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } else {
      setError(result.message || "No se pudo eliminar");
    }
  };

  const statCards = [
    { label: "Proyectos totales", value: stats.total, tone: "bg-slate-100 text-slate-600" },
    { label: "Publicados", value: stats.publicados, tone: "bg-emerald-100 text-emerald-600" },
    { label: "Ocultos", value: stats.ocultos, tone: "bg-amber-100 text-amber-600" },
    { label: "Fotos en galería", value: stats.fotos, tone: "bg-violet-100 text-violet-600" },
  ];

  return (
    <div className="pb-12">
      {/* Cabecera */}
      <div className="border-b border-slate-200 bg-white px-8 pt-8 pb-6">
        <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
          Portafolio
        </span>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-blue-950">
              Proyectos
            </h1>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Gestiona el portafolio: cada proyecto admite varias fotos, portada
              destacada y datos rápidos.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/proyectos/new")}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Nuevo proyecto
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${card.tone}`}>
                {String(card.value).charAt(0)}
              </span>
              <div>
                <p className="font-serif text-lg font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Barra de herramientas */}
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div className="relative min-w-56 flex-1">
            <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyecto, categoría o materia..."
              className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm outline-hidden focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  cat === category
                    ? "bg-blue-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-slate-200 lg:flex">
            {[
              { id: "table", label: "Vista de tabla", path: <path d="M3 6h14M3 10h14M3 14h14" /> },
              { id: "grid", label: "Vista de tarjetas", path: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="6" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="11" width="6" height="6" rx="1" /></> },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setView(option.id)}
                aria-label={option.label}
                aria-pressed={view === option.id}
                className={`p-2 transition-colors ${
                  view === option.id
                    ? "bg-blue-950 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  {option.path}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Cargando proyectos...
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icono="🎨"
            titulo={
              projects.length === 0
                ? "No hay proyectos aún"
                : "Ningún proyecto coincide"
            }
            mensaje={
              projects.length === 0
                ? "Crea tu primer proyecto para llenar el portafolio"
                : "Prueba con otra búsqueda o quita el filtro de categoría."
            }
            accion={
              projects.length === 0 && (
                <button
                  onClick={() => navigate("/admin/proyectos/new")}
                  className="rounded-lg bg-blue-950 px-6 py-2 text-white"
                >
                  Crear proyecto
                </button>
              )
            }
          />
        ) : effectiveView === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/70">
                <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
                  <th className="px-6 py-3">PORTADA</th>
                  <th className="px-6 py-3">PROYECTO</th>
                  <th className="px-6 py-3">DESCRIPCIÓN</th>
                  <th className="px-6 py-3">FOTOS</th>
                  <th className="px-6 py-3">ESTADO</th>
                  <th className="px-6 py-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => (
                  <tr key={project.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <Cover project={project} />
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {project.title}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {project.category}
                      </span>
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {project.description}
                      </p>
                      <MetaTags meta={project.meta} />
                    </td>

                    <td className="px-6 py-4">
                      <Thumbnails images={project.images} />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge visible={project.visible} />
                    </td>

                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => navigate(`/admin/proyectos/${project.id}/edit`)}
                        onDelete={() => setDeleteConfirm(project)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative h-44 bg-slate-100">
                  {project.images?.[0] && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {project.category}
                  </span>

                  <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    <PhotoIcon />
                    {project.images?.length || 0}
                  </span>

                  {/* Miniaturas del resto de la galería */}
                  <div className="absolute bottom-3 left-3">
                    <Thumbnails images={project.images?.slice(1)} size="sm" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-blue-950">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">
                    {project.description}
                  </p>

                  <MetaTags meta={project.meta} />

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <StatusBadge visible={project.visible} />
                    <RowActions
                      onEdit={() => navigate(`/admin/proyectos/${project.id}/edit`)}
                      onDelete={() => setDeleteConfirm(project)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Aquí se monta ProyectoDrawer cuando la URL es /new o /:id/edit */}
      <Outlet context={{ projects, reload: loadProjects }} />

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar proyecto?"
          mensaje={`"${deleteConfirm.title}" y sus ${deleteConfirm.images?.length || 0} fotos se quitarán del portafolio para siempre. Si solo quieres esconderlo, edítalo y desactiva "Mostrar en el portafolio público".`}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
}

/* --- Piezas pequeñas, locales a esta página --- */

function PhotoIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="3" width="12" height="10" rx="1.5" />
      <path d="M3 6v9a2 2 0 0 0 2 2h9" />
    </svg>
  );
}

function Cover({ project }) {
  return (
    <div className="relative h-14 w-14 shrink-0">
      {project.images?.[0] ? (
        <img
          src={project.images[0]}
          alt={project.title}
          className="h-full w-full rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="h-full w-full rounded-lg border border-dashed border-slate-300 bg-slate-50" />
      )}

      <span className="absolute -right-1 -bottom-1 flex items-center gap-0.5 rounded-full bg-white px-1.5 text-[10px] font-semibold text-slate-600 shadow-xs ring-1 ring-slate-200">
        <PhotoIcon />
        {project.images?.length || 0}
      </span>
    </div>
  );
}

function Thumbnails({ images = [], size = "md" }) {
  if (!images || images.length === 0) return null;

  const box = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className="flex">
      {images.slice(0, 3).map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          // -ml-2 solapa cada miniatura sobre la anterior; el ring blanco las separa
          className={`${box} rounded-lg object-cover ring-2 ring-white ${i > 0 ? "-ml-2" : ""}`}
        />
      ))}
    </div>
  );
}

function MetaTags({ meta = [] }) {
  const tags = (meta || []).filter(Boolean);
  if (tags.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
          {tag}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ visible }) {
  const isVisible = visible !== false;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
      isVisible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
    }`}>
      {isVisible ? "Visible" : "Oculto"}
    </span>
  );
}