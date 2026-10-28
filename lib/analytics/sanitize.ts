/**
 * Pure helpers shared by the browser and the lead API routes. Anything that leaves the visitor's
 * browser for analytics, or lands in the internal lead email as attribution, passes through here.
 */

const controlChars = /[\u0000-\u001f\u007f]/g;
const emailLike = /@/;
/** Seven or more digits, allowing phone separators: phone numbers, SSN/ITIN, long IDs. */
const numberLike = /\d(?:[\s().\-/]?\d){6,}/;

/** Short free text (UTM values): trimmed, length-limited, and dropped if it looks like PII. */
export function safeText(value: unknown, max = 100): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.normalize("NFKC").replace(controlChars, "").replace(/\s+/g, " ").trim().slice(0, max);
  if (!text || emailLike.test(text) || numberLike.test(text)) return undefined;
  return text;
}

/** A same-site pathname with no query string or fragment, e.g. "/health". */
export function safePath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const path = value.split(/[?#]/)[0].slice(0, 200);
  if (!/^\/[\w\-./]*$/.test(path) || numberLike.test(path)) return undefined;
  return path;
}

/** The host of a referrer URL (or a bare host), never its path or query. */
export function safeHost(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  let host: string;
  try {
    host = new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return undefined;
  }
  host = host.toLowerCase().slice(0, 100);
  return /^[a-z0-9.-]+$/.test(host) ? host : undefined;
}

export const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** A URL reduced to origin + path + recognised UTM parameters; every other parameter and the fragment are dropped. */
export function cleanUrl(value: string): string {
  try {
    const url = new URL(value);
    const kept = new URLSearchParams();
    for (const key of utmKeys) {
      const v = safeText(url.searchParams.get(key));
      if (v) kept.set(key, v);
    }
    const query = kept.toString();
    return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return "";
  }
}
