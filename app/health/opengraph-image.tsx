import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — El seguro médico es confuso. Te ayudamos a entenderlo.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "El seguro médico es confuso.",
    accent: "Nosotros te lo explicamos.",
    subtitle: "Obamacare (ACA), seguro privado y protección complementaria, en español.",
  });
}
