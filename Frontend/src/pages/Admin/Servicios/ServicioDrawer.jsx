import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  getServiceById,
  createService,
  updateService,
} from "../../../services/api";
import SlideOver from "../../../components/common/Admin/SlideOver";
import ServiceForm from "./ServiceForm";

const LIST_PATH = "/admin/servicios";

const EMPTY_SERVICE = {
  category: "",
  title: "",
  description: "",
  deliveryTime: "",
  includes: [],
  image: "",
  visible: true,
};

// Deja solo los campos que el formulario maneja y rellena los que falten.
const toFormData = (service) => ({
  category: service.category || "",
  title: service.title || "",
  description: service.description || "",
  deliveryTime: service.deliveryTime || "",
  includes: service.includes || [],
  image: service.image || "",
  visible: service.visible ?? true,
});

export default function ServicioDrawer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { services, reload } = useOutletContext();

  const isNew = !id;

  const [formData, setFormData] = useState(EMPTY_SERVICE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingService, setLoadingService] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      setFormData(EMPTY_SERVICE);
      setLoadingService(false);
      return;
    }

    // Camino rapido: la lista ya esta en memoria (viniste desde la tabla)
    const fromList = services.find((s) => String(s.id) === String(id));
    if (fromList) {
      setFormData(toFormData(fromList));
      setLoadingService(false);
      return;
    }

    // Camino lento: entraste por URL directa o recargaste con F5
    let cancelled = false;
    setLoadingService(true);

    getServiceById(id)
      .then((result) => {
        if (cancelled) return;
        if (result.success) {
          setFormData(toFormData(result.data));
        } else {
          setErrors({ submit: "Ese servicio ya no existe." });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingService(false);
      });

    // Si el drawer se cierra antes de que responda la API, ignoramos el resultado
    return () => {
      cancelled = true;
    };
  }, [id, isNew, services]);

  const close = () => navigate(LIST_PATH);

  const validate = () => {
    const e = {};
    if (!formData.category.trim()) e.category = "La categoría es requerida";
    if (!formData.title.trim()) e.title = "El título es requerido";
    if (!formData.description.trim()) e.description = "La descripción es requerida";
    if (!formData.deliveryTime.trim()) e.deliveryTime = "El tiempo de entrega es requerido";
    if (formData.includes.length === 0) e.includes = "Agrega al menos un elemento";
    if (!formData.image.trim()) e.image = "La ruta de la imagen es obligatoria";
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
        ? await createService(formData)
        : await updateService(id, formData);

      if (result.success) {
        await reload();
        navigate(LIST_PATH);
      } else {
        setErrors({ submit: result.message });
      }
    } catch {
      setErrors({ submit: "No se pudo guardar el servicio" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlideOver
      isOpen
      onClose={close}
      badge={isNew ? "NUEVO" : "EDITANDO"}
      title={isNew ? "Crear nuevo servicio" : "Editar servicio"}
      subtitle="Los cambios se reflejan en la sección de servicios de tu landing."
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
            form="service-form"
            disabled={saving || loadingService}
            className="flex-1 rounded-xl bg-blue-950 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : isNew
                ? "Crear servicio"
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

      {loadingService ? (
        <p className="py-12 text-center text-sm text-slate-500">
          Cargando servicio...
        </p>
      ) : (
        <ServiceForm
          formId="service-form"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
        />
      )}
    </SlideOver>
  );
}