import { NextResponse } from "next/server";
import { leadInbox } from "@/lib/config/contact";
import { consentText, honeypotFieldName, validateContact, type ContactRequest } from "@/lib/content/contact";
import { products } from "@/lib/content/products";
import { attributionEmailLines } from "@/lib/server/attribution";
import { emailConfigured, sendEmail, senderFor } from "@/lib/server/email";
import { allowSend, isCrossOrigin, maxFormBodyBytes } from "@/lib/server/form-guard";
import { alreadyDelivered, deliverLeadOnce, submissionKey, type Lead } from "@/lib/server/lead-intake";
import { ledgerLeadRecord, recordLeadInLedger } from "@/lib/server/lead-ledger";

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
 *
 * Insurance leads (the contact and employer forms) get an internal lead ID in
 * the email and a PII-free record in the lead ledger. /work recruiting
 * applications use the same form but are not insurance leads: no ID, no ledger.
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
    for (const field of ["name", "phone", "email", "productId", "message", "source", "form_type", "product_line", "submission_id"]) {
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

  const email = payload.email?.trim() || undefined;
  const product = products.find((p) => p.id === payload.productId);
  const productName = product?.name ?? "Orientación general";
  const page = sourcePage(request, payload.source);
  const recruiting = payload.form_type === "work" || page === "/work" || page.startsWith("/work/");
  const key = recruiting ? undefined : submissionKey(payload.submission_id);

  // A retry of a lead that already reached the inbox is answered without counting against the limit.
  if (!alreadyDelivered(key) && !allowSend(request, "contact")) {
    return NextResponse.json(
      { error: "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por correo." },
      { status: 429 },
    );
  }

  const send = (lead?: Lead) =>
    sendEmail({
      from: senderFor("contact")!,
      to: [leadInbox],
      replyTo: email,
      subject: `Nuevo contacto web: ${productName}${lead ? ` · ${lead.id}` : ""}`,
      text: [
        ...(lead ? [`ID de lead: ${lead.id}`, ""] : []),
        "Solicitud desde el formulario de contacto de alleanzainsurance.org",
        "",
        `Nombre: ${payload.name?.trim()}`,
        `Correo: ${email ?? "no proporcionado"}`,
        `Teléfono: ${payload.phone?.trim()}`,
        `Interés: ${productName}`,
        `Página: ${page}`,
        `Fecha: ${lead?.createdAt ?? new Date().toISOString()}`,
        "",
        "Mensaje:",
        payload.message?.trim() || "(sin mensaje)",
        "",
        `Consentimiento: ${consentText}`,
        "",
        ...attributionEmailLines(payload.attribution),
      ].join("\n"),
    });

  if (recruiting) {
    if (!(await send())) return NextResponse.json({ error: sendFailed }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  const { lead, delivered, replayed } = await deliverLeadOnce(key, send);
  if (!delivered) return NextResponse.json({ error: sendFailed }, { status: 502 });
  if (!replayed) {
    recordLeadInLedger(
      ledgerLeadRecord({
        lead,
        formType: "contact",
        productLine: product?.line ?? payload.product_line,
        language: page === "/en" || page.startsWith("/en/") || page.startsWith("/employers") ? "en" : "es",
        attribution: payload.attribution,
      }),
    );
  }
  // The lead ID stays server-side: it is never returned to the browser.
  return NextResponse.json({ ok: true });
}
