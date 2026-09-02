import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getServices, deleteService } from "../../../services/api";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";
import { getAccent } from "../../../data/categories";
import useIsDesktop from "../../../hooks/useIsDesktop";
import { PlusIcon, SquaresPlusIcon, CheckBadgeIcon, EyeSlashIcon, ClockIcon } from "@heroicons/react/24/outline";
import Toolbar from "../../../components/common/Admin/Toolbar";
import StatsRow from "../../../components/common/Admin/StatsRow";

// "5–8 días" -> [5, 8]
const parseDays = (text = "") => (text.match(/\d+/g) || []).map(Number);

export default function ServiciosPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [view, setView] = useState("table");
  const isDesktop = useIsDesktop();
  const effectiveView = isDesktop ? view : "grid";

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getServices();
      if (result.success) {
        setServices(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const stats = useMemo(() => {
    const publicados = services.filter((s) => s.visible !== false).length;
    const dias = services.flatMap((s) => parseDays(s.deliveryTime));
    const promedio = dias.length
      ? Math.round(dias.reduce((a, b) => a + b, 0) / dias.length)
      : 0;

    return {
      total: services.length,
      publicados,
      ocultos: services.length - publicados,
      promedio,
    };
  }, [services]);

  const categories = useMemo(
    () => [
      "Todos",
      ...new Set(services.map((s) => s.category).filter(Boolean)),
    ],
    [services],
  );

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return services.filter((s) => {
      const matchCategory = category === "Todos" || s.category === category;
      const titleNormalized = s.title
        ? s.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        : "";
      const matchSearch = !q || titleNormalized.includes(q);
      return matchCategory && matchSearch;
    });
  }, [services, search, category]);

  const handleDelete = async (id) => {
    const result = await deleteService(id);
    if (result.success) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    } else {
      setError(result.message || "No se pudo eliminar");
    }
  };

  const statCards = [
    {
      label: "Servicios totales",
      value: stats.total,
      tone: "bg-slate-100 text-slate-600",
      icon: SquaresPlusIcon,
    },
    {
      label: "Publicados",
      value: stats.publicados,
      tone: "bg-emerald-100 text-emerald-600",
      icon: CheckBadgeIcon,
    },
    {
      label: "Ocultos",
      value: stats.ocultos,
      tone: "bg-amber-100 text-amber-600",
      icon: EyeSlashIcon,
    },
    {
      label: "Entrega promedio",
      value: `${stats.promedio} días`,
      tone: "bg-violet-100 text-violet-600",
      icon: ClockIcon,
    },
  ];

  return (
    <div>
      {/* Cabecera */}
      <div className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-5 md:py-10 text-slate-900 border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-amber-500"></div>
            <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
              Catálogo
            </span>
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight">
                Servicios
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Gestiona los servicios que se muestran en tu landing page. Puedes crear, editar o eliminar servicios, así como activar o desactivar su visibilidad.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/servicios/new")}
              className="flex shrink-0 items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
            >
              <PlusIcon className="h-4 w-4" strokeWidth={4} />
              Nuevo servicio
            </button>
          </div>

          {/* Métricas */}
          <StatsRow items={statCards} />
        </div>
      </div>

      <div className="px-8 pt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Barra de herramientas */}
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar servicio, categoría o descripción..."
          options={categories}
          activeOption={category}
          onOptionChange={setCategory}
          view={view}
          onViewChange={setView}
        />

        {/* Contenido */}
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Cargando servicios...
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icono="🛠️"
            titulo={
              services.length === 0
                ? "No hay servicios aún"
                : "Ningún servicio coincide"
            }
            mensaje={
              services.length === 0
                ? "Crea tu primer servicio para que aparezca en tu landing page"
                : "Prueba con otra búsqueda o quita el filtro de categoría."
            }
            accion={
              services.length === 0 && (
                <button
                  onClick={() => navigate("/admin/servicios/new")}
                  className="rounded-lg bg-blue-950 px-6 py-2 text-white"
                >
                  Crear servicio
                </button>
              )
            }
          />
        ) : effectiveView === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/70">
                <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
                  <th className="px-6 py-3">SERVICIO</th>
                  <th className="px-6 py-3">DESCRIPCIÓN</th>
                  <th className="px-6 py-3">ENTREGA</th>
                  <th className="px-6 py-3">ESTADO</th>
                  <th className="px-6 py-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((service) => (
                  <tr
                    key={service.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-xs font-bold text-white ${getAccent(service.category).header}`}
                        >
                          {service.title?.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {service.title}
                          </p>
                          <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            {service.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {service.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {(service.includes || []).slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                      {service.deliveryTime}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          service.visible !== false
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {service.visible !== false ? "Público" : "Oculto"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() =>
                          navigate(`/admin/servicios/${service.id}/edit`)
                        }
                        onDelete={() => setDeleteConfirm(service)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div
                  className={`relative h-24 bg-linear-to-br ${getAccent(service.category).header}`}
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt=""
                      className="h-full w-full object-cover opacity-70"
                    />
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {service.category}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {service.visible !== false ? "Público" : "Oculto"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-blue-950">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(service.includes || []).map((item) => (
                      <span
                        key={item}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">
                      {service.deliveryTime}
                    </span>
                    <RowActions
                      onEdit={() =>
                        navigate(`/admin/servicios/${service.id}/edit`)
                      }
                      onDelete={() => setDeleteConfirm(service)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Aquí se monta ServicioDrawer cuando la URL es /new o /:id/edit */}
      <Outlet context={{ services, reload: loadServices }} />

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar servicio?"
          mensaje={`"${deleteConfirm.title}" se borrará para siempre. Si solo quieres quitarlo de la web, edítalo y desactiva "Mostrar en la página pública".`}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onEdit}
        aria-label="Editar"
        title="Editar"
        className="rounded-lg bg-amber-50 p-2 text-amber-600 transition-colors hover:bg-amber-100"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 3.5a1.8 1.8 0 0 1 2.5 2.5L7 15.5l-3.5 1 1-3.5Z" />
        </svg>
      </button>

      <button
        onClick={onDelete}
        aria-label="Eliminar"
        title="Eliminar"
        className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h12M8 6V4h4v2M6.5 6l.6 10h5.8l.6-10" />
        </svg>
      </button>
    </div>
  );
}
