// src/pages/Admin/AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white py-3 pr-11 pl-11 text-sm outline-hidden transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-slate-200 focus:border-blue-500"
  }`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAdminAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar el error del campo en cuanto el usuario lo corrige
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // navigate en vez de window.location: no recarga la app entera
      navigate("/admin/servicios", { replace: true });
    } else {
      setErrors({ submit: result.message });
    }

    setIsSubmitting(false);
  };

  const cargando = isSubmitting || loading;
  const errorGeneral = errors.submit || authError;

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] p-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f5f0] px-3 py-1 text-[11px] font-bold tracking-wide text-slate-600">
          <span className="text-amber-500">✦</span> ACCESO PRIVADO
        </span>

        {/* Título con degradado recortado sobre el texto */}
        <h1 className="mt-5 bg-linear-to-r from-blue-950 to-teal-600 bg-clip-text font-serif text-4xl font-bold text-transparent">
          Bienvenido de vuelta
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa con tu cuenta de administrador para continuar.
        </p>

        {errorGeneral && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {errorGeneral}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500"
            >
              CORREO ELECTRÓNICO
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                placeholder="admin@educraft.com"
                aria-invalid={Boolean(errors.email)}
                className={inputClass(errors.email)}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500"
            >
              CONTRASEÑA
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className={inputClass(errors.password)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-900"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M6.7 6.7C4.6 8 3 10 2.5 12c1 3.5 5 7 9.5 7 1.6 0 3.1-.4 4.4-1.1M17.3 17.3c2-1.3 3.4-3.2 4.2-5.3-1-3.5-5-7-9.5-7-1 0-2 .2-2.9.5" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2.5 12C3.5 8.5 7.5 5 12 5s8.5 3.5 9.5 7c-1 3.5-5 7-9.5 7s-8.5-3.5-9.5-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Mantener sesión iniciada.
              OJO: hoy solo guarda el valor. Para que tenga efecto real,
              login() debe recibirlo y el backend ajustar la duración
              de la cookie de sesión. */}
          <label
            htmlFor="recordar"
            className="flex w-fit cursor-pointer items-center gap-3"
          >
            <span className="relative inline-flex shrink-0">
              <input
                type="checkbox"
                id="recordar"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 peer-focus-visible:ring-offset-2" />
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="text-sm text-slate-600">
              Mantener sesión iniciada
            </span>
          </label>

          {/* Ayuda de contraseña: no hay flujo de recuperación por correo,
              así que en vez de un enlace muerto explicamos qué hacer. */}
          <div>
            <button
              type="button"
              onClick={() => setMostrarAyuda((v) => !v)}
              className="text-sm font-semibold text-blue-900 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
            {mostrarAyuda && (
              <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                No hay recuperación automática. La contraseña se restablece
                directamente en la base de datos del panel.
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-950 to-teal-600 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        {/* Aviso de seguridad */}
        <div className="mt-6 flex gap-2.5 rounded-xl bg-[#f6f5f0] p-4">
          <span className="mt-0.5 shrink-0 text-emerald-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <p className="text-xs leading-relaxed text-slate-600">
            Por razones de seguridad, solo el administrador tiene acceso a esta
            sección.
          </p>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-900"
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  );
}