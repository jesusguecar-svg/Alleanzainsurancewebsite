import { sanitizeLeadAttribution, type Touch } from "@/lib/analytics/attribution";

/**
 * The "Atribución" block of the internal lead email. Input is untrusted browser data: every field
 * is re-sanitized and length-limited here, and nothing from it is ever shown publicly.
 */
export function attributionEmailLines(input: unknown): string[] {
  const attribution = sanitizeLeadAttribution(input);
  const value = (text?: string) => text ?? "—";
  const touch = (label: string, t?: Touch) => [
    `- ${label} fuente: ${value(t?.source)}`,
    `- ${label} medio: ${value(t?.medium)}`,
    `- ${label} campaña: ${value(t?.campaign)}`,
    ...(t?.content ? [`- ${label} contenido: ${t.content}`] : []),
    ...(t?.term ? [`- ${label} término: ${t.term}`] : []),
    `- ${label} página de llegada: ${value(t?.landing_page)}`,
  ];
  return [
    "Atribución (uso interno)",
    ...(attribution?.consent === "granted"
      ? touch("Primera", attribution.first)
      : ["- Primer contacto: no disponible (el visitante no aceptó la medición)"]),
    ...touch("Última", attribution?.last),
    `- Referente: ${value(attribution?.referrer)}`,
  ];
}
