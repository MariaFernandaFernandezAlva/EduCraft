// src/pages/Admin/Proyectos/ProyectoDrawer.jsx
// Se monta en /admin/proyectos/new y /admin/proyectos/:id/edit

import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  getProjectById,
  createProject,
  updateProject,
} from "../../../services/api";
import SlideOver from "../../../components/common/Admin/SlideOver";
import ProjectForm from "./ProjectForm";

const LIST_PATH = "/admin/proyectos";

const EMPTY_PROJECT = {
  category: "",
  title: "",
  description: "",
  images: [],
  includes: [],
  meta: ["", "", ""],
  visible: true,
};

const toFormData = (project) => ({
  category: project.category || "",
  title: project.title || "",
  description: project.description || "",
  images: project.images || [],
  includes: project.includes || [],
  meta: [
    project.meta?.[0] || "",
    project.meta?.[1] || "",
    project.meta?.[2] || "",
  ],
  visible: project.visible ?? true,
});

export default function ProyectoDrawer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, reload } = useOutletContext();

  const isNew = !id;

  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      setFormData(EMPTY_PROJECT);
      setLoadingProject(false);
      return;
    }

    // Camino rápido: la lista ya está en memoria
    const fromList = projects.find((p) => String(p.id) === String(id));
    if (fromList) {
      setFormData(toFormData(fromList));
      setLoadingProject(false);
      return;
    }

    // Camino lento: URL directa o F5
    let cancelled = false;
    setLoadingProject(true);

    getProjectById(id)
      .then((result) => {
        if (cancelled) return;
        if (result.success) {
          setFormData(toFormData(result.data));
        } else {
          setErrors({ submit: "Ese proyecto ya no existe." });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProject(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isNew, projects]);

  const close = () => navigate(LIST_PATH);

  const validate = () => {
    const e = {};
    if (!formData.category.trim()) e.category = "La categoría es requerida";
    if (!formData.title.trim()) e.title = "El título es requerido";
    if (!formData.description.trim()) e.description = "La descripción es requerida";
    if (formData.images.length === 0) e.images = "Agrega al menos una imagen";
    if (formData.includes.length === 0) e.includes = "Agrega al menos un elemento";
    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const result = isNew
        ? await createProject(formData)
        : await updateProject(id, formData);

      if (result.success) {
        await reload();
        navigate(LIST_PATH);
      } else {
        setErrors({ submit: result.message });
      }
    } catch {
      setErrors({ submit: "No se pudo guardar el proyecto" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlideOver
      onClose={close}
      badge={isNew ? "NUEVO" : "EDITANDO"}
      title={isNew ? "Crear nuevo proyecto" : "Editar proyecto"}
      subtitle="La primera imagen se usa como portada en el portafolio público."
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={saving || loadingProject}
            className="flex-1 rounded-xl bg-blue-950 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : isNew
                ? "Crear proyecto"
                : "Guardar cambios"}
          </button>
        </div>
      }
    >
      {errors.submit && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      {loadingProject ? (
        <p className="py-12 text-center text-sm text-slate-500">
          Cargando proyecto...
        </p>
      ) : (
        <ProjectForm
          formId="project-form"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
        />
      )}
    </SlideOver>
  );
}