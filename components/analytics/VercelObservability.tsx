"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cleanUrl } from "@/lib/analytics/sanitize";

/**
 * Vercel Web Analytics (cookieless traffic sanity checks) and Speed Insights (Core Web Vitals).
 * Not the source of truth for conversions, so no custom events. URLs keep only UTM parameters.
 */
const withCleanUrl = <T extends { url: string }>(event: T): T => ({ ...event, url: cleanUrl(event.url) || event.url.split(/[?#]/)[0] });

export function VercelObservability() {
  return (
    <>
      <Analytics beforeSend={withCleanUrl} />
      <SpeedInsights beforeSend={withCleanUrl} />
    </>
  );
}
