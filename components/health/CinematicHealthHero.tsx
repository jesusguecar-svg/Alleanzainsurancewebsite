"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { healthScenes as scenes } from "./health-scene-data";
import { HealthSceneActions, useSceneAssets } from "./HealthSceneActions";
import c from "./cinematic-hero.module.css";

const assets = "/cinematic/people/decision-";
// Individually frame the original subjects for a portrait, two-sided composition.
const frames = ["20 565 650 350", "40 385 730 310", "30 180 730 310", "0 0 735 285", "1005 680 666 260", "920 475 740 220", "960 305 710 200", "1040 0 630 270"];

export function CinematicHealthHero({ onReview, onExplore }: { onReview: () => void; onExplore: () => void }) {
  const canvas = useRef<HTMLDivElement>(null);
  const inView = useInView(canvas, { amount: .2 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [interacted, setInteracted] = useState(false);
  const [hint, setHint] = useState(true);
  const [portrait, setPortrait] = useState(false);
  const assetsReady = useSceneAssets(inView && active >= 0 && !reduced && !portrait);
  const hitAreas = useRef<SVGPathElement[]>([]);
  const frame = useRef(0);
  const bounds = useRef<DOMRect | null>(null);
  const pointer = useRef({ x: .5, y: .78 });
  const targetX = useMotionValue(50), targetY = useMotionValue(78);
  const springX = useSpring(targetX, { stiffness: 160, damping: 30 });
  const springY = useSpring(targetY, { stiffness: 160, damping: 30 });
  const handX = useTransform(springX, x => `${(x - 50) * 5.5}%`);
  const handY = useTransform(springY, y => `${(y - 78) * 5.5}%`);
  const current = active >= 0 ? scenes[active] : null;
  useEffect(() => {
    const media = matchMedia("(max-width: 767px)");
    const sync = () => { setPortrait(media.matches); bounds.current = null; };
    sync(); media.addEventListener("change", sync);
    const clearBounds = () => { bounds.current = null; };
    window.addEventListener("scroll", clearBounds, { passive: true });
    window.addEventListener("resize", clearBounds);
    return () => { media.removeEventListener("change", sync); window.removeEventListener("scroll", clearBounds); window.removeEventListener("resize", clearBounds); cancelAnimationFrame(frame.current); };
  }, []);
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setHint(false), 4500);
    return () => clearTimeout(timer);
  }, [inView]);
  function select(index: number) {
    setActive(index); setInteracted(true); setHint(false);
    if (index >= 0) { targetX.set(scenes[index].x); targetY.set(scenes[index].y); }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("button, a")) return;
    if (event.pointerType !== "mouse" && !event.buttons) return;
    bounds.current ??= event.currentTarget.getBoundingClientRect();
    const rect = bounds.current;
    pointer.current = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
    const pointerType = event.pointerType;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const { x, y } = pointer.current;
      targetX.set(x * 100); targetY.set(y * 100);
      let index = -1;
      if (portrait) {
        if (y >= .30 && y < .74 && (x < .39 || x > .61)) index = 3 - Math.min(3, Math.floor((y - .30) / .11)) + (x > .61 ? 4 : 0);
      } else {
        const point = new DOMPoint(x * 1671, y * 941);
        index = hitAreas.current.findIndex(path => path?.isPointInFill(point));
      }
      if (index >= 0) { setInteracted(true); setHint(false); setActive(index); }
      else if (!portrait && pointerType === "mouse") setActive(-1);
    });
  }
  return <section className={c.hero} aria-labelledby="health-title">
    <div className={c.stage}>
      <div ref={canvas} className={c.canvas} data-active={current?.id ?? "none"} data-side={active < 0 ? "none" : active < 4 ? "left" : "right"} data-engaged={interacted} data-story-position={active >= 0 && active % 4 < 2 ? "top" : "bottom"} onPointerMove={move} onPointerDown={move} onPointerLeave={event => { if (event.pointerType === "mouse" && !(event.currentTarget.contains(document.activeElement))) setActive(-1); }}>
        {/* Background pathway; the subjects below are independently recomposed on mobile. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.background} src={`${assets}world.webp`} alt="Un camino iluminado entre escenas de presión financiera y escenas de protección, cuidado y familia." fetchPriority="high" width="1671" height="941" />
        <div className={c.desktopComposition} aria-hidden="true">
          {scenes.map((item, i) => <motion.div key={item.id} className={c.layer} data-selected={active === i} animate={{ scale: active === i && !reduced ? 1.025 : 1 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }} style={{ transformOrigin: `${item.x}% ${item.y}%`, zIndex: active === i ? 3 : 1 }}>
            <svg viewBox="0 0 1671 941"><defs><clipPath id={`health-layer-${item.id}`}><path d={item.path} /></clipPath></defs><g clipPath={`url(#health-layer-${item.id})`}><image href={`${assets}panels.webp`} width="1671" height="941" />{active === i && assetsReady && inView && !reduced && !portrait && <HealthSceneActions key={item.id} id={item.id} />}</g></svg>
          </motion.div>)}
          <svg className={c.hitMap} viewBox="0 0 1671 941">{scenes.map((item, i) => <path key={item.id} ref={element => { if (element) hitAreas.current[i] = element; }} d={item.path} />)}</svg>
        </div>
        <div className={c.portraitComposition} aria-hidden="true">{scenes.map((item, i) => <svg key={item.id} className={c.portraitLayer} data-selected={active === i} style={{ left: i < 4 ? 0 : "61%", top: `${30 + (3 - i % 4) * 11}%` }} viewBox={frames[i]} preserveAspectRatio="xMidYMid slice"><defs><clipPath id={`portrait-${item.id}`}><path d={item.path} /></clipPath></defs><image href={`${assets}panels.webp`} width="1671" height="941" clipPath={`url(#portrait-${item.id})`} /></svg>)}</div>
        <div className={c.grade} aria-hidden="true" />
        <motion.div className={c.handPosition} style={{ x: reduced ? 0 : handX, y: reduced ? 0 : handY }} aria-hidden="true">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`${assets}hand.webp`} alt="" width="400" height="550" /></motion.div>
        <div className={c.intro} data-hidden={active >= 0}><span className={c.eyebrow}>TU SALUD. TU FAMILIA. TU DECISIÓN.</span><h1 id="health-title">Tú decides<span>.</span></h1><p>No todo está en tus manos.<br />Cómo prepararte, sí.</p></div>
        <div className={c.sceneLabels} aria-hidden="true"><span>Sin protección</span><span>Con respaldo</span></div>
        <div className={c.storyShade} aria-hidden="true" />
        {current && <div key={current.id} className={c.story} role="status" aria-live="polite" aria-atomic="true"><span className={c.eyebrow}>{active < 4 ? "SIN PROTECCIÓN" : active < 7 ? "CON PROTECCIÓN" : "CON RESPALDO"} — {current.name}</span><h2>{current.title}</h2><p>{current.text}</p><button type="button" className={c.primary} onClick={onReview}>Revisar mi cobertura <ArrowUpRight size={16} /></button></div>}
        <div className={c.hint} data-visible={inView && hint && !interacted}><span className={c.desktopHint}>Mueve tu cursor para explorar</span><span className={c.touchHint}>Toca o desliza para explorar</span></div>
        <nav className={c.sceneNav} aria-label="Explorar las ocho escenas de protección" onKeyDown={event => { if (event.key === "Escape") { setActive(-1); return; } if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); select((Math.max(0, active) + (event.key === "ArrowRight" ? 1 : 7)) % scenes.length); }}>
          <span className={c.sceneIndex}>{String(active + 1 || 1).padStart(2, "0")} / 08</span>
          <button type="button" aria-label="Escena anterior" onClick={() => select((active < 0 ? 7 : active + 7) % 8)}><ChevronLeft size={17} /></button>
          <button type="button" aria-label="Escena siguiente" onClick={() => select((active + 1) % 8)}><ChevronRight size={17} /></button>
          {active >= 0 && <button type="button" aria-label="Cerrar historia" onClick={() => setActive(-1)}><X size={16} /></button>}
        </nav>
        <a className={c.continue} href="#revision-cobertura" aria-label="Continuar a la revisión de cobertura"><ArrowDown size={17} /></a>
      </div>
    </div>
    <div id="revision-cobertura" className={c.review}><div><span className={c.eyebrow}>¿YA TIENES SEGURO? EMPECEMOS POR AHÍ.</span><h2>Tener cobertura es un comienzo.<br /><em>Entenderla cambia las cosas.</em></h2><p>Revisemos qué incluye tu plan, qué falta y cuánto podrías pagar. Seguro médico, protección complementaria, dental y visión: cada pieza tiene una función.</p></div><div className={c.actions}><button type="button" className={c.primary} onClick={onReview}>Quiero revisar mi cobertura <ArrowUpRight size={18} /></button><button type="button" className={c.secondary} onClick={onExplore}>No tengo seguro. Quiero orientación <ArrowUpRight size={16} /></button><small>Orientación en español · Sin costo · Sin compromiso</small></div></div>
    <p className={c.disclaimer}>Escenas, tarjeta, cantidades y cheque ilustrativos; no representan clientes, pagos reales ni beneficios garantizados. La cobertura no elimina todos los gastos ni garantiza resultados. Alleanza Insurance Corp. es una agencia independiente. Las pólizas son emitidas por las compañías aseguradoras correspondientes. Beneficios sujetos a elegibilidad, exclusiones, límites y términos de cada póliza. El seguro complementario no sustituye un seguro médico integral.</p>
  </section>;
}
