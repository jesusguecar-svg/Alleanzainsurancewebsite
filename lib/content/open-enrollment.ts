/**
 * 2027 Open Enrollment notice for the health pages. Dates are HealthCare.gov / CuidadoDeSalud.gov's
 * (Dates and deadlines page, checked 2026-11-10): Open Enrollment runs Nov 1, 2026 to Jan 15, 2027; choose a
 * plan by Dec 15 for coverage starting Jan 1; Dec 16 to Jan 15 gives Feb 1. Coverage starts only once the
 * first premium is paid, and states with their own marketplace may set other dates, so the note says both.
 *
 * Each phase ends at 23:59 Pacific time on its deadline (08:00 UTC the next day), so no reader in the
 * continental US sees a deadline that has already passed for them. Outside Open Enrollment no notice is shown.
 */

export type OpenEnrollmentPhase = "january" | "february";

const phases: ReadonlyArray<{ phase: OpenEnrollmentPhase; startsAt: string; endsAt: string }> = [
  { phase: "january", startsAt: "2026-11-01T00:00:00Z", endsAt: "2026-12-16T08:00:00Z" },
  { phase: "february", startsAt: "2026-12-16T08:00:00Z", endsAt: "2027-01-16T08:00:00Z" },
];

export function openEnrollmentPhase(now: Date = new Date()): OpenEnrollmentPhase | null {
  const time = now.getTime();
  return phases.find(({ startsAt, endsAt }) => time >= Date.parse(startsAt) && time < Date.parse(endsAt))?.phase ?? null;
}

type NoticeCopy = { label: string; message: string; note: string; advisor: string; call: string; whatsapp: string };

export const openEnrollmentCopy: Record<"es" | "en", Record<OpenEnrollmentPhase, NoticeCopy>> = {
  es: {
    january: {
      label: "Inscripción abierta 2027",
      message: "Elige tu plan a más tardar el 15 de diciembre para que tu cobertura empiece el 1 de enero.",
      note: "En los estados que usan CuidadoDeSalud.gov. La cobertura empieza cuando pagas la primera prima. Algunos estados con mercado propio tienen otras fechas.",
      advisor: "Hablar con un asesor",
      call: "Llamar",
      whatsapp: "WhatsApp",
    },
    february: {
      label: "Inscripción abierta 2027",
      message: "Aún puedes inscribirte: elige tu plan a más tardar el 15 de enero para que tu cobertura empiece el 1 de febrero.",
      note: "En los estados que usan CuidadoDeSalud.gov. La cobertura empieza cuando pagas la primera prima. Algunos estados con mercado propio tienen otras fechas.",
      advisor: "Hablar con un asesor",
      call: "Llamar",
      whatsapp: "WhatsApp",
    },
  },
  en: {
    january: {
      label: "2027 Open Enrollment",
      message: "Choose your plan by December 15 for coverage that starts January 1.",
      note: "In states that use HealthCare.gov. Coverage starts once you pay your first premium. Some states with their own marketplace have different dates.",
      advisor: "Talk to an advisor",
      call: "Call",
      whatsapp: "WhatsApp",
    },
    february: {
      label: "2027 Open Enrollment",
      message: "You can still enroll: choose your plan by January 15 for coverage that starts February 1.",
      note: "In states that use HealthCare.gov. Coverage starts once you pay your first premium. Some states with their own marketplace have different dates.",
      advisor: "Talk to an advisor",
      call: "Call",
      whatsapp: "WhatsApp",
    },
  },
};
