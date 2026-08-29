import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPendingQuotations } from '../../services/api';

export default function Sidebar() {
  const location = useLocation();

  // Array de items del menú
  const menuItems = [
    {
      id: 'servicios',
      label: 'Servicios',
      icon: '🛠️',
      path: '/admin/servicios',
      description: 'Gestionar servicios'
    },
    {
      id: 'proyectos',
      label: 'Proyectos',
      icon: '🎨',
      path: '/admin/proyectos',
      description: 'Gestionar portafolio'
    },
    {
      id: 'cotizaciones',
      label: 'Cotizaciones',
      icon: '💼',
      path: '/admin/cotizaciones',
      description: 'Solicitudes nuevas'
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: '📂',
      path: '/admin/historial',
      description: 'Cotizaciones gestionadas'
    },
    {
      id: 'testimonios',
      label: 'Testimonios',
      icon: '⭐',
      path: '/admin/testimonios',
      description: 'Moderar comentarios'
    }
  ];

  // Verificar si la ruta actual coincide
  const isActive = (path) => location.pathname === path;

  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    const contarPendientes = async () => {
      const result = await getPendingQuotations();
      if (result.success) setPendientes(result.data.length);
    };

    contarPendientes();

    // Revisamos cada 30 segundos. Como json-server no puede
    // avisarnos solo cuando llega algo nuevo, preguntamos cada cierto tiempo.
    const intervalo = setInterval(contarPendientes, 30000);

    // Limpieza: si no cancelamos el intervalo al desmontar,
    // sigue corriendo para siempre y consume memoria.
    return () => clearInterval(intervalo);
  }, []);

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 flex flex-col overflow-y-auto">
      
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold">Panel Admin</h2>
        <p className="text-xs text-gray-400 mt-1">Gestionar tu landing page</p>
      </div>

      {/* Menú Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(item.path)
                ? 'bg-blue-900 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
            {/* Contador de pendientes */}
            {item.id === 'cotizaciones' && pendientes > 0 && (
              <span className="min-w-5.5 h-5.5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {pendientes}
              </span>
            )}

            {isActive(item.path) && (
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-400">
          EduCraft © 2024
        </p>
        <p className="text-xs text-gray-500 mt-1">
          v1.0
        </p>
      </div>

    </aside>
  );
}