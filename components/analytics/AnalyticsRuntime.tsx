"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";
import { captureAttribution } from "@/lib/analytics/attribution";
import { installClickTracking } from "@/lib/analytics/clicks";
import { analyticsAllowed, initConsent } from "@/lib/analytics/consent";
import { ConsentBanner } from "./ConsentBanner";

/**
 * Mounted once in the root layout. Applies the stored consent choice, reads this page load's
 * attribution, listens for tracked clicks, and sends exactly one page_view per route.
 * `googleTags` loads GTM (production only, so previews never reach GA4).
 */
export function AnalyticsRuntime({ googleTags }: { googleTags: boolean }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initConsent({ googleTags });
    captureAttribution(analyticsAllowed());
    setReady(true);
    return installClickTracking();
  }, [googleTags]);

  // Runs after the effect above on first load, then on every pathname change.
  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return <ConsentBanner ready={ready} />;
}
