import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { RootDocument } from "@/components/layout/RootDocument";
import "./globals.css";

/**
 * 404 for URLs that match no route. With two root layouts (app/(es), app/(en)) Next.js has no
 * single layout to render an unmatched URL in, so this page renders its own document
 * (experimental.globalNotFound in next.config.ts). Pages that call notFound() use the
 * not-found.tsx of their own language group instead.
 */
export const metadata: Metadata = {
  title: "Página no encontrada | Alleanza Insurance Corp.",
};

export default function GlobalNotFound() {
  return (
    <RootDocument locale="es">
      <LegalDocument title="Página no encontrada">
        <p>
          Esta página no existe o cambió de dirección. Vuelve al <a href="/">inicio</a> o visita{" "}
          <a href="/contacto">Contacto</a>.
        </p>
        <p lang="en">
          This page does not exist or has moved. <a href="/en/health" hrefLang="en">English health page</a>.
        </p>
      </LegalDocument>
    </RootDocument>
  );
}
