// src/pages/Admin/Historial/HistorialPage.jsx

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getQuotations,
  updateQuotation,
  deleteQuotation,
} from "../../../services/api";
import {
  HISTORY_STATUS,
  getStatusColor,
  getStatusLabel,
  formatearFecha,
  calcularTotal,
} from "../../../data/quotationStatus";
import QuotationDetail from "../Cotizaciones/QuotationDetail";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";
import Toolbar from "../../../components/common/Admin/Toolbar";
import StatsRow from "../../../components/common/Admin/StatsRow";
import useIsDesktop from "../../../hooks/useIsDesktop";

const totalDe = (q) =>
  q.items?.length > 0 ? calcularTotal(q.items, q.shippingCost) : 0;

export default function HistorialPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [view, setView] = useState("table");

  const isDesktop = useIsDesktop();
  const effectiveView = isDesktop ? view : "grid";

  const loadQuotations = useCallback(async () => {
    setLoading(true);
    const result = await getQuotations();

    if (result.success) {
      // Traemos todas y descartamos las pendientes en el cliente:
      // json-server necesitaría una consulta por estado, así es una sola.
      const gestionadas = result.data
        .filter((q) => q.status !== "pendiente")
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      setQuotations(gestionadas);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await updateQuotation(id, { status: nuevoEstado });

    if (result.success) {
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: nuevoEstado } : q))
      );
    } else {
      setError("Error al cambiar el estado: " + result.message);
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

  const handleMarcarEnviada = async () => {
    if (detalle.status !== "cotizada") return; // Ya estaba enviada o más allá

    const result = await updateQuotation(detalle.id, { status: "enviada" });

    if (result.success) {
      setQuotations((prev) =>
        prev.map((q) => (q.id === detalle.id ? { ...q, status: "enviada" } : q))
      );
      setDetalle((prev) => ({ ...prev, status: "enviada" }));
    }
  };

  const stats = useMemo(() => {
    const declinadas = quotations.filter((q) => q.status === "declinada").length;
    const monto = quotations.reduce((suma, q) => suma + totalDe(q), 0);

    return {
      total: quotations.length,
      cotizadas: quotations.length - declinadas,
      declinadas,
      monto,
    };
  }, [quotations]);

  const opciones = useMemo(
    () => [
      { value: "todos", label: `Todos (${quotations.length})` },
      ...HISTORY_STATUS.map((estado) => ({
        value: estado.valor,
        label: `${estado.label} (${
          quotations.filter((q) => q.status === estado.valor).length
        })`,
      })),
    ],
    [quotations]
  );

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return quotations.filter((q) => {
      if (filtroEstado !== "todos" && q.status !== filtroEstado) return false;

      if (texto) {
        const coincide =
          q.fullName?.toLowerCase().includes(texto) ||
          q.email?.toLowerCase().includes(texto);
        if (!coincide) return false;
      }

      // createdAt es ISO completo; los primeros 10 caracteres son la fecha,
      // y en formato ISO se pueden comparar como texto.
      const fecha = (q.createdAt || "").slice(0, 10);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;

      return true;
    });
  }, [quotations, filtroEstado, busqueda, desde, hasta]);

  const hayFiltrosActivos =
    filtroEstado !== "todos" || busqueda || desde || hasta;

  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setBusqueda("");
    setDesde("");
    setHasta("");
  };

  const statCards = [
    { label: "Gestionadas", value: stats.total, tone: "bg-slate-100 text-slate-600" },
    { label: "Cotizadas", value: stats.cotizadas, tone: "bg-emerald-100 text-emerald-600" },
    { label: "Declinadas", value: stats.declinadas, tone: "bg-amber-100 text-amber-600" },
    {
      label: "Total cotizado",
      value: `S/ ${stats.monto.toFixed(0)}`,
      tone: "bg-violet-100 text-violet-600",
      icon: "S/",
    },
  ];

  return (
    <div className="pb-12">
      <div className="border-b border-slate-200 bg-white px-4 pt-6 pb-5 lg:px-8 lg:pt-8 lg:pb-6">
        <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
          Archivo
        </span>

        <div className="mt-3">
          <h1 className="font-serif text-3xl font-bold text-blue-950">
            Historial
          </h1>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Todas las cotizaciones que ya gestionaste, cotizadas o declinadas.
          </p>
        </div>

        <StatsRow items={statCards} />
      </div>

      <div className="px-4 pt-5 lg:px-8 lg:pt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Toolbar
          search={busqueda}
          onSearchChange={setBusqueda}
          searchPlaceholder="Buscar por nombre o correo..."
          options={opciones}
          activeOption={filtroEstado}
          onOptionChange={setFiltroEstado}
          view={view}
          onViewChange={setView}
        />

        {/* Rango de fechas: va aparte porque son dos campos y no
            entran en la barra sin apretarla en pantallas medianas. */}
        <div className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500">
              DESDE
            </label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500">
              HASTA
            </label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-blue-400"
            />
          </div>

          {hayFiltrosActivos && (
            <div className="ml-auto flex items-center gap-3">
              <p className="text-xs text-slate-500">
                Mostrando <span className="font-bold">{visibles.length}</span> de{" "}
                {quotations.length}
              </p>
              <button
                onClick={limpiarFiltros}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Cargando historial...
          </p>
        ) : visibles.length === 0 ? (
          <EmptyState
            icono="📭"
            titulo={
              quotations.length === 0
                ? "Aún no has gestionado cotizaciones"
                : "Ninguna coincide con los filtros"
            }
            mensaje={
              quotations.length === 0
                ? "Cuando atiendas una solicitud pendiente, aparecerá aquí."
                : "Prueba con otro rango de fechas o quita el filtro de estado."
            }
          />
        ) : effectiveView === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/70">
                <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
                  <th className="px-6 py-3">FECHA</th>
                  <th className="px-6 py-3">CLIENTE</th>
                  <th className="px-6 py-3">PROYECTO</th>
                  <th className="px-6 py-3 text-right">TOTAL</th>
                  <th className="px-6 py-3">ESTADO</th>
                  <th className="px-6 py-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibles.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                      {formatearFecha(q.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {q.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{q.whatsapp}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {q.projectType}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap text-slate-900">
                      {/* Las declinadas no tienen precio */}
                      {q.items?.length > 0
                        ? `S/ ${totalDe(q).toFixed(2)}`
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <EstadoSelect
                        value={q.status}
                        onChange={(valor) => handleCambiarEstado(q.id, valor)}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <Acciones
                        onVer={() => setDetalle(q)}
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
            {visibles.map((q) => (
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
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(q.status)}`}>
                    {getStatusLabel(q.status)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {q.projectType}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formatearFecha(q.createdAt)}
                  </span>
                </div>

                <p className="mt-3 font-serif text-xl font-bold text-blue-950">
                  {q.items?.length > 0 ? `S/ ${totalDe(q).toFixed(2)}` : "Sin cotizar"}
                </p>

                {q.declineReason && (
                  <p className="mt-2 line-clamp-2 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-900">
                    {q.declineReason}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <EstadoSelect
                    value={q.status}
                    onChange={(valor) => handleCambiarEstado(q.id, valor)}
                  />
                  <Acciones
                    onVer={() => setDetalle(q)}
                    onDelete={() => setDeleteConfirm(q)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {detalle && (
        <QuotationDetail
          key={detalle.id}
          quotation={detalle}
          onClose={() => setDetalle(null)}
          onEnviado={handleMarcarEnviada}
          soloLectura={true}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar del historial?"
          mensaje={`Perderás el registro de la cotización de ${deleteConfirm.fullName} y los datos del cliente. Esta acción no se puede deshacer.`}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
}

/* --- Piezas locales --- */

function EstadoSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Cambiar estado"
      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold outline-hidden ${getStatusColor(value)}`}
    >
      {HISTORY_STATUS.map((estado) => (
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
        aria-label="Ver cotización"
        title="Ver cotización"
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