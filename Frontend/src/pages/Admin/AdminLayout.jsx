// src/pages/Admin/AdminLayout.jsx

import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLayout() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-900" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f6f7f9]">
      <Sidebar />

      {/* Ya no hay AdminNavbar: el encabezado vive dentro de cada página */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}