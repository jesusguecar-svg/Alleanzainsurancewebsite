import { visibleHealthCarrierLogos } from "@/lib/content/health-carriers";
import u from "./health.module.css";
import c from "./carrier-logos.module.css";

export function HealthCarrierLogos({ locale = "es" }: { locale?: "es" | "en" }) {
  const en = locale === "en";
  const heading = en
    ? "Meet some of our insurers and coverage options"
    : "Conoce algunas de nuestras aseguradoras y opciones de cobertura";
  const note = en
    ? "Insurer, product, and plan availability varies by your location and eligibility."
    : "La disponibilidad de aseguradoras, productos y planes varía según tu ubicación y elegibilidad.";

  return <section className={c.strip} aria-labelledby="carrier-logos-heading" data-component="health-carrier-logos">
    <div className={u.wrap}>
      <p id="carrier-logos-heading" className={u.eyebrow}>{heading}</p>
      <ul className={c.row}>
        {visibleHealthCarrierLogos.map(carrier => <li key={carrier.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={carrier.width === carrier.height ? c.square : c.logo} src={carrier.src} alt={en ? carrier.altEn : carrier.altEs} width={carrier.width} height={carrier.height} loading="lazy" />
        </li>)}
      </ul>
      <p className={u.fine}>{note}</p>
    </div>
  </section>;
}
