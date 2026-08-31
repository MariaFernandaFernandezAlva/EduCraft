import { useState, useEffect } from "react";
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
import TableLayout from "../../../components/common/Admin/TableLayout";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";

export default function HistorialPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Los tres filtros que pediste.
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setLoading(true);
    const result = await getQuotations();

    if (result.success) {
      // Traemos todas y descartamos las pendientes en el cliente.
      // Podríamos pedirle a json-server que filtre, pero necesitaría
      // una consulta por cada estado; así es una sola petición.
      const gestionadas = result.data
        .filter((q) => q.status !== "pendiente")
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      setQuotations(gestionadas);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await updateQuotation(id, { status: nuevoEstado });

    if (result.success) {
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: nuevoEstado } : q)),
      );
    } else {
      alert("Error al cambiar el estado: " + result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteQuotation(id);

    if (result.success) {
      setQuotations((prev) => prev.filter((q) => q.id !== id));
      setDeleteConfirm(null);
    } else {
      alert("Error al eliminar: " + result.message);
    }
  };

  // Los filtros se aplican en cadena sobre la misma lista.
  // Es un valor derivado: se recalcula solo cuando algo cambia.
  const visibles = quotations.filter((q) => {
    // Filtro por estado
    if (filtroEstado !== "todos" && q.status !== filtroEstado) return false;

    // Filtro por nombre. toLowerCase en ambos lados para
    // que "maria" encuentre a "María Fernández".
    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();
      const coincide =
        q.fullName?.toLowerCase().includes(texto) ||
        q.email?.toLowerCase().includes(texto);
      if (!coincide) return false;
    }

    // Filtro por rango de fechas. createdAt es ISO completo
    // ("2026-08-29T02:56:26.213Z"); nos quedamos con los
    // primeros 10 caracteres para comparar solo la fecha.
    const fecha = (q.createdAt || "").slice(0, 10);
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;

    return true;
  });

  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setBusqueda("");
    setDesde("");
    setHasta("");
  };

  const hayFiltrosActivos =
    filtroEstado !== "todos" || busqueda || desde || hasta;

  const handleMarcarEnviada = async () => {
    if (detalle.status !== "cotizada") return; // Ya estaba enviada o más allá

    const result = await updateQuotation(detalle.id, { status: "enviada" });

    if (result.success) {
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === detalle.id ? { ...q, status: "enviada" } : q,
        ),
      );
      setDetalle((prev) => ({ ...prev, status: "enviada" }));
    }
  };

  const columnas = [
    { label: "Fecha" },
    { label: "Cliente" },
    { label: "Proyecto" },
    { label: "Total", align: "right" },
    { label: "Estado" },
    { label: "Acciones", align: "center" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📂 Historial</h1>
        <p className="text-gray-600 mt-1">
          Todas las cotizaciones que ya gestionaste
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {/* Estado */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroEstado("todos")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filtroEstado === "todos"
                ? "bg-blue-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos ({quotations.length})
          </button>

          {HISTORY_STATUS.map((estado) => {
            const cantidad = quotations.filter(
              (q) => q.status === estado.valor,
            ).length;
            return (
              <button
                key={estado.valor}
                onClick={() => setFiltroEstado(estado.valor)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filtroEstado === estado.valor
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {estado.label} ({cantidad})
              </button>
            );
          })}
        </div>

        {/* Búsqueda y fechas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Buscar cliente
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre o correo..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Desde
            </label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>
        </div>

        {hayFiltrosActivos && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-bold">{visibles.length}</span> de{" "}
              {quotations.length}
            </p>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-blue-700 font-semibold hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <TableLayout
        loading={loading}
        columnas={columnas}
        hayDatos={visibles.length > 0}
        vacio={
          <EmptyState
            icono="📭"
            titulo={
              quotations.length === 0
                ? "Aún no has gestionado cotizaciones"
                : "Ninguna coincide con los filtros"
            }
          />
        }
      >
        {visibles.map((q) => (
          <tr key={q.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {formatearFecha(q.createdAt)}
            </td>

            <td className="px-6 py-4">
              <p className="text-sm font-medium text-gray-900">{q.fullName}</p>
              <p className="text-xs text-gray-500">{q.whatsapp}</p>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">{q.projectType}</td>

            <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
              {/* Las declinadas no tienen precio */}
              {q.items?.length > 0
                ? `S/ ${calcularTotal(q.items, q.shippingCost).toFixed(2)}`
                : "—"}
            </td>

            <td className="px-6 py-4">
              <select
                value={q.status}
                onChange={(e) => handleCambiarEstado(q.id, e.target.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${getStatusColor(q.status)}`}
              >
                {HISTORY_STATUS.map((estado) => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </td>

            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDetalle(q)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                >
                  👁️ Ver
                </button>
                <button
                  onClick={() => setDeleteConfirm(q.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableLayout>

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
          mensaje="Perderás el registro de esta cotización y los datos del cliente. Esta acción no se puede deshacer."
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  );
}
