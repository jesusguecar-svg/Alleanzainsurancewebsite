export const healthEmail = "jesusg@alleanzainsurance.org";
// Office locations and nationwide coverage supplied by the business on 2026-09-24.
export const healthOffices = [
  { city: "Houston", state: "Texas", stateId: "48", coordinates: [-95.3698, 29.7604] },
  { city: "Dallas", state: "Texas", stateId: "48", coordinates: [-96.797, 32.7767] },
  { city: "El Paso", state: "Texas", stateId: "48", coordinates: [-106.485, 31.7619] },
  { city: "Atlanta", state: "Georgia", stateId: "13", coordinates: [-84.388, 33.749] },
  { city: "Miami", state: "Florida", stateId: "12", coordinates: [-80.1918, 25.7617] },
  { city: "Orlando", state: "Florida", stateId: "12", coordinates: [-81.3792, 28.5383] },
  { city: "Columbus", state: "Ohio", stateId: "39", coordinates: [-82.9988, 39.9612] },
  // State-level reference, not a fabricated city or street address.
  { city: "Utah", state: "Utah", stateId: "49", coordinates: [-111.6, 39.3] },
] as const;

export const healthServices = [
  { id: "aca", title: "ACA / Obamacare", short: "Tu salud, con un plan.", description: "Te acompañamos a comparar planes del Mercado de Seguros Médicos y revisar si calificas para ayuda con el costo de tu cobertura.", details: ["Revisión de médicos y medicamentos", "Deducibles y costos explicados", "Orientación para tu inscripción"], icon: "heart" },
  { id: "private", title: "Seguro médico privado", short: "Más opciones. Tu decisión.", description: "Exploramos alternativas fuera del Marketplace según lo que necesitas, tu presupuesto y los planes disponibles en tu estado.", details: ["Comparación de redes y beneficios", "Claridad sobre límites y exclusiones", "Asesoría para elegir con confianza"], icon: "shield" },
  { id: "dental", title: "Dental y visión", short: "Sonríe. Mira hacia adelante.", description: "Cuida los detalles que hacen mejor tu día. Te ayudamos a encontrar opciones para tu salud dental y el cuidado de tu vista.", details: ["Opciones de atención preventiva", "Planes dentales y de visión", "Revisión de red y períodos de espera"], icon: "eye" },
  { id: "supplemental", title: "Protección complementaria", short: "Un respaldo extra para ti.", description: "Un accidente o una enfermedad pueden cambiar tus planes. Conoce las coberturas que pueden brindarte beneficios económicos ante un evento cubierto.", details: ["Accidentes y cáncer", "Derrame cerebral (stroke)", "Indemnización hospitalaria"], icon: "plus" },
] as const;

export type HealthServiceId = typeof healthServices[number]["id"];
export type HealthLead = { name: string; email: string; phone: string; state: string; service: string; consent: boolean; company_fax_hp?: string };

export function validateHealthLead(value: unknown): { lead?: HealthLead; error?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { error: "Revisa los datos de tu solicitud." };
  const v = value as Record<string, unknown>;
  for (const key of ["name", "email", "phone", "state", "service"]) {
    if (typeof v[key] !== "string" || (v[key] as string).length > 180) return { error: "Revisa los datos de tu solicitud." };
  }
  const lead = { name: (v.name as string).trim(), email: (v.email as string).trim(), phone: (v.phone as string).trim(), state: v.state as string, service: v.service as string, consent: v.consent === true };
  if (lead.name.length < 2) return { error: "Escribe tu nombre completo." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: "Revisa tu correo electrónico." };
  if (!/^[\d\s()+.-]{7,30}$/.test(lead.phone) || lead.phone.replace(/\D/g, "").length < 7) return { error: "Revisa tu teléfono." };
  if (!/^\d{2}$/.test(lead.state)) return { error: "Selecciona tu estado." };
  if (lead.service !== "guidance" && !healthServices.some(s => s.id === lead.service)) return { error: "Selecciona una cobertura." };
  if (!lead.consent) return { error: "Necesitamos tu autorización para contactarte." };
  if (v.company_fax_hp) return { error: "No pudimos procesar esta solicitud." };
  return { lead };
}
