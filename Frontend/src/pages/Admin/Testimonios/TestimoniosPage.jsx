// src/pages/Admin/Testimonios/TestimoniosPage.jsx
// Moderación: el admin no crea nada, solo oculta o elimina.

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../../../services/api";
import { formatearFecha } from "../../../data/quotationStatus";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";
import Toolbar from "../../../components/common/Admin/Toolbar";
import StatsRow from "../../../components/common/Admin/StatsRow";
import useIsDesktop from "../../../hooks/useIsDesktop";
import TestimonioDetail, { Stars } from "./TestimonioDetail";
import { SquaresPlusIcon, EyeIcon, EyeSlashIcon, PhotoIcon } from "@heroicons/react/24/outline";

const ESTADOS = [
  { valor: "aprobado", label: "Visible", color: "bg-emerald-100 text-emerald-700" },
  { valor: "oculto", label: "Oculto", color: "bg-slate-100 text-slate-600" },
];

const getEstadoColor = (valor) =>
  ESTADOS.find((e) => e.valor === valor)?.color || "bg-slate-100 text-slate-600";

export default function TestimoniosPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filtro, setFiltro] = useState("todos");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  const isDesktop = useIsDesktop();
  const effectiveView = isDesktop ? view : "grid";

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    const result = await getTestimonials();

    if (result.success) {
      // Más recientes primero. Las fechas ISO se ordenan como texto.
      const ordenados = [...result.data].sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
      );
      setTestimonials(ordenados);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await updateTestimonial(id, { status: nuevoEstado });

    if (result.success) {
      // En memoria en vez de recargar: más rápido y no pierde el scroll.
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nuevoEstado } : t))
      );
      // Si el panel está abierto con este testimonio, también se refresca.
      setDetalle((prev) =>
        prev && prev.id === id ? { ...prev, status: nuevoEstado } : prev
      );
    } else {
      setError("Error al cambiar el estado: " + result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteTestimonial(id);

    if (result.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirm(null);
      setDetalle(null);
    } else {
      setError("Error al eliminar: " + result.message);
    }
  };

  const stats = useMemo(() => {
    const visibles = testimonials.filter((t) => t.status === "aprobado").length;
    const conFotos = testimonials.filter((t) => t.images?.length > 0).length;

    return {
      total: testimonials.length,
      visibles,
      ocultos: testimonials.length - visibles,
      conFotos,
    };
  }, [testimonials]);

  // Los contadores salen de la lista completa, no de la filtrada:
  // si no, al filtrar los demás chips mostrarían cero.
  const opciones = useMemo(
    () => [
      { value: "todos", label: `Todos (${testimonials.length})` },
      ...ESTADOS.map((estado) => ({
        value: estado.valor,
        label: `${estado.label} (${
          testimonials.filter((t) => t.status === estado.valor).length
        })`,
      })),
    ],
    [testimonials]
  );

  const visibles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return testimonials.filter((t) => {
      const matchEstado = filtro === "todos" || t.status === filtro;
      const matchSearch = !q || (t.name || "").toLowerCase().includes(q);
      return matchEstado && matchSearch;
    });
  }, [testimonials, filtro, search]);

  const statCards = [
    { label: "Testimonios", value: stats.total, tone: "bg-slate-100 text-slate-600", icon: SquaresPlusIcon },
    { label: "Visibles", value: stats.visibles, tone: "bg-emerald-100 text-emerald-600", icon: EyeIcon },
    { label: "Ocultos", value: stats.ocultos, tone: "bg-amber-100 text-amber-600", icon: EyeSlashIcon },
    { label: "Con fotos", value: stats.conFotos, tone: "bg-violet-100 text-violet-600", icon: PhotoIcon },
  ];

  return (
    <div>
      {/* Cabecera */}
            <div className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-5 md:py-10 text-slate-900 border-b border-gray-200">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-0.5 bg-amber-500"></div>
                  <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                    Moderación
                  </span>
                </div>
      
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight">
                      Testimonios
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Gestiona los testimonios que dejan los usuarios en tu landing page. Puedes aprobarlos para que se muestren, ocultarlos o eliminarlos.
                    </p>
                  </div>
                </div>
      
                {/* Métricas */}
                <StatsRow items={statCards} />
              </div>
            </div>

      <div className="px-4 pt-5 lg:px-8 lg:pt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Toolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nombre del autor..."
          options={opciones}
          activeOption={filtro}
          onOptionChange={setFiltro}
          view={view}
          onViewChange={setView}
        />

        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Cargando testimonios...
          </p>
        ) : visibles.length === 0 ? (
          <EmptyState
            icono="💬"
            titulo={
              testimonials.length === 0
                ? "Aún no hay testimonios"
                : "Ninguno coincide"
            }
            mensaje={
              testimonials.length === 0
                ? "Cuando alguien deje su testimonio en la página, aparecerá aquí."
                : "Prueba con otra búsqueda o quita el filtro de estado."
            }
          />
        ) : effectiveView === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/70">
                <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
                  <th className="px-6 py-3">AUTOR</th>
                  <th className="px-6 py-3">CALIFICACIÓN</th>
                  <th className="px-6 py-3">COMENTARIO</th>
                  <th className="px-6 py-3">ESTADO</th>
                  <th className="px-6 py-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibles.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <Autor testimonial={t} />
                    </td>

                    <td className="px-6 py-4">
                      <Stars rating={t.rating} />
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {t.comment}
                      </p>
                      {t.images?.length > 0 && (
                        <span className="mt-1 inline-block text-[11px] text-blue-700">
                          {t.images.length} foto(s)
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <EstadoSelect
                        value={t.status}
                        onChange={(valor) => handleCambiarEstado(t.id, valor)}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <Acciones
                        onVer={() => setDetalle(t)}
                        onDelete={() => setDeleteConfirm(t)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibles.map((t) => (
              <article
                key={t.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <Autor testimonial={t} />
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getEstadoColor(t.status)}`}>
                    {ESTADOS.find((e) => e.valor === t.status)?.label || t.status}
                  </span>
                </div>

                <div className="mt-3">
                  <Stars rating={t.rating} />
                </div>

                <p className="mt-2 line-clamp-4 text-sm text-slate-600 italic">
                  &ldquo;{t.comment}&rdquo;
                </p>

                {t.images?.length > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {t.images.slice(0, 3).map((ruta) => (
                      <img
                        key={ruta}
                        src={ruta}
                        alt=""
                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                      />
                    ))}
                    {t.images.length > 3 && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-500">
                        +{t.images.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <EstadoSelect
                    value={t.status}
                    onChange={(valor) => handleCambiarEstado(t.id, valor)}
                  />
                  <Acciones
                    onVer={() => setDetalle(t)}
                    onDelete={() => setDeleteConfirm(t)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {detalle && (
        <TestimonioDetail
          key={detalle.id}
          testimonial={detalle}
          onClose={() => setDetalle(null)}
          onCambiarEstado={handleCambiarEstado}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar testimonio?"
          mensaje={`El testimonio de ${deleteConfirm.name} se borrará para siempre. Si solo quieres quitarlo de la página, usa la opción de ocultar: así conservas el registro.`}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
}

/* --- Piezas locales --- */

function Autor({ testimonial }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-xs font-bold text-white">
        {testimonial.avatar}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          {testimonial.name}
        </p>
        <p className="truncate text-xs text-slate-500">
          {testimonial.role} · {formatearFecha(testimonial.date)}
        </p>
      </div>
    </div>
  );
}

function EstadoSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Cambiar estado"
      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold outline-hidden ${getEstadoColor(value)}`}
    >
      {ESTADOS.map((estado) => (
        <option key={estado.valor} value={estado.valor}>
          {estado.label}
        </option>
      ))}
    </select>
  );
}

function Acciones({ onVer, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onVer}
        aria-label="Ver testimonio"
        title="Ver testimonio"
        className="rounded-lg bg-blue-50 p-2 text-blue-700 transition-colors hover:bg-blue-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" />
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      </button>

      <button
        onClick={onDelete}
        aria-label="Eliminar"
        title="Eliminar"
        className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h12M8 6V4h4v2M6.5 6l.6 10h5.8l.6-10" />
        </svg>
      </button>
    </div>
  );
}