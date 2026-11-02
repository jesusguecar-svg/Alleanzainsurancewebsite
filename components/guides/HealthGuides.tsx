import { guideIndexPath, guidePath, guides, type GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "./copy";

/** The "Guides" block on /health and /en/health. Hidden until a guide is published. */
export function HealthGuides({ locale }: { locale: GuideLocale }) {
  if (!guides.length) return null;
  const copy = guideCopy[locale];
  return (
    <section id="guias" aria-labelledby="guides-heading" data-cta-location="health_guides" className="bg-white px-6 py-16 text-navy md:px-[6vw] md:py-24">
      <h2 id="guides-heading">{copy.block.heading}</h2>
      <ul className="mt-8 divide-y divide-navy/15 border-y border-navy/15">
        {guides.map((guide) => (
          <li key={guide.id}><a className="block py-5 text-base font-semibold hover:text-[#0b7fa8]" href={guidePath(guide, locale)}>{guide[locale].h1}</a></li>
        ))}
      </ul>
      <a className="mt-6 inline-block text-sm font-semibold underline underline-offset-4" href={guideIndexPath[locale]}>{copy.block.all}</a>
    </section>
  );
}
