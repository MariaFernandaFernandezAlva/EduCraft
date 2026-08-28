// src/pages/Admin/Proyectos/ProyectosPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../../../services/api';

export default function ProyectosPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const result = await getProjects();

    if (result.success) {
      setProjects(result.data);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const result = await deleteProject(id);

    if (result.success) {
      setProjects(projects.filter(p => p.id !== id));
      setDeleteConfirm(null);
      alert('Proyecto eliminado exitosamente');
    } else {
      alert('Error: ' + result.message);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎨 Proyectos</h1>
          <p className="text-gray-600 mt-1">Gestiona el portafolio de tu negocio</p>
        </div>
        <button
          onClick={() => navigate('/admin/proyectos/new')}
          className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
        >
          ➕ Nuevo Proyecto
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay proyectos aún</h3>
          <button
            onClick={() => navigate('/admin/proyectos/new')}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Crear Proyecto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Portada</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Título</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Fotos</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {project.title}
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {project.images.length}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        project.visible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {project.visible ? 'Visible' : 'Oculto'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/proyectos/${project.id}/edit`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(project.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar proyecto?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Si solo quieres quitarlo de la web, edítalo y desmarca "Mostrar en el portafolio".
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
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