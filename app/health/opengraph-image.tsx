import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance — El seguro médico es confuso. Nosotros te lo explicamos.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "El seguro médico es confuso.",
    accent: "Nosotros te lo explicamos.",
    subtitle: "Obamacare (ACA), seguro privado y protección complementaria, en español.",
  });
}
