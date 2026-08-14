export type ProductId =
  | "cardiaca"
  | "cuidados-intensivos"
  | "cancer"
  | "accidentes"
  | "indemnizacion-hospitalaria"
  | "aca-obamacare"
  | "seguro-medico"
  | "seguro-privado"
  | "seguro-vida";

export type Product = {
  id: ProductId;
  /** Full name, used as the dialog heading. */
  name: string;
  /** Compact name for the card grid, where the display type is large. */
  shortName: string;
  eyebrow: string;
  /** One line for the card. */
  summary: string;
  overview: string;
  useCase: string;
  eligibility: string;
  /**
   * Featured products get the cinematic treatment on the landing page. The
   * remaining categories use the compact card, which keeps the section
   * readable as the catalogue grows.
   */
  featured: boolean;
};

export const policyDisclosure =
  "Este contenido es únicamente informativo y no constituye una oferta, recomendación, garantía de cobertura ni contrato de seguro. Los beneficios están sujetos a los términos, condiciones, definiciones, períodos de espera, limitaciones y exclusiones de la póliza emitida por la compañía aseguradora. La disponibilidad, elegibilidad y características del producto pueden variar según el estado y la compañía. La póliza y sus anexos son los documentos que rigen la cobertura; si existe alguna diferencia con este resumen, prevalece la póliza. Esta cobertura es complementaria y no sustituye un seguro médico principal ni cubre todos los gastos. Un agente de seguros con licencia puede explicar las opciones disponibles y confirmar los detalles antes de que solicites cobertura.";

