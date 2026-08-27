// src/utils/adminApi.js
// Funciones para hacer llamadas a la API del backend

const API_BASE_URL = 'http://localhost/educraft-backend/api';

/**
 * Función genérica para llamadas a API
 * 
 * @param {string} endpoint - Ruta del endpoint (ej: "services")
 * @param {string} method - GET, POST, PUT, DELETE
 * @param {object} data - Datos a enviar (para POST/PUT)
 * @returns {object} - Respuesta de la API
 */
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    const options = {
      method,
      credentials: 'include', // Incluir cookies de sesión
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Si hay datos, agregarlos al body
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error en apiCall:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// ===============================
// SERVICIOS
// ===============================

/**
 * Obtener todos los servicios
 */
export async function getServices() {
  return apiCall('services', 'GET');
}

/**
 * Obtener un servicio por ID
 */
export async function getServiceById(id) {
  return apiCall(`services?id=${id}`, 'GET');
}

/**
 * Crear nuevo servicio
 */
export async function createService(serviceData) {
  return apiCall('services', 'POST', serviceData);
}

/**
 * Actualizar un servicio
 */
export async function updateService(id, serviceData) {
  const dataWithId = {
    id,
    ...serviceData
  };
  return apiCall('services', 'PUT', dataWithId);
}

/**
 * Eliminar un servicio
 */
export async function deleteService(id) {
  return apiCall(`services?id=${id}`, 'DELETE');
}

// ===============================
// PROYECTOS (para después)
// ===============================

export async function getProjects() {
  return apiCall('projects', 'GET');
}

export async function createProject(projectData) {
  return apiCall('projects', 'POST', projectData);
}

export async function updateProject(id, projectData) {
  const dataWithId = { id, ...projectData };
  return apiCall('projects', 'PUT', dataWithId);
}

export async function deleteProject(id) {
  return apiCall(`projects?id=${id}`, 'DELETE');
}

// ===============================
// COTIZACIONES (para después)
// ===============================

export async function getQuotations() {
  return apiCall('quotations', 'GET');
}

export async function createQuotation(quotationData) {
  return apiCall('quotations', 'POST', quotationData);
}

export async function updateQuotation(id, quotationData) {
  const dataWithId = { id, ...quotationData };
  return apiCall('quotations', 'PUT', dataWithId);
}

// ===============================
// TESTIMONIOS (para después)
// ===============================

export async function getTestimonies() {
  return apiCall('testimonies', 'GET');
}

export async function updateTestimony(id, testimonyData) {
  const dataWithId = { id, ...testimonyData };
  return apiCall('testimonies', 'PUT', dataWithId);
}

export async function deleteTestimony(id) {
  return apiCall(`testimonies?id=${id}`, 'DELETE');
}