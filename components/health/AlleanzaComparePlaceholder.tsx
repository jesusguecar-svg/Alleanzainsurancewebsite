"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BadgePercent, Check, ChevronRight, Eye, Heart, IdCard, MessageCircle, Plus, ShieldCheck, Sun } from "lucide-react";
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

const illustrativePlans = [
  { name: "ambetter.", tierEs: "Plata", tierEn: "Silver", price: 30, brand: "ambetter" },
  { name: "Oscar", tierEs: "Bronce", tierEn: "Bronze", price: 42, brand: "oscar" },
  { name: "Community Health Choice", tierEs: "Plata", tierEn: "Silver", price: 68, brand: "community" },
  { name: "UnitedHealthcare", tierEs: "Plata", tierEn: "Silver", price: 85, brand: "united" },
  { name: "cigna", tierEs: "Oro", tierEn: "Gold", price: 129, brand: "cigna" },
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
        <div className={c.device}>
          <div className={c.deviceScreen}>
            <div className={c.deviceStatus} aria-hidden="true"><span>9:41</span><span>●●●　◉</span></div>
            <div className={c.deviceBrand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/alleanza/logo-primary-horizontal.svg" alt="Alleanza Health & Life Insurance" width="160" height="26" />
            </div>
            <div className={c.deviceHeading}><span className={c.sampleBadge}>{en ? "ILLUSTRATIVE PRICES · NOT REAL QUOTES" : "PRECIOS ILUSTRATIVOS · NO SON COTIZACIONES REALES"}</span><strong>{en ? "Health plans for you" : "Planes de salud para ti"}</strong><span>{en ? "5 visual examples" : "5 ejemplos visuales"}</span></div>
            <div className={c.planOptions}>{illustrativePlans.map(plan => <div key={plan.brand} className={c.planOption}>
              {plan.brand === "community" && <Sun className={c.communityMark} size={22} strokeWidth={2.6} aria-hidden="true" />}
              <span className={`${c.planWordmark} ${c[plan.brand]}`}>{plan.name}</span>
              <span className={c.planPrice}><strong>${plan.price}</strong><span>{en ? "/mo" : "/mes"}</span></span>
              <ChevronRight size={13} aria-hidden="true" />
              <small>{en ? plan.tierEn : plan.tierEs}</small>
            </div>)}</div>
            <p className={c.deviceLegal}>{en ? "Design examples only. These are not available offers or actual quotes. Rates and eligibility vary by location and situation." : "Ejemplos de diseño. No son ofertas disponibles ni cotizaciones reales. Los precios y la elegibilidad varían según ubicación y situación."}</p>
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
