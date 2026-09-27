import Link from "next/link";

export function LanguageSwitch({
  locale,
  spanishHref,
  englishHref,
  className,
}: {
  locale: "es" | "en";
  spanishHref: string;
  englishHref: string;
  className?: string;
}) {
  return <span className={className} role="group" aria-label={locale === "es" ? "Seleccionar idioma" : "Select language"}>
    <Link href={spanishHref} lang="es" hrefLang="es" aria-current={locale === "es" ? "page" : undefined}>ES</Link>
    <span aria-hidden="true">/</span>
    <Link href={englishHref} lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
  </span>;
}
