/** Largest JSON body either form legitimately sends (the message caps at 2,000 characters). */
export const maxFormBodyBytes = 8_000;

/** Rejects posts from another site's pages, so the endpoints cannot be used as a mail relay. */
export function isCrossOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin !== new URL(request.url).origin);
}

const windowMs = 10 * 60_000;
const maxSendsPerWindow = 5;
const sends = new Map<string, number[]>();

/**
 * Best-effort cap on emails sent per client IP: 5 per 10 minutes per form.
 * The counts live in this server instance's memory, so they reset on a cold
 * start and are not shared between instances. That stops a single client
 * hammering the form; a distributed flood needs a Vercel Firewall rate-limit
 * rule (see docs/migration/cutover-plan.md). Only valid submissions count, so
 * a visitor fixing a typo is not penalized.
 */
export function allowSend(request: Request, form: string) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (sends.get(key) ?? []).filter((at) => now - at < windowMs);
  if (recent.length >= maxSendsPerWindow) {
    sends.set(key, recent);
    return false;
  }
  recent.push(now);
  sends.set(key, recent);
  if (sends.size > 5_000) {
    for (const [k, times] of sends) if (times.every((at) => now - at >= windowMs)) sends.delete(k);
  }
  return true;
}
