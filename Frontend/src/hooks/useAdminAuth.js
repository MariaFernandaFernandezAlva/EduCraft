// src/hooks/useAdminAuth.js
// La lógica se mudó a src/context/AdminAuthContext.jsx para que el
// estado de sesión sea único en toda la app. Este archivo solo
// reexporta, así los imports que ya existen siguen funcionando.

export { useAdminAuth } from "../context/AdminAuthContext";