import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatGuideDate, guideIndexPath, guidePath, guides, type Guide, type GuideLocale } from "@/lib/content/guides";
import { guideArticleSchema, guideBreadcrumbSchema } from "@/lib/seo/guides";
import { guideCopy } from "./copy";
import { GuideContactForm } from "./GuideContactForm";
import { GuideShell } from "./GuideShell";

const heading = "mt-12 font-display text-2xl font-semibold tracking-tight";

export function GuidePage({ guide, locale }: { guide: Guide; locale: GuideLocale }) {
  const copy = guideCopy[locale];
  const content = guide[locale];
  const related = guides.filter((other) => guide.relatedGuides.includes(other.id));
  const ctaProps = { "data-cta": "guide_agent", "data-product-line": "health" };

  return (
    <GuideShell
      locale={locale}
      spanishHref={guidePath(guide, "es")}
      englishHref={guidePath(guide, "en")}
      afterArticle={<GuideContactForm locale={locale} />}
    >
      <JsonLd data={guideArticleSchema(guide, locale)} />
      <JsonLd data={guideBreadcrumbSchema(guide, locale)} />
      <article data-cta-location="guide">
        <nav aria-label={copy.breadcrumb} className="text-sm text-navy/65">
          <ol className="flex flex-wrap gap-x-2 gap-y-1">
            <li><a className="hover:underline" href={copy.health.href}>{copy.health.label}</a> <span aria-hidden="true">/</span></li>
            <li><a className="hover:underline" href={guideIndexPath[locale]}>{copy.index.label}</a> <span aria-hidden="true">/</span></li>
            <li aria-current="page">{content.h1}</li>
          </ol>
        </nav>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl">{content.h1}</h1>
        <p className="mt-5 text-sm text-navy/65">
          {copy.updated} <time dateTime={guide.updatedDate}>{formatGuideDate(guide.updatedDate, locale)}</time> · {copy.reviewedBy} {guide.reviewer}, {copy.licensedAgent}
        </p>
        <p className="mt-8 border-l-4 border-cyan pl-5 text-lg leading-relaxed">{content.summary}</p>

        <h2 className={heading}>{copy.keyFacts}</h2>
        <table className="mt-5 w-full border-collapse text-left text-sm md:text-base">
          <tbody>
            {content.keyFacts.map((fact) => (
              <tr key={fact.label} className="border-y border-navy/15">
                <th scope="row" className="w-2/5 py-3 pr-4 align-top font-semibold">{fact.label}</th>
                <td className="py-3 align-top text-navy/75">{fact.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className={heading}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed text-navy/80">{paragraph}</p>)}
          </section>
        ))}

        <h2 className={heading}>{copy.sources}</h2>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-navy/75">
          {content.sources.map((source) => (
            <li key={source.url}>
              <a className="font-semibold underline underline-offset-4" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>. {copy.accessed} <time dateTime={source.accessed}>{formatGuideDate(source.accessed, locale)}</time>.
            </li>
          ))}
        </ol>

        {related.length > 0 && (
          <>
            <h2 className={heading}>{copy.related}</h2>
            <ul className="mt-5 space-y-2">
              {related.map((other) => <li key={other.id}><a className="font-semibold underline underline-offset-4" href={guidePath(other, locale)}>{other[locale].h1}</a></li>)}
            </ul>
          </>
        )}

        <div className="mt-12 space-y-2 border-t border-navy/15 pt-6 text-xs leading-relaxed text-navy/65">
          <p>{copy.disclaimer}</p>
          <p>{copy.notGovernment}</p>
        </div>

        <a href="#contacto" {...ctaProps} className="mt-8 inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-4 text-sm font-semibold text-navy">
          {copy.cta} <ArrowRight aria-hidden="true" size={16} />
        </a>
      </article>
    </GuideShell>
  );
}
