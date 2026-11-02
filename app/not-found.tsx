import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Página no encontrada | Alleanza Insurance Corp.",
  // Next.js adds its own noindex to 404s; null drops the root layout's "index, follow" tag.
  robots: null,
};

export default function NotFound() {
  return (
    <LegalDocument title="Página no encontrada">
      {/* TODO-COPY: functional 404 text, pending review. */}
      <p>
        Esta página no existe o cambió de dirección. Vuelve al <a href="/">inicio</a> o visita{" "}
        <a href="/contacto">Contacto</a>.
      </p>
    </LegalDocument>
  );
}
