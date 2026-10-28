/**
 * Measurement identifiers and storage keys. See docs/measurement/measurement-plan.md.
 * The GTM container is configured and published in the GTM UI, never from code.
 */
export const gtmContainerId = "GTM-PP5RBPJH";
/** Configured inside GTM (Google Tag). Listed here for reference and documentation only. */
export const ga4MeasurementId = "G-GKHH8TDY77";

/** The visitor's consent choice: { v, analytics, marketing }. */
export const consentStorageKey = "alleanza-consent";
/** Pre-GA4 single-checkbox choice. Its scope (Whop only) no longer matches, so it is discarded and the visitor is asked again. */
export const legacyConsentStorageKey = "alleanza-analytics-consent";
export const consentVersion = 2;

/** First-party first/last-touch attribution, kept only with analytics consent. */
export const attributionStorageKey = "alleanza-attribution";
export const attributionMaxAgeMs = 90 * 24 * 60 * 60 * 1000;

export const whopPixelScope = "biz_36KJ2dEIlKiSlt";
