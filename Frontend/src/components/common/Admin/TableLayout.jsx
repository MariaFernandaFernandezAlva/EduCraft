// src/components/Admin/TableLayout.jsx
// La "carcasa" compartida de las tablas del admin:
// carga, estado vacío, contenedor y encabezados.
// Las filas las escribe cada página, porque son distintas.

import Spinner from './Spinner';

export default function TableLayout({
  loading,
  columnas,
  vacio,
  hayDatos,
  children,
}) {
  if (loading) return <Spinner />;

  // "vacio" es JSX completo: cada página decide su ícono y mensaje.
  if (!hayDatos) return vacio;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.label}
                  // Cada columna decide su alineación. Por defecto
                  // a la izquierda, que es lo más común.
                  className={`px-6 py-4 text-sm font-semibold text-gray-900 ${
                    col.align === "center" ? "text-center"
                      : col.align === "right" ? "text-right"
                      : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {children}
          </tbody>

        </table>
      </div>
    </div>
  );
}