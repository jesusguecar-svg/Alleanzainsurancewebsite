import { BookOpen, Clock, Compass, Languages, LayoutGrid, MapPin, MessageCircle, ShieldCheck, Star, Users, type LucideIcon } from "lucide-react";
import { credibilityContent, type CredibilityFact } from "@/lib/content/health-credibility";
import { verifiedGoogleSummary, type GoogleReviews } from "@/lib/google-reviews";
import p from "./platform.module.css";
import c from "./credibility.module.css";

const factIcons: Record<string, LucideIcon> = {
  subscribers: Users,
  google: Star,
  categories: LayoutGrid,
  founded: MapPin,
  bbb: ShieldCheck,
  service: Clock,
};

const benefitIcons: Record<string, LucideIcon> = {
  explore: Compass,
  human: MessageCircle,
  informed: BookOpen,
  language: Languages,
};

export function HealthCredibility({ locale = "es", reviews }: { locale?: "es" | "en"; reviews: GoogleReviews | null }) {
  const en = locale === "en";
  const copy = credibilityContent(locale);
  const google = verifiedGoogleSummary(reviews);
  const facts: CredibilityFact[] = [...copy.facts];
  if (google) {
    facts.splice(1, 0, {
      id: "google",
      value: google.rating.toFixed(1),
      label: en ? `${google.count} Google reviews` : `${google.count} reseñas en Google`,
      note: en ? "Public profile. Not a customer count." : "Perfil público. No es un conteo de clientes.",
      href: google.url,
      external: true,
      linkLabel: en ? `${google.rating.toFixed(1)} out of 5, ${google.count} Google reviews` : `${google.rating.toFixed(1)} de 5, ${google.count} reseñas en Google`,
    });
  }

  return <section id="credibilidad" className={`${p.section} ${c.credibility}`} aria-labelledby="credibility-heading" data-component="health-credibility">
    <div className={c.intro}>
      <h2 id="credibility-heading">{copy.headlineLead} <em>{copy.headlineEmphasis}</em></h2>
      <p className={c.description}>{copy.description}</p>
    </div>
    <dl className={c.metrics}>
      {facts.map(fact => {
        const Icon = factIcons[fact.id] ?? ShieldCheck;
        return <div className={c.metric} key={fact.id}>
          <span className={c.mark} aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
          <dt className={c.label}>{fact.label}<small className={c.note}>{fact.note}</small></dt>
          <dd className={c.value}>{fact.href ? <a href={fact.href} aria-label={fact.linkLabel} {...(fact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{fact.value}</a> : fact.value}</dd>
        </div>;
      })}
    </dl>
    <ul className={c.benefits}>
      {copy.benefits.map(benefit => {
        const Icon = benefitIcons[benefit.id] ?? Compass;
        return <li key={benefit.id}><span className={c.benefitMark} aria-hidden="true"><Icon size={16} strokeWidth={1.75} /></span><h3>{benefit.title}</h3><p>{benefit.text}</p></li>;
      })}
    </ul>
  </section>;
}
