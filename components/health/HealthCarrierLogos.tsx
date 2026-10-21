import { visibleHealthCarrierLogos } from "@/lib/content/health-carriers";
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
    <div className={c.inner}>
      <p id="carrier-logos-heading" className={c.heading}>{heading}</p>
      <div className={c.viewport}>
        <ul className={c.track}>
          {visibleHealthCarrierLogos.map(carrier => <li className={c.item} key={carrier.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={c.logo} src={carrier.src} alt={en ? carrier.altEn : carrier.altEs} width={carrier.width} height={carrier.height} />
          </li>)}
          {visibleHealthCarrierLogos.map(carrier => <li className={c.item} key={`${carrier.id}-clone`} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={c.logo} src={carrier.src} alt="" width={carrier.width} height={carrier.height} />
          </li>)}
        </ul>
      </div>
      <p className={c.note}>{note}</p>
    </div>
  </section>;
}
