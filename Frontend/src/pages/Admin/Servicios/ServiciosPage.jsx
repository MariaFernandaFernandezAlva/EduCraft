// src/pages/Admin/Servicios/ServiciosPage.jsx
// Página principal de Servicios - Lista y CRUD

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, deleteService } from '../../../services/api';

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
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteService(id);

      if (result.success) {
        setServices(services.filter(s => s.id !== id));
        setDeleteConfirm(null);
        alert('Servicio eliminado exitosamente');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🛠️ Servicios
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona los servicios que ofrece tu negocio
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/servicios/new')}
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

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        // Sin servicios
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay servicios aún
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer servicio para que aparezca en tu landing page
          </p>
          <button
            onClick={() => navigate('/admin/servicios/new')}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Crear Servicio
          </button>
        </div>
      ) : (
        // Tabla de Servicios
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              
              {/* Header de tabla */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Entrega
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Body de tabla */}
              <tbody className="divide-y divide-gray-200">
                {services.map(service => (
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
                          onClick={() => navigate(`/admin/servicios/${service.id}/edit`)}
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
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ¿Eliminar servicio?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. El servicio será eliminado permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}