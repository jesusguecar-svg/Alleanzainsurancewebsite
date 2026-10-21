import { Star } from "lucide-react";
import { credibilityContent } from "@/lib/content/health-credibility";
import { verifiedGoogleSummary, type GoogleReviews } from "@/lib/google-reviews";
import p from "./platform.module.css";
import c from "./credibility.module.css";

function checkedOnLabel(iso: string, locale: "es" | "en") {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function Stars({ rating }: { rating: number }) {
  return <span className={c.stars} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < Math.round(rating) ? "currentColor" : "none"} />)}</span>;
}

type Metric = {
  id: string;
  kind: "number" | "words";
  value: string;
  href?: string;
  external?: boolean;
  label: string;
  note: string;
  stars?: number;
  linkLabel?: string;
};

export function HealthCredibility({ locale = "es", reviews }: { locale?: "es" | "en"; reviews: GoogleReviews | null }) {
  const en = locale === "en";
  const copy = credibilityContent(locale);
  const google = verifiedGoogleSummary(reviews);
  const checked = google?.checkedOn ? checkedOnLabel(google.checkedOn, locale) : null;
  const metrics: Metric[] = [
    {
      id: "categories",
      kind: "number",
      value: String(copy.categoryCount),
      href: "#coberturas",
      label: copy.categoryLabel,
      note: copy.categoryNote,
      linkLabel: en ? `${copy.categoryCount} coverage categories in the health guide` : `${copy.categoryCount} categorías de cobertura en la guía de salud`,
    },
    {
      id: "language",
      kind: "words",
      value: copy.bilingualValue,
      label: copy.bilingualLabel,
      note: copy.bilingualNote,
    },
  ];
  if (google) {
    metrics.unshift({
      id: "google",
      kind: "number",
      value: google.rating.toFixed(1),
      href: google.url,
      external: true,
      label: en ? `${google.count} Google reviews` : `${google.count} reseñas en Google`,
      note: checked
        ? (en ? `Public profile, checked ${checked}. Not a count of customers.` : `Perfil público, revisado el ${checked}. No es un conteo de clientes.`)
        : (en ? "Public Google profile. Not a count of customers." : "Perfil público de Google. No es un conteo de clientes."),
      stars: google.rating,
      linkLabel: en ? `${google.rating.toFixed(1)} out of 5, ${google.count} Google reviews` : `${google.rating.toFixed(1)} de 5, ${google.count} reseñas en Google`,
    });
  }

  return <section className={`${p.section} ${c.credibility}`} aria-labelledby="credibility-heading" data-component="health-credibility">
    <div className={c.intro}>
      <h2 id="credibility-heading">{copy.headlineLead}<br /><em>{copy.headlineEmphasis}</em></h2>
      <p className={c.description}>{copy.description}</p>
    </div>
    <dl className={c.metrics} data-count={metrics.length}>
      {metrics.map(metric => <div className={c.metric} key={metric.id}>
        <dt className={c.label}>{metric.label}<small className={c.note}>{metric.note}</small></dt>
        <dd className={c.value} data-kind={metric.kind}>
          {metric.href ? <a href={metric.href} aria-label={metric.linkLabel} {...(metric.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{metric.value}</a> : metric.value}
          {metric.stars !== undefined && <Stars rating={metric.stars} />}
        </dd>
      </div>)}
    </dl>
    <ul className={c.benefits}>
      {copy.benefits.map(benefit => <li key={benefit.id}><h3>{benefit.title}</h3><p>{benefit.text}</p></li>)}
    </ul>
  </section>;
}
