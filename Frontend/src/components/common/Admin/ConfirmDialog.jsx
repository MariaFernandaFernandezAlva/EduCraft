// src/components/Admin/ConfirmDialog.jsx
// Modal de confirmación reutilizable.
// Antes estaba duplicado en servicios, proyectos, cotizaciones e historial.

export default function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  textoCancelar = "Cancelar",
  variante = "peligro",
  onConfirmar,
  onCancelar,
  procesando = false,
}) {
  // Los colores según qué tan grave es la acción.
  // Un mapa en vez de un ternario porque mañana puede
  // haber una tercera variante sin tocar el JSX.
  const estilos = {
    peligro: "bg-red-600 hover:bg-red-700",
    advertencia: "bg-amber-600 hover:bg-amber-700",
    normal: "bg-blue-900 hover:bg-blue-800",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{titulo}</h3>

        {/* El mensaje puede ser texto o JSX, por si necesitas
            resaltar algo en negrita dentro de la advertencia. */}
        <div className="text-gray-600 mb-6">{mensaje}</div>

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            disabled={procesando}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            disabled={procesando}
            className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 ${estilos[variante]}`}
          >
            {procesando ? "Procesando..." : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
