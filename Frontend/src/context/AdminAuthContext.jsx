// src/context/AdminAuthContext.jsx
// El estado de sesión vive AQUÍ, una sola vez para toda la app.
// Antes cada componente que llamaba al hook tenía su propia copia
// y no se enteraba de los cambios de las demás.

import { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SESSION_KEY = "educraft_admin";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Al arrancar la app, revisamos si ya había una sesión guardada.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        setAdmin(JSON.parse(saved));
      }
    } catch (err) {
      // Si el JSON guardado está corrupto, limpiamos y seguimos.
      console.error("Sesión inválida:", err);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // json-server filtra por query string y devuelve un ARRAY:
      // vacío si no coincide, con 1 elemento si coincide.
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
    localStorage.removeItem(SESSION_KEY);
    setAdmin(null);
    setError(null);
    return { success: true };
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: admin !== null,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  // Si alguien usa el hook fuera del Provider, mejor un error claro
  // ahora que un "admin is undefined" diez archivos más adelante.
  if (context === null) {
    throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>");
  }

  return context;
}