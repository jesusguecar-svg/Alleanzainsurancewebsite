import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import "../globals.css";

/** Root layout for every page under /en: <html lang="en">. Spanish pages use app/(es)/layout.tsx. */
export const metadata = rootMetadata("en");

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
