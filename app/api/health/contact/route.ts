import { NextResponse } from "next/server";
import { healthEmail, healthServices, healthServicesEn, validateHealthLead } from "@/lib/content/health";
import { consentText, consentTextEn } from "@/lib/content/contact";
import states from "@/components/health/us-states.json";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Do not allow another browser origin to use this endpoint as a mail relay.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 6000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const { lead, error } = validateHealthLead(input);
  if (!lead) return NextResponse.json({ error }, { status: 422 });
  const english = lead.locale === "en";
  const state = states.find(s => s.id === lead.state);
  if (!state) return NextResponse.json({ error: english ? "Select a valid state." : "Selecciona un estado válido." }, { status: 422 });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.HEALTH_CONTACT_FROM;
  if (!key || !from) return NextResponse.json({ error: english ? "Direct submission is unavailable right now. You can send your request by email or WhatsApp." : "El envío directo no está disponible en este momento. Puedes enviarnos tu solicitud por correo o WhatsApp." }, { status: 503 });
  const services = english ? healthServicesEn : healthServices;
  const service = lead.service === "review" ? (english ? "Existing coverage review" : "Revisión de cobertura existente") : services.find(s => s.id === lead.service)?.title ?? (english ? "General guidance" : "Orientación general");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [healthEmail], reply_to: lead.email, subject: `Nueva solicitud de salud: ${service}`, text: `Solicitud desde Alleanza ${english ? "/en/health" : "/health"}\n\nNombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nEstado: ${state.name}\nInterés: ${service}\nIdioma: ${english ? "English" : "Español"}\n\nConsentimiento: ${english ? consentTextEn : consentText}\nFecha: ${new Date().toISOString()}` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return NextResponse.json({ error: english ? "We could not send your request. Try again or contact us directly." : "No pudimos enviar tu solicitud. Inténtalo otra vez o contáctanos directamente." }, { status: 502 });
    const receipt = await response.json();
    if (!receipt.id) return NextResponse.json({ error: english ? "We could not confirm submission. Please contact us directly." : "No pudimos confirmar el envío. Contáctanos directamente." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: english ? "We could not connect to the email service. Please try again." : "No pudimos conectar con el servicio de correo. Inténtalo otra vez." }, { status: 502 }); }
}
