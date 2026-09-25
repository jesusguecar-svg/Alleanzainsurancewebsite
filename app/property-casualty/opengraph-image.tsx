import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Tu casa y tu auto, explicados con calma.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Tu casa y tu auto",
    accent: "merecen claridad.",
    subtitle: "Hogar, auto, inquilinos y responsabilidad civil, en español.",
  });
}
