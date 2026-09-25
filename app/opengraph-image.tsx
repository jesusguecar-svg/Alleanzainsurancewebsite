import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Alleanza Insurance Corp. — Conoce tus opciones y decide con claridad.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderOgCard({
    headline: "Elige el camino correcto",
    accent: "para proteger lo que más importa.",
    subtitle: "Salud, vida, propiedad, academia y carrera. En español.",
  });
}