export const products: Product[] = [
  {
    id: "cardiaca",
    name: "Protección cardíaca",
    shortName: "Cardíaca",
    eyebrow: "Corazón protegido",
    summary: "Apoyo económico ante eventos cardíacos cubiertos, para respirar y enfocarte en sanar.",
    overview:
      "Una cobertura complementaria pensada para acompañarte si atraviesas un evento cardíaco que esté cubierto por tu póliza. El beneficio puede ayudarte a mantener la atención en tu recuperación y en quienes dependen de ti.",
    useCase:
      "Por ejemplo, una persona que debe guardar reposo después de un evento cubierto podría usar el apoyo para organizar ayuda con el cuidado de sus hijos o sus traslados a citas médicas.",
    eligibility:
      "La edad de solicitud, el estado de residencia, las preguntas de salud, los períodos de espera y cualquier otra condición de elegibilidad deben ser confirmados directamente con la compañía aseguradora antes de presentar una solicitud.",
    featured: true,
  },
  {
    id: "cuidados-intensivos",
    name: "Cuidados intensivos",
    shortName: "Cuidados intensivos",
    eyebrow: "Apoyo hospitalario",
    summary: "Respaldo diario durante una estadía cubierta en cuidados intensivos.",
    overview:
      "Una protección complementaria que puede brindar respaldo durante una estadía cubierta en una unidad de cuidados intensivos, según lo establecido en la póliza.",
    useCase:
      "Por ejemplo, durante una hospitalización cubierta, una familia podría coordinar ayuda para las tareas del hogar, el cuidado de una mascota o los viajes de acompañamiento al hospital.",
    eligibility:
      "La edad de solicitud, el tipo de unidad hospitalaria admitida, la duración de la estadía, el estado de residencia, las preguntas de salud y demás requisitos deben ser confirmados directamente con la compañía aseguradora.",
    featured: true,
  },
  {
    id: "cancer",
    name: "Protección contra el cáncer",
    shortName: "Cáncer",
    eyebrow: "Fuerza para seguir",
    summary: "Protección pensada para acompañarte desde un diagnóstico cubierto y durante el proceso.",
    overview:
      "Una cobertura complementaria diseñada para acompañarte cuando recibes un diagnóstico de cáncer cubierto y durante etapas del proceso contempladas por tu póliza.",
    useCase:
      "Por ejemplo, una persona en tratamiento por un diagnóstico cubierto podría organizar transporte a sus citas o pedir apoyo a alguien de confianza para mantener las rutinas de su familia.",
    eligibility:
      "La edad de solicitud, el estado de residencia, los antecedentes y preguntas de salud, los períodos de espera, las definiciones de diagnóstico y cualquier otro requisito deben ser confirmados directamente con la compañía aseguradora.",
    featured: true,
  },
  {
    id: "accidentes",
    name: "Póliza de accidentes",
    shortName: "Accidentes",
    eyebrow: "Para lo inesperado",
    summary: "Un beneficio ante lesiones accidentales cubiertas por la póliza.",
    overview:
      "Una cobertura complementaria que puede pagar un beneficio cuando ocurre un accidente cubierto, según lo que establezca la póliza. Está pensada para acompañar los gastos que aparecen alrededor de una lesión inesperada.",
    useCase:
      "Por ejemplo, después de una caída con lesión cubierta, una familia podría destinar el beneficio a traslados, al cuidado de los hijos o a los gastos del hogar mientras dura la recuperación.",
    eligibility:
      "La edad de solicitud, el estado de residencia, la definición de accidente cubierto, los períodos de espera y las exclusiones aplicables deben confirmarse directamente con la compañía aseguradora antes de solicitar.",
    featured: false,
  },
  {
    id: "indemnizacion-hospitalaria",
    name: "Indemnización hospitalaria",
    shortName: "Hospitalaria",
    eyebrow: "Respaldo por hospitalización",
    summary: "Un beneficio durante una hospitalización cubierta, según los términos de la póliza.",
    overview:
      "Una póliza complementaria que puede pagar un beneficio cuando ocurre una hospitalización cubierta, de acuerdo con lo establecido en el contrato. Funciona junto a un seguro médico, no en lugar de él.",
    useCase:
      "Por ejemplo, durante una estadía hospitalaria cubierta, el beneficio podría ayudar con el transporte, las comidas o el cuidado de la casa mientras la familia acompaña.",
    eligibility:
      "Los eventos y días cubiertos, los máximos aplicables, los períodos de espera, la edad de solicitud y el estado de residencia deben confirmarse directamente con la compañía aseguradora.",
    featured: false,
  },
  {
    id: "aca-obamacare",
    name: "Obamacare (ACA)",
    shortName: "Obamacare (ACA)",
    eyebrow: "Mercado de Salud",
    summary: "Orientación para entender e inscribirte en un plan del Mercado de Salud.",
    overview:
      "Te acompañamos a entender y comparar los planes disponibles en el Mercado de Salud (ACA), incluidos los períodos de inscripción y la documentación que suele solicitarse. La elegibilidad y cualquier ayuda económica las determina el Mercado, no la agencia.",
    useCase:
      "Por ejemplo, una familia que cambia de empleo puede revisar qué opciones tiene disponibles y en qué fechas puede inscribirse.",
    eligibility:
      "La elegibilidad, las ayudas económicas y las fechas de inscripción las define el Mercado de Salud según tus ingresos, tu hogar y tu estado. Un agente de seguros con licencia puede explicarte el proceso y confirmar los requisitos vigentes.",
    featured: false,
  },
  {
    id: "seguro-medico",
    name: "Seguro médico",
    shortName: "Seguro médico",
    eyebrow: "Cobertura principal",
    summary: "Opciones de cobertura médica explicadas en español, sin tecnicismos.",
    overview:
      "Revisamos contigo alternativas de seguro médico según lo que necesites y lo que esté disponible en tu estado, explicando en español cómo funcionan las redes de proveedores, los deducibles y los copagos.",
    useCase:
      "Por ejemplo, alguien que trabaja por su cuenta puede comparar opciones y entender qué implica cada una antes de decidir.",
    eligibility:
      "La disponibilidad de planes, las redes médicas, los requisitos y los costos varían según el estado, la compañía y el momento del año. Un agente de seguros con licencia puede confirmar qué aplica en tu caso.",
    featured: false,
  },
  {
    id: "seguro-privado",
    name: "Seguro privado",
    shortName: "Seguro privado",
    eyebrow: "Alternativas fuera del Mercado",
    summary: "Alternativas privadas cuando el Mercado de Salud no es la opción adecuada.",
    overview:
      "Algunas familias no califican para el Mercado de Salud o buscan otra alternativa. Revisamos las opciones privadas disponibles y te explicamos con claridad tanto sus alcances como sus límites.",
    useCase:
      "Por ejemplo, una persona que se encuentra fuera del período de inscripción abierta puede conocer qué alternativas existen mientras tanto.",
    eligibility:
      "Estos planes tienen reglas, límites y exclusiones propias que pueden diferir de un plan del Mercado de Salud. Las condiciones deben revisarse con un agente de seguros con licencia y confirmarse con la compañía antes de contratar.",
    featured: false,
  },
  {
    id: "seguro-vida",
    name: "Seguro de vida",
    shortName: "Seguro de vida",
    eyebrow: "Protección para los tuyos",
    summary: "Un respaldo económico para las personas que dependen de ti.",
    overview:
      "Una póliza de vida puede dejar un beneficio a las personas que designes, según los términos del contrato. Te ayudamos a entender las diferencias entre las modalidades disponibles y qué implica cada una.",
    useCase:
      "Por ejemplo, una familia puede prever cómo cubrir gastos finales o sostener el hogar durante un tiempo.",
    eligibility:
      "El monto, la modalidad, la edad de solicitud, las preguntas de salud, los períodos de contestabilidad y las exclusiones se definen en la póliza y deben confirmarse directamente con la compañía aseguradora.",
    featured: false,
  },
];

export const featuredProducts = products.filter((product) => product.featured);
export const additionalProducts = products.filter((product) => !product.featured);

export function getProduct(id: ProductId) {
  return products.find((product) => product.id === id);
}
