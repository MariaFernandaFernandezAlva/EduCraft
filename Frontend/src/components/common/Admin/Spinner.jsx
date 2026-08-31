// src/components/Admin/Spinner.jsx
// Indicador de carga. Estaba copiado en cada página del admin.

export default function Spinner({ altura = "h-64" }) {
  return (
    <div className={`flex items-center justify-center ${altura}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );
}