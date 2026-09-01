import { RectangleGroupIcon ,ViewColumnsIcon, PuzzlePieceIcon, BookOpenIcon, StarIcon
} from "@heroicons/react/24/outline";

export const projectTypes = [
  { id: 1, name: "Maqueta", icon: RectangleGroupIcon },
  { id: 2, name: "Tríptico", icon: ViewColumnsIcon },
  { id: 3, name: "Lámina", icon: PuzzlePieceIcon },
  { id: 4, name: "Cuaderno", icon: BookOpenIcon },
  { id: 5, name: "Otro", icon: StarIcon }
];

export const academicLevels = [
  { id: 1, name: "Inicial" },
  { id: 2, name: "Primaria" },
  { id: 3, name: "Secundaria" }
];

export const deliveryMethods = [
  { 
    id: 1, 
    name: "Envío a Domicilio", 
    description: "Llega a la puerta de tu casa",
    icon: "🚚"
  },
  { 
    id: 2, 
    name: "Recojo en Persona", 
    description: "En nuestras sedes centrales",
    icon: "🏪"
  }
];