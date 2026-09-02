import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getPendingQuotations,
  updateQuotation,
  deleteQuotation,
} from "../../../services/api";
import { formatearFecha } from "../../../data/quotationStatus";
import QuotationDetail from "./QuotationDetail";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";
import useIsDesktop from "../../../hooks/useIsDesktop";
import Toolbar from "../../../components/common/Admin/Toolbar";
import StatsRow from "../../../components/common/Admin/StatsRow";
import { PlusIcon, SquaresPlusIcon, CheckBadgeIcon, ExclamationTriangleIcon, TruckIcon } from "@heroicons/react/24/outline";

const DIA_MS = 1000 * 60 * 60 * 24;

// Días completos transcurridos desde que llegó la solicitud.
const diasEsperando = (createdAt) => {
  if (!createdAt) return 0;
  const fecha = new Date(createdAt);
  if (isNaN(fecha)) return 0;
  return Math.floor((Date.now() - fecha.getTime()) / DIA_MS);
};

// Días que faltan para la fecha de entrega deseada.
const diasParaEntrega = (deliveryDate) => {
  if (!deliveryDate) return null;
  const fecha = new Date(deliveryDate);
  if (isNaN(fecha)) return null;
  return Math.ceil((fecha.getTime() - Date.now()) / DIA_MS);
};

