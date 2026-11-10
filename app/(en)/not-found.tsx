import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Page not found | Alleanza Insurance Corp.",
  // Next.js adds its own noindex to 404s; null drops the root layout's "index, follow" tag.
  robots: null,
};

/** Shown when an English page calls notFound(), such as /en/learn before a guide is published. */
export default function NotFound() {
  return (
    <LegalDocument locale="en" title="Page not found">
      <p>
        This page does not exist or has moved. Go to <a href="/en/health">Health</a> or{" "}
        <a href="/contacto" hrefLang="es">contact us</a>.
      </p>
    </LegalDocument>
  );
}
