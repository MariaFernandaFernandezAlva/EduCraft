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

// src/components/Admin/accents.js
// El color no se guarda: se deduce de la categoría del servicio.

// Clases escritas completas para que Tailwind las compile.
export const ACCENTS = {
  navy: { swatch: "bg-blue-900", header: "from-blue-900 to-blue-700" },
  amber: { swatch: "bg-amber-400", header: "from-amber-400 to-amber-600" },
  emerald: { swatch: "bg-emerald-500", header: "from-emerald-500 to-emerald-700" },
  violet: { swatch: "bg-violet-500", header: "from-violet-500 to-violet-700" },
  clay: { swatch: "bg-amber-800", header: "from-amber-700 to-amber-900" },
};

// Categorías conocidas. Las llaves van en minúscula: la búsqueda normaliza.
const ACCENT_BY_CATEGORY = {
  maquetas: "navy",
  trípticos: "amber",
  "cuadernos de trabajo": "emerald",
  láminas: "violet",
};

const KEYS = Object.keys(ACCENTS);

// Hash simple: suma los códigos de cada carácter y reparte entre los colores.
// Determinista, así que la misma categoría siempre recibe el mismo color.
const hashAccent = (text) => {
  let sum = 0;
  for (const char of text) sum += char.codePointAt(0);
  return KEYS[sum % KEYS.length];
};

export const getAccent = (category = "") => {
  const normalized = category.trim().toLowerCase();
  if (!normalized) return ACCENTS.navy;

  const key = ACCENT_BY_CATEGORY[normalized] || hashAccent(normalized);
  return ACCENTS[key];
};