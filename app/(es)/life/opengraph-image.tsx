import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — El seguro de vida no debería ser un misterio.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "El seguro de vida",
    accent: "no debería ser un misterio.",
    subtitle: "Temporal, permanente y gastos finales, explicados en español.",
  });
}
