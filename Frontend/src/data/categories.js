// src/data/categories.js
// Única fuente de verdad de las categorías del portafolio.
// El db.json guarda SOLO el nombre; el color se resuelve aquí,
// para que Tailwind pueda ver las clases y generarlas.

export const PROJECT_CATEGORIES = [
  { name: "Maqueta",  color: "bg-teal-100 text-teal-700" },
  { name: "Tríptico", color: "bg-amber-100 text-amber-700" },
  { name: "Lámina",   color: "bg-blue-100 text-blue-700" },
  { name: "Cuaderno", color: "bg-purple-100 text-purple-700" },
  { name: "Guía",     color: "bg-green-100 text-green-700" },
];

// Busca el color de una categoría. Si el nombre no existe
// (por ejemplo si borraste una categoría que ya estaba en uso),
// devuelve un gris neutro en vez de romper la tarjeta.
export function getCategoryColor(categoryName) {
  const found = PROJECT_CATEGORIES.find((c) => c.name === categoryName);
  return found ? found.color : "bg-gray-100 text-gray-700";
}