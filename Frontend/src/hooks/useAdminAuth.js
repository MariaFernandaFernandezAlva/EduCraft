// src/hooks/useAdminAuth.js
// Antes: sesiones PHP ($_SESSION + credentials: 'include').
// Ahora: json-server no tiene sesiones ni cookies, así que la "sesión"
// vive en localStorage del navegador.

import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Clave con la que guardamos al admin logueado en el navegador.
const SESSION_KEY = "educraft_admin";

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Al montar, revisamos si ya había una sesión guardada.
  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem(SESSION_KEY);

      if (saved) {
        setAdmin(JSON.parse(saved));
        setError(null);
        return true;
      }

      setAdmin(null);
      return false;
    } catch (err) {
      // Si el JSON guardado está corrupto, limpiamos y seguimos.
      console.error("Sesión inválida:", err);
      localStorage.removeItem(SESSION_KEY);
      setAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // json-server filtra por query string: /admins?email=X&password=Y
      // Devuelve un ARRAY: vacío si no coincide, con 1 elemento si coincide.
      const response = await fetch(
        `${API_URL}/admins?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      const results = await response.json();

      if (results.length === 0) {
        const message = "Correo o contraseña incorrectos";
        setError(message);
        return { success: false, message };
      }

      // Nunca guardamos la contraseña en localStorage.
      const { password: _omitida, ...adminData } = results[0];

      localStorage.setItem(SESSION_KEY, JSON.stringify(adminData));
      setAdmin(adminData);
      setError(null);

      return { success: true, message: "Bienvenido" };
    } catch (err) {
      const message = "No se pudo conectar. ¿Está corriendo json-server?";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Cerrar sesión ahora es solo borrar la clave del navegador.
    localStorage.removeItem(SESSION_KEY);
    setAdmin(null);
    setError(null);
    return { success: true };
  };

  return {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: admin !== null,
  };
}