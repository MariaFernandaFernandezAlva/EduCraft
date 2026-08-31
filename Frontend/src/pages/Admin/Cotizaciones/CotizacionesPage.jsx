// src/pages/Admin/Cotizaciones/CotizacionesPage.jsx
// Bandeja de entrada: SOLO las cotizaciones pendientes.
// Todo lo ya gestionado vive en el Historial.

import { useState, useEffect } from "react";
import {
  getPendingQuotations,
  updateQuotation,
  deleteQuotation,
} from "../../../services/api";
import { formatearFecha } from "../../../data/quotationStatus";
import QuotationDetail from "./QuotationDetail";
import TableLayout from "../../../components/common/Admin/TableLayout";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";

export default function CotizacionesPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setLoading(true);
    const result = await getPendingQuotations();

    if (result.success) {
      // Más antiguas primero: quien lleva más esperando
      // debería atenderse antes.
      const ordenadas = [...result.data].sort((a, b) =>
        (a.createdAt || "").localeCompare(b.createdAt || ""),
      );
      setQuotations(ordenadas);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Se usa tanto al cotizar como al declinar: en ambos casos
  // el status deja de ser "pendiente" y la fila sale de la bandeja.
  const handleActualizar = async (cambios) => {
    const result = await updateQuotation(detalle.id, cambios);

    if (result.success) {
      setQuotations((prev) => prev.filter((q) => q.id !== detalle.id));
      setDetalle(null);
    } else {
      alert("Error al guardar: " + result.message);
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

  const columnas = [
    { label: "Recibida" },
    { label: "Cliente" },
    { label: "Proyecto" },
    { label: "Entrega" },
    { label: "Acciones", align: "center" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💼 Cotizaciones</h1>
        <p className="text-gray-600 mt-1">
          Solicitudes nuevas por atender. Una vez cotizadas o declinadas pasan
          al Historial.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      )}

      <TableLayout
        loading={loading}
        columnas={columnas}
        hayDatos={quotations.length > 0}
        vacio={
          <EmptyState
            icono="✅"
            titulo="Todo al día"
            mensaje="No tienes solicitudes pendientes por atender."
          />
        }
      >
        {quotations.map((q) => (
          <tr key={q.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {formatearFecha(q.createdAt)}
            </td>

            <td className="px-6 py-4">
              <p className="text-sm font-medium text-gray-900">{q.fullName}</p>
              <p className="text-xs text-gray-500">{q.whatsapp}</p>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">{q.projectType}</td>

            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {q.deliveryDate || "—"}
            </td>

            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDetalle(q)}
                  className="px-4 py-1 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm font-semibold"
                >
                  Atender
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
          // La key hace que el modal se reinicie por completo
          // al abrir otra cotización, en vez de conservar los
          // items de la anterior.
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
          mensaje={'Se perderá para siempre. Si simplemente no vas a tomar el proyecto, usa "Atender" → "Declinar": así queda registrada en el historial con su motivo.'}
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  );
}
