import { clearAttribution, persistAttribution } from "./attribution";
import { consentStorageKey, consentVersion, gtmContainerId, legacyConsentStorageKey, whopPixelScope } from "./config";

/**
 * Two optional categories. Google Consent Mode v2 starts everything denied (see the inline script
 * in app/layout.tsx); this module records the visitor's choice and applies it.
 *  - analytics → analytics_storage granted, GTM (and GA4 inside it) loads, attribution is stored.
 *  - marketing → loads the Whop pixel. Google ad signals stay denied in this phase regardless.
 */
export type ConsentChoice = { analytics: boolean; marketing: boolean };

type DataLayerWindow = Window & { dataLayer?: unknown[]; __whopApp?: Record<string, unknown> };

let current: ConsentChoice | null = null;
let googleTagsEnabled = false;
const listeners = new Set<(choice: ConsentChoice | null) => void>();

export const openPreferencesEvent = "alleanza:consent-preferences";

export function consentChoice() {
  return current;
}

export function analyticsAllowed() {
  return current?.analytics === true;
}

export function onConsentChange(listener: (choice: ConsentChoice | null) => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
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
    return { analytics: value.analytics === true, marketing: value.marketing === true };
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

/**
 * The Whop pixel, unchanged except for two privacy switches: by default it reads name, email and
 * phone from form fields as visitors type (`forms`) and email/phone from URL parameters
 * (`urlIdentity`) and sends them to Whop. Both are off. See the Whop audit in the measurement plan.
 */
function loadWhopPixel() {
  const w = window as DataLayerWindow & { whop?: unknown };
  if (w.whop || document.getElementById("whop-pixel")) return;
  w.__whopApp = { ...w.__whopApp, forms: false, urlIdentity: false };
  const script = document.createElement("script");
  script.id = "whop-pixel";
  script.text = `!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("${whopPixelScope}");whop.track("page");`;
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
    // Phase 1: no advertising, remarketing or ad personalization, whatever the visitor chose.
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
  // A pixel that already loaded cannot be unloaded; withdrawing marketing stops it from the next page load.
  if (choice.marketing) loadWhopPixel();
  else clearCookies((name) => name.startsWith("_wuid"));
}

/** Reads the stored choice once per page load and applies it. Returns it (null = not chosen yet). */
export function initConsent(options: { googleTags: boolean }) {
  googleTagsEnabled = options.googleTags;
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
  for (const listener of listeners) listener(choice);
}

/** Reopens the consent banner, e.g. from the privacy policy. */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(openPreferencesEvent));
}
