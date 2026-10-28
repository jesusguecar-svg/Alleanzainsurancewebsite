import { attributionMaxAgeMs, attributionStorageKey } from "./config";
import { safeHost, safePath, safeText } from "./sanitize";

/** One marketing touch: where a visit came from. Never holds personal data. */
export type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  landing_page?: string;
};

/**
 * What a lead form sends to its API route. `first` exists only when the visitor allowed analytics
 * (it needs storage across visits); without consent, `last` is just this page load's own touch.
 */
export type LeadAttribution = {
  consent: "granted" | "denied";
  first?: Touch;
  last?: Touch;
  referrer?: string;
};

type StoredTouch = Touch & { at: number };
type StoredAttribution = { v: 1; first: StoredTouch; last: StoredTouch };

const searchEngines: Record<string, string> = { google: "google", bing: "bing", yahoo: "yahoo", duckduckgo: "duckduckgo", ecosia: "ecosia", baidu: "baidu", yandex: "yandex" };
const socialNetworks: Record<string, string> = { facebook: "facebook", fb: "facebook", instagram: "instagram", linkedin: "linkedin", youtube: "youtube", tiktok: "tiktok", "t.co": "x", "x.com": "x", twitter: "x", whatsapp: "whatsapp" };

function known(host: string, table: Record<string, string>) {
  const labels = host.split(".");
  const hit = Object.keys(table).find((key) => (key.includes(".") ? host === key || host.endsWith(`.${key}`) : labels.includes(key)));
  return hit ? table[hit] : undefined;
}

/** The touch a page load represents, or null for direct and same-site visits. */
export function touchFrom(href: string, referrer: string): Touch | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const landing_page = safePath(url.pathname);
  const utm = (key: string) => safeText(url.searchParams.get(key));
  const source = utm("utm_source");
  if (source) {
    return { source, medium: utm("utm_medium") ?? "(not set)", campaign: utm("utm_campaign"), content: utm("utm_content"), term: utm("utm_term"), landing_page };
  }
  const host = safeHost(referrer);
  if (!host || host === url.hostname) return null;
  const engine = known(host, searchEngines);
  if (engine) return { source: engine, medium: "organic", landing_page };
  const social = known(host, socialNetworks);
  if (social) return { source: social, medium: "social", landing_page };
  return { source: host, medium: "referral", landing_page };
}

const directTouch = (landing_page?: string): Touch => ({ source: "(direct)", medium: "(none)", landing_page });

/** Coarse, low-cardinality channel for GA4's `source_group` parameter. */
export function sourceGroup(touch?: Touch): string {
  const medium = touch?.medium ?? "(none)";
  if (medium === "(none)") return "direct";
  if (["cpc", "ppc", "paid_social", "display"].includes(medium)) return "paid";
  if (medium === "agent_link") return "agent";
  if (["organic", "social", "email", "referral", "qr"].includes(medium)) return medium;
  return "other";
}

/** Server-side gatekeeper for attribution received from the browser. */
export function sanitizeLeadAttribution(input: unknown): LeadAttribution | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const raw = input as Record<string, unknown>;
  const touch = (value: unknown): Touch | undefined => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const t = value as Record<string, unknown>;
    const source = safeText(t.source);
    const medium = safeText(t.medium);
    if (!source || !medium) return undefined;
    return { source, medium, campaign: safeText(t.campaign), content: safeText(t.content), term: safeText(t.term), landing_page: safePath(t.landing_page) };
  };
  return {
    consent: raw.consent === "granted" ? "granted" : "denied",
    first: touch(raw.first),
    last: touch(raw.last),
    referrer: safeHost(raw.referrer),
  };
}

// --- Browser state ---------------------------------------------------------------------------

/** This page load's own touch and referrer, kept in memory only. */
let pageTouch: Touch | null = null;
let pageReferrer: string | undefined;
let captured = false;

function readStored(): StoredAttribution | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(attributionStorageKey) ?? "null");
    if (value?.v !== 1 || typeof value.first?.at !== "number") return null;
    if (Date.now() - value.first.at > attributionMaxAgeMs) {
      window.localStorage.removeItem(attributionStorageKey);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

/**
 * Stores a touch: the first one ever seen (within 90 days) stays as first touch, and every
 * non-direct touch becomes the last touch. A direct visit never overwrites a known campaign.
 */
function persist(touch: Touch) {
  const at = Date.now();
  const stored = readStored();
  const next: StoredAttribution = !stored
    ? { v: 1, first: { ...touch, at }, last: { ...touch, at } }
    : touch.medium === "(none)" ? stored : { ...stored, last: { ...touch, at } };
  try {
    window.localStorage.setItem(attributionStorageKey, JSON.stringify(next));
  } catch {
    /* storage blocked: attribution falls back to this page load */
  }
}

/** Reads this page load's touch once. Persists it only when the visitor allowed analytics. */
export function captureAttribution(analyticsAllowed: boolean) {
  if (captured) return;
  captured = true;
  const internal = safeHost(document.referrer) === window.location.hostname;
  pageReferrer = internal ? undefined : safeHost(document.referrer);
  pageTouch = touchFrom(window.location.href, document.referrer) ?? (internal ? null : directTouch(safePath(window.location.pathname)));
  if (analyticsAllowed) persistAttribution();
}

/** Called on load with consent and when the visitor grants analytics later in the visit. */
export function persistAttribution() {
  if (pageTouch) persist(pageTouch);
  else if (!readStored()) persist(directTouch(safePath(window.location.pathname)));
}

export function clearAttribution() {
  try {
    window.localStorage.removeItem(attributionStorageKey);
  } catch {
    /* nothing stored */
  }
}

/** Attribution to attach to a lead request. */
export function leadAttribution(analyticsAllowed: boolean): LeadAttribution {
  if (!analyticsAllowed) return { consent: "denied", last: pageTouch ?? undefined, referrer: pageReferrer };
  const stored = readStored();
  const strip = (t?: StoredTouch): Touch | undefined => {
    if (!t) return undefined;
    const { at: _at, ...touch } = t;
    return touch;
  };
  return { consent: "granted", first: strip(stored?.first), last: strip(stored?.last) ?? pageTouch ?? undefined, referrer: pageReferrer };
}
