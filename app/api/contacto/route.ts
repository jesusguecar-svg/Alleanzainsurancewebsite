import { NextResponse } from "next/server";
import { validateContact, type ContactRequest } from "@/lib/content/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Destination for submitted leads. Deliberately not NEXT_PUBLIC_, so the
 * endpoint is never exposed to the browser: submissions are relayed
 * server-side. The form carries personal contact details, so the site refuses
 * to accept submissions until a destination is configured rather than
 * collecting data it has nowhere to deliver.
 */
const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

export async function POST(request: Request) {
  if (!webhookUrl) {
    console.error("CONTACT_WEBHOOK_URL is not configured; refusing to accept submissions.");
    return NextResponse.json(
      { error: "El formulario todavía no está disponible. Intenta más tarde." },
      { status: 503 },
    );
  }

  let payload: Partial<ContactRequest> & { website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: a hidden field real people never fill in.
  if (payload.website) return NextResponse.json({ ok: true });

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: payload.name?.trim(),
        phone: payload.phone?.trim(),
        email: payload.email?.trim() || undefined,
        productId: payload.productId || undefined,
        message: payload.message?.trim() || undefined,
        consent: true,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // Status only — the body may echo back the submitted personal details.
      console.error(`Contact webhook rejected submission with status ${response.status}`);
      return NextResponse.json(
        { error: "No pudimos enviar tu solicitud. Intenta de nuevo." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Contact webhook request failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "No pudimos enviar tu solicitud. Intenta de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
