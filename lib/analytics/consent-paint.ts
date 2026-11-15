import { consentStorageKey, consentVersion } from "./config";

/**
 * Before-paint consent check. The consent banner is server-rendered (see
 * components/analytics/ConsentBanner.tsx); this inline script runs in <head>, before first paint,
 * and marks <html data-consent-stored> when a valid choice is already stored, so CSS hides the
 * banner for returning visitors without a flash. It reads the same key and version as
 * lib/analytics/consent.ts and fails closed (banner shown) when storage is unavailable.
 */
export const consentStoredDataKey = "consentStored";

export const consentPaintScript = `try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(consentStorageKey)})||"null");if(c&&c.v===${consentVersion})document.documentElement.dataset.${consentStoredDataKey}=""}catch(e){}`;

/** Returning visitors (marked above) and visitors without JavaScript (no analytics runs) never see it. */
export const consentBannerHiddenCss = "html[data-consent-stored] [data-consent-banner]{display:none}";
export const consentBannerNoScriptCss = "[data-consent-banner]{display:none}";
