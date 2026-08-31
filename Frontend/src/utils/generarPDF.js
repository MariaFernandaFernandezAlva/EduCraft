// src/utils/generarPDF.js
// Genera la cotización formal en PDF, dentro del navegador.
// No interviene ningún servidor: jsPDF arma el archivo y
// el navegador lo descarga.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EMPRESA } from "../data/empresa";
import { calcularTotal } from "../data/quotationStatus";

// Formatea un número como moneda peruana.
const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

// Fecha larga para el encabezado del documento.
const fechaLarga = (iso) =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric"
  });

// Suma días a una fecha y la devuelve formateada.
const sumarDias = (iso, dias) => {
  const fecha = new Date(iso);
  fecha.setDate(fecha.getDate() + dias);
  return fechaLarga(fecha.toISOString());
};

export function generarCotizacionPDF(quotation) {
  // "p" = vertical, "mm" = milímetros, "a4" = tamaño de hoja.
  const doc = new jsPDF("p", "mm", "a4");

  const anchoPagina = doc.internal.pageSize.getWidth();
  const margen = 15;
  const hoy = new Date().toISOString();

  // ---------- Encabezado ----------
  doc.setFillColor(30, 58, 138); // El azul de tu marca
  doc.rect(0, 0, anchoPagina, 32, "F"); // "F" = relleno

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(EMPRESA.nombre, margen, 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(EMPRESA.eslogan, margen, 21);
  doc.text(`WhatsApp: ${EMPRESA.whatsapp}  |  ${EMPRESA.email}`, margen, 26);

  // Título alineado a la derecha
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("COTIZACIÓN", anchoPagina - margen, 18, { align: "right" });

  // ---------- Datos del cliente ----------
  doc.setTextColor(0, 0, 0);
  let y = 45;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", margen, y);

  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Función local para no repetir el patrón etiqueta/valor.
  const linea = (etiqueta, valor) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${etiqueta}:`, margen, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(valor || "—"), margen + 38, y);
    y += 6;
  };

  linea("Nombre", quotation.fullName);
  linea("Correo", quotation.email);
  linea("WhatsApp", quotation.whatsapp);
  linea("Fecha de emisión", fechaLarga(hoy));
  linea("Válida hasta", sumarDias(hoy, EMPRESA.validezDias));

  // ---------- Datos del proyecto ----------
  y += 4;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PROYECTO SOLICITADO", margen, y);

  y += 7;
  doc.setFontSize(10);
  linea("Tipo", quotation.projectType);
  linea("Nivel académico", quotation.academicLevel);
  linea("Fecha de entrega", quotation.deliveryDate);
  linea("Modalidad", quotation.deliveryMethod);

  if (quotation.address) {
    linea("Dirección", quotation.address);
  }

  // La descripción puede ser larga: splitTextToSize la parte
  // en varias líneas según el ancho disponible.
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.text("Descripción:", margen, y);
  y += 5;
  doc.setFont("helvetica", "normal");

  const descripcion = doc.splitTextToSize(
    quotation.description || "—",
    anchoPagina - margen * 2
  );
  doc.text(descripcion, margen, y);
  y += descripcion.length * 5 + 6;

  // ---------- Tabla de conceptos ----------
  const filas = (quotation.items || []).map((item) => [
    item.concepto,
    soles(item.precio),
  ]);

  // El envío entra como una fila más de la tabla.
  filas.push([
    `Envío — ${quotation.deliveryMethod}`,
    soles(quotation.shippingCost || 0),
  ]);

  const total = calcularTotal(quotation.items, quotation.shippingCost);

  autoTable(doc, {
    startY: y,
    head: [["DESCRIPCIÓN", "IMPORTE"]],
    body: filas,
    // La fila del total va en el pie de la tabla.
    foot: [["TOTAL", soles(total)]],
    theme: "grid",
    margin: { left: margen, right: margen },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 12,
    },
    styles: { fontSize: 10, cellPadding: 3 },
    // La segunda columna, alineada a la derecha y con ancho fijo.
    columnStyles: { 1: { halign: "right", cellWidth: 40 } },
  });

  // ---------- Pie ----------
  // lastAutoTable.finalY nos dice dónde terminó la tabla.
  let yFinal = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);

  const notas = [
    `Esta cotización tiene una validez de ${EMPRESA.validezDias} días desde su emisión.`,
    "Los precios incluyen materiales y mano de obra.",
    "El plazo de entrega comienza a contar desde la confirmación del pedido.",
    `Cualquier consulta, escríbenos al WhatsApp ${EMPRESA.whatsapp}.`,
  ];

  notas.forEach((nota) => {
    doc.text(nota, margen, yFinal);
    yFinal += 5;
  });

  // ---------- Descarga ----------
  // El nombre del archivo lleva el cliente y la fecha para
  // que el admin lo encuentre después en su carpeta.
  const nombreLimpio = quotation.fullName
    .normalize("NFD")                  // separa las tildes de las letras
    .replace(/[\u0300-\u036f]/g, "")   // borra las tildes
    .replace(/[^a-zA-Z0-9]/g, "-");    // el resto, guiones

  doc.save(`Cotizacion-${nombreLimpio}-${hoy.slice(0, 10)}.pdf`);
}