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

export const legalName = "Alleanza Insurance Corp.";

export const officeCountry = "US";

export const officeAddressLines = [
  office.street,
  `${office.city}, ${office.state} ${office.postalCode}`,
] as const;

/** The office schedule. Display hours and structured data are all derived from this. */
export const officeSchedule = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00", days: "Lunes a viernes", daysEn: "Monday–Friday" },
  { dayOfWeek: ["Saturday"], opens: "10:00", closes: "17:00", days: "Sábado", daysEn: "Saturday" },
] as const;

const time24 = (time: string) => time.replace(/^0/, "");

function time12(time: string) {
  const [hour, minutes] = time.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minutes).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

export const officeHours = officeSchedule.map(({ days, opens, closes }) => ({
  days,
  hours: `${time24(opens)} – ${time24(closes)}`,
}));

export const officeHoursEn = officeSchedule.map(({ daysEn, opens, closes }) => ({
  days: daysEn,
  hours: `${time12(opens)}–${time12(closes)}`,
}));

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
