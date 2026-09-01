// src/pages/Admin/AdminLayout.jsx

import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLayout() {
  const { admin, loading } = useAdminAuth();

  // El estado vive aqui porque el boton de menu y el sidebar
  // son hermanos: este es su ancestro comun mas cercano.
  const [menuOpen, setMenuOpen] = useState(false);

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
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior: solo en movil, para abrir el menu */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 font-serif text-xs font-bold text-blue-950">
              E
            </div>
            <span className="text-sm font-bold text-blue-950">Panel Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}