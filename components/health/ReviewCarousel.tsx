"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Instagram } from "lucide-react";
import { instagramProfileUrl } from "@/lib/config/site";
import { verifiedGoogleSummary, type GoogleReviews } from "@/lib/google-reviews";
import u from "./health.module.css";
import s from "./review-carousel.module.css";

type Locale = "es" | "en";

function formatChecked(iso: string | undefined, locale: Locale) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return null;
  const months = locale === "en"
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return locale === "en" ? `${months[month - 1]} ${day}, ${year}` : `${day} ${months[month - 1]} ${year}`;
}

/** Shows an all-caps reviewer name ("ANA SUESCUN") in name case ("Ana Suescun"). Mixed-case names are left as written. */
function displayName(name: string) {
  const trimmed = name.trim();
  if (trimmed !== trimmed.toLocaleUpperCase("es") || trimmed === trimmed.toLocaleLowerCase("es")) return trimmed;
  return trimmed.toLocaleLowerCase("es").replace(/(^|[\s'-])(\p{L})/gu, (_, start: string, letter: string) => start + letter.toLocaleUpperCase("es"));
}

function Quote({ text, more, less }: { text: string; more: string; less: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, text]);

  return (
    <>
      <p ref={ref} className={s.text} data-open={open}>{text}</p>
      {overflows || open ? (
        <button type="button" className={`${u.link} ${s.more}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? less : more}
        </button>
      ) : null}
    </>
  );
}

/** Reviews (#opiniones): summary on the left, three quotes on the right. No carousel. */
export function ReviewCarousel({ locale, reviews, reviewsUrl }: { locale: Locale; reviews: GoogleReviews | null; reviewsUrl?: string }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const summary = verifiedGoogleSummary(reviews);
  const profileUrl = reviews?.url || reviewsUrl;
  const items = (reviews?.reviews ?? []).slice(0, 3);
  const checked = formatChecked(summary?.checkedOn, locale);
  const countLabel = summary
    ? t(`${summary.count.toLocaleString("es-ES")} reseñas en Google`, `${summary.count.toLocaleString("en-US")} Google reviews`)
    : null;
  const note = summary
    ? (checked
      ? t(`Perfil público al ${checked}. No es un conteo de clientes.`, `Public profile as of ${checked}. Not a customer count.`)
      : t("Perfil público. No es un conteo de clientes.", "Public profile. Not a customer count."))
    : null;

  return (
    <section id="opiniones" className={u.sec} aria-labelledby="trust-heading">
      <div className={u.wrap}>
        <div className={s.layout}>
          <div>
            <p className={u.eyebrow}>{t("Experiencias con nuestro equipo", "Experiences with our team")}</p>
            <h2 id="trust-heading" className={`${u.h2} ${s.title}`}>{t("Reseñas de nuestro equipo en Carrollton", "Reviews of our Carrollton team")}</h2>
            {summary ? (
              <>
                <p className={s.score}><span className={u.num}>{summary.rating.toFixed(1)}<span className={u.sr}>{t(" de 5", " out of 5")}</span></span><span className={u.body}>{countLabel}</span></p>
                <p className={u.fine}>{note}</p>
              </>
            ) : null}
            <div className={s.links}>
              {profileUrl ? (
                <a className={u.link} href={profileUrl} target="_blank" rel="noopener noreferrer">
                  {t("Ver el perfil en Google", "View the Google listing")}
                  <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : null}
              <a className={u.link} href={instagramProfileUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={18} strokeWidth={1.5} aria-hidden="true" />
                {t("Ver en Instagram", "View on Instagram")}
              </a>
            </div>
          </div>
          {items.length ? (
            <div className={s.quotes}>
              {items.map((review, index) => {
                const href = review.authorUrl || review.url || profileUrl;
                const name = displayName(review.name);
                return (
                  <figure className={s.quote} key={`${review.name}-${index}`}>
                    <blockquote><Quote text={review.text} more={t("Leer más", "Read more")} less={t("Leer menos", "Show less")} /></blockquote>
                    <figcaption>
                      {href ? <a href={href} target="_blank" rel="noopener noreferrer">{name}</a> : <span className={s.name}>{name}</span>}
                      {review.date ? <> · {review.date}</> : null} · Google
                      <span className={u.sr}>{`, ${review.rating} / 5`}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <p className={u.body}>{t("Conoce las experiencias compartidas en nuestro perfil público.", "Explore the experiences shared on our public profile.")}</p>
          )}
        </div>
        <p className={`${u.fine} ${s.legal}`}>{t("Opiniones públicas del perfil de Google de nuestro equipo en Carrollton, publicado con el nombre Villard Agency, de la misma propiedad que Alleanza Insurance Corp. No indican si quien escribe es asegurado o forma parte del equipo, y no garantizan resultados de una póliza.", "Public reviews from the Google listing of our Carrollton team, published under the Villard Agency name, which shares ownership with Alleanza Insurance Corp. They do not say whether the writer is a policyholder or part of the team, and they do not guarantee policy results.")}</p>
      </div>
    </section>
  );
}
