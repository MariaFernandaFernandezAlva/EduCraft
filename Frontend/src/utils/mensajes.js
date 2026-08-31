// src/utils/mensajes.js
// Arma los enlaces de WhatsApp con el mensaje ya escrito.
// El admin solo revisa y presiona enviar.

import { EMPRESA } from "../data/empresa";
import { calcularTotal } from "../data/quotationStatus";

// Convierte un número peruano al formato que espera wa.me:
// código de país sin el "+" y sin espacios.
function normalizarNumero(whatsapp) {
  const soloDigitos = String(whatsapp || "").replace(/\D/g, "");
  // Si ya trae el 51 del código de país, lo dejamos.
  return soloDigitos.startsWith("51") ? soloDigitos : `51${soloDigitos}`;
}

function construirEnlace(whatsapp, texto) {
  // encodeURIComponent escapa saltos de línea, tildes y símbolos
  // para que viajen bien dentro de la URL.
  return `https://wa.me/${normalizarNumero(whatsapp)}?text=${encodeURIComponent(texto)}`;
}

// Mensaje que acompaña al envío del PDF.
export function enlaceEnvioCotizacion(quotation) {
  const total = calcularTotal(quotation.items, quotation.shippingCost);

  const texto =
`Hola ${quotation.fullName}, te saluda ${EMPRESA.nombre}.

Preparamos la cotización de tu proyecto de ${quotation.projectType}.

El monto total es de S/ ${total.toFixed(2)}, con entrega por ${quotation.deliveryMethod.toLowerCase()}.

Te adjunto el documento con el detalle completo. La cotización es válida por ${EMPRESA.validezDias} días.

Quedamos atentos a tus comentarios.`;

  return construirEnlace(quotation.whatsapp, texto);
}

// Mensaje para cuando el admin declina la solicitud.
export function enlaceDeclinacion(quotation) {
  const texto =
`Hola ${quotation.fullName}, te saluda ${EMPRESA.nombre}.

Gracias por escribirnos sobre tu proyecto de ${quotation.projectType}.

Lamentablemente no podremos tomarlo en esta ocasión. ${quotation.declineReason}

Esperamos poder ayudarte en una próxima oportunidad.`;

  return construirEnlace(quotation.whatsapp, texto);
}