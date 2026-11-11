import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Compara tus opciones. Te ayudamos a entenderlas.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Compara tus opciones.",
    accent: "Te ayudamos a entenderlas.",
    subtitle: "Obamacare (ACA), seguro privado y protección complementaria, en español.",
  });
}
