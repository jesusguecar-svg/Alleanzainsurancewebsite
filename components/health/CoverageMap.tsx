"use client";

import { useState, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, MapPin, MousePointer2, Phone } from "lucide-react";
import states from "./us-states.json";
import { healthOffices } from "@/lib/content/health";
import { AgentSearch } from "./AgentSearch";
import { stateNamesEn } from "./state-names";
import s from "./health.module.css";

// Same Albers projection as us-atlas: scale 1300, translate [487.5, 305].
function project(coordinates: readonly number[]) {
  const r = Math.PI / 180, n = (Math.sin(29.5 * r) + Math.sin(45.5 * r)) / 2;
  const c = 1 + Math.sin(29.5 * r) * (2 * n - Math.sin(29.5 * r));
  const raw = (lon: number, lat: number) => { const rho = Math.sqrt(c - 2 * n * Math.sin(lat * r)) / n; return [rho * Math.sin(lon * r * n), -rho * Math.cos(lon * r * n)]; };
  const center = raw(-.6, 38.7), point = raw(coordinates[0] + 96, coordinates[1]);
  return [487.5 + 1300 * (point[0] - center[0]), 305 - 1300 * (point[1] - center[1])];
}

const offices = healthOffices.map(o => ({
  ...o,
  point: project(o.coordinates),
  addressLine: "addressLine" in o ? o.addressLine : undefined,
  localityLine: "localityLine" in o ? o.localityLine : undefined,
  mapUrl: "mapUrl" in o ? o.mapUrl : undefined,
}));
const officeStates = new Set<string>(offices.map(o => o.stateId));

