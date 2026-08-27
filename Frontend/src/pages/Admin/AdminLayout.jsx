// src/pages/Admin/AdminLayout.jsx
// Layout principal del panel admin

import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';

export default function AdminLayout() {
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