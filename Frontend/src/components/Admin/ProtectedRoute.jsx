// src/components/Admin/ProtectedRoute.jsx
// Componente que bloquea acceso a rutas si no está logueado

import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  // Si aún está cargando, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
}