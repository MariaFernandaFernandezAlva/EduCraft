const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body = null } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Error ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, data, message: "OK" };
  } catch (error) {
    console.error("Error de conexión con json-server:", error);
    return {
      success: false,
      data: null,
      message: "No se pudo conectar. ¿Está corriendo json-server en el puerto 3000?",
    };
  }
}

function crud(resource) {
  return {
    getAll: (query = "") => request(`/${resource}${query}`),
    getById: (id) => request(`/${resource}/${id}`),
    create: (data) => request(`/${resource}`, { method: "POST", body: data }),
    update: (id, data) => request(`/${resource}/${id}`, { method: "PATCH", body: data }),
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

// ===============================
// SERVICIOS
// ===============================
const servicesApi = crud("services");

export const getServices = () => servicesApi.getAll();
export const getServiceById = (id) => servicesApi.getById(id);
export const createService = (data) => servicesApi.create(data);
export const updateService = (id, data) => servicesApi.update(id, data);
export const deleteService = (id) => servicesApi.remove(id);

// ===============================
// PROYECTOS (portafolio)
// ===============================
const projectsApi = crud("projects");

export const getProjects = () => projectsApi.getAll();
export const getProjectById = (id) => projectsApi.getById(id);
export const createProject = (data) => projectsApi.create(data);
export const updateProject = (id, data) => projectsApi.update(id, data);
export const deleteProject = (id) => projectsApi.remove(id);

// ===============================
// COTIZACIONES
// ===============================
const quotationsApi = crud("quotations");

export const getQuotations = () => quotationsApi.getAll();
export const updateQuotation = (id, data) => quotationsApi.update(id, data);
export const deleteQuotation = (id) => quotationsApi.remove(id);

export const getPendingQuotations = () => quotationsApi.getAll("?status=pendiente");

export const createQuotation = (data) =>
  quotationsApi.create({
    ...data,
    status: "pendiente",
    items: [],
    shippingCost: 0,
    declineReason: "",
    quotedAt: null,
    createdAt: new Date().toISOString(),
  });