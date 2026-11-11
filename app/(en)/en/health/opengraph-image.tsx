import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Compare your options. Understand them.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Compare your options.",
    accent: "We help you understand.",
    subtitle: "Obamacare (ACA), private health, and supplemental protection in English or Spanish.",
  });
}
