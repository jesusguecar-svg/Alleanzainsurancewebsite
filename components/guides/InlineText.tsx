import { Fragment } from "react";
import { hiddenGuidePaths, type GuideLocale } from "@/lib/content/guides";
import { isInternalHref, renderedTokens } from "@/lib/content/guides/inline";
import { guideCopy } from "./copy";

const linkClass = "font-semibold underline underline-offset-4";

/** A link that opens in a new tab, with a screen-reader hint saying so. */
export function ExternalLink({ href, locale, children }: { href: string; locale: GuideLocale; children: React.ReactNode }) {
  return (
    <a className={linkClass} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only">{` ${guideCopy[locale].newTab}`}</span>
    </a>
  );
}

/**
 * Renders guide inline text: `[label](href)` and `**bold**`. The validator has already checked every
 * href (internal route or allowlisted https host). A link to a guide this build does not show
 * renders as its label only (see renderedTokens).
 */
export function InlineText({ text, locale }: { text: string; locale: GuideLocale }) {
  return (
    <>
      {renderedTokens(text, hiddenGuidePaths).map((token, index) => {
        if (token.kind === "bold") return <strong key={index}>{token.text}</strong>;
        if (token.kind === "link") {
          return isInternalHref(token.href) ? (
            <a key={index} className={linkClass} href={token.href}>{token.label}</a>
          ) : (
            <ExternalLink key={index} href={token.href} locale={locale}>{token.label}</ExternalLink>
          );
        }
        return <Fragment key={index}>{token.text}</Fragment>;
      })}
    </>
  );
}
