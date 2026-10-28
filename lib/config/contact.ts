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

/**
 * Public phone hierarchy (management decision, 2026-10-28): one corporate line labelled
 * "Teléfono" and one WhatsApp line labelled "WhatsApp". The former (786) 757-5553,
 * (682) 248-1234 and (817) 966-4347 lines are no longer shown in public navigation, footer
 * or contact areas; a page that needs one must document the operational reason.
 */
export const primaryPhone: Phone = { label: "+1 (786) 451 1599", href: "+17864511599" };

/** Alleanza Health WhatsApp line. Use for wa.me links, never as the "Teléfono" line. */
export const whatsappPhone: Phone = { label: "+1 (214) 997 4650", href: "+12149974650" };

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${whatsappPhone.href.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** The two public contact lines, labelled, in the order footers and contact blocks show them. */
export const publicContactLines = [
  { id: "phone", label: "Teléfono", labelEn: "Phone", display: primaryPhone.label, href: `tel:${primaryPhone.href}`, external: false },
  { id: "whatsapp", label: "WhatsApp", labelEn: "WhatsApp", display: whatsappPhone.label, href: whatsappUrl(), external: true },
] as const;

/** Kept for existing callers: `phones[0]` is the primary corporate line. */
export const phones: Phone[] = [primaryPhone];

export const academyUrl = "https://licencia.alleanzainsurance.org";

/** Inbox that receives every website form submission. */
export const leadInbox = "info@alleanzainsurance.org";

/**
 * Verified Resend sending domain, used when `RESEND_SENDING_DOMAIN` is not set.
 * Form emails are only sent from addresses on the configured domain.
 */
export const defaultEmailSendingDomain = "forms.alleanzainsurance.org";
