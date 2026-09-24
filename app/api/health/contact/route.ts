import { NextResponse } from "next/server";
import { healthEmail, healthServices, validateHealthLead } from "@/lib/content/health";
import { consentText } from "@/lib/content/contact";
import states from "@/components/health/us-states.json";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Do not allow another browser origin to use this endpoint as a mail relay.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 6000) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 }); }
  const { lead, error } = validateHealthLead(input);
  if (!lead) return NextResponse.json({ error }, { status: 422 });
  const state = states.find(s => s.id === lead.state);
  if (!state) return NextResponse.json({ error: "Selecciona un estado válido." }, { status: 422 });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.HEALTH_CONTACT_FROM;
  if (!key || !from) return NextResponse.json({ error: "El envío directo no está disponible en este momento. Puedes enviarnos tu solicitud por correo o WhatsApp." }, { status: 503 });
  const service = lead.service === "review" ? "Revisión de cobertura existente" : healthServices.find(s => s.id === lead.service)?.title ?? "Orientación general";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [healthEmail], reply_to: lead.email, subject: `Nueva solicitud de salud: ${service}`, text: `Solicitud desde Alleanza /health\n\nNombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nEstado: ${state.name}\nInterés: ${service}\n\nConsentimiento: ${consentText}\nFecha: ${new Date().toISOString()}` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return NextResponse.json({ error: "No pudimos enviar tu solicitud. Inténtalo otra vez o contáctanos directamente." }, { status: 502 });
    const receipt = await response.json();
    if (!receipt.id) return NextResponse.json({ error: "No pudimos confirmar el envío. Contáctanos directamente." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "No pudimos conectar con el servicio de correo. Inténtalo otra vez." }, { status: 502 }); }
}
