import { NextResponse } from "next/server";
import { leadInbox } from "@/lib/config/contact";
import { consentText, honeypotFieldName, validateContact, type ContactRequest } from "@/lib/content/contact";
import { products } from "@/lib/content/products";
import { emailConfigured, sendEmail, senderFor } from "@/lib/server/email";
import { allowSend, isCrossOrigin, maxFormBodyBytes } from "@/lib/server/form-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sendFailed = "No pudimos enviar tu solicitud. Intenta de nuevo.";

/** The page the form was sent from: the path the form reports, else the same-origin Referer. */
function sourcePage(request: Request, reported: unknown) {
  if (typeof reported === "string" && /^\/[\w\-./]{0,199}$/.test(reported)) return reported;
  try {
    const referer = new URL(request.headers.get("referer") ?? "");
    if (referer.origin === new URL(request.url).origin) return referer.pathname;
  } catch {}
  return "desconocida";
}

/**
 * Emails each lead to the agency inbox through Resend, from the verified
 * sending domain, with the visitor's address as Reply-To. The form carries
 * personal contact details, so it refuses submissions (503) until Resend is
 * configured rather than collecting data it has nowhere to deliver.
 */
export async function POST(request: Request) {
  if (isCrossOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!emailConfigured("contact")) {
    console.error("RESEND_API_KEY or the contact sender is not configured; refusing to accept submissions.");
    return NextResponse.json(
      { error: "El formulario todavía no está disponible. Intenta más tarde." },
      { status: 503 },
    );
  }

  let payload: Partial<ContactRequest> & Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > maxFormBodyBytes) {
      return NextResponse.json({ error: "La solicitud es demasiado grande." }, { status: 413 });
    }
    payload = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error();
    for (const field of ["name", "phone", "email", "productId", "message", "source"]) {
      if (payload[field] !== undefined && typeof payload[field] !== "string") throw new Error();
    }
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const honeypot = payload[honeypotFieldName];
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  if (!allowSend(request, "contact")) {
    return NextResponse.json(
      { error: "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por correo." },
      { status: 429 },
    );
  }

  const email = payload.email?.trim() || undefined;
  const product = products.find((p) => p.id === payload.productId)?.name ?? "Orientación general";
  const page = sourcePage(request, payload.source);
  const sent = await sendEmail({
    from: senderFor("contact")!,
    to: [leadInbox],
    replyTo: email,
    subject: `Nuevo contacto web: ${product}`,
    text: [
      "Solicitud desde el formulario de contacto de alleanzainsurance.org",
      "",
      `Nombre: ${payload.name?.trim()}`,
      `Correo: ${email ?? "no proporcionado"}`,
      `Teléfono: ${payload.phone?.trim()}`,
      `Interés: ${product}`,
      `Página: ${page}`,
      `Fecha: ${new Date().toISOString()}`,
      "",
      "Mensaje:",
      payload.message?.trim() || "(sin mensaje)",
      "",
      `Consentimiento: ${consentText}`,
    ].join("\n"),
  });

  if (!sent) return NextResponse.json({ error: sendFailed }, { status: 502 });
  return NextResponse.json({ ok: true });
}
