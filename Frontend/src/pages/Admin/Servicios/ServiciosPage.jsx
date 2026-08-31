// src/pages/Admin/Servicios/ServiciosPage.jsx
// Página principal de Servicios - Lista y CRUD

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, deleteService } from "../../../services/api";
import TableLayout from "../../../components/common/Admin/TableLayout";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";

export default function ServiciosPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Cargar servicios al montar
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await getServices();

      if (result.success) {
        setServices(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteService(id);

      if (result.success) {
        setServices(services.filter((s) => s.id !== id));
        setDeleteConfirm(null);
        alert("Servicio eliminado exitosamente");
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const columnas = [
    { label: "Categoría" },
    { label: "Título" },
    { label: "Descripción" },
    { label: "Entrega" },
    { label: "Acciones", align: "center" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🛠️ Servicios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los servicios que ofrece tu negocio
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/servicios/new")}
          className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          ➕ Nuevo Servicio
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      )}

      <TableLayout
        loading={loading}
        columnas={columnas}
        hayDatos={services.length > 0}
        vacio={
          <EmptyState
            icono="🛠️"
            titulo="No hay servicios aún"
            mensaje="Crea tu primer servicio para que aparezca en tu landing page"
            accion={
              <button
                onClick={() => navigate("/admin/servicios/new")}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Crear Servicio
              </button>
            }
          />
        }
      >
        {services.map((service) => (
          <tr key={service.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {service.category}
              </span>
            </td>

            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {service.title}
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
              {service.description.substring(0, 50)}...
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
              {service.deliveryTime}
            </td>

            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {/* Botón Editar */}
                <button
                  onClick={() =>
                    navigate(`/admin/servicios/${service.id}/edit`)
                  }
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-semibold"
                >
                  ✏️ Editar
                </button>

                {/* Botón Eliminar */}
                <button
                  onClick={() => setDeleteConfirm(service.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableLayout>

      {/* Modal de Confirmación de Eliminación */}
      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar servicio?"
          mensaje="Esta acción no se puede deshacer. Si solo quieres quitarlo de la web, edítalo y desmarca la casilla de visible."
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  );
}
