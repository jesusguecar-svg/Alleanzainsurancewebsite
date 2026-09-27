"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, MousePointer2 } from "lucide-react";
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
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState("48");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // Choosing a city locks its office details in place until the visitor picks
  // another state or city; incidental map hover should not hide the address.
  const active = selectedCity ? selected : hovered || selected;
  const activeState = states.find(state => state.id === active)!;
  const activeStateName = locale === "en" ? stateNamesEn[activeState.id] : activeState.name;
  const activeOffices = offices.filter(office => office.stateId === active);
  const selectedOffice = selectedCity ? offices.find(office => office.stateId === selected && office.city === selectedCity) : undefined;
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateY = useSpring(x, { stiffness: 65, damping: 22 });
  const pointerTilt = useSpring(y, { stiffness: 65, damping: 22 });
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const scrollTilt = useTransform(scrollYProgress, [0, .5, 1], [15, 3, -5]);
  const rotateX = useTransform(() => reduced ? 0 : scrollTilt.get() + pointerTilt.get());
  const lightX = useMotionValue("50%"), lightY = useMotionValue("50%");

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width, py = (event.clientY - box.top) / box.height;
    x.set((px - .5) * 11); y.set((.5 - py) * 9);
    lightX.set(`${px * 100}%`); lightY.set(`${py * 100}%`);
    // Touch movement can inspect states while native vertical scrolling stays available.
    if (event.pointerType === "touch") {
      const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-state]");
      if (hit) setHovered(hit.getAttribute("data-state"));
    }
  }

  function choose(id: string, city: string | null = null) { setSelected(id); setSelectedCity(city); setHovered(null); }

  return (
    <section ref={root} id="presencia" className={s.coverage} aria-labelledby="coverage-heading">
      <div className={s.sectionTop}><span className={s.eyebrow}>{locale === "en" ? "02 / NEAR YOU" : "02 / CERCA DE TI"}</span><span className={s.liveLabel}><i /> {locale === "en" ? "Nationwide service" : "Presencia nacional"}</span></div>
      <div className={s.mapHeading}><h2 id="coverage-heading">{locale === "en" ? <>A whole country.<br /><em>An alliance with you.</em></> : <>Un país entero.<br /><em>Una alianza contigo.</em></>}</h2><p>{locale === "en" ? <>Across all 50 states, we speak your language.<br />Explore our offices and meet<br className={s.desktopBreak} /> your next ally.</> : <>En los 50 estados, hablamos tu idioma.<br />Descubre nuestras oficinas y encuentra<br className={s.desktopBreak} /> a tu próximo aliado.</>}</p></div>
      <div className={s.mapLayout}>
        <div className={s.mapStage} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); setHovered(null); }} onPointerUp={event => { if (event.pointerType === "touch" && hovered) choose(hovered); }}>
          <motion.div className={s.mapSpotlight} style={{ left: lightX, top: lightY }} aria-hidden="true" />
          <div className={s.mapFloor} aria-hidden="true" />
          <motion.div className={s.mapPlane} style={{ rotateX, rotateY: reduced ? 0 : rotateY }}>
            <svg viewBox="-65 -15 1050 665" className={s.mapSvg} aria-label={locale === "en" ? "Interactive map of the 50 United States" : "Mapa interactivo de los 50 estados de Estados Unidos"} role="group">
              <defs>
                <linearGradient id="health-state" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#496374" /><stop offset="1" stopColor="#1a2e3c" /></linearGradient>
                <linearGradient id="health-office" x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#b6effb" /><stop offset="1" stopColor="#439ebf" /></linearGradient>
                <linearGradient id="health-active" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0fcff" /><stop offset=".5" stopColor="#80e4ff" /><stop offset="1" stopColor="#04c0fe" /></linearGradient>
                <filter id="health-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" /></filter>
              </defs>
              <g transform="translate(0 12)" fill="#081824" stroke="#35546a" strokeWidth="1" aria-hidden="true">{states.map(state => <path key={state.id} d={state.path} />)}</g>
              {states.map(state => <path key={state.id} d={state.path} data-state={state.id} data-active={active === state.id} data-office={officeStates.has(state.id)} className={s.statePath} role="button" tabIndex={0} aria-label={`${locale === "en" ? stateNamesEn[state.id] : state.name}: ${officeStates.has(state.id) ? (locale === "en" ? "Alleanza offices" : "con oficinas Alleanza") : (locale === "en" ? "remote service" : "atención a distancia")}`} aria-pressed={selected === state.id} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(state.id); }} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(state.id)} onBlur={() => setHovered(null)} onClick={() => choose(state.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(state.id); } }} />)}
              <g aria-hidden="true" pointerEvents="none">{offices.map(office => <g key={office.city} transform={`translate(${office.point[0]} ${office.point[1] - (active === office.stateId ? 7 : 0)})`} className={s.mapPin} data-active={office.stateId === active}>
                <circle r="15" fill="#7feaff" opacity=".32" filter="url(#health-glow)" /><circle className={s.pinPulse} r="12" /><line y1="-23" y2="0" stroke="#bdf5ff" strokeWidth="1.5" /><circle cy="-24" r="5" fill="#fff" stroke="#04c0fe" strokeWidth="2" /><circle r="3" fill="#ecffff" />
              </g>)}</g>
              <g className={s.mapLabels} aria-hidden="true"><text x="125" y="553">ALASKA</text><text x="305" y="566">{locale === "en" ? "HAWAII" : "HAWÁI"}</text></g>
            </svg>
          </motion.div>
          <div className={s.mapHint}><MousePointer2 size={13} /> {locale === "en" ? "Explore with your cursor or tap a state" : "Explora con el cursor o toca un estado"}</div>
        </div>
        <aside className={s.mapDetail} aria-label={locale === "en" ? "Selected state" : "Estado seleccionado"}>
          <div className={s.detailTop}><span className={s.eyebrow}>{locale === "en" ? "YOUR LOCAL ALLIANCE" : "TU ALIANZA LOCAL"}</span><MapPin size={18} /></div>
          <div aria-live="polite" aria-atomic="true"><span className={s.stateNumber}>{activeState.id}</span><h3>{activeStateName}</h3><p>{activeOffices.length ? (locale === "en" ? "Real people. Close to you." : "Personas reales. Cerca de ti.") : (locale === "en" ? "Distance does not separate us." : "La distancia no nos separa.")}</p>
          <div className={s.officeList}>{activeOffices.length ? activeOffices.map(office => <button key={office.city} type="button" data-selected={selectedCity === office.city && active === selected} onClick={() => choose(office.stateId, office.city)}><span><i />{office.city}</span><ArrowUpRight size={15} /></button>) : <div className={s.remoteOffice}><span className={s.statusDot} /> {locale === "en" ? "Guidance by phone or video call" : "Asesoría por teléfono o videollamada"}</div>}</div></div>
          {selectedCity && active === selected ? <AgentSearch city={selectedCity} locale={locale} addressLine={selectedOffice?.addressLine} localityLine={selectedOffice?.localityLine} mapUrl={selectedOffice?.mapUrl} /> : <p className={s.officeNote}>{active === "49" ? (locale === "en" ? "Service in Utah. Ask our team for location details." : "Presencia en Utah. Consulta la ubicación con nuestro equipo.") : activeOffices.length ? (locale === "en" ? "Choose a city to meet its agents." : "Elige una ciudad para conocer a sus agentes.") : (locale === "en" ? "We can guide you in English or Spanish, wherever you are." : "Te orientamos en español, estés donde estés.")}</p>}
          <button type="button" className={s.mapCta} onClick={() => onChoose(active)}>{locale === "en" ? "Talk to an agent" : "Hablar con un asesor"} <ArrowUpRight size={17} /></button>
        </aside>
      </div>
      <div className={s.mapBottom}><div className={s.legend}><span><i /> {locale === "en" ? "Service in all 50 states" : "Atención en 50 estados"}</span><span><i /> {locale === "en" ? "States with offices" : "Estados con oficinas"}</span></div><label className={s.stateSelect}>{locale === "en" ? "Go to a state" : "Ir a un estado"} <select value={selected} onChange={event => choose(event.target.value)}>{states.map(state => <option key={state.id} value={state.id}>{locale === "en" ? stateNamesEn[state.id] : state.name}</option>)}</select></label></div>
      <div className={s.officeRail}>{offices.map(office => <button key={office.city} type="button" aria-pressed={selected === office.stateId && selectedCity === office.city} onClick={() => choose(office.stateId, office.city)}>{office.city}<span>{office.state === office.city ? (locale === "en" ? "USA" : "EE. UU.") : office.state}</span></button>)}</div>
      {selectedOffice?.addressLine && selectedOffice.localityLine && selectedOffice.mapUrl && <a className={s.railOfficeAddress} href={selectedOffice.mapUrl} target="_blank" rel="noopener noreferrer"><span className={s.railAddressIcon}><MapPin size={18} /></span><span><small>{locale === "en" ? `${selectedOffice.city.toUpperCase()} OFFICE` : `OFICINA DE ${selectedOffice.city.toUpperCase()}`}</small><strong>{selectedOffice.addressLine}</strong><em>{selectedOffice.localityLine}</em></span><span className={s.railAddressAction}>{locale === "en" ? "Open in Google Maps" : "Abrir en Google Maps"} <ArrowUpRight size={15} /></span></a>}
      <p className={s.mapDisclaimer}>{locale === "en" ? "Plan, benefit, and licensed-agent availability varies by state. Alaska and Hawaii are shown in insets at different scales." : "La disponibilidad de planes, beneficios y agentes autorizados varía según el estado. Alaska y Hawái se muestran en recuadros a distinta escala."}</p>
    </section>
  );
}