export default function CotizacionesPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [view, setView] = useState("table");
  const isDesktop = useIsDesktop();
  const effectiveView = isDesktop ? view : "grid";

  const loadQuotations = useCallback(async () => {
    setLoading(true);
    const result = await getPendingQuotations();

    if (result.success) {
      // Más antiguas primero: quien lleva más esperando se atiende antes.
      const ordenadas = [...result.data].sort((a, b) =>
        (a.createdAt || "").localeCompare(b.createdAt || "")
      );
      setQuotations(ordenadas);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const stats = useMemo(() => {
    const hoy = quotations.filter((q) => diasEsperando(q.createdAt) === 0).length;
    const demoradas = quotations.filter((q) => diasEsperando(q.createdAt) >= 3).length;
    const proximas = quotations.filter((q) => {
      const dias = diasParaEntrega(q.deliveryDate);
      return dias !== null && dias >= 0 && dias <= 7;
    }).length;

    return { total: quotations.length, hoy, demoradas, proximas };
  }, [quotations]);

  const categories = useMemo(
    () => [
      "Todos",
      ...new Set(quotations.map((s) => s.category).filter(Boolean)),
    ],
    [quotations]
  );

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return quotations.filter((item) => {
      const matchcategory = category === "Todos" || item.category === category;
      const titleNormalized = item.fullName
        ? item.fullName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        : "";
      const matchSearch = !q || titleNormalized.includes(q);
      return matchcategory && matchSearch;
    });
  }, [quotations, search, category]);

  // Se usa al cotizar y al declinar: en ambos casos el status deja
  // de ser "pendiente" y la fila sale de la bandeja.
  const handleActualizar = async (cambios) => {
    const result = await updateQuotation(detalle.id, cambios);

    if (result.success) {
      setQuotations((prev) => prev.filter((q) => q.id !== detalle.id));
      setDetalle(null);
    } else {
      setError("Error al guardar: " + result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteQuotation(id);

    if (result.success) {
      setQuotations((prev) => prev.filter((q) => q.id !== id));
      setDeleteConfirm(null);
    } else {
      setError("Error al eliminar: " + result.message);
    }
  };

  const statCards = [
    { label: "Pendientes", value: stats.total, tone: "bg-slate-100 text-slate-600", icon: SquaresPlusIcon },
    { label: "Llegaron hoy", value: stats.hoy, tone: "bg-emerald-100 text-emerald-600", icon: CheckBadgeIcon },
    { label: "Esperando +3 días", value: stats.demoradas, tone: "bg-red-100 text-red-600", icon: ExclamationTriangleIcon },
    { label: "Entregas esta semana", value: stats.proximas, tone: "bg-violet-100 text-violet-600", icon: TruckIcon },
  ];

  return (
    <div>
      {/* Cabecera */}
      <div className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-5 md:py-10 text-slate-900 border-b border-gray-200">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-0.5 bg-amber-500"></div>
                  <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                    Bandeja
                  </span>
                </div>
      
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight">
                      Cotizaciones
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Solicitudes nuevas por atender. Una vez cotizadas o declinadas pasan al Historial.
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
            Cargando solicitudes...
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icono="✅"
            titulo={
              quotations.length === 0
                ? "Todo al día"
                : "Ninguna solicitud coincide"
            }
            mensaje={
              quotations.length === 0
                ? "No tienes solicitudes pendientes por atender."
                : "Prueba con otra búsqueda o quita el filtro de tipo."
            }
          />
        ) : effectiveView === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/70">
                <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
                  <th className="px-6 py-3">RECIBIDA</th>
                  <th className="px-6 py-3">CLIENTE</th>
                  <th className="px-6 py-3">PROYECTO</th>
                  <th className="px-6 py-3">ENTREGA</th>
                  <th className="px-6 py-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-700">
                        {formatearFecha(q.createdAt)}
                      </p>
                      <EsperaBadge dias={diasEsperando(q.createdAt)} />
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {q.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{q.whatsapp}</p>
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {q.projectType}
                      </span>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {q.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                      {q.deliveryDate || "—"}
                      <EntregaBadge dias={diasParaEntrega(q.deliveryDate)} />
                    </td>

                    <td className="px-6 py-4">
                      <Acciones
                        onAtender={() => setDetalle(q)}
                        onDelete={() => setDeleteConfirm(q)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((q) => (
              <article
                key={q.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {q.fullName}
                    </p>
                    <p className="text-xs text-slate-500">{q.whatsapp}</p>
                  </div>
                  <EsperaBadge dias={diasEsperando(q.createdAt)} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {q.projectType}
                  </span>
                  {q.academicLevel && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                      {q.academicLevel}
                    </span>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {q.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>Recibida: {formatearFecha(q.createdAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>Entrega: {q.deliveryDate || "—"}</span>
                </div>

                {/* mt-auto empuja las acciones al pie aunque las
                    descripciones tengan alturas distintas */}
                <div className="mt-auto pt-4">
                  <Acciones
                    onAtender={() => setDetalle(q)}
                    onDelete={() => setDeleteConfirm(q)}
                    full
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {detalle && (
        <QuotationDetail
          // La key reinicia el panel al abrir otra cotización, en vez
          // de conservar los items de la anterior.
          key={detalle.id}
          quotation={detalle}
          onClose={() => setDetalle(null)}
          onGuardar={handleActualizar}
          onDeclinar={handleActualizar}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar solicitud?"
          mensaje={`La solicitud de ${deleteConfirm.fullName} se perderá para siempre. Si simplemente no vas a tomar el proyecto, usa "Atender" → "Declinar": así queda registrada en el historial con su motivo.`}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
}

/* --- Piezas locales --- */

function EsperaBadge({ dias }) {
  if (dias <= 0) {
    return (
      <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        Hoy
      </span>
    );
  }

  const urgente = dias >= 3;

  return (
    <span
      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        urgente ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {dias} {dias === 1 ? "día" : "días"} esperando
    </span>
  );
}

function EntregaBadge({ dias }) {
  if (dias === null || dias > 7) return null;

  return (
    <span
      className={`mt-1 block text-[10px] font-semibold ${
        dias < 0 ? "text-red-600" : "text-amber-600"
      }`}
    >
      {dias < 0 ? "Fecha vencida" : dias === 0 ? "Es hoy" : `En ${dias} días`}
    </span>
  );
}

function Acciones({ onAtender, onDelete, full = false }) {
  return (
    <div className={`flex items-center gap-2 ${full ? "" : "justify-center"}`}>
      <button
        onClick={onAtender}
        className={`rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900 ${
          full ? "flex-1" : ""
        }`}
      >
        Atender
      </button>

      <button
        onClick={onDelete}
        aria-label="Eliminar solicitud"
        title="Eliminar solicitud"
        className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h12M8 6V4h4v2M6.5 6l.6 10h5.8l.6-10" />
        </svg>
      </button>
    </div>
  );
}