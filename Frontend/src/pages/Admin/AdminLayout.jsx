// src/pages/Admin/AdminLayout.jsx
// Layout principal del panel admin

import { Outlet, Navigate } from 'react-router-dom';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLayout() {
  const { admin, loading } = useAdminAuth();

  // 1. Mostrar pantalla de carga mientras verifica la cookie en el backend
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // 2. Si terminó de cargar y no hay sesión, expulsar al login inmediatamente
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Si hay sesión activa, renderizar el panel completo
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <AdminNavbar />

        {/* Área de Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}