import { Fragment } from "react";
import { isInternalHref, parseInline } from "@/lib/content/guides/inline";

const linkClass = "font-semibold underline underline-offset-4";

/**
 * Renders guide inline text: `[label](href)` and `**bold**`. The validator has already checked every
 * href (internal route or allowlisted https host), so this only decides how each link opens.
 */
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        if (token.kind === "bold") return <strong key={index}>{token.text}</strong>;
        if (token.kind === "link") {
          return isInternalHref(token.href) ? (
            <a key={index} className={linkClass} href={token.href}>{token.label}</a>
          ) : (
            <a key={index} className={linkClass} href={token.href} target="_blank" rel="noopener noreferrer">{token.label}</a>
          );
        }
        return <Fragment key={index}>{token.text}</Fragment>;
      })}
    </>
  );
}