export function CoverageMap({ onChoose, locale = "es" }: { onChoose: (state: string) => void; locale?: "es" | "en" }) {
  const en = locale === "en";
  const [selected, setSelected] = useState("48");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // Choosing a city locks its office details in place until the visitor picks
  // another state or city; incidental map hover should not hide the address.
  const active = selectedCity ? selected : hovered || selected;
  const activeState = states.find(state => state.id === active)!;
  const activeStateName = en ? stateNamesEn[activeState.id] : activeState.name;
  const activeOffices = offices.filter(office => office.stateId === active);
  const selectedOffice = selectedCity ? offices.find(office => office.stateId === selected && office.city === selectedCity) : undefined;

  function move(event: PointerEvent<HTMLDivElement>) {
    // Touch movement can inspect states while native vertical scrolling stays available.
    if (event.pointerType !== "touch") return;
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-state]");
    if (hit) setHovered(hit.getAttribute("data-state"));
  }

  function choose(id: string, city: string | null = null) { setSelected(id); setSelectedCity(city); setHovered(null); }

  return (
    <section id="presencia" className={`${s.sec} ${s.dark}`} aria-labelledby="coverage-heading">
      <div className={s.wrap}>
        <div className={s.mapHead}>
          <div>
            <p className={s.eyebrow}>{en ? "Near you · Nationwide agent network" : "Cerca de ti · Red nacional de agentes"}</p>
            <h2 id="coverage-heading" className={s.h2}>{en ? <>A whole country<br /><span className={s.soft}>An alliance with you</span></> : <>Un país entero<br /><span className={s.soft}>Una alianza contigo</span></>}</h2>
          </div>
          <p className={s.lead}>{en ? "A network of licensed agents serving clients across all 50 states. Product availability varies by state, applicable licensing, and eligibility. Explore the areas we serve and meet your next ally." : "Red de agentes licenciados con capacidad de atención en los 50 estados. La disponibilidad de productos depende del estado, las licencias aplicables y la elegibilidad. Explora nuestras áreas de atención y encuentra a tu próximo aliado."}</p>
        </div>
        <div className={s.mapGrid}>
          <div onPointerMove={move} onPointerLeave={() => setHovered(null)} onPointerUp={event => { if (event.pointerType === "touch" && hovered) choose(hovered); }}>
            <svg viewBox="-65 -15 1050 665" className={s.mapSvg} aria-label={en ? "Interactive map of the 50 United States" : "Mapa interactivo de los 50 estados de Estados Unidos"} role="group">
              {states.map(state => <path key={state.id} d={state.path} data-state={state.id} data-active={active === state.id} data-office={officeStates.has(state.id)} className={s.statePath} role="button" tabIndex={0} aria-label={`${en ? stateNamesEn[state.id] : state.name}: ${officeStates.has(state.id) ? (en ? "Alleanza service area" : "área de atención Alleanza") : (en ? "remote service" : "atención a distancia")}`} aria-pressed={selected === state.id} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(state.id); }} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(state.id)} onBlur={() => setHovered(null)} onClick={() => choose(state.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(state.id); } }} />)}
              <g aria-hidden="true">{offices.map(office => <circle key={office.city} className={s.pin} cx={office.point[0]} cy={office.point[1]} r="5" />)}</g>
              <g className={s.mapLabels} aria-hidden="true"><text x="125" y="553">Alaska</text><text x="305" y="566">{en ? "Hawaii" : "Hawái"}</text></g>
            </svg>
            <p className={s.hint}><MousePointer2 size={18} strokeWidth={1.5} aria-hidden="true" />{en ? "Explore with your cursor or tap a state" : "Explora con el cursor o toca un estado"}</p>
          </div>
          <aside className={s.panel} aria-label={en ? "Selected state" : "Estado seleccionado"}>
            <div className={s.panelTop}><p className={s.eyebrow}>{en ? "Your local alliance" : "Tu alianza local"}</p><MapPin size={18} strokeWidth={1.5} aria-hidden="true" /></div>
            <div aria-live="polite" aria-atomic="true">
              <h3 className={s.h3}>{activeStateName}</h3>
              <p className={s.small}>{activeOffices.length ? (en ? "Real people, close to you" : "Personas reales, cerca de ti") : (en ? "Distance does not separate us" : "La distancia no nos separa")}</p>
              {activeOffices.length ? <div className={s.cities}>{activeOffices.map(office => <button key={office.city} type="button" className={s.city} data-selected={selectedCity === office.city && active === selected} onClick={() => choose(office.stateId, office.city)}><span>{office.city}</span><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>)}</div> : <div className={s.remoteLine}><Phone size={18} strokeWidth={1.5} aria-hidden="true" />{en ? "Guidance by phone or video call" : "Asesoría por teléfono o videollamada"}</div>}
            </div>
            {selectedCity && active === selected ? <AgentSearch city={selectedCity} locale={locale} addressLine={selectedOffice?.addressLine} localityLine={selectedOffice?.localityLine} mapUrl={selectedOffice?.mapUrl} /> : <p className={s.fine}>{active === "49" ? (en ? "Service in Utah. Ask our team for location details." : "Presencia en Utah. Consulta la ubicación con nuestro equipo.") : activeOffices.length ? (en ? "Choose a city to meet its agents." : "Elige una ciudad para conocer a sus agentes.") : (en ? "We can guide you in English or Spanish, wherever you are." : "Te orientamos en español, estés donde estés.")}</p>}
            <button type="button" className={`${s.btn} ${s.btnP} ${s.panelCta}`} onClick={() => onChoose(active)}>{en ? "Talk to an agent" : "Hablar con un asesor"}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
          </aside>
        </div>
        <div className={s.areas}>
          <p className={`${s.eyebrow} ${s.areasLabel}`}><span className={s.swatch} aria-hidden="true" />{en ? "Service areas" : "Áreas de atención"}</p>
          <ul className={s.areaList}>{offices.map(office => <li key={office.city}><button type="button" className={s.areaButton} aria-pressed={selected === office.stateId && selectedCity === office.city} onClick={() => choose(office.stateId, office.city)}>{office.city}<span>{office.state === office.city ? (en ? "USA" : "EE. UU.") : office.state}</span></button></li>)}</ul>
          <label className={s.stateSelect}>{en ? "Go to a state" : "Ir a un estado"} <select value={selected} onChange={event => choose(event.target.value)}>{states.map(state => <option key={state.id} value={state.id}>{en ? stateNamesEn[state.id] : state.name}</option>)}</select></label>
        </div>
        {selectedOffice?.addressLine && selectedOffice.localityLine && selectedOffice.mapUrl && <a className={s.railAddress} href={selectedOffice.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} strokeWidth={1.5} aria-hidden="true" /><span><small>{en ? "Main office · Carrollton" : "Oficina principal · Carrollton"}</small><strong>{selectedOffice.addressLine}</strong><em>{selectedOffice.localityLine}</em></span><span className={s.railAction}>{en ? "Open in Google Maps" : "Abrir en Google Maps"}<ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" /></span></a>}
        <p className={`${s.fine} ${s.mapFine}`}>{en ? "Plan, benefit, and licensed-agent availability varies by state. The cities shown are service areas; our physical main office is in Carrollton, Texas. Alaska and Hawaii are shown in insets at different scales." : "La disponibilidad de planes, beneficios y agentes autorizados varía según el estado. Las ciudades indicadas son áreas de atención; nuestra oficina física principal está en Carrollton, Texas. Alaska y Hawái se muestran en recuadros a distinta escala."}</p>
      </div>
    </section>
  );
}
