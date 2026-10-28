/**
 * The site's only analytics API. Components call these functions; nothing else touches gtag,
 * dataLayer or Vercel custom events. Events go to window.dataLayer for GTM, only
 * with analytics consent, and only with the allowlisted parameters below — never form values.
 * Taxonomy and GTM setup: docs/measurement/measurement-plan.md.
 */
import { leadAttribution, sourceGroup } from "./attribution";
import { analyticsAllowed } from "./consent";
import { cleanUrl, safeHost, safePath } from "./sanitize";

export type FormType = "contact" | "health" | "work";
export type ProductLine = "health" | "life" | "employer" | "academy" | "work";
export type Language = "es" | "en";
export type ErrorCategory = "validation" | "rate_limited" | "unavailable" | "server" | "network";

/** Events that fire today. */
export type LiveEvent = "page_view" | "cta_click" | "form_start" | "generate_lead" | "form_error" | "phone_click" | "whatsapp_click";
/** Defined for the funnel but not wired to any UI yet (no quote tool or agent hand-off exists). */
export type FutureEvent = "quote_start" | "quote_complete" | "agent_handoff";
/**
 * Lead lifecycle events for GA4's lead-generation funnel. They describe what happens after the
 * website (agent work, enrollment) and must come from a server or offline import, never the
 * browser. Not sent anywhere yet. `close_convert_lead` = confirmed enrollment/customer only.
 */
export const offlineLeadEvents = ["qualify_lead", "working_lead", "disqualify_lead", "close_convert_lead", "close_unconvert_lead"] as const;

type EventParams = {
  form_type?: FormType;
  cta_name?: string;
  cta_location?: string;
  product_line?: ProductLine;
  source_group?: string;
  error_category?: ErrorCategory;
};

const formTypes: readonly string[] = ["contact", "health", "work"];
const productLines: readonly string[] = ["health", "life", "employer", "academy", "work"];
const errorCategories: readonly string[] = ["validation", "rate_limited", "unavailable", "server", "network"];
const token = (value: unknown) => (typeof value === "string" && /^[a-z0-9_]{1,50}$/.test(value) ? value : undefined);
const oneOf = (allowed: readonly string[]) => (value: unknown) => (typeof value === "string" && allowed.includes(value) ? value : undefined);

/** Every parameter an event may carry, with its validator. Anything else is dropped. */
const allowedParams: Record<keyof EventParams, (value: unknown) => string | undefined> = {
  form_type: oneOf(formTypes),
  cta_name: token,
  cta_location: token,
  product_line: oneOf(productLines),
  source_group: token,
  error_category: oneOf(errorCategories),
};

/** Keys present on every push, so GTM's data model never carries a value over from an earlier event. */
export const dataLayerKeys = ["event", "page_path", "page_location", "page_referrer", "language", ...Object.keys(allowedParams)] as const;

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function pageLanguage(pathname = window.location.pathname): Language {
  return pathname.startsWith("/en/") || pathname === "/en" || pathname.startsWith("/employers") ? "en" : "es";
}

function push(event: LiveEvent | FutureEvent, params: EventParams = {}, extra: { page_referrer?: string } = {}) {
  if (!analyticsAllowed()) return;
  const entry: Record<string, unknown> = Object.fromEntries(dataLayerKeys.map((key) => [key, undefined]));
  for (const [key, validate] of Object.entries(allowedParams)) {
    const value = validate(params[key as keyof EventParams]);
    if (value !== undefined) entry[key] = value;
  }
  Object.assign(entry, {
    event,
    page_path: safePath(window.location.pathname),
    page_location: cleanUrl(window.location.href),
    language: pageLanguage(),
    ...extra,
  });
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(entry);
}

// --- Page views ------------------------------------------------------------------------------

let lastPagePath: string | null = null;
let lastPageLocation: string | null = null;

/**
 * The single page_view source: called once per route by AnalyticsRuntime (initial load and every
 * client-side navigation, including back/forward). GA4's own automatic and history-based page
 * views must stay off in GTM/GA4. Re-renders and hash changes on the same path do not count.
 */
export function trackPageView() {
  const path = window.location.pathname;
  if (!analyticsAllowed() || path === lastPagePath) return;
  // Previous page for client-side navigations; otherwise only the referring site's origin.
  const referrerHost = safeHost(document.referrer);
  const page_referrer = lastPageLocation ?? (referrerHost ? `https://${referrerHost}/` : undefined);
  lastPagePath = path;
  lastPageLocation = cleanUrl(window.location.href);
  push("page_view", {}, { page_referrer });
}

// --- Business events -------------------------------------------------------------------------

export function trackCtaClick(params: { cta_name: string; cta_location: string; product_line?: ProductLine }) {
  push("cta_click", params);
}

export function trackPhoneClick(cta_location: string) {
  push("phone_click", { cta_location });
}

export function trackWhatsAppClick(cta_location: string) {
  push("whatsapp_click", { cta_location });
}

export function trackFormStart(form_type: FormType, product_line?: ProductLine) {
  push("form_start", { form_type, product_line });
}

/** Only after the lead API returned success. Never on click. */
export function trackLeadGenerated(form_type: FormType, product_line?: ProductLine) {
  push("generate_lead", { form_type, product_line, source_group: sourceGroup(leadAttribution(analyticsAllowed()).last) });
}

export function trackFormError(form_type: FormType, error_category: ErrorCategory) {
  push("form_error", { form_type, error_category });
}

export function trackQuoteStart(product_line: ProductLine) {
  push("quote_start", { product_line });
}

export function trackQuoteComplete(product_line: ProductLine) {
  push("quote_complete", { product_line });
}

export function trackAgentHandoff(product_line: ProductLine) {
  push("agent_handoff", { product_line });
}

/** Generic category for a failed lead request; the server's message is never sent to analytics. */
export function errorCategoryFor(status: number | "network" | "validation"): ErrorCategory {
  if (status === "network" || status === "validation") return status;
  if (status === 400 || status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status === 503) return "unavailable";
  return "server";
}

/** Attribution for a lead request body. See lib/analytics/attribution.ts. */
export function attributionForLead() {
  return leadAttribution(analyticsAllowed());
}
