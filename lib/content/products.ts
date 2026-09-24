export type ProductId =
  | "cardiaca"
  | "cuidados-intensivos"
  | "cancer"
  | "accidentes"
  | "indemnizacion-hospitalaria"
  | "aca-obamacare"
  | "seguro-medico"
  | "seguro-privado"
  | "vida-temporal"
  | "vida-permanente"
  | "gastos-finales"
  | "hogar"
  | "auto"
  | "inquilinos"
  | "responsabilidad";

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
  /** Which portal spoke the product belongs to. */
  line: "health" | "life" | "property";
};

export const policyDisclosures = {
  health:
    "Este contenido es únicamente informativo y no constituye una oferta, recomendación, garantía de cobertura ni contrato de seguro. Los beneficios están sujetos a los términos, condiciones, definiciones, períodos de espera, limitaciones y exclusiones de la póliza emitida por la compañía aseguradora. La disponibilidad, elegibilidad y características del producto pueden variar según el estado y la compañía. La póliza y sus anexos son los documentos que rigen la cobertura; si existe alguna diferencia con este resumen, prevalece la póliza. Esta cobertura es complementaria y no sustituye un seguro médico principal ni cubre todos los gastos. Un agente de seguros con licencia puede explicar las opciones disponibles y confirmar los detalles antes de que solicites cobertura.",
  life:
    "Este contenido es únicamente informativo y no constituye una oferta, recomendación, garantía de cobertura ni contrato de seguro. El beneficio por fallecimiento, cuando corresponde, se paga según los términos, condiciones, definiciones, períodos de contestabilidad, limitaciones y exclusiones de la póliza emitida por la compañía aseguradora. La disponibilidad, la elegibilidad, el monto y la modalidad pueden variar según el estado y la compañía. La póliza y sus anexos son los documentos que rigen la cobertura; si existe alguna diferencia con este resumen, prevalece la póliza. Un agente de seguros con licencia puede explicar las opciones disponibles y confirmar los detalles antes de que solicites cobertura.",
  property:
    "Este contenido es únicamente informativo y no constituye una oferta, recomendación, garantía de cobertura ni contrato de seguro. La póliza responde por las pérdidas y los reclamos cubiertos, hasta los límites del contrato y después de aplicar los deducibles, según las exclusiones y condiciones de la póliza emitida por la compañía aseguradora. La disponibilidad, la elegibilidad y los límites pueden variar según el estado, el bien y la compañía. La póliza y sus anexos son los documentos que rigen la cobertura; si existe alguna diferencia con este resumen, prevalece la póliza. Un agente de seguros con licencia puede explicar las opciones disponibles y confirmar los detalles antes de que solicites cobertura.",
} as const;

