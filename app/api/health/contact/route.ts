import { NextResponse } from "next/server";
import { healthEmail, healthServices, healthServicesEn, validateHealthLead } from "@/lib/content/health";
import { consentText, consentTextEn } from "@/lib/content/contact";
import states from "@/components/health/us-states.json";
import { attributionEmailLines } from "@/lib/server/attribution";
import { emailConfigured, sendEmail, senderFor } from "@/lib/server/email";
import { allowSend, isCrossOrigin, maxFormBodyBytes } from "@/lib/server/form-guard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Do not allow another browser origin to use this endpoint as a mail relay.
  if (isCrossOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > maxFormBodyBytes) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const { lead, error } = validateHealthLead(input);
  if (!lead) return NextResponse.json({ error }, { status: 422 });
  const english = lead.locale === "en";
  const state = states.find(s => s.id === lead.state);
  if (!state) return NextResponse.json({ error: english ? "Select a valid state." : "Selecciona un estado válido." }, { status: 422 });
  if (!emailConfigured("health")) return NextResponse.json({ error: english ? "Direct submission is unavailable right now. You can send your request by email or WhatsApp." : "El envío directo no está disponible en este momento. Puedes enviarnos tu solicitud por correo o WhatsApp." }, { status: 503 });
  if (!allowSend(request, "health")) return NextResponse.json({ error: english ? "We received several requests in a row. Please wait a few minutes or email us." : "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por correo." }, { status: 429 });
  const services = english ? healthServicesEn : healthServices;
  const service = lead.service === "review" ? (english ? "Existing coverage review" : "Revisión de cobertura existente") : services.find(s => s.id === lead.service)?.title ?? (english ? "General guidance" : "Orientación general");
  const sent = await sendEmail({
    from: senderFor("health")!, to: [healthEmail], replyTo: lead.email, subject: `Nueva solicitud de salud: ${service}`,
    text: `Solicitud desde Alleanza ${english ? "/en/health" : "/health"}\n\nNombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nEstado: ${state.name}\nInterés: ${service}\nIdioma: ${english ? "English" : "Español"}\n\nConsentimiento: ${english ? consentTextEn : consentText}\nFecha: ${new Date().toISOString()}\n\n${attributionEmailLines((input as { attribution?: unknown }).attribution).join("\n")}`,
  });
  if (!sent) return NextResponse.json({ error: english ? "We could not send your request. Try again or contact us directly." : "No pudimos enviar tu solicitud. Inténtalo otra vez o contáctanos directamente." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
