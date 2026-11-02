import { notFound } from "next/navigation";
import { formatGuideDate, guideIndexPath, guidePath, guides, type GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "./copy";
import { GuideShell } from "./GuideShell";

export function GuidesIndex({ locale }: { locale: GuideLocale }) {
  // No published guides yet: there is nothing to show, so the page does not exist.
  if (!guides.length) notFound();
  const copy = guideCopy[locale];
  return (
    <GuideShell locale={locale} spanishHref={guideIndexPath.es} englishHref={guideIndexPath.en}>
      <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#0b7fa8]">{copy.index.eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">{copy.index.h1}</h1>
      <ul className="mt-12 divide-y divide-navy/15 border-y border-navy/15">
        {guides.map((guide) => (
          <li key={guide.id}>
            <a className="block py-6 hover:text-[#0b7fa8]" href={guidePath(guide, locale)}>
              <h2 className="font-display text-2xl font-semibold tracking-tight">{guide[locale].h1}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/75">{guide[locale].description}</p>
              <p className="mt-2 text-xs text-navy/65">{copy.updated} {formatGuideDate(guide.updatedDate, locale)}</p>
            </a>
          </li>
        ))}
      </ul>
    </GuideShell>
  );
}
