"use client";

import Link from "next/link";

export function LanguageSwitch({
  locale,
  spanishHref,
  englishHref,
  className,
  preserveHash = false,
}: {
  locale: "es" | "en";
  spanishHref: string;
  englishHref: string;
  className?: string;
  preserveHash?: boolean;
}) {
  function followWithHash(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!preserveHash || !window.location.hash) return;
    event.preventDefault();
    window.location.assign(`${href}${window.location.hash}`);
  }
  return <span className={className} role="group" aria-label={locale === "es" ? "Seleccionar idioma" : "Select language"}>
    <Link href={spanishHref} lang="es" hrefLang="es" aria-current={locale === "es" ? "page" : undefined} onClick={(event) => followWithHash(event, spanishHref)}>ES</Link>
    <span aria-hidden="true">/</span>
    <Link href={englishHref} lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined} onClick={(event) => followWithHash(event, englishHref)}>EN</Link>
  </span>;
}
