import maqueta from "../assets/servicies/maqueta.webp"
import triptico from "../assets/servicies/Triptico.webp"
import cuaderno from "../assets/servicies/cuaderno.webp"
import Trifolio from "../assets/servicies/Trifolio.webp"

export const servicesData = [
  {
    id: 1,
    category: "Maquetas",
    icon: "📐",
    title: "Maquetas Profesionales",
    description: "Modelos tridimensionales a escala para historia, ciencias y geografía, con corte láser, impresión 3D y acabados a mano.",
    includes: [
      "Investigación histórica y técnica previa",
      "Materiales premium: madera, acrílico o resina",
      "Rótulos impresos y opción de luces LED",
      "Entrega protegida a domicilio"
    ],
    deliveryTime: "5-8 días",
    image: maqueta
  },
  {
    id: 2,
    category: "Trípticos",
    icon: "📄",
    title: "Trípticos Profesionales",
    description: "Diseños limpios, informativos y con diagramación editorial experta para presentaciones y campañas escolares.",
    includes: [
      "Diseño editorial personalizado",
      "Maquetación profesional con tipografía experta",
      "Impresión en papel de calidad",
      "Revisiones ilimitadas"
    ],
    deliveryTime: "3-5 días",
    image: triptico
  },
  {
    id: 3,
    category: "Cuadernos de trabajo",
    icon: "📚",
    title: "Cuadernos de Trabajo",
    description: "Material didáctico estructurado para el refuerzo escolar y guías de estudio personalizadas con actividades.",
    includes: [
      "Contenido pedagógico especializado",
      "Ejercicios prácticos y actividades interactivas",
      "Diseño de páginas internas y portada",
      "Encuadernación profesional"
    ],
    deliveryTime: "7-10 días",
    image: cuaderno
  },
  {
    id: 4,
    category: "Láminas",
    icon: "🎨",
    title: "Láminas Educativas",
    description: "Gráficos de gran formato con ilustraciones detalladas para exposiciones y carteles escolares de alto impacto visual.",
    includes: [
      "Ilustraciones de calidad profesional",
      "Impresión en papel de gran formato",
      "Acabado mate o brillante a elegir",
      "Estructura para exposición (opcional)"
    ],
    deliveryTime: "4-6 días",
    image: Trifolio
  }
];