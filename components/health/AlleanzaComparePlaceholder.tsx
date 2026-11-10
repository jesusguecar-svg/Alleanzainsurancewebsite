"use client";

import { useState } from "react";
import { ArrowRight, BadgePercent, Check, Eye, Heart, MessageCircle, Plus, ShieldCheck } from "lucide-react";
import { healthServices, healthServicesEn, type HealthServiceId } from "@/lib/content/health";
import u from "./health.module.css";
import c from "./compare.module.css";

const options = [
  { id: "aca", es: "Salud ACA", en: "ACA health", icon: Heart },
  { id: "private", es: "Salud privada", en: "Private health", icon: ShieldCheck },
  { id: "dental", es: "Dental y visión", en: "Dental & vision", icon: Eye },
  { id: "supplemental", es: "Protección adicional", en: "Extra protection", icon: Plus },
  { id: "discount", es: "Plan de Descuento", en: "Discount Plan", icon: BadgePercent },
] as const;

const noPeriod = (text: string) => text.replace(/\.$/, "");

// Local coverage-guide navigation. Replace this boundary when the live quoter is ready.
// No quote generation, availability lookup, or collection of personal information.
export function AlleanzaComparePlaceholder({ locale = "es" }: { locale?: "es" | "en" }) {
  const en = locale === "en";
  const [selected, setSelected] = useState<HealthServiceId>("aca");
  const services = en ? healthServicesEn : healthServices;
  const choice = services.find(service => service.id === selected)!;

  return <section id="compare" className={u.sec} aria-labelledby="compare-heading" data-component="alleanza-compare-placeholder">
    <div className={`${u.wrap} ${c.split}`}>
      <div>
        <p className={u.eyebrow}>{en ? "Alleanza Compare · Health" : "Alleanza Compare · Salud"}</p>
        <h2 id="compare-heading" className={u.h2}>{en ? "Your health, your options" : "Tu salud, tus opciones"}<br /><span className={u.soft}>{en ? "Find your coverage" : "Encuentra tu cobertura"}</span></h2>
        <p className={u.lead}>{en ? "Explore your options in one place. With guidance when you need it." : "Explora tus opciones en un solo lugar. Con orientación cuando la necesites."}</p>
        <div className={c.plan}>
          <p className={u.eyebrow}>{en ? "Let’s start with you" : "Empecemos por ti"}</p>
          <h3 className={u.h4}>{noPeriod(choice.short)}</h3>
          <ul className={u.checks}>{choice.details.map(detail => <li key={detail}><Check size={18} strokeWidth={1.5} aria-hidden="true" />{detail}</li>)}</ul>
          {selected === "discount" && <p className={`${u.small} ${c.planNote}`}>{en ? "A discount plan is not health insurance." : "Un plan de descuento no es un seguro médico."}</p>}
        </div>
      </div>
      <div>
        <fieldset className={c.picker}>
          <legend className={c.pickerQ}>{en ? "What would you like to explore?" : "¿Qué te gustaría explorar?"}</legend>
          <div className={c.opts}>{options.map(({ id, es, en: labelEn, icon: Icon }) => <label key={id} className={c.opt} data-selected={selected === id}>
            <input className={u.sr} type="radio" name="compare-interest" value={id} checked={selected === id} onChange={() => setSelected(id)} />
            <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{en ? labelEn : es}</span>
            <Check className={c.tick} size={18} strokeWidth={1.5} aria-hidden="true" />
          </label>)}</div>
          <div className={c.pickerGo}>
            <div><span className={u.small}>{en ? "Your starting point" : "Tu punto de partida"}</span><strong>{choice.title}</strong></div>
            <a className={`${u.btn} ${u.btnP}`} href={`#coverage-${selected}`} aria-label={`${en ? "Explore" : "Explorar"}: ${choice.title}`}>{en ? "Explore" : "Explorar"}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a>
          </div>
        </fieldset>
        <div className={c.pickerMeta}>
          <p className={u.small}>{en ? "At your pace · No obligation · English & Spanish" : "A tu ritmo · Sin compromiso · En español"}</p>
          <a className={u.link} href="#contacto" data-cta="health_compare_advisor" data-product-line="health"><MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />{en ? "Not sure where to start? Talk to an advisor" : "¿No sabes por dónde empezar? Habla con un asesor"}</a>
          <p className={u.small}>{en ? "Explore our coverage guide. Personalized online quotes are coming soon." : "Explora nuestra guía de coberturas. Las cotizaciones personalizadas en línea estarán disponibles próximamente."}</p>
        </div>
      </div>
    </div>
  </section>;
}
