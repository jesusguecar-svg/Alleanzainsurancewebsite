import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import "../globals.css";

/** Root layout for every Spanish page: <html lang="es">. English pages use app/(en)/layout.tsx. */
export const metadata = rootMetadata("es");

export default function SpanishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
