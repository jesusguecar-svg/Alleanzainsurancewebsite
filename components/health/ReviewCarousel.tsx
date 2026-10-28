"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Star } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { instagramProfileUrl } from "@/lib/config/site";
import { verifiedGoogleSummary, type GoogleReviews } from "@/lib/google-reviews";
import s from "./review-carousel.module.css";

type Locale = "es" | "en";

const CARD_GAP = 16;

const tones = ["#e5f2f6", "#eef1ea", "#f4efe6", "#e8eef5", "#f3e9ea"];

function toneFor(name: string) {
  const code = name.trim().toUpperCase().charCodeAt(0) || 0;
  return tones[code % tones.length];
}

function formatChecked(iso: string | undefined, locale: Locale) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return null;
  const months = locale === "en"
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return locale === "en" ? `${months[month - 1]} ${day}, ${year}` : `${day} ${months[month - 1]} ${year}`;
}

function Stars({ rating, size }: { rating: number; size: number }) {
  const safe = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
  return (
    <span className={s.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const amount = Math.max(0, Math.min(1, safe - index));
        return (
          <span className={s.star} key={index}>
            <Star size={size} fill="none" strokeWidth={1.75} />
            <span style={{ width: `${amount * 100}%` }}>
              <Star size={size} fill="currentColor" strokeWidth={1.75} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Quote({ text, more, less }: { text: string; more: string; less: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
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
      <blockquote ref={ref} className={open ? s.quoteOpen : s.quote}>{text}</blockquote>
      {overflows ? (
        <button type="button" className={s.more} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? less : more}
        </button>
      ) : null}
    </>
  );
}

export function ReviewCarousel({ locale, reviews, reviewsUrl }: { locale: Locale; reviews: GoogleReviews | null; reviewsUrl?: string }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const summary = verifiedGoogleSummary(reviews);
  const profileUrl = reviews?.url || reviewsUrl;
  const items = reviews?.reviews ?? [];
  const checked = formatChecked(summary?.checkedOn, locale);
  const countLabel = summary
    ? t(`${summary.count.toLocaleString("es-ES")} reseñas en Google`, `${summary.count.toLocaleString("en-US")} Google reviews`)
    : null;
  const note = summary
    ? (checked
      ? t(`Perfil público al ${checked}. No es un conteo de clientes.`, `Public profile as of ${checked}. Not a customer count.`)
      : t("Perfil público. No es un conteo de clientes.", "Public profile. Not a customer count."))
    : null;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => {
      const start = el.scrollLeft <= 8;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [items.length]);

  function move(direction: number) {
    const el = scroller.current;
    const card = el?.querySelector("figure");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + CARD_GAP), behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section id="opiniones" className={s.section} aria-labelledby="trust-heading">
      <div className={s.wrap}>
        <span className={s.eyebrow}>{t("EXPERIENCIAS CON NUESTRO EQUIPO", "EXPERIENCES WITH OUR TEAM")}</span>
        <h2 id="trust-heading">{t("Reseñas de nuestro equipo en Carrollton", "Reviews of our Carrollton team")}</h2>
        <div className={s.stage}>
          <div className={s.summary}>
            <p className={s.brand}>{t("Equipo de Carrollton", "Carrollton team")}</p>
            {summary ? (
              <>
                <span className={s.starRow} aria-label={t(`${summary.rating.toFixed(1)} de 5`, `${summary.rating.toFixed(1)} out of 5`)}>
                  <Stars rating={summary.rating} size={18} />
                </span>
                <p className={s.score}>{summary.rating.toFixed(1)}</p>
                <p className={s.count}>{countLabel}</p>
                <p className={s.note}>{note}</p>
              </>
            ) : null}
            {profileUrl ? (
              <a className={s.profile} href={profileUrl} target="_blank" rel="noopener noreferrer">
                {t("Ver el perfil en Google", "View the Google listing")}
              </a>
            ) : null}
            <a className={s.instagram} href={instagramProfileUrl} target="_blank" rel="noopener noreferrer">
              <Instagram size={16} aria-hidden="true" />
              {t("Ver en Instagram", "View on Instagram")}
            </a>
          </div>
          {items.length ? (
            <div className={s.rail}>
              <button type="button" className={`${s.arrow} ${s.prev}`} aria-label={t("Opinión anterior", "Previous review")} hidden={edges.start} onClick={() => move(-1)}>
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <div className={s.scroller} ref={scroller} tabIndex={0} aria-label={t("Opiniones públicas", "Public reviews")}>
                {items.map((review, index) => {
                  const href = review.authorUrl || review.url || profileUrl;
                  const initial = review.name.trim().charAt(0).toUpperCase() || "•";
                  return (
                    <figure className={s.card} key={`${review.name}-${index}`}>
                      <figcaption className={s.who}>
                        <span className={s.avatar} style={{ background: toneFor(review.name) }} aria-hidden="true">{initial}</span>
                        <span className={s.person}>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer">{review.name}</a>
                          ) : (
                            <span className={s.name}>{review.name}</span>
                          )}
                          {review.date ? <small>{review.date}</small> : null}
                        </span>
                        <span className={s.mark} aria-hidden="true">G</span>
                      </figcaption>
                      <span className={s.starRow} aria-label={`${review.rating} / 5`}>
                        <Stars rating={review.rating} size={14} />
                      </span>
                      <Quote text={review.text} more={t("Leer más", "Read more")} less={t("Leer menos", "Show less")} />
                    </figure>
                  );
                })}
              </div>
              <button type="button" className={`${s.arrow} ${s.next}`} aria-label={t("Opinión siguiente", "Next review")} hidden={edges.end} onClick={() => move(1)}>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <p className={s.empty}>{t("Conoce las experiencias compartidas en nuestro perfil público.", "Explore the experiences shared on our public profile.")}</p>
          )}
        </div>
        <p className={s.legal}>{t("Opiniones públicas del perfil de Google de nuestro equipo en Carrollton, publicado con el nombre Villard Agency, de la misma propiedad que Alleanza Insurance Corp. No indican si quien escribe es asegurado o forma parte del equipo, y no garantizan resultados de una póliza.", "Public reviews from the Google listing of our Carrollton team, published under the Villard Agency name, which shares ownership with Alleanza Insurance Corp. They do not say whether the writer is a policyholder or part of the team, and they do not guarantee policy results.")}</p>
      </div>
    </section>
  );
}
