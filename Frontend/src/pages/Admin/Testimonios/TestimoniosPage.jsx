// src/pages/Admin/Testimonios/TestimoniosPage.jsx
// Moderación de testimonios. A diferencia de servicios y proyectos,
// aquí el admin no crea nada: los testimonios los escriben los
// visitantes y se publican al instante. El admin solo puede
// ocultarlos de la página pública o eliminarlos.

import { useState, useEffect } from 'react';
import { getTestimonials, updateTestimonial, deleteTestimonial } from '../../../services/api';
import { formatearFecha } from '../../../data/quotationStatus';
import TableLayout from '../../../components/common/Admin/TableLayout';
import EmptyState from '../../../components/common/Admin/EmptyState';
import ConfirmDialog from '../../../components/common/Admin/ConfirmDialog';

// Los dos estados posibles. Mismo patrón que las categorías de
// proyectos: definidos en código para que Tailwind vea las clases.
const ESTADOS = [
  { valor: 'aprobado', label: 'Visible', color: 'bg-green-100 text-green-700' },
  { valor: 'oculto',   label: 'Oculto',  color: 'bg-gray-200 text-gray-600' },
];

const getEstadoColor = (valor) => {
  const found = ESTADOS.find(e => e.valor === valor);
  return found ? found.color : 'bg-gray-100 text-gray-700';
};

export default function TestimoniosPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const result = await getTestimonials();

    if (result.success) {
      // Más recientes primero. Las fechas ISO se ordenan
      // como texto, por eso funciona un localeCompare.
      const ordenados = [...result.data].sort((a, b) =>
        (b.date || '').localeCompare(a.date || '')
      );
      setTestimonials(ordenados);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await updateTestimonial(id, { status: nuevoEstado });

    if (result.success) {
      // Actualizamos en memoria en vez de recargar todo:
      // más rápido y no pierde la posición del scroll.
      setTestimonials(prev =>
        prev.map(t => (t.id === id ? { ...t, status: nuevoEstado } : t))
      );
      // Si el modal está abierto con este testimonio, también lo refrescamos.
      setDetalle(prev => (prev && prev.id === id ? { ...prev, status: nuevoEstado } : prev));
    } else {
      alert('Error al cambiar el estado: ' + result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteTestimonial(id);

    if (result.success) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      setDeleteConfirm(null);
      setDetalle(null);
    } else {
      alert('Error al eliminar: ' + result.message);
    }
  };

  // Valor derivado: se recalcula solo cuando cambia la lista o el filtro.
  const visibles = filtro === 'todos'
    ? testimonials
    : testimonials.filter(t => t.status === filtro);

  const columnas = [
    { label: 'Fecha' },
    { label: 'Autor' },
    { label: 'Calificación', align: 'center' },
    { label: 'Comentario' },
    { label: 'Estado' },
    { label: 'Acciones', align: 'center' },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">💬 Testimonios</h1>
        <p className="text-gray-600 mt-1">
          Los testimonios se publican al instante. Aquí puedes ocultar los que no correspondan.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Filtros por estado */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filtro === 'todos'
              ? 'bg-blue-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos ({testimonials.length})
        </button>

        {ESTADOS.map(estado => {
          // Los contadores salen de la lista completa, no de la
          // filtrada: si no, al filtrar los demás mostrarían cero.
          const cantidad = testimonials.filter(t => t.status === estado.valor).length;
          return (
            <button
              key={estado.valor}
              onClick={() => setFiltro(estado.valor)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filtro === estado.valor
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {estado.label} ({cantidad})
            </button>
          );
        })}
      </div>

      <TableLayout
        loading={loading}
        columnas={columnas}
        hayDatos={visibles.length > 0}
        vacio={
          <EmptyState
            icono="💬"
            titulo={
              testimonials.length === 0
                ? 'Aún no hay testimonios'
                : 'Ninguno con ese estado'
            }
            mensaje={
              testimonials.length === 0
                ? 'Cuando alguien deje su testimonio en la página, aparecerá aquí.'
                : undefined
            }
          />
        }
      >
        {visibles.map(t => (
          <tr key={t.id} className="hover:bg-gray-50 transition-colors">

            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {formatearFecha(t.date)}
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </td>

            <td className="px-6 py-4 text-center whitespace-nowrap">
              {/* repeat() dibuja las estrellas llenas y luego las vacías */}
              <span className="text-amber-400">{'★'.repeat(t.rating)}</span>
              <span className="text-gray-300">{'★'.repeat(5 - t.rating)}</span>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
              {/* line-clamp-2 corta el texto a dos líneas con puntos suspensivos */}
              <p className="line-clamp-2">{t.comment}</p>
              {t.images?.length > 0 && (
                <span className="text-xs text-blue-700">
                  📸 {t.images.length} foto(s)
                </span>
              )}
            </td>

            <td className="px-6 py-4">
              <select
                value={t.status}
                onChange={(e) => handleCambiarEstado(t.id, e.target.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${getEstadoColor(t.status)}`}
              >
                {ESTADOS.map(estado => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </td>

            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDetalle(t)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                >
                  👁️ Ver
                </button>
                <button
                  onClick={() => setDeleteConfirm(t.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                >
                  🗑️
                </button>
              </div>
            </td>

          </tr>
        ))}
      </TableLayout>

      {/* Modal de detalle */}
      {detalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-white flex items-center justify-center font-bold">
                  {detalle.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{detalle.name}</h3>
                  <p className="text-sm text-gray-500">
                    {detalle.role} · {formatearFecha(detalle.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetalle(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <span className="text-amber-400 text-xl">{'★'.repeat(detalle.rating)}</span>
                <span className="text-gray-300 text-xl">{'★'.repeat(5 - detalle.rating)}</span>
              </div>

              <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 italic">
                "{detalle.comment}"
              </p>

              {detalle.images?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Fotos adjuntas
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {detalle.images.map((ruta, i) => (
                      <a key={ruta} href={ruta} target="_blank" rel="noopener noreferrer">
                        <img
                          src={ruta}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-28 object-cover rounded-lg border border-gray-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Un solo botón que alterna según el estado actual.
                Es más claro que dos, donde uno siempre estaría inútil. */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {detalle.status === 'oculto' ? (
                <button
                  onClick={() => handleCambiarEstado(detalle.id, 'aprobado')}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  👁️ Volver a mostrar
                </button>
              ) : (
                <button
                  onClick={() => handleCambiarEstado(detalle.id, 'oculto')}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800"
                >
                  🙈 Ocultar de la página
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          titulo="¿Eliminar testimonio?"
          mensaje="Se borrará para siempre. Si solo quieres quitarlo de la página, usa la opción de ocultar: así conservas el registro."
          onCancelar={() => setDeleteConfirm(null)}
          onConfirmar={() => handleDelete(deleteConfirm)}
        />
      )}

    </div>
  );
}