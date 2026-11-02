import type { ReactNode } from "react";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { EnglishSiteFooter } from "@/components/layout/EnglishSiteFooter";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "./copy";

/** Header, language switch and footer shared by guide and index pages. */
export function GuideShell({ locale, spanishHref, englishHref, children, afterArticle }: { locale: GuideLocale; spanishHref: string; englishHref: string; children: ReactNode; afterArticle?: ReactNode }) {
  const copy = guideCopy[locale];
  return (
    <div className="bg-white text-navy" lang={locale}>
      <SiteHeader locale={locale} links={[...copy.nav]} cta={afterArticle ? { ...copy.headerCta, href: "#contacto" } : copy.headerCta} />
      <main>
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mb-8 flex justify-end text-sm font-semibold [&_a[aria-current=page]]:text-[#0b7fa8] [&_span[aria-hidden]]:mx-2">
            <LanguageSwitch locale={locale} spanishHref={spanishHref} englishHref={englishHref} />
          </div>
          {children}
        </div>
        {afterArticle}
      </main>
      {locale === "en" ? <EnglishSiteFooter /> : <SiteFooter />}
    </div>
  );
}
