import { breadcrumbLabel, guides } from "@/lib/content/guides";
import { guideImageFile } from "@/lib/seo/guides";
import { renderOgCard } from "@/lib/og";

/**
 * 1200 × 630 card for each guide this build shows, at a stable URL (/og/guides/<id>-<locale>.png)
 * so the Article JSON-LD image and og:image can name it. Built once at build time.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const accent = { es: "Guía Obamacare (ACA)", en: "Obamacare (ACA) guide" } as const;

const cards = guides.flatMap((guide) => (["es", "en"] as const).map((locale) => ({ guide, locale, file: guideImageFile(guide, locale) })));

export function generateStaticParams() {
  return cards.map(({ file }) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const card = cards.find((candidate) => candidate.file === file);
  if (!card) return new Response("Not found", { status: 404 });
  return renderOgCard({
    headline: breadcrumbLabel(card.guide, card.locale),
    accent: accent[card.locale],
    subtitle: "alleanzainsurance.org",
  });
}
