"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { healthScenes as scenes } from "./health-scene-data";
import { HealthSceneActions, useSceneAssets } from "./HealthSceneActions";
import c from "./cinematic-hero.module.css";

const assets = "/cinematic/people/decision-";
// Individually frame the original subjects for a portrait, two-sided composition.
const frames = ["20 565 650 350", "40 385 730 310", "30 180 730 310", "0 0 735 285", "1005 680 666 260", "920 475 740 220", "960 305 710 200", "1040 0 630 270"];

export function CinematicHealthHero({ onReview, onExplore, locale = "es" }: { onReview: () => void; onExplore: () => void; locale?: "es" | "en" }) {
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
  const targetX = useMotionValue(0), targetY = useMotionValue(0);
  const springX = useSpring(targetX, { stiffness: 160, damping: 30 });
  const springY = useSpring(targetY, { stiffness: 160, damping: 30 });
  const current = active >= 0 ? scenes[active] : null;
  const sceneSide = !current || current.x >= 43 && current.x <= 57 ? "center" : current.x < 50 ? "left" : "right";
  const copySide = !current ? "none" : sceneSide === "left" ? "right" : sceneSide === "right" ? "left" : current.y < 50 ? "left" : "right";
  const storyPosition = current && current.y < 50 ? "bottom" : "top";
  useEffect(() => {
    const media = matchMedia("(max-width: 767px)");
    const sync = () => { setPortrait(media.matches); bounds.current = null; };
    sync(); moveHandTo(.5, .72); media.addEventListener("change", sync);
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
    if (index >= 0) moveHandTo(scenes[index].x / 100, scenes[index].y / 100);
  }
  function moveHandTo(x: number, y: number) {
    const rect = canvas.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(250, Math.max(150, rect.width * .14));
    const height = width * 1.375;
    targetX.set(Math.max(0, Math.min(rect.width - width, x * rect.width - width * .5)));
    targetY.set(Math.max(0, Math.min(rect.height - height, y * rect.height - height * .08)));
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
      moveHandTo(x, y);
      let index = -1;
      if (portrait) {
        if (y >= .30 && y < .74 && (x < .39 || x > .61)) index = 3 - Math.min(3, Math.floor((y - .30) / .11)) + (x > .61 ? 4 : 0);
      } else {
        const point = new DOMPoint(x * 1671, y * 941);
        index = hitAreas.current.findIndex(path => path?.isPointInFill(point));
      }
      if (index < 0) {
        const nearby = scenes.map((scene, i) => ({ i, distance: Math.hypot((x - scene.x / 100) * rect.width, (y - scene.y / 100) * rect.height) })).sort((a, b) => a.distance - b.distance)[0];
        const currentDistance = active >= 0 ? Math.hypot((x - scenes[active].x / 100) * rect.width, (y - scenes[active].y / 100) * rect.height) : Infinity;
        if (active >= 0 && currentDistance < 125) index = active;
        else if (nearby.distance < 90) index = nearby.i;
      }
      if (index >= 0) { setInteracted(true); setHint(false); setActive(index); }
      else if (!portrait && pointerType === "mouse") setActive(-1);
    });
  }
  return <section className={c.hero} aria-labelledby="health-title">
    <div className={c.stage}>
      <div ref={canvas} className={c.canvas} data-active={current?.id ?? "none"} data-scene-side={sceneSide} data-copy-side={copySide} data-engaged={interacted} data-story-position={storyPosition} onPointerMove={move} onPointerDown={move} onPointerLeave={event => { if (event.pointerType === "mouse" && !(event.currentTarget.contains(document.activeElement))) setActive(-1); }}>
        {/* Background pathway; the subjects below are independently recomposed on mobile. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.background} src={`${assets}world.webp`} alt={locale === "en" ? "An illuminated path between scenes of financial pressure and scenes of protection, care, and family." : "Un camino iluminado entre escenas de presión financiera y escenas de protección, cuidado y familia."} fetchPriority="high" width="1671" height="941" />
        <div className={c.desktopComposition} aria-hidden="true">
          {scenes.map((item, i) => {
            const selected = active === i;
            const adjacent = active >= 0 && active !== i && Math.abs((active % 4) - (i % 4)) === 1 && (active < 4) === (i < 4);
            const intensity = selected ? 1 : adjacent ? .86 : .76;
            return <motion.div key={item.id} className={c.layer} data-selected={selected} animate={{ scale: selected && !reduced ? 1.045 : adjacent && !reduced ? .985 : 1, z: selected && !reduced ? 44 : 0, filter: `brightness(${selected ? 1.03 : intensity}) saturate(${selected ? 1.03 : adjacent ? .9 : .82})` }} transition={{ duration: .48, ease: [.22, 1, .36, 1] }} style={{ transformOrigin: `${item.x}% ${item.y}%`, zIndex: selected ? 30 : adjacent ? 15 : 10 }}>
            <svg viewBox="0 0 1671 941"><defs><clipPath id={`health-layer-${item.id}`}><path d={item.path} /></clipPath></defs><g clipPath={`url(#health-layer-${item.id})`}><image href={`${assets}panels.webp`} width="1671" height="941" />{active === i && assetsReady && inView && !reduced && !portrait && <HealthSceneActions key={item.id} id={item.id} locale={locale} />}</g></svg>
          </motion.div>;
          })}
          <svg className={c.hitMap} viewBox="0 0 1671 941">{scenes.map((item, i) => <path key={item.id} ref={element => { if (element) hitAreas.current[i] = element; }} d={item.path} />)}</svg>
        </div>
        <div className={c.portraitComposition} aria-hidden="true">{scenes.map((item, i) => <svg key={item.id} className={c.portraitLayer} data-selected={active === i} style={{ left: i < 4 ? 0 : "61%", top: `${30 + (3 - i % 4) * 11}%` }} viewBox={frames[i]} preserveAspectRatio="xMidYMid slice"><defs><clipPath id={`portrait-${item.id}`}><path d={item.path} /></clipPath></defs><image href={`${assets}panels.webp`} width="1671" height="941" clipPath={`url(#portrait-${item.id})`} /></svg>)}</div>
        <div className={c.grade} aria-hidden="true" />
        <motion.div className={c.handPosition} style={{ x: reduced ? targetX : springX, y: reduced ? targetY : springY }} aria-hidden="true">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`${assets}hand.webp`} alt="" width="400" height="550" /></motion.div>
        <div className={c.intro} data-hidden={active >= 0}><span className={c.eyebrow}>{locale === "en" ? "YOUR HEALTH. YOUR FAMILY. YOUR DECISION." : "TU SALUD. TU FAMILIA. TU DECISIÓN."}</span><h1 id="health-title">{locale === "en" ? "You decide" : "Tú decides"}<span>.</span></h1><p>{locale === "en" ? <>Not everything is in your hands.<br />How you prepare is.</> : <>No todo está en tus manos.<br />Cómo prepararte, sí.</>}</p></div>
        <div className={c.sceneLabels} aria-hidden="true"><span>{locale === "en" ? "Without protection" : "Sin protección"}</span><span>{locale === "en" ? "With support" : "Con respaldo"}</span></div>
        <div className={c.storyShade} aria-hidden="true" />
        <AnimatePresence mode="wait">{current && <motion.div key={current.id} className={`${c.story} ${copySide === "left" ? c.storyLeft : c.storyRight}`} role="status" aria-live="polite" aria-atomic="true" initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }}><span className={c.eyebrow}>{locale === "en" ? (active < 4 ? "WITHOUT PROTECTION" : active < 7 ? "WITH PROTECTION" : "WITH SUPPORT") : (active < 4 ? "SIN PROTECCIÓN" : active < 7 ? "CON PROTECCIÓN" : "CON RESPALDO")} — {locale === "en" ? current.nameEn : current.name}</span><h2>{locale === "en" ? current.titleEn : current.title}</h2><p>{locale === "en" ? current.textEn : current.text}</p><button type="button" className={c.primary} onClick={onReview}>{locale === "en" ? "Review my coverage" : "Revisar mi cobertura"} <ArrowUpRight size={16} /></button></motion.div>}</AnimatePresence>
        <div className={c.hint} data-visible={inView && hint && !interacted}><span className={c.desktopHint}>{locale === "en" ? "Move your cursor to explore" : "Mueve tu cursor para explorar"}</span><span className={c.touchHint}>{locale === "en" ? "Tap or swipe to explore" : "Toca o desliza para explorar"}</span></div>
        <nav className={c.sceneNav} aria-label={locale === "en" ? "Explore eight protection scenarios" : "Explorar las ocho escenas de protección"} onKeyDown={event => { if (event.key === "Escape") { setActive(-1); return; } if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); select((Math.max(0, active) + (event.key === "ArrowRight" ? 1 : 7)) % scenes.length); }}>
          <span className={c.sceneIndex}>{String(active + 1 || 1).padStart(2, "0")} / 08</span>
          <button type="button" aria-label={locale === "en" ? "Previous scene" : "Escena anterior"} onClick={() => select((active < 0 ? 7 : active + 7) % 8)}><ChevronLeft size={17} /></button>
          <button type="button" aria-label={locale === "en" ? "Next scene" : "Escena siguiente"} onClick={() => select((active + 1) % 8)}><ChevronRight size={17} /></button>
          {active >= 0 && <button type="button" aria-label={locale === "en" ? "Close story" : "Cerrar historia"} onClick={() => setActive(-1)}><X size={16} /></button>}
        </nav>
        <a className={c.continue} href="#revision-cobertura" aria-label={locale === "en" ? "Continue to the coverage review" : "Continuar a la revisión de cobertura"}><ArrowDown size={17} /></a>
      </div>
    </div>
    <div id="revision-cobertura" className={c.review}><div><span className={c.eyebrow}>{locale === "en" ? "ALREADY INSURED? LET'S START THERE." : "¿YA TIENES SEGURO? EMPECEMOS POR AHÍ."}</span><h2>{locale === "en" ? <>Having coverage is a beginning.<br /><em>Understanding it changes things.</em></> : <>Tener cobertura es un comienzo.<br /><em>Entenderla cambia las cosas.</em></>}</h2><p>{locale === "en" ? "Let’s review what your plan includes, what may be missing, and what you could pay. Health insurance, supplemental protection, dental, and vision each serve a purpose." : "Revisemos qué incluye tu plan, qué falta y cuánto podrías pagar. Seguro médico, protección complementaria, dental y visión: cada pieza tiene una función."}</p></div><div className={c.actions}><button type="button" className={c.primary} onClick={onReview}>{locale === "en" ? "Review my coverage" : "Quiero revisar mi cobertura"} <ArrowUpRight size={18} /></button><button type="button" className={c.secondary} onClick={onExplore}>{locale === "en" ? "I’m uninsured. I want guidance" : "No tengo seguro. Quiero orientación"} <ArrowUpRight size={16} /></button><small>{locale === "en" ? "Guidance in English or Spanish · No cost · No obligation" : "Orientación en español · Sin costo · Sin compromiso"}</small></div></div>
    <p className={c.disclaimer}>{locale === "en" ? "Scenes, card, amounts, and check are illustrative; they do not represent actual clients, payments, or guaranteed benefits. Coverage does not eliminate every expense or guarantee results. Alleanza Insurance Corp. is an independent insurance agency. Policies are issued by the applicable insurance companies. Benefits are subject to eligibility, exclusions, limits, and each policy’s terms. Supplemental insurance does not replace comprehensive health insurance." : "Escenas, tarjeta, cantidades y cheque ilustrativos; no representan clientes, pagos reales ni beneficios garantizados. La cobertura no elimina todos los gastos ni garantiza resultados. Alleanza Insurance Corp. es una agencia independiente. Las pólizas son emitidas por las compañías aseguradoras correspondientes. Beneficios sujetos a elegibilidad, exclusiones, límites y términos de cada póliza. El seguro complementario no sustituye un seguro médico integral."}</p>
  </section>;
}
