// src/components/common/Admin/RowActions.jsx
// Botones de acción usados en las tablas y tarjetas del panel.

export default function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onEdit}
        aria-label="Editar"
        title="Editar"
        className="rounded-lg bg-amber-50 p-2 text-amber-600 transition-colors hover:bg-amber-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3.5a1.8 1.8 0 0 1 2.5 2.5L7 15.5l-3.5 1 1-3.5Z" />
        </svg>
      </button>

      <button
        onClick={onDelete}
        aria-label="Eliminar"
        title="Eliminar"
        className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h12M8 6V4h4v2M6.5 6l.6 10h5.8l.6-10" />
        </svg>
      </button>
    </div>
  );
}