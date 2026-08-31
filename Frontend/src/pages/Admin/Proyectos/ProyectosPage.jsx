// src/pages/Admin/Proyectos/ProyectosPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../../../services/api";
import TableLayout from "../../../components/common/Admin/TableLayout";
import EmptyState from "../../../components/common/Admin/EmptyState";
import ConfirmDialog from "../../../components/common/Admin/ConfirmDialog";

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
      setProjects(projects.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      alert("Proyecto eliminado exitosamente");
    } else {
      alert("Error: " + result.message);
    }
  };

  const columnas = [
    { label: "Portada" },
    { label: "Categoría" },
    { label: "Título" },
    { label: "Fotos", align: "center" },
    { label: "Estado", align: "center" },
    { label: "Acciones", align: "center" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎨 Proyectos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el portafolio de tu negocio
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/proyectos/new")}
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

      <TableLayout
        loading={loading}
        columnas={columnas}
        hayDatos={projects.length > 0}
        vacio={
          <EmptyState
            icono="🎨"
            titulo="No hay proyectos aún"
            accion={
              <button
                onClick={() => navigate("/admin/proyectos/new")}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Crear Proyecto
              </button>
            }
          />
        }
      >
        {projects.map((project) => (
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
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  project.visible
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {project.visible ? "Visible" : "Oculto"}
              </span>
            </td>

            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    navigate(`/admin/proyectos/${project.id}/edit`)
                  }
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
      </TableLayout>

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar proyecto?"
          mensaje='Esta acción no se puede deshacer. Si solo quieres quitarlo de la web, edítalo y desmarca "Mostrar en el portafolio".'
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  );
}
