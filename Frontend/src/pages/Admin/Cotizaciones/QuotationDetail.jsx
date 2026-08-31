import { useState } from "react";
import { formatearFecha, calcularTotal } from "../../../data/quotationStatus";
import { generarCotizacionPDF } from "../../../utils/generarPDF";
import {
  enlaceEnvioCotizacion,
  enlaceDeclinacion,
} from "../../../utils/mensajes";

export default function QuotationDetail({
  quotation,
  onClose,
  onGuardar,
  onDeclinar,
  onEnviado,
  soloLectura = false,
}) {
  const [items, setItems] = useState(quotation.items || []);
  const [shippingCost, setShippingCost] = useState(quotation.shippingCost || 0);
  const [guardando, setGuardando] = useState(false);

  // Campos del nuevo concepto que se está agregando.
  const [nuevoConcepto, setNuevoConcepto] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  // Motivo de declinación (solo se usa si el admin declina).
  const [mostrarDeclinar, setMostrarDeclinar] = useState(false);
  const [motivo, setMotivo] = useState("");

  const total = calcularTotal(items, shippingCost);

  const handleAgregarItem = () => {
    const concepto = nuevoConcepto.trim();
    const precio = Number(nuevoPrecio);

    // El precio puede ser 0 (un item de cortesía), pero no vacío ni texto.
    if (!concepto || nuevoPrecio === "" || isNaN(precio)) return;

    setItems((prev) => [...prev, { concepto, precio }]);
    setNuevoConcepto("");
    setNuevoPrecio("");
  };

  const handleQuitarItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    await onGuardar({
      items,
      shippingCost: Number(shippingCost) || 0,
      status: "cotizada",
      quotedAt: new Date().toISOString(),
    });
    setGuardando(false);
  };

  const handleConfirmarDeclinar = async () => {
    if (!motivo.trim()) return;
    setGuardando(true);
    await onDeclinar({
      status: "declinada",
      declineReason: motivo.trim(),
    });
    setGuardando(false);
  };

  // Genera el PDF con lo que hay en pantalla ahora mismo,
  // no con lo guardado en el servidor. Así el admin puede
  // previsualizar antes de guardar.
  const handleDescargarPDF = () => {
    generarCotizacionPDF({
      ...quotation,
      items,
      shippingCost: Number(shippingCost) || 0,
    });
  };

  const [refPreviewOk, setRefPreviewOk] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {quotation.fullName}
            </h3>
            <p className="text-sm text-gray-500">
              Solicitado el {formatearFecha(quotation.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Datos del cliente */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Datos de la solicitud
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Correo" valor={quotation.email} />
              <Campo label="WhatsApp" valor={quotation.whatsapp} />
              <Campo label="Tipo de proyecto" valor={quotation.projectType} />
              <Campo label="Nivel académico" valor={quotation.academicLevel} />
              <Campo label="Fecha deseada" valor={quotation.deliveryDate} />
              <Campo label="Entrega" valor={quotation.deliveryMethod} />
            </div>

            {quotation.address && (
              <div className="mt-4">
                <Campo label="Dirección" valor={quotation.address} />
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Descripción del proyecto
              </p>
              <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                {quotation.description}
              </p>
            </div>

            {quotation.referenceLink && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Referencia enviada
                </p>
                {quotation.declineReason && (
                  <div className="mt-4 border-2 border-amber-300 bg-amber-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-amber-900 uppercase mb-1">
                      Motivo de la declinación
                    </p>
                    <p className="text-amber-900">{quotation.declineReason}</p>
                  </div>
                )}
                <a
                  href={quotation.referenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline break-all text-sm"
                >
                  {quotation.referenceLink}
                </a>
                <img
                  key={quotation.referenceLink}
                  src={quotation.referenceLink}
                  alt="Referencia enviada por el cliente"
                  onLoad={() => setRefPreviewOk(true)}
                  onError={() => setRefPreviewOk(false)}
                  className={`mt-3 max-h-56 w-auto rounded-lg border border-gray-200 ${
                    refPreviewOk === true ? "block" : "hidden"
                  }`}
                />

                {refPreviewOk === false && (
                  <p className="text-xs text-gray-500 mt-2">
                    No se puede mostrar la miniatura de este enlace. Ábrelo en una
                    pestaña nueva para verlo.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Formulario de cotización */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Detalle de la cotización
            </h4>

            {/* Agregar concepto: dos inputs separados */}
            {!soloLectura && (
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={nuevoConcepto}
                  onChange={(e) => setNuevoConcepto(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAgregarItem()}
                  placeholder="Concepto — ej: Maqueta en madera 60x40cm"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none"
                />
                <input
                  type="number"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAgregarItem()}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full sm:w-32 px-4 py-3 border border-gray-300 rounded-lg outline-none"
                />
                <button
                  type="button"
                  onClick={handleAgregarItem}
                  className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold rounded-lg hover:bg-blue-200 whitespace-nowrap"
                >
                  ➕ Agregar
                </button>
              </div>
            )}

            {/* Lista de conceptos */}
            {items.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-900 flex-1">
                      {item.concepto}
                    </span>
                    <span className="font-semibold text-gray-900 mx-4 whitespace-nowrap">
                      S/ {item.precio.toFixed(2)}
                    </span>
                    {!soloLectura && (
                      <button
                        type="button"
                        onClick={() => handleQuitarItem(index)}
                        className="text-red-600 font-semibold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm mb-4">
                Aún no agregas conceptos.
              </p>
            )}

            {/* Costo de envío */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <label className="text-gray-700 font-medium">
                Costo de envío
                <span className="block text-xs text-gray-500 font-normal">
                  {quotation.deliveryMethod}
                </span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">S/</span>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  disabled={soloLectura}
                  min="0"
                  step="0.01"
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg outline-none text-right disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Total: calculado, nunca guardado */}
            <div className="flex items-center justify-between py-4 border-t-2 border-gray-900">
              <span className="text-lg font-bold text-gray-900">TOTAL</span>
              <span className="text-2xl font-bold text-blue-900">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Zona de declinar */}
          {mostrarDeclinar && (
            <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4 space-y-3">
              <label className="block text-sm font-semibold text-amber-900">
                Motivo por el que declinas esta solicitud
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows="3"
                placeholder="Ej: No trabajamos con ese material / No alcanzamos con la fecha de entrega solicitada"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg outline-none resize-none"
              />
              <p className="text-xs text-amber-800">
                Este texto se usará para armar el mensaje que le enviarás al
                cliente.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMostrarDeclinar(false);
                    setMotivo("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarDeclinar}
                  disabled={!motivo.trim() || guardando}
                  className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  Confirmar declinación
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        {!mostrarDeclinar && !soloLectura && (
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleGuardar}
              disabled={items.length === 0 || guardando}
              className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "💾 Guardar cotización"}
            </button>
            <button
              onClick={handleDescargarPDF}
              disabled={items.length === 0}
              className="px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-40"
            >
              📄 Ver PDF
            </button>
            <button
              onClick={() => setMostrarDeclinar(true)}
              className="px-6 py-3 border-2 border-amber-500 text-amber-700 font-semibold rounded-lg hover:bg-amber-50"
            >
              Declinar
            </button>
          </div>
        )}

        {/* Botones de acción (historial) */}
        {soloLectura && (
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {items.length > 0 && (
              <>
                <button
                  onClick={handleDescargarPDF}
                  className="flex-1 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800"
                >
                  📄 Descargar PDF
                </button>

                <a
                  href={enlaceEnvioCotizacion(quotation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onEnviado && onEnviado()}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-center"
                >
                  💬 Enviar por WhatsApp
                </a>
              </>
            )}

            {quotation.status === "declinada" && (
              <a
                href={enlaceDeclinacion(quotation)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 text-center"
              >
                💬 Avisar al cliente
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Auxiliar: etiqueta + valor. Definido fuera del componente
// principal para que React no lo recree en cada renderizado.
function Campo({ label, valor }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-900">{valor || "—"}</p>
    </div>
  );
}
