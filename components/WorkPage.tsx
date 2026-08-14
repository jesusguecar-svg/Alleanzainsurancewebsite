"use client";

import { CareersSection } from "./sections/CareersSection";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { ContactSection } from "./sections/ContactSection";
import { portalNavLinks } from "@/lib/config/routes";

/**
 * Recruiting spoke. Reuses the careers section built for the original site and
 * the shared contact form, so applicants go through the same validated,
 * consent-gated route as everyone else.
 */
export default function WorkPage() {
  return (
    <main>
      <div className="noise" />
      <SiteHeader links={portalNavLinks} cta={{ href: "#contacto", label: "Quiero postularme" }} />
      <div className="pt-24">
        <CareersSection />
      </div>
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
