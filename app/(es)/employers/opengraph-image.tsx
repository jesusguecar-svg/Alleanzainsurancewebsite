import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Benefits your people can understand.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Benefits your people",
    accent: "can understand.",
    subtitle: "Voluntary supplemental coverage with licensed enrollment support.",
  });
}
