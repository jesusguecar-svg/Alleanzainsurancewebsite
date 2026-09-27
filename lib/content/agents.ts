export type Agent = {
  slug: string;
  fullName: string;
  title: string;
  titleEn: string;
  npn: string;
  image: string;
  languages: readonly string[];
  residentState: string;
  nonResidentStates: readonly string[];
  nonResidentStatesEn: readonly string[];
  serviceStates: readonly string[];
  serviceStatesEn: readonly string[];
  city: string;
  officeName: string;
  officeNameEn: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  phone: { label: string; href: string };
  shortBio: string;
  shortBioEn: string;
  bio: readonly string[];
  bioEn: readonly string[];
  specialties: readonly string[];
  specialtiesEn: readonly string[];
};

export const agents: readonly Agent[] = [
  {
    slug: "jesus-esteban-guerra",
    fullName: "Jesus Esteban Guerra",
    title: "Agente de seguros con licencia",
    titleEn: "Licensed Insurance Agent",
    npn: "22182433",
    image: "/agents/jesus-esteban-guerra.png",
    languages: ["Español", "English"],
    residentState: "Texas",
    nonResidentStates: ["Tennessee", "Florida", "Nueva Jersey"],
    nonResidentStatesEn: ["Tennessee", "Florida", "New Jersey"],
    serviceStates: ["Texas", "Tennessee", "Florida", "Nueva Jersey"],
    serviceStatesEn: ["Texas", "Tennessee", "Florida", "New Jersey"],
    city: "Dallas",
    officeName: "Oficina Dallas–Fort Worth",
    officeNameEn: "Dallas–Fort Worth Office",
    address: {
      street: "3424 Midcourt Rd, Suite 122",
      locality: "Carrollton",
      region: "TX",
      postalCode: "75006",
      country: "US",
    },
    phone: { label: "(214) 997-4650", href: "+12149974650" },
    shortBio:
      "Orientación bilingüe y clara para que personas y familias entiendan sus opciones de protección.",
    shortBioEn:
      "Clear bilingual guidance that helps individuals and families understand their protection options.",
    bio: [
      "Jesus Esteban Guerra es un agente de seguros con licencia que atiende en inglés y español desde el área de Dallas–Fort Worth. Su trabajo se centra en hacer que la conversación sobre seguros sea más clara, cercana y fácil de entender.",
      "Le apasiona ayudar a personas y familias a conocer sus opciones de seguro de salud, accidentes y protección complementaria, explicar los límites de cada cobertura y acompañarlas para que puedan tomar una decisión informada.",
    ],
    bioEn: [
      "Jesus Esteban Guerra is a licensed insurance agent serving the Dallas–Fort Worth area in English and Spanish. His work focuses on making insurance conversations clearer, more personal, and easier to understand.",
      "He is passionate about helping individuals and families learn about health insurance, accident, and supplemental protection options, understand the limits of each policy, and make informed decisions.",
    ],
    specialties: ["Seguro de salud", "Accidentes", "Protección complementaria"],
    specialtiesEn: ["Health insurance", "Accident coverage", "Supplemental protection"],
  },
] as const;

export function getAgent(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}

export function getAgentsByCity(city: string) {
  return agents.filter((agent) => agent.city.toLocaleLowerCase("es") === city.toLocaleLowerCase("es"));
}
