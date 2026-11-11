/**
 * 2027 Open Enrollment notice for the health pages. Dates are HealthCare.gov / CuidadoDeSalud.gov's
 * (Dates and deadlines page, checked 2026-11-10): Open Enrollment runs Nov 1, 2026 to Jan 15, 2027; choose a
 * plan by Dec 15 for coverage starting Jan 1; Dec 16 to Jan 15 gives Feb 1. Coverage starts only once the
 * first premium is paid, so the note says so. HealthCare.gov states only the federal dates (re-checked 2026-11-11), so for
 * states with their own marketplace the note asks readers to confirm dates there instead of asserting other dates.
 * The Spanish copy says "a más tardar el 15 de diciembre": CuidadoDeSalud.gov calls Dec 15 the "último día" and
 * HealthCare.gov says "by December 15", so the deadline is inclusive.
 *
 * The phase follows the reader's own calendar date: "by December 15" is shown through 11:59 PM on December 15
 * wherever the reader is, and the February message from their December 16 (likewise January 15/16). The server
 * cannot know the reader's time zone, so while US time zones fall on different sides of a deadline (midnight Eastern to midnight
 * Hawaii) it renders no notice and the browser fills in the reader's phase after loading. A page left open
 * re-checks at the reader's local midnight and when the tab becomes visible again.
 */

export type OpenEnrollmentPhase = "january" | "february";

/** Published 2027 Open Enrollment dates (YYYY-MM-DD, inclusive), HealthCare.gov / CuidadoDeSalud.gov. */
export const openEnrollmentDates = { start: "2026-11-01", januaryCoverageDeadline: "2026-12-15", end: "2027-01-15" } as const;

/** Phase for a calendar date (YYYY-MM-DD); null outside Open Enrollment. */
export function openEnrollmentPhaseForDate(date: string): OpenEnrollmentPhase | null {
  if (date < openEnrollmentDates.start || date > openEnrollmentDates.end) return null;
  return date <= openEnrollmentDates.januaryCoverageDeadline ? "january" : "february";
}

/** Calendar date (YYYY-MM-DD) of an instant in a time zone; the runtime's own zone when none is given. */
export function calendarDate(now: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** The reader's phase, from the browser's own time zone. */
export function readerOpenEnrollmentPhase(now: Date = new Date()) {
  return openEnrollmentPhaseForDate(calendarDate(now));
}

/** Earliest and latest US time zones with HealthCare.gov states (Eastern, Hawaii-Aleutian). */
const usZoneBounds = ["America/New_York", "Pacific/Honolulu"] as const;

/**
 * Phase the server can render without knowing the reader's zone: the phase when every US zone agrees,
 * "pending" while they straddle a boundary date (the browser then decides), null outside Open Enrollment.
 */
export function serverOpenEnrollmentPhase(now: Date = new Date()): OpenEnrollmentPhase | null | "pending" {
  const [east, west] = usZoneBounds.map((zone) => openEnrollmentPhaseForDate(calendarDate(now, zone)));
  return east === west ? east : "pending";
}

type NoticeCopy = { label: string; message: string; note: string; advisor: string; call: string; whatsapp: string };

export const openEnrollmentCopy: Record<"es" | "en", Record<OpenEnrollmentPhase, NoticeCopy>> = {
  es: {
    january: {
      label: "Inscripción abierta 2027",
      message: "Elige tu plan a más tardar el 15 de diciembre para que tu cobertura empiece el 1 de enero.",
      note: "En los estados que usan CuidadoDeSalud.gov. La cobertura empieza cuando pagas la primera prima. Si tu estado tiene su propio mercado, confirma las fechas en su sitio.",
      advisor: "Hablar con un asesor",
      call: "Llamar",
      whatsapp: "WhatsApp",
    },
    february: {
      label: "Inscripción abierta 2027",
      message: "Aún puedes inscribirte: elige tu plan a más tardar el 15 de enero para que tu cobertura empiece el 1 de febrero.",
      note: "En los estados que usan CuidadoDeSalud.gov. La cobertura empieza cuando pagas la primera prima. Si tu estado tiene su propio mercado, confirma las fechas en su sitio.",
      advisor: "Hablar con un asesor",
      call: "Llamar",
      whatsapp: "WhatsApp",
    },
  },
  en: {
    january: {
      label: "2027 Open Enrollment",
      message: "Choose your plan by December 15 for coverage that starts January 1.",
      note: "In states that use HealthCare.gov. Coverage starts once you pay your first premium. If your state runs its own marketplace, confirm the dates on its website.",
      advisor: "Talk to an advisor",
      call: "Call",
      whatsapp: "WhatsApp",
    },
    february: {
      label: "2027 Open Enrollment",
      message: "You can still enroll: choose your plan by January 15 for coverage that starts February 1.",
      note: "In states that use HealthCare.gov. Coverage starts once you pay your first premium. If your state runs its own marketplace, confirm the dates on its website.",
      advisor: "Talk to an advisor",
      call: "Call",
      whatsapp: "WhatsApp",
    },
  },
};
