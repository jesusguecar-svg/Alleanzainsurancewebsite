import { emailSendingDomain } from "@/lib/config/contact";

export type FormSender = "contact" | "health";

/**
 * The From address for a form's notification email. One shared identity
 * (`RESEND_FROM`) covers both forms; `CONTACT_FROM` / `HEALTH_CONTACT_FROM`
 * override it only if a form needs its own. The address must be on the
 * verified Resend domain — never the visitor's address, which goes in
 * Reply-To instead — so anything else is treated as not configured.
 */
export function senderFor(form: FormSender): string | undefined {
  const specific = form === "health" ? process.env.HEALTH_CONTACT_FROM : process.env.CONTACT_FROM;
  const from = (specific || process.env.RESEND_FROM)?.trim();
  if (!from) return undefined;
  const address = from.match(/<([^<>\s]+)>\s*$/)?.[1] ?? from;
  if (address.split("@")[1]?.toLowerCase() !== emailSendingDomain) {
    console.error(`Sender for the ${form} form is not on ${emailSendingDomain}; refusing to send.`);
    return undefined;
  }
  return from;
}

export function emailConfigured(form: FormSender) {
  return Boolean(process.env.RESEND_API_KEY && senderFor(form));
}

type Email = { from: string; to: string[]; replyTo?: string; subject: string; text: string };

/**
 * Sends through the Resend API. Returns true only when Resend accepted the
 * message and returned its id. Errors are logged by status only: the response
 * body can echo the submitted personal details.
 */
export async function sendEmail({ from, to, replyTo, subject, text }: Email): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: replyTo || undefined, subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`Resend rejected the email with status ${response.status}`);
      return false;
    }
    const receipt = await response.json().catch(() => null);
    return Boolean(receipt?.id);
  } catch (error) {
    console.error("Resend request failed:", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}
