const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body = null } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      // Solo mandamos Content-Type cuando hay cuerpo (POST / PATCH).
      headers: body ? { "Content-Type": "application/json" } : {},
      // json-server solo entiende JSON: nada de FormData.
      body: body ? JSON.stringify(body) : undefined,
    });

    // Ojo: fetch NO lanza error con un 404 o 500. Hay que revisarlo a mano.
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
    // Este catch salta cuando json-server no está corriendo.
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
    // PATCH y no PUT: PUT reemplaza el objeto completo, así que si el
    // formulario olvida un campo, ese campo se borra del JSON.
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