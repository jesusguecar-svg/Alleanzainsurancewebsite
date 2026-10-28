import { clearAttribution, persistAttribution } from "./attribution";
import { consentStorageKey, consentVersion, gtmContainerId, legacyConsentStorageKey, retiredTrackerCookiePrefixes } from "./config";

/**
 * One optional category: analytics. Google Consent Mode v2 starts everything denied (see the
 * inline script in app/layout.tsx); this module records the visitor's choice and applies it.
 * Analytics → analytics_storage granted, GTM (and GA4 inside it) loads, attribution is stored.
 * No advertising or marketing tracker exists in this phase, so ad signals are always denied.
 */
export type ConsentChoice = { analytics: boolean };

type DataLayerWindow = Window & { dataLayer?: unknown[] };

let current: ConsentChoice | null = null;
let googleTagsEnabled = false;

export const openPreferencesEvent = "alleanza:consent-preferences";

export function consentChoice() {
  return current;
}

export function analyticsAllowed() {
  return current?.analytics === true;
}

/** Google's gtag() contract: commands must be pushed as an `arguments` object, not an array. */
function gtag(..._args: unknown[]) {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(arguments);
}

function readStoredChoice(): ConsentChoice | null {
  try {
    window.localStorage.removeItem(legacyConsentStorageKey);
    const value = JSON.parse(window.localStorage.getItem(consentStorageKey) ?? "null");
    if (value?.v !== consentVersion) return null;
    return { analytics: value.analytics === true };
  } catch {
    return null;
  }
}

function loadGoogleTagManager() {
  if (!googleTagsEnabled || document.getElementById("gtm-loader")) return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "gtm-loader";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
  document.head.appendChild(script);
}

function clearCookies(match: (name: string) => boolean) {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!match(name)) continue;
    const domain = window.location.hostname.split(".").slice(-2).join(".");
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/; domain=.${domain}`;
  }
}

function apply(choice: ConsentChoice) {
  gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    // No advertising, remarketing or ad personalization in this phase.
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (choice.analytics) {
    loadGoogleTagManager();
    persistAttribution();
  } else {
    clearAttribution();
    clearCookies((name) => name === "_ga" || name.startsWith("_ga_"));
  }
}

/** Reads the stored choice once per page load and applies it. Returns it (null = not chosen yet). */
export function initConsent(options: { googleTags: boolean }) {
  googleTagsEnabled = options.googleTags;
  clearCookies((name) => retiredTrackerCookiePrefixes.some((prefix) => name.startsWith(prefix)));
  current = readStoredChoice();
  if (current) apply(current);
  return current;
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify({ v: consentVersion, ...choice }));
  } catch {
    /* private mode: still honor the choice for this visit */
  }
  current = choice;
  apply(choice);
}

/** Reopens the consent banner, e.g. from the privacy policy. */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(openPreferencesEvent));
}
