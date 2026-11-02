import { legalName, office, officeCountry, officeSchedule, primaryPhone } from "@/lib/config/contact";
import { instagramProfileUrl, siteUrl } from "@/lib/config/site";

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

/**
 * Points at the one agency node. Pages other than /, /contacto and /nosotros use this rather than
 * repeating the agency's details.
 */
export const organizationRef = { "@type": "InsuranceAgency", "@id": organizationId, name: legalName } as const;

/**
 * The agency's full node. Facts only: the Google listing, reviews and ratings, NPNs, counts and
 * licensed states stay out (see lib/config/company.ts and lib/google-reviews.ts).
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "@id": organizationId,
    name: legalName,
    legalName,
    url: siteUrl,
    logo: `${siteUrl}/brand/alleanza/png/logo-primary-horizontal.png`,
    image: `${siteUrl}/brand/alleanza/png/logo-primary-vertical.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.city,
      addressRegion: office.state,
      postalCode: office.postalCode,
      addressCountry: officeCountry,
    },
    telephone: primaryPhone.href,
    openingHoursSpecification: officeSchedule.map(({ dayOfWeek, opens, closes }) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens,
      closes,
    })),
    knowsLanguage: ["es", "en"],
    sameAs: [instagramProfileUrl],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: legalName,
    inLanguage: "es",
    publisher: { "@id": organizationId },
  };
}
