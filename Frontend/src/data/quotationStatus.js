// src/data/quotationStatus.js
// Estados por los que pasa una cotización.
// "pendiente" es el único que vive en la bandeja de entrada;
// el resto van al historial.

const QUOTATION_STATUS = [
  { valor: "pendiente",  label: "Pendiente",  color: "bg-amber-100 text-amber-700" },
  { valor: "cotizada",   label: "Cotizada",   color: "bg-blue-100 text-blue-700" },
  { valor: "enviada",    label: "PDF enviado", color: "bg-teal-100 text-teal-700" },
  { valor: "aceptada",   label: "Aceptada",   color: "bg-green-100 text-green-700" },
  { valor: "rechazada",  label: "Rechazada",  color: "bg-orange-100 text-orange-700" },
  { valor: "declinada",  label: "Declinada",  color: "bg-gray-200 text-gray-600" },
];

// Los que aparecen en el historial (todos menos pendiente).
export const HISTORY_STATUS = QUOTATION_STATUS.filter(e => e.valor !== "pendiente");

export function getStatusColor(valor) {
  const found = QUOTATION_STATUS.find(e => e.valor === valor);
  return found ? found.color : "bg-gray-100 text-gray-700";
}

export function getStatusLabel(valor) {
  const found = QUOTATION_STATUS.find(e => e.valor === valor);
  return found ? found.label : valor;
}

// Convierte una fecha ISO a formato legible peruano.
export function formatearFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

// Suma los items más el envío. El total NUNCA se guarda:
// siempre se calcula, para que no pueda quedar desactualizado.
export function calcularTotal(items = [], shippingCost = 0) {
  const subtotal = items.reduce((suma, item) => suma + (Number(item.precio) || 0), 0);
  return subtotal + (Number(shippingCost) || 0);
}