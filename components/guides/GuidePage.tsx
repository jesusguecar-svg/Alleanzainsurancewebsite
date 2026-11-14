import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLabel, formatGuideDate, getParentGuide, guideIndexPath, guidePath, guides, type Guide, type GuideBlock, type GuideLocale } from "@/lib/content/guides";
import { guideArticleSchema, guideBreadcrumbSchema } from "@/lib/seo/guides";
import { guideCopy } from "./copy";
import { GuideContactForm } from "./GuideContactForm";
import { GuideShell } from "./GuideShell";
import { InlineText } from "./InlineText";

const heading = "mt-12 font-display text-2xl font-semibold tracking-tight";
const body = "leading-relaxed text-navy/80";

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={`mt-4 ${body}`}><InlineText text={block.text} /></p>;
    case "list": {
      const items = block.items.map((item, index) => <li key={index}><InlineText text={item} /></li>);
      return block.ordered
        ? <ol className={`mt-4 list-decimal space-y-2 pl-6 ${body}`}>{items}</ol>
        : <ul className={`mt-4 list-disc space-y-2 pl-6 ${body}`}>{items}</ul>;
    }
    case "table": {
      const { caption, columns, rows } = block.table;
      return (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm md:text-base">
            <caption className="mb-2 text-left text-sm font-semibold text-navy/75"><InlineText text={caption} /></caption>
            <thead>
              <tr className="border-b-2 border-navy/25">
                {columns.map((column, index) => <th key={index} scope="col" className="py-2 pr-4 align-bottom font-semibold"><InlineText text={column} /></th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-navy/15">
                  {row.map((cell, cellIndex) => cellIndex === 0
                    ? <th key={cellIndex} scope="row" className="py-3 pr-4 align-top font-semibold"><InlineText text={cell} /></th>
                    : <td key={cellIndex} className="py-3 pr-4 align-top text-navy/75"><InlineText text={cell} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "qa":
      return (
        <>
          <h3 className="mt-8 font-display text-lg font-semibold tracking-tight"><InlineText text={block.question} /></h3>
          <p className={`mt-2 ${body}`}><InlineText text={block.answer} /></p>
        </>
      );
  }
}

export function GuidePage({ guide, locale }: { guide: Guide; locale: GuideLocale }) {
  const copy = guideCopy[locale];
  const content = guide[locale];
  const related = guides.filter((other) => guide.relatedGuides.includes(other.id));
  const parent = getParentGuide(guide);
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
            {parent && <li><a className="hover:underline" href={guidePath(parent, locale)}>{breadcrumbLabel(parent, locale)}</a> <span aria-hidden="true">/</span></li>}
            <li aria-current="page">{breadcrumbLabel(guide, locale)}</li>
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
            {section.blocks.map((block, index) => <Block key={index} block={block} />)}
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
