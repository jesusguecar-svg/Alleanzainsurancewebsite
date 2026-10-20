"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BadgePercent, Check, ChevronRight, Eye, Heart, IdCard, MessageCircle, Plus, ShieldCheck } from "lucide-react";
import { healthServices, healthServicesEn, type HealthServiceId } from "@/lib/content/health";
import c from "./compare.module.css";

const options = [
  { id: "aca", es: "Salud ACA", en: "ACA health", icon: Heart },
  { id: "private", es: "Salud privada", en: "Private health", icon: ShieldCheck },
  { id: "dental", es: "Dental y visión", en: "Dental & vision", icon: Eye },
  { id: "supplemental", es: "Protección adicional", en: "Extra protection", icon: Plus },
  { id: "discount", es: "Plan de Descuento", en: "Discount Plan", icon: BadgePercent },
  { id: "medicare", es: "Medicare", en: "Medicare", icon: IdCard },
] as const;

// Local coverage-guide navigation. Replace this boundary when the live quoter is ready.
// No quote generation, availability lookup, or collection of personal information.
export function AlleanzaComparePlaceholder({ locale = "es" }: { locale?: "es" | "en" }) {
  const en = locale === "en";
  const [selected, setSelected] = useState<HealthServiceId>("aca");
  const services = en ? healthServicesEn : healthServices;
  const choice = services.find(service => service.id === selected)!;

  return <section id="compare" className={c.section} aria-labelledby="compare-heading" data-component="alleanza-compare-placeholder">
    <div className={c.layout}>
      <div className={c.copy}>
        <span className={c.brand}>ALLEANZA <strong>COMPARE</strong><span>{en ? "HEALTH" : "SALUD"}</span></span>
        <h2 id="compare-heading">{en ? "Your health. Your options." : "Tu salud. Tus opciones."}<br /><em>{en ? "Find your coverage." : "Encuentra tu cobertura."}</em></h2>
        <p className={c.intro}>{en ? "Explore your options in one place. With guidance when you need it." : "Explora tus opciones en un solo lugar. Con orientación cuando la necesites."}</p>
        <fieldset className={c.options}>
          <legend>{en ? "What would you like to explore?" : "¿Qué te gustaría explorar?"}</legend>
          <div className={c.tiles}>{options.map(({ id, es, en: labelEn, icon: Icon }) => <label key={id} className={c.option} data-selected={selected === id}>
            <input type="radio" name="compare-interest" value={id} checked={selected === id} onChange={() => setSelected(id)} />
            <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
            <span>{en ? labelEn : es}</span>
            <Check className={c.selectedCheck} size={12} aria-hidden="true" />
          </label>)}</div>
        </fieldset>
        <div className={c.exploreBar}>
          <div><span>{en ? "YOUR STARTING POINT" : "TU PUNTO DE PARTIDA"}</span><strong>{choice.title}</strong></div>
          <a href={`#coverage-${selected}`} aria-label={`${en ? "Explore" : "Explorar"}: ${choice.title}`}>{en ? "Explore" : "Explorar"}<ArrowRight size={20} aria-hidden="true" /></a>
        </div>
        <ul className={c.assurances}>
          <li><Check size={14} aria-hidden="true" />{en ? "At your pace" : "A tu ritmo"}</li>
          <li><Check size={14} aria-hidden="true" />{en ? "No obligation" : "Sin compromiso"}</li>
          <li><Check size={14} aria-hidden="true" />{en ? "English & Spanish" : "En español"}</li>
        </ul>
        <a className={c.advisor} href="#contacto"><MessageCircle size={17} aria-hidden="true" />{en ? "Not sure where to start? Talk to an advisor." : "¿No sabes por dónde empezar? Habla con un asesor."}<ArrowUpRight size={15} aria-hidden="true" /></a>
        <p className={c.note}>{en ? "Explore our coverage guide. Personalized online quotes are coming soon." : "Explora nuestra guía de coberturas. Las cotizaciones personalizadas en línea estarán disponibles próximamente."}</p>
      </div>
      <div className={c.visual}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.photo} src="/cinematic/people/salud.jpg" alt={en ? "A mother and daughter sharing a hug" : "Una madre y su hija comparten un abrazo"} width={1536} height={1024} loading="lazy" />
        <div className={c.device} aria-hidden="true">
          <div className={c.deviceScreen}>
            <div className={c.deviceStatus}><span>9:41</span><span>●●●　◉</span></div>
            <div className={c.deviceBrand}><span className={c.brandMark}>A</span><span><strong>ALLEANZA</strong><small>Health &amp; Life Insurance</small></span></div>
            <div className={c.deviceHeading}><strong>{en ? "Coverage options" : "Opciones de cobertura"}</strong><span>{en ? "Explore a path that fits you" : "Explora un camino para ti"}</span></div>
            <div className={c.deviceOptions}>{options.map(({ id, es, en: labelEn, icon: Icon }) => <div key={id} data-selected={selected === id} className={c.deviceOption}>
              <span className={c.deviceIcon}><Icon size={14} aria-hidden="true" /></span>
              <span className={c.deviceOptionCopy}><strong>{en ? labelEn : es}</strong><small>{services.find(service => service.id === id)?.short}</small></span>
              <ChevronRight size={14} aria-hidden="true" />
            </div>)}</div>
            <p className={c.deviceLegal}>{en ? "Illustrative preview. No prices or plan availability shown." : "Vista ilustrativa. No muestra precios ni disponibilidad de planes."}</p>
          </div>
        </div>
        <div className={c.guide}>
          <span className={c.guideEyebrow}>{en ? "LET’S START WITH YOU" : "EMPECEMOS POR TI"}<Heart size={16} aria-hidden="true" /></span>
          <strong>{choice.short}</strong>
          <ul>{choice.details.map(detail => <li key={detail}><Check size={14} aria-hidden="true" />{detail}</li>)}</ul>
          {selected === "discount" && <p>{en ? "A discount plan is not health insurance." : "Un plan de descuento no es un seguro médico."}</p>}
        </div>
      </div>
    </div>
  </section>;
}
