import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Health insurance, explained clearly.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Health insurance can be confusing.",
    accent: "We make it clear.",
    subtitle: "Obamacare (ACA), private health, and supplemental protection in English or Spanish.",
  });
}
