// src/components/Admin/AdminNavbar.jsx
// Navbar superior del admin panel

import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  const handleChangePassword = () => {
    // Por ahora, solo un placeholder
    alert('Función de cambiar contraseña - próximamente');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-xl font-bold text-blue-900">EduCraft Admin</h1>
        </div>

        {/* Lado Derecho - Info del Admin */}
        <div className="flex items-center gap-4">
          
          {/* Nombre del Admin */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {admin?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">{admin?.email}</p>
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </span>
          </div>

          {/* Menú Dropdown */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg 
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={handleChangePassword}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100"
              >
                🔑 Cambiar Contraseña
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-semibold"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}