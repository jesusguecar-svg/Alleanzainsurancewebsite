import { credibilityContent, type CredibilityFact } from "@/lib/content/health-credibility";
import { verifiedGoogleSummary, type GoogleReviews } from "@/lib/google-reviews";
import u from "./health.module.css";
import c from "./credibility.module.css";

export function HealthCredibility({ locale = "es", reviews }: { locale?: "es" | "en"; reviews: GoogleReviews | null }) {
  const en = locale === "en";
  const copy = credibilityContent(locale);
  const google = verifiedGoogleSummary(reviews);
  const facts: CredibilityFact[] = [...copy.facts];
  if (google) {
    facts.splice(1, 0, {
      id: "google",
      value: google.rating.toFixed(1),
      label: en ? `${google.count} Google reviews of our Carrollton team` : `${google.count} reseñas en Google de nuestro equipo en Carrollton`,
      note: en ? "Listing published as Villard Agency, same ownership. Not a customer count." : "Perfil publicado como Villard Agency, misma propiedad. No es un conteo de clientes.",
      href: google.url,
      external: true,
      linkLabel: en ? `${google.rating.toFixed(1)} out of 5, ${google.count} Google reviews of our Carrollton team (Villard Agency listing)` : `${google.rating.toFixed(1)} de 5, ${google.count} reseñas en Google de nuestro equipo en Carrollton (perfil de Villard Agency)`,
    });
  }

  return <section id="credibilidad" className={`${u.sec} ${u.white}`} aria-labelledby="credibility-heading" data-component="health-credibility">
    <div className={u.wrap}>
      <div className={c.head}>
        <h2 id="credibility-heading" className={u.h2}>{copy.headlineLead}<br /><span className={u.soft}>{copy.headlineEmphasis}</span></h2>
        <p className={u.lead}>{copy.description}</p>
      </div>
      <dl className={c.stats}>
        {facts.map(fact => <div className={c.stat} key={fact.id}>
          <dt>{fact.label}</dt>
          <dd className={`${c.value} ${u.num}`}>{fact.href ? <a href={fact.href} aria-label={fact.linkLabel} {...(fact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{fact.value}</a> : fact.value}</dd>
          <dd className={u.fine}>{fact.note}</dd>
        </div>)}
      </dl>
      <ul className={c.feats}>
        {copy.benefits.map(benefit => <li key={benefit.id}><h3>{benefit.title}</h3><p className={u.small}>{benefit.text}</p></li>)}
      </ul>
    </div>
  </section>;
}
