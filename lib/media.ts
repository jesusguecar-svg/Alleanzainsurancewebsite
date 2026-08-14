import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Slots reserved for future media. Nothing here ships yet — drop a file at the
 * documented path and it starts rendering with no code change.
 *
 * Availability is resolved on the server at build time, so a missing file
 * simply renders the branded fallback instead of firing a 404 in the browser.
 * Never let a missing asset block or break a page.
 */
export type MediaSlotId =
  | "health-hero"
  | "health-concepts"
  | "health-coverage-aca"
  | "health-process"
  | "health-consultation";

type MediaDefinition = {
  /** Poster/still image, relative to /public. */
  image: string;
  /** Optional motion file; used in preference to the still when present. */
  video?: string;
  /** Describes the intended content, and doubles as the alt text. */
  description: string;
};

export const mediaSlots: Record<MediaSlotId, MediaDefinition> = {
  "health-hero": {
    image: "/media/health/hero-remote-consultation.webp",
    video: "/media/health/hero-remote-consultation.mp4",
    description: "Asesoría de seguros de salud por videollamada, en español.",
  },
  "health-concepts": {
    image: "/media/health/coverage-life-health-card.webp",
    description: "Tarjeta de seguro con deducible, copago y máximo de bolsillo.",
  },
  "health-coverage-aca": {
    image: "/media/health/coverage-aca.webp",
    description: "Comparación de planes del Mercado de Salud.",
  },
  "health-process": {
    image: "/media/health/process-clarity.webp",
    video: "/media/health/process-clarity.webm",
    description: "Proceso de orientación paso a paso.",
  },
  "health-consultation": {
    image: "/media/health/contact-remote-consultation.webp",
    description: "Consulta remota con un agente de seguros con licencia.",
  },
};

export type ResolvedMedia = {
  image: string | null;
  video: string | null;
  description: string;
};

/**
 * Resolve a slot against the filesystem. Server-only — call from a server
 * component and pass the result down, so client components never probe for
 * files that do not exist.
 */
export function resolveMedia(id: MediaSlotId): ResolvedMedia {
  const slot = mediaSlots[id];
  const publicDir = path.join(process.cwd(), "public");
  const exists = (p?: string) => (p && existsSync(path.join(publicDir, p)) ? p : null);

  return {
    image: exists(slot.image),
    video: exists(slot.video),
    description: slot.description,
  };
}
