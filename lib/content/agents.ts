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
  serviceStates: readonly string[];
  city: string;
  officeName: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  phone: { label: string; href: string };
  shortBio: string;
  bio: readonly string[];
  specialties: readonly string[];
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
    serviceStates: ["Texas", "Tennessee", "Florida", "Nueva Jersey"],
    city: "Dallas",
    officeName: "Oficina Dallas–Fort Worth",
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
    bio: [
      "Jesus Esteban Guerra es un agente de seguros con licencia que atiende en inglés y español desde el área de Dallas–Fort Worth. Su trabajo se centra en hacer que la conversación sobre seguros sea más clara, cercana y fácil de entender.",
      "Le apasiona ayudar a personas y familias a conocer sus opciones de seguro de salud, accidentes y protección complementaria, explicar los límites de cada cobertura y acompañarlas para que puedan tomar una decisión informada.",
    ],
    specialties: ["Seguro de salud", "Accidentes", "Protección complementaria"],
  },
] as const;

export function getAgent(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}

export function getAgentsByCity(city: string) {
  return agents.filter((agent) => agent.city.toLocaleLowerCase("es") === city.toLocaleLowerCase("es"));
}
