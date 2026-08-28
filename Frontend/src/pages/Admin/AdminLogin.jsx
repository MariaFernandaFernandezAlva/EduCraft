// src/pages/Admin/AdminLogin.jsx
// Página de login para el admin

import { useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLogin() {
  const { login, loading, error: authError } = useAdminAuth();

  const [formData, setFormData] = useState({
    email: "admin@educraft.com",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar form
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);

  // Llamar función login del hook
  const result = await login(formData.email, formData.password);

  if (result.success) {
    window.location.href = '/admin';
  } else {
    setErrors({
      submit: result.message
    });
  }

  setIsSubmitting(false);
};

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">EduCraft</h1>
          <p className="text-gray-600">Panel de Administración</p>
        </div>

        {/* Error General */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-semibold">
              ❌ {errors.submit}
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@educraft.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-900"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            {/* Contenedor relativo para posicionar el ojo */}
            <div className="relative">
              <input
                // 👇 Lógica dinámica para cambiar el tipo 👇
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                // He añadido 'pr-12' (padding right) para que el texto no pise el ojo
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
                  errors.password
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-900"
                }`}
              />

              {/* 👇 BOTÓN DEL OJO PERSONALIZADO 👇 */}
              <button
                type="button" // Importante: type="button" para que no haga submit al formulario
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-900 transition-colors"
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  // Icono Ojo Cerrado (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Icono Ojo Abierto (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.226 8.716 7.244 4.5 12 4.5c4.756 0 8.773 4.216 10.065 7.822a1.012 1.012 0 010 .644C20.774 15.284 16.756 19.5 12 19.5c-4.756 0-8.773-4.216-10.065-7.822z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Iniciando sesión...
              </>
            ) : (
              "🔐 Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          Por razones de seguridad, solo el administrador tiene acceso a esta
          sección.
        </p>
      </div>
    </div>
  );
}
