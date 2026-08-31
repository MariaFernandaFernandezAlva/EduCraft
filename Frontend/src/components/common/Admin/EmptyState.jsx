// src/components/Admin/EmptyState.jsx
// Mensaje para cuando no hay nada que mostrar.

export default function EmptyState({ icono, titulo, mensaje, accion }) {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="text-6xl mb-4">{icono}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
      {mensaje && <p className="text-gray-600 mb-4">{mensaje}</p>}
      {/* La acción es opcional: unas páginas ofrecen un botón para crear el primer registro, otras no. */}
      {accion}
    </div>
  );
}