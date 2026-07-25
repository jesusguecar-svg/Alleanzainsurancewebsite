import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleanza Insurance | Tu familia, protegida",
  description: "Protección complementaria para familias hispanas en Texas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
