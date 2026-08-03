export type Product = {
  id: "cardiaca" | "cuidados-intensivos" | "cancer";
  name: string;
  eyebrow: string;
  overview: string;
  useCase: string;
  eligibility: string;
};

export const policyDisclosure =
  "Este contenido es únicamente informativo y no constituye una oferta, recomendación, garantía de cobertura ni contrato de seguro. Los beneficios están sujetos a los términos, condiciones, definiciones, períodos de espera, limitaciones y exclusiones de la póliza emitida por la compañía aseguradora. La disponibilidad, elegibilidad y características del producto pueden variar según el estado y la compañía. La póliza y sus anexos son los documentos que rigen la cobertura; si existe alguna diferencia con este resumen, prevalece la póliza. Esta cobertura es complementaria y no sustituye un seguro médico principal ni cubre todos los gastos. Un agente de seguros con licencia puede explicar las opciones disponibles y confirmar los detalles antes de que solicites cobertura.";

export const products: Product[] = [
  {
    id: "cardiaca",
    name: "Protección cardíaca",
    eyebrow: "Corazón protegido",
    overview:
      "Una cobertura complementaria pensada para acompañarte si atraviesas un evento cardíaco que esté cubierto por tu póliza. El beneficio puede ayudarte a mantener la atención en tu recuperación y en quienes dependen de ti.",
    useCase:
      "Por ejemplo, una persona que debe guardar reposo después de un evento cubierto podría usar el apoyo para organizar ayuda con el cuidado de sus hijos o sus traslados a citas médicas.",
    eligibility:
      "La edad de solicitud, el estado de residencia, las preguntas de salud, los períodos de espera y cualquier otra condición de elegibilidad deben ser confirmados directamente con la compañía aseguradora antes de presentar una solicitud.",
  },
  {
    id: "cuidados-intensivos",
    name: "Cuidados intensivos",
    eyebrow: "Apoyo hospitalario",
    overview:
      "Una protección complementaria que puede brindar respaldo durante una estadía cubierta en una unidad de cuidados intensivos, según lo establecido en la póliza.",
    useCase:
      "Por ejemplo, durante una hospitalización cubierta, una familia podría coordinar ayuda para las tareas del hogar, el cuidado de una mascota o los viajes de acompañamiento al hospital.",
    eligibility:
      "La edad de solicitud, el tipo de unidad hospitalaria admitida, la duración de la estadía, el estado de residencia, las preguntas de salud y demás requisitos deben ser confirmados directamente con la compañía aseguradora.",
  },
  {
    id: "cancer",
    name: "Protección contra el cáncer",
    eyebrow: "Fuerza para seguir",
    overview:
      "Una cobertura complementaria diseñada para acompañarte cuando recibes un diagnóstico de cáncer cubierto y durante etapas del proceso contempladas por tu póliza.",
    useCase:
      "Por ejemplo, una persona en tratamiento por un diagnóstico cubierto podría organizar transporte a sus citas o pedir apoyo a alguien de confianza para mantener las rutinas de su familia.",
    eligibility:
      "La edad de solicitud, el estado de residencia, los antecedentes y preguntas de salud, los períodos de espera, las definiciones de diagnóstico y cualquier otro requisito deben ser confirmados directamente con la compañía aseguradora.",
  },
];

export function getProduct(id: Product["id"]) {
  return products.find((product) => product.id === id);
}
