/**
 * Operational business details: where the office is, when it is open, and how
 * to reach it.
 *
 * These are distinct from `companyFacts` in ./company.ts. That file gates
 * *marketing claims* — counts, years, awards — behind explicit verification.
 * The values here are plain operational facts supplied by the business, so
 * they are rendered directly. Do not add claim-shaped values (number of
 * clients, years of experience, satisfaction rates) to this file; those belong
 * in `companyFacts` and stay hidden until verified.
 */

export type Phone = {
  /** Display form, as written for a Spanish-speaking reader. */
  label: string;
  /** E.164, for the tel: href. */
  href: string;
};

export const office = {
  street: "3424 Midcourt Rd, Suite 122",
  city: "Carrollton",
  state: "TX",
  postalCode: "75006",
} as const;

export const officeAddressLines = [
  office.street,
  `${office.city}, ${office.state} ${office.postalCode}`,
] as const;

export const officeHours = [
  { days: "Lunes a viernes", hours: "8:00 – 19:00" },
  { days: "Sábado", hours: "10:00 – 17:00" },
] as const;

export const phones: Phone[] = [
  { label: "+1 (786) 451 1599", href: "+17864511599" },
  { label: "+1 (786) 757 5553", href: "+17867575553" },
  { label: "+1 (682) 248 1234", href: "+16822481234" },
  { label: "+1 (817) 966 4347", href: "+18179664347" },
];

export const academyUrl = "https://academia.alleanzainsurance.org";
