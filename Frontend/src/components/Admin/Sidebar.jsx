// src/components/Admin/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPendingQuotations } from "../../services/api";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const Icon = ({ path }) => (
  <svg
    className="h-4.5 w-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

const ICONS = {
  servicios: <Icon path={<path d="M3 7h18M3 12h18M3 17h18" />} />,
  proyectos: (
    <Icon
      path={
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      }
    />
  ),
  cotizaciones: (
    <Icon
      path={
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </>
      }
    />
  ),
  historial: (
    <Icon path={<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />} />
  ),
  testimonios: (
    <Icon path={<path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.7l5.4-.8Z" />} />
  ),
};

const menuItems = [
  { id: "servicios", label: "Servicios", path: "/admin/servicios", description: "Gestionar servicios" },
  { id: "proyectos", label: "Proyectos", path: "/admin/proyectos", description: "Gestionar portafolio" },
  { id: "cotizaciones", label: "Cotizaciones", path: "/admin/cotizaciones", description: "Solicitudes nuevas" },
  { id: "historial", label: "Historial", path: "/admin/historial", description: "Cotizaciones gestionadas" },
  { id: "testimonios", label: "Testimonios", path: "/admin/testimonios", description: "Modera los comentarios" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [pendientes, setPendientes] = useState(0);

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    const contarPendientes = async () => {
      const result = await getPendingQuotations();
      if (result.success) setPendientes(result.data.length);
    };

    contarPendientes();
    const intervalo = setInterval(contarPendientes, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // Al cambiar de ruta el menú móvil se cierra solo.
  // Sin esto el panel se queda encima tapando la página que acabas de abrir.
  useEffect(() => {
    onClose();
    // Solo la ruta dispara este efecto; onClose es estable en el layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) navigate("/admin/login");
  };

  return (
    <>
      {/* Fondo oscuro: solo existe en movil y solo cuando el menu esta abierto */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-linear-to-b from-blue-950 via-blue-900 to-teal-700 text-white transition-transform duration-200 ease-out motion-reduce:transition-none lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Marca */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 font-serif text-sm font-bold text-blue-950">
            E
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Panel Admin</p>
            <p className="text-[11px] text-white/60">Gestiona tu landing</p>
          </div>

          {/* Cerrar: solo en movil */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 ${
                  active
                    ? "bg-white text-blue-950 shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={active ? "text-blue-900" : "text-white/60"}>
                  {ICONS[item.id]}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`truncate text-[11px] ${active ? "text-slate-500" : "text-white/45"}`}>
                    {item.description}
                  </p>
                </div>

                {item.id === "cotizaciones" && pendientes > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                    {pendientes}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cuenta */}
        <div className="mx-3 mt-4 flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            {admin?.name?.charAt(0) || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{admin?.name || "Admin"}</p>
            <p className="truncate text-[11px] text-white/50">{admin?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17l5-5-5-5M20 12H9M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
            </svg>
          </button>
        </div>

        {/* Pie */}
        <div className="m-3 rounded-xl bg-white/10 px-3 py-3">
          <p className="text-xs font-semibold">EduCraft © 2026</p>
          <p className="mt-0.5 text-[11px] text-white/50">Panel v2.0</p>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[11px] font-semibold text-amber-300 hover:text-amber-200"
          >
            Ver sitio público →
          </a>
        </div>
      </aside>
    </>
  );
}