"use client";

import { useState } from "react";
import { ArrowRight, Check, Compass, Eye, Heart, Plus, MapPin } from "lucide-react";
import p from "./platform.module.css";

// Future Alleanza Compare quoter mounts here.
// Do not couple surrounding layout to placeholder internals.
// Future implementation will include routing for ACA,
// private medical, dental/vision, supplemental,
// CRM session tracking, and advisor assistance.
// This preview is deliberately local UI only: no quotes, ZIP lookup, persistence,
// lead capture, eligibility assessment, carrier routing, or network requests.
// Replace this component through the #compare mount without changing page layout.
export function AlleanzaComparePlaceholder({ locale = "es" }: { locale?: "es" | "en" }) {
  const en = locale === "en";
  const [selected, setSelected] = useState("guidance");
  const options = [
    { id: "health", label: en ? "Health" : "Salud", icon: Heart, href: "#coverage-aca" },
    { id: "dental", label: en ? "Dental & vision" : "Dental y visión", icon: Eye, href: "#coverage-dental" },
    { id: "supplemental", label: en ? "Extra protection" : "Protección adicional", icon: Plus, href: "#coverage-supplemental" },
    { id: "guidance", label: en ? "I’m not sure" : "No estoy seguro", icon: Compass, href: "#coberturas" },
  ];
  const choice = options.find(option => option.id === selected)!;

  return <div className={p.compareCard} data-component="alleanza-compare-placeholder">
    <div className={p.compareBrand}><span>ALLEANZA <strong>COMPARE</strong></span><span className={p.previewBadge}>{en ? "PREVIEW" : "VISTA PREVIA"}</span></div>
    <div className={p.compareQuestion}><span className={p.stepNumber}>01</span><h3>{en ? "Where do you need coverage?" : "¿Dónde necesitas cobertura?"}</h3></div>
    <div className={p.zipPreview} aria-label={en ? "ZIP code field preview; not active yet" : "Vista previa del campo de código postal; aún no activo"}><MapPin size={19} aria-hidden="true" /><span>{en ? "ZIP code" : "Código postal"}</span><span aria-hidden="true">— — — — —</span></div>
    <p className={p.previewHint}>{en ? "Location search will be available in Alleanza Compare." : "La búsqueda por ubicación estará disponible en Alleanza Compare."}</p>
    <fieldset className={p.compareOptions}><legend><span className={p.stepNumber}>02</span>{en ? "What would you like to explore?" : "¿Qué tipo de cobertura buscas?"}</legend>
      <div>{options.map(({ id, label, icon: Icon }) => <label key={id} className={p.coverageOption} data-selected={selected === id}>
        <input type="radio" name="compare-interest" value={id} checked={selected === id} onChange={() => setSelected(id)} />
        <Icon size={22} strokeWidth={1.4} aria-hidden="true" /><span>{label}</span><Check className={p.optionCheck} size={15} aria-hidden="true" />
      </label>)}</div>
    </fieldset>
    <a className={p.primary} href={choice.href}>{en ? "Explore coverage types" : "Explorar tipos de cobertura"}<ArrowRight size={18} aria-hidden="true" /></a>
    <p className={p.compareFootnote}>{en ? "For now, explore our coverage guide. Online comparison is in development; this preview does not generate quotes or check availability." : "Por ahora, explora nuestra guía de coberturas. La comparación en línea está en desarrollo; esta vista previa no genera cotizaciones ni consulta disponibilidad."}</p>
  </div>;
}
