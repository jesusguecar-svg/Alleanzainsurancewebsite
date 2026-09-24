"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, MousePointer2 } from "lucide-react";
import states from "./us-states.json";
import { healthOffices } from "@/lib/content/health";
import s from "./health.module.css";

// Same Albers projection as us-atlas: scale 1300, translate [487.5, 305].
function project(coordinates: readonly number[]) {
  const r = Math.PI / 180, n = (Math.sin(29.5 * r) + Math.sin(45.5 * r)) / 2;
  const c = 1 + Math.sin(29.5 * r) * (2 * n - Math.sin(29.5 * r));
  const raw = (lon: number, lat: number) => { const rho = Math.sqrt(c - 2 * n * Math.sin(lat * r)) / n; return [rho * Math.sin(lon * r * n), -rho * Math.cos(lon * r * n)]; };
  const center = raw(-.6, 38.7), point = raw(coordinates[0] + 96, coordinates[1]);
  return [487.5 + 1300 * (point[0] - center[0]), 305 - 1300 * (point[1] - center[1])];
}

const offices = healthOffices.map(o => ({ ...o, point: project(o.coordinates) }));
const officeStates = new Set<string>(offices.map(o => o.stateId));

export function CoverageMap({ onChoose }: { onChoose: (state: string) => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState("48");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const active = hovered || selected;
  const activeState = states.find(state => state.id === active)!;
  const activeOffices = offices.filter(office => office.stateId === active);
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
      <div className={s.sectionTop}><span className={s.eyebrow}>02 / CERCA DE TI</span><span className={s.liveLabel}><i /> Presencia nacional</span></div>
      <div className={s.mapHeading}><h2 id="coverage-heading">Un país entero.<br /><em>Una alianza contigo.</em></h2><p>En los 50 estados, hablamos tu idioma.<br />Descubre nuestras oficinas y encuentra<br className={s.desktopBreak} /> a tu próximo aliado.</p></div>
      <div className={s.mapLayout}>
        <div className={s.mapStage} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); setHovered(null); }} onPointerUp={event => { if (event.pointerType === "touch" && hovered) choose(hovered); }}>
          <motion.div className={s.mapSpotlight} style={{ left: lightX, top: lightY }} aria-hidden="true" />
          <div className={s.mapFloor} aria-hidden="true" />
          <motion.div className={s.mapPlane} style={{ rotateX, rotateY: reduced ? 0 : rotateY }}>
            <svg viewBox="-65 -15 1050 665" className={s.mapSvg} aria-label="Mapa interactivo de los 50 estados de Estados Unidos" role="group">
              <defs>
                <linearGradient id="health-state" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#496374" /><stop offset="1" stopColor="#1a2e3c" /></linearGradient>
                <linearGradient id="health-office" x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#b6effb" /><stop offset="1" stopColor="#439ebf" /></linearGradient>
                <linearGradient id="health-active" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0fcff" /><stop offset=".5" stopColor="#80e4ff" /><stop offset="1" stopColor="#04c0fe" /></linearGradient>
                <filter id="health-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" /></filter>
              </defs>
              <g transform="translate(0 12)" fill="#081824" stroke="#35546a" strokeWidth="1" aria-hidden="true">{states.map(state => <path key={state.id} d={state.path} />)}</g>
              {states.map(state => <path key={state.id} d={state.path} data-state={state.id} data-active={active === state.id} data-office={officeStates.has(state.id)} className={s.statePath} role="button" tabIndex={0} aria-label={`${state.name}: ${officeStates.has(state.id) ? "con oficinas Alleanza" : "atención a distancia"}`} aria-pressed={selected === state.id} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(state.id); }} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(state.id)} onBlur={() => setHovered(null)} onClick={() => choose(state.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(state.id); } }} />)}
              <g aria-hidden="true" pointerEvents="none">{offices.map(office => <g key={office.city} transform={`translate(${office.point[0]} ${office.point[1] - (active === office.stateId ? 7 : 0)})`} className={s.mapPin} data-active={office.stateId === active}>
                <circle r="15" fill="#7feaff" opacity=".32" filter="url(#health-glow)" /><circle className={s.pinPulse} r="12" /><line y1="-23" y2="0" stroke="#bdf5ff" strokeWidth="1.5" /><circle cy="-24" r="5" fill="#fff" stroke="#04c0fe" strokeWidth="2" /><circle r="3" fill="#ecffff" />
              </g>)}</g>
              <g className={s.mapLabels} aria-hidden="true"><text x="125" y="553">ALASKA</text><text x="305" y="566">HAWÁI</text></g>
            </svg>
          </motion.div>
          <div className={s.mapHint}><MousePointer2 size={13} /> Explora con el cursor o toca un estado</div>
        </div>
        <aside className={s.mapDetail} aria-label="Estado seleccionado">
          <div className={s.detailTop}><span className={s.eyebrow}>TU ALIANZA LOCAL</span><MapPin size={18} /></div>
          <div aria-live="polite" aria-atomic="true"><span className={s.stateNumber}>{activeState.id}</span><h3>{activeState.name}</h3><p>{activeOffices.length ? "Personas reales. Cerca de ti." : "La distancia no nos separa."}</p>
          <div className={s.officeList}>{activeOffices.length ? activeOffices.map(office => <button key={office.city} type="button" data-selected={selectedCity === office.city && active === selected} onClick={() => choose(office.stateId, office.city)}><span><i />{office.city}</span><ArrowUpRight size={15} /></button>) : <div className={s.remoteOffice}><span className={s.statusDot} /> Asesoría por teléfono o videollamada</div>}</div></div>
          <p className={s.officeNote}>{active === "49" ? "Presencia en Utah. Consulta la ubicación con nuestro equipo." : activeOffices.length ? "Coordina tu visita con un asesor." : "Te orientamos en español, estés donde estés."}</p>
          <button type="button" className={s.mapCta} onClick={() => onChoose(active)}>Hablar con un asesor <ArrowUpRight size={17} /></button>
        </aside>
      </div>
      <div className={s.mapBottom}><div className={s.legend}><span><i /> Atención en 50 estados</span><span><i /> Estados con oficinas</span></div><label className={s.stateSelect}>Ir a un estado <select value={selected} onChange={event => choose(event.target.value)}>{states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}</select></label></div>
      <div className={s.officeRail}>{offices.map(office => <button key={office.city} type="button" aria-pressed={selected === office.stateId && selectedCity === office.city} onClick={() => choose(office.stateId, office.city)}>{office.city}<span>{office.state === office.city ? "EE. UU." : office.state}</span></button>)}</div>
      <p className={s.mapDisclaimer}>La disponibilidad de planes, beneficios y agentes autorizados varía según el estado. Alaska y Hawái se muestran en recuadros a distinta escala.</p>
    </section>
  );
}