/** Health landing disclosure. Life and property use `policyDisclosures`. */
export const policyDisclosure = policyDisclosures.health;

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
    line: "health",
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
    line: "health",
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
    line: "health",
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
    line: "health",
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
    line: "health",
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
    line: "health",
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
    line: "health",
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
    line: "health",
  },
  {
    id: "vida-temporal",
    name: "Seguro de vida temporal",
    shortName: "Temporal",
    eyebrow: "Por un plazo definido",
    summary: "Protección durante un período determinado, mientras quienes dependen de ti más la necesitan.",
    overview:
      "Una modalidad que puede pagar un beneficio por fallecimiento si la persona asegurada fallece durante el plazo de la póliza y ese fallecimiento está cubierto. Suele contratarse por un número de años. Al terminar el plazo, la cobertura termina, salvo que el contrato permita renovarla o convertirla.",
    useCase:
      "Por ejemplo, una familia con hijos en la escuela puede usar esta modalidad durante los años en que un ingreso sostiene la casa, la renta o una deuda.",
    eligibility:
      "La edad de solicitud, el plazo, el monto, las preguntas de salud, el período de contestabilidad y las exclusiones deben confirmarse con la compañía aseguradora antes de solicitar.",
    featured: true,
    line: "life",
  },
  {
    id: "vida-permanente",
    name: "Seguro de vida permanente",
    shortName: "Permanente",
    eyebrow: "Pensada para durar",
    summary: "Una modalidad diseñada para mantenerse vigente mientras se cumplen las condiciones del contrato, incluida la prima.",
    overview:
      "A diferencia de una póliza temporal, una permanente está pensada para durar más que un plazo fijo, siempre que se cumplan las condiciones del contrato. Algunas modalidades pueden acumular valor en efectivo. Ese valor no es un depósito bancario y no todas las pólizas lo acumulan de la misma forma.",
    useCase:
      "Por ejemplo, alguien que quiere dejar un beneficio sin depender de renovar un plazo puede revisar si una modalidad permanente cabe en su presupuesto y en su edad.",
    eligibility:
      "La modalidad, la edad, las preguntas de salud, las primas, cualquier valor en efectivo y las exclusiones se definen en la póliza y deben confirmarse con la compañía aseguradora.",
    featured: true,
    line: "life",
  },
  {
    id: "gastos-finales",
    name: "Protección para gastos finales",
    shortName: "Gastos finales",
    eyebrow: "Un respaldo concreto",
    summary: "Un beneficio de monto más acotado, pensado para ayudar con gastos finales cubiertos por la póliza.",
    overview:
      "Una póliza de vida orientada a dejar un beneficio que las personas beneficiarias puedan usar para gastos finales, dentro del monto del contrato. No está diseñada para sostener el ingreso de una familia durante muchos años.",
    useCase:
      "Por ejemplo, una persona puede designar a un hijo para que reciba el beneficio y pueda ocuparse de los gastos inmediatos, hasta el monto de la póliza.",
    eligibility:
      "La edad, el monto disponible, las preguntas de salud, los períodos de espera o de contestabilidad y las exclusiones deben confirmarse con la compañía aseguradora. Algunas pólizas de gastos finales tienen reglas distintas a una temporal o permanente.",
    featured: true,
    line: "life",
  },
  {
    id: "hogar",
    name: "Seguro de hogar",
    shortName: "Hogar",
    eyebrow: "La casa donde vives",
    summary: "Cobertura para la vivienda y, según la póliza, para bienes y responsabilidad ligados a ella.",
    overview:
      "Una póliza de hogar puede proteger la estructura de la vivienda y ciertos bienes ante pérdidas cubiertas. Qué eventos entran, qué deducible aplica y qué queda excluido cambia de contrato a contrato. Una inundación, por ejemplo, suele requerir una cobertura distinta.",
    useCase:
      "Por ejemplo, después de un daño cubierto en la cocina, la póliza puede responder hasta el límite contratado, una vez aplicado el deducible y confirmado que el evento está incluido.",
    eligibility:
      "La ubicación, el tipo de vivienda, el estado de la construcción y los límites los evalúa la compañía aseguradora. Conviene confirmar qué está cubierto antes de contratar.",
    featured: true,
    line: "property",
  },
  {
    id: "auto",
    name: "Seguro de auto",
    shortName: "Auto",
    eyebrow: "En la carretera",
    summary: "Cobertura para tu vehículo y, según la póliza, para tu responsabilidad frente a otras personas.",
    overview:
      "El seguro de auto puede incluir responsabilidad civil y coberturas como colisión o daños a otros. Los requisitos mínimos del estado no describen todo lo que una póliza puede ofrecer ni todo lo que queda fuera. El contrato indica límites, deducibles y exclusiones.",
    useCase:
      "Por ejemplo, después de un choque cubierto, la póliza puede responder por los daños incluidos hasta el límite, con el deducible que corresponda.",
    eligibility:
      "El vehículo, quién lo conduce, el uso, el estado de residencia y el historial influyen en la elegibilidad y en la prima. La compañía aseguradora confirma qué aplica en tu caso.",
    featured: true,
    line: "property",
  },
  {
    id: "inquilinos",
    name: "Seguro para inquilinos",
    shortName: "Inquilinos",
    eyebrow: "Si rentas",
    summary: "Protección para tus pertenencias y, según la póliza, para tu responsabilidad en la vivienda que rentas.",
    overview:
      "Rentar no significa que el seguro del propietario cubra tus muebles o tu responsabilidad. Una póliza de inquilinos puede cubrir bienes personales ante pérdidas incluidas y cierta responsabilidad civil. La estructura del edificio suele corresponder al propietario.",
    useCase:
      "Por ejemplo, después de un incendio cubierto en un departamento rentado, la póliza del inquilino puede ayudar con los bienes incluidos. Reconstruir el edificio suele corresponder a la póliza del propietario.",
    eligibility:
      "La dirección, el tipo de vivienda y los límites los confirma la compañía aseguradora. El contrato de arrendamiento no sustituye la póliza.",
    featured: true,
    line: "property",
  },
  {
    id: "responsabilidad",
    name: "Responsabilidad civil",
    shortName: "Responsabilidad",
    eyebrow: "Frente a terceros",
    summary: "Protección ante reclamos cubiertos por daños a otras personas o a sus bienes.",
    overview:
      "La responsabilidad civil puede formar parte de una póliza de hogar o de auto, o existir como cobertura aparte, según lo que ofrezca la compañía. Responde, hasta el límite, cuando un reclamo cubierto exige que la persona asegurada responda por un daño.",
    useCase:
      "Por ejemplo, si una visita se lesiona en la casa y el reclamo está cubierto, la póliza puede responder hasta el límite de responsabilidad, según sus condiciones.",
    eligibility:
      "Los límites, las exclusiones y si la cobertura viene dentro de otra póliza o por separado deben confirmarse con la compañía aseguradora y con un agente de seguros con licencia.",
    featured: false,
    line: "property",
  },
];

/** Everything shown on /health — life and property live on their own spokes. */
export const healthProducts = products.filter((product) => product.line === "health");
export const lifeProducts = products.filter((product) => product.line === "life");
export const propertyProducts = products.filter((product) => product.line === "property");

export const featuredHealthProducts = healthProducts.filter((product) => product.featured);
export const additionalHealthProducts = healthProducts.filter((product) => !product.featured);
export const featuredLifeProducts = lifeProducts.filter((product) => product.featured);
export const additionalLifeProducts = lifeProducts.filter((product) => !product.featured);
export const featuredPropertyProducts = propertyProducts.filter((product) => product.featured);
export const additionalPropertyProducts = propertyProducts.filter((product) => !product.featured);

export function getProduct(id: ProductId) {
  return products.find((product) => product.id === id);
}
