// src/pages/Admin/Cotizaciones/QuotationDetail.jsx

import { useState } from "react";
import { formatearFecha, calcularTotal } from "../../../data/quotationStatus";
import { generarCotizacionPDF } from "../../../utils/generarPDF";
import {
  enlaceEnvioCotizacion,
  enlaceDeclinacion,
} from "../../../utils/mensajes";
import SlideOver from "../../../components/common/Admin/SlideOver";

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

  const [nuevoConcepto, setNuevoConcepto] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  const [mostrarDeclinar, setMostrarDeclinar] = useState(false);
  const [motivo, setMotivo] = useState("");

  const [refPreviewOk, setRefPreviewOk] = useState(null);

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

  const handleQuitarItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

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

  // Genera el PDF con lo que hay en pantalla ahora mismo, no con lo guardado.
  const handleDescargarPDF = () => {
    generarCotizacionPDF({
      ...quotation,
      items,
      shippingCost: Number(shippingCost) || 0,
    });
  };

  // El pie cambia según el modo: cotizar, declinar o solo lectura.
  const footer = mostrarDeclinar ? (
    <div className="flex gap-3">
      <button
        onClick={() => {
          setMostrarDeclinar(false);
          setMotivo("");
        }}
        className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600"
      >
        Cancelar
      </button>
      <button
        onClick={handleConfirmarDeclinar}
        disabled={!motivo.trim() || guardando}
        className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        Confirmar declinación
      </button>
    </div>
  ) : soloLectura ? (
    <div className="flex flex-col gap-2 sm:flex-row">
      {items.length > 0 && (
        <>
          <button
            onClick={handleDescargarPDF}
            className="flex-1 rounded-xl bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Descargar PDF
          </button>
          <a
            href={enlaceEnvioCotizacion(quotation)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onEnviado && onEnviado()}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Enviar por WhatsApp
          </a>
        </>
      )}

      {quotation.status === "declinada" && (
        <a
          href={enlaceDeclinacion(quotation)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-amber-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-600"
        >
          Avisar al cliente
        </a>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        onClick={handleGuardar}
        disabled={items.length === 0 || guardando}
        className="flex-1 rounded-xl bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar cotización"}
      </button>
      <button
        onClick={handleDescargarPDF}
        disabled={items.length === 0}
        className="rounded-xl border border-blue-950 px-4 py-2.5 text-sm font-semibold text-blue-950 hover:bg-blue-50 disabled:opacity-40"
      >
        Ver PDF
      </button>
      <button
        onClick={() => setMostrarDeclinar(true)}
        className="rounded-xl border border-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
      >
        Declinar
      </button>
    </div>
  );

  return (
    <SlideOver
      size="wide"
      onClose={onClose}
      badge={soloLectura ? "HISTORIAL" : "SOLICITUD"}
      title={quotation.fullName}
      subtitle={`Solicitado el ${formatearFecha(quotation.createdAt)}`}
      footer={footer}
    >
      <div className="space-y-6">
        {/* Datos de la solicitud */}
        <section>
          <h4 className="mb-3 text-[11px] font-semibold tracking-wide text-slate-500">
            DATOS DE LA SOLICITUD
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <p className="mb-1 text-[11px] font-semibold tracking-wide text-slate-500">
              DESCRIPCIÓN DEL PROYECTO
            </p>
            <p className="rounded-lg bg-slate-50 p-4 text-sm whitespace-pre-wrap text-slate-800">
              {quotation.description}
            </p>
          </div>

          {/* Motivo de declinación: ahora fuera del bloque de referencia,
              antes solo se veía si además había enlace adjunto. */}
          {quotation.declineReason && (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-amber-900">
                MOTIVO DE LA DECLINACIÓN
              </p>
              <p className="text-sm text-amber-900">{quotation.declineReason}</p>
            </div>
          )}

          {quotation.referenceLink && (
            <div className="mt-4">
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-slate-500">
                REFERENCIA ENVIADA
              </p>
              <a
                href={quotation.referenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs break-all text-blue-700 underline"
              >
                {quotation.referenceLink}
              </a>
              <img
                key={quotation.referenceLink}
                src={quotation.referenceLink}
                alt="Referencia enviada por el cliente"
                onLoad={() => setRefPreviewOk(true)}
                onError={() => setRefPreviewOk(false)}
                className={`mt-3 max-h-56 w-auto rounded-lg border border-slate-200 ${
                  refPreviewOk === true ? "block" : "hidden"
                }`}
              />
              {refPreviewOk === false && (
                <p className="mt-2 text-[11px] text-slate-500">
                  No se puede mostrar la miniatura de este enlace. Ábrelo en una
                  pestaña nueva para verlo.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Detalle de la cotización */}
        <section className="border-t border-slate-200 pt-6">
          <h4 className="mb-3 text-[11px] font-semibold tracking-wide text-slate-500">
            DETALLE DE LA COTIZACIÓN
          </h4>

          {!soloLectura && (
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={nuevoConcepto}
                onChange={(e) => setNuevoConcepto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAgregarItem();
                  }
                }}
                placeholder="Concepto — ej: Maqueta en madera 60x40cm"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500"
              />
              <input
                type="number"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAgregarItem();
                  }
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500 sm:w-28"
              />
              <button
                type="button"
                onClick={handleAgregarItem}
                className="shrink-0 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-blue-950 hover:bg-amber-300"
              >
                Agregar
              </button>
            </div>
          )}

          {items.length > 0 ? (
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-200">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0"
                >
                  <span className="flex-1 text-sm text-slate-800">
                    {item.concepto}
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap text-slate-900">
                    S/ {item.precio.toFixed(2)}
                  </span>
                  {!soloLectura && (
                    <button
                      type="button"
                      onClick={() => handleQuitarItem(index)}
                      aria-label={`Quitar ${item.concepto}`}
                      className="text-sm text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-xs text-slate-400 italic">
              Aún no agregas conceptos.
            </p>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 py-3">
            <label className="text-sm font-medium text-slate-700">
              Costo de envío
              <span className="block text-[11px] font-normal text-slate-500">
                {quotation.deliveryMethod}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">S/</span>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                disabled={soloLectura}
                min="0"
                step="0.01"
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-hidden disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Total: siempre calculado, nunca guardado */}
          <div className="flex items-center justify-between border-t-2 border-slate-900 py-4">
            <span className="text-sm font-bold tracking-wide text-slate-900">
              TOTAL
            </span>
            <span className="font-serif text-2xl font-bold text-blue-950">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Motivo al declinar */}
        {mostrarDeclinar && (
          <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-amber-900">
              Motivo por el que declinas esta solicitud
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows="3"
              placeholder="Ej: No trabajamos con ese material / No alcanzamos con la fecha de entrega"
              className="w-full resize-none rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm outline-hidden"
            />
            <p className="mt-2 text-[11px] text-amber-800">
              Este texto se usará para armar el mensaje que le enviarás al
              cliente.
            </p>
          </section>
        )}
      </div>
    </SlideOver>
  );
}

function Campo({ label, valor }) {
  return (
    <div>
      <p className="mb-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
        {label.toUpperCase()}
      </p>
      <p className="text-sm text-slate-900">{valor || "—"}</p>
    </div>
  );
}