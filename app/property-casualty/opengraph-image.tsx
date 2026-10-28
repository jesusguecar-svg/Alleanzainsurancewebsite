import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Property & Casualty, próximamente.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Property & Casualty",
    accent: "Próximamente.",
    subtitle: "En desarrollo. Sujeto a licencias y disponibilidad.",
  });
}
