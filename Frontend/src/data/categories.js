export const PROJECT_CATEGORIES = [
  { name: "Maqueta",  color: "bg-verde/10 text-verde" },
  { name: "Tríptico", color: "bg-amarillo/10 text-amarillo" },
  { name: "Lámina",   color: "bg-azul/10 text-azul" },
  { name: "Cuaderno", color: "bg-morado/10 text-morado" },
  { name: "Guía",     color: "bg-marron/10 text-marron" },
];

export function getCategoryColor(categoryName) {
  const found = PROJECT_CATEGORIES.find((c) => c.name === categoryName);
  return found ? found.color : "bg-gray-100 text-gray-700";
}

const CATEGORY_ACCENTS = {
  Maqueta: "from-verde/70 via-verde/90",
  Lámina: "from-morado/70 via-morado/90",
  Tríptico: "from-amarillo/70 via-amarillo/90",
};

export const getCategoryAccent = (category) =>
  CATEGORY_ACCENTS[category] ?? "from-azul/70 via-azul/90";