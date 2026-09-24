"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, MousePointer2 } from "lucide-react";
import { healthScenes as scenes } from "./health-scene-data";
import { HealthSceneActions, useSceneAssets } from "./HealthSceneActions";
import c from "./cinematic-hero.module.css";

const assets = "/cinematic/people/decision-";

export function CinematicHealthHero({ onReview, onExplore }: { onReview: () => void; onExplore: () => void }) {
  const canvas = useRef<HTMLDivElement>(null);
  const inView = useInView(canvas, { amount: .05 });
  const assetsReady = useSceneAssets();
  const hitAreas = useRef<SVGPathElement[]>([]);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [quiet, setQuiet] = useState(false);
  const [active, setActive] = useState(-1);
  const [following, setFollowing] = useState(false);
  // Match server-rendered copy before applying the browser's motion preference.
  const prefersQuiet = mounted && !!reduced;
  const calm = prefersQuiet || quiet;
  const targetX = useMotionValue(50), targetY = useMotionValue(78);
  const springX = useSpring(targetX, { stiffness: 500, damping: 42, mass: .35 });
  const springY = useSpring(targetY, { stiffness: 500, damping: 42, mass: .35 });
  const left = useTransform(calm ? targetX : springX, x => `${x - 9.3}%`);
  const top = useTransform(calm ? targetY : springY, y => `${y - 6.1}%`);
  const shakeX = useMotionValue(0), shakeY = useMotionValue(0), shakeRotate = useMotionValue(0);
  const current = active >= 0 ? scenes[active] : null;

  function reset() {
    setActive(-1); setFollowing(false); targetX.set(50); targetY.set(78);
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    targetX.set(x * 100); targetY.set(y * 100); setFollowing(true);
    // Hit-test the original masks, independent of the enlarged visual layer.
    // The cursor can cross boundaries freely without zoom-induced flickering.
    const point = new DOMPoint(x * 1671, y * 941);
    setActive(hitAreas.current.findIndex(path => path?.isPointInFill(point)));
  }
  function select(index: number) {
    setActive(index); setFollowing(true);
    targetX.set(scenes[index].x); targetY.set(scenes[index].y);
  }
  useAnimationFrame(time => {
    const amplitude = inView && !calm && following && active >= 0 && active < 4 ? 2 + active * 1.7 : 0;
    shakeX.set(Math.sin(time * .047) * amplitude);
    shakeY.set(Math.sin(time * .061) * amplitude * .45);
    shakeRotate.set(Math.sin(time * .038) * amplitude * .16);
  });

  return <section className={c.hero} aria-labelledby="health-title">
    <div className={c.intro}><div><span className={c.eyebrow}>TU SALUD. TU FAMILIA. TU DECISIÓN.</span><h1 id="health-title">Tú decides<span>.</span></h1></div><p>No todo está en tus manos.<br />Cómo prepararte, sí.</p><a className={c.skip} href="#revision-cobertura">Revisar mi cobertura <ArrowDown size={14} /></a></div>
    <div className={c.stage}>
      <div ref={canvas} className={c.canvas} data-following={following && !calm} data-active={current?.id ?? "none"} onPointerMove={move} onPointerDown={event => { move(event); if (event.pointerType !== "mouse") event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerLeave={event => { if (event.pointerType === "mouse") reset(); }} onPointerCancel={reset}>
        {/* One cached texture is shared by all eight source-image masks. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.background} src={`${assets}world.webp`} alt="" fetchPriority="high" />
        {scenes.map((item, i) => <motion.div key={item.id} className={c.layer} animate={{ scale: active === i && !calm ? 1.12 : 1, filter: active < 0 || active === i ? "saturate(1.05) brightness(1)" : "saturate(.65) brightness(.62)" }} transition={{ duration: calm ? 0 : .4, ease: [.2, .7, .25, 1] }} style={{ transformOrigin: `${item.x}% ${item.y}%`, zIndex: active === i ? 3 : 1 }} aria-hidden="true">
          <svg viewBox="0 0 1671 941"><defs><clipPath id={`health-layer-${item.id}`}><path d={item.path} /></clipPath></defs><g clipPath={`url(#health-layer-${item.id})`}><image href={`${assets}panels.webp`} width="1671" height="941" />{active === i && assetsReady && inView && !calm && <HealthSceneActions key={item.id} id={item.id} />}<path d={item.path} fill="none" stroke={i < 4 ? "#e6ebf3" : "#ffe6a9"} strokeWidth={active === i ? 7 : 1} /></g></svg>
        </motion.div>)}
        <svg className={c.hitMap} viewBox="0 0 1671 941" aria-hidden="true">{scenes.map((item, i) => <path key={item.id} ref={element => { if (element) hitAreas.current[i] = element; }} d={item.path} />)}</svg>
        <motion.div className={c.handPosition} style={{ left, top }} aria-hidden="true"><motion.div style={{ x: shakeX, y: shakeY, rotate: shakeRotate }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`${assets}hand.webp`} alt="" /></motion.div></motion.div>
        <div className={c.edgeShade} aria-hidden="true" />
      </div>
      <div className={c.interaction}><span><MousePointer2 size={15} /><span className={c.desktopHint}>Mueve la mano con tu cursor. Explora cualquier escena.</span><span className={c.touchHint}>Mueve el dedo sobre las escenas para explorar.</span></span><button type="button" aria-pressed={calm} disabled={prefersQuiet} onClick={() => setQuiet(!quiet)}>Movimiento {calm ? "mínimo" : "completo"}</button></div>
    </div>
    <div className={c.caption}><div><span className={c.eyebrow}>{current ? `${active < 4 ? "SIN PROTECCIÓN" : "CON RESPALDO"} — ${current.name}` : "UNA FAMILIA. DOS CAMINOS. SIN UN ORDEN OBLIGATORIO."}</span><h2>{current?.title ?? "Explora lo que puede cambiar."}</h2><p>{current?.text ?? "Acércate a cada escena. Tú controlas la mano y eliges qué descubrir."}</p></div><button type="button" className={c.primary} onClick={onReview}>¿Mi cobertura es suficiente? <ArrowUpRight size={17} /></button></div>
    <details className={c.accessibleScenes}><summary>Explorar escenas con botones</summary><nav className={c.chapters} aria-label="Escenas de protección">{scenes.map((item, i) => <button type="button" key={item.id} aria-pressed={active === i} onClick={() => select(i)} onFocus={() => select(i)} onBlur={reset}>{item.name}</button>)}</nav></details>
    <div id="revision-cobertura" className={c.review}><div><span className={c.eyebrow}>¿YA TIENES SEGURO? EMPECEMOS POR AHÍ.</span><h2>Tener cobertura es un comienzo.<br /><em>Entenderla cambia las cosas.</em></h2><p>Revisemos qué incluye tu plan, qué falta y cuánto podrías pagar. Seguro médico, protección complementaria, dental y visión: cada pieza tiene una función.</p></div><div className={c.actions}><button type="button" className={c.primary} onClick={onReview}>Quiero revisar mi cobertura <ArrowUpRight size={18} /></button><button type="button" className={c.secondary} onClick={onExplore}>No tengo seguro. Quiero orientación <ArrowUpRight size={16} /></button><small>Asesoría en español · Sin costo · Sin compromiso</small></div></div>
    <p className={c.disclaimer}>Escenas, tarjeta, cantidades y cheque ilustrativos; no representan clientes, pagos reales ni beneficios garantizados. La cobertura no elimina todos los gastos ni garantiza resultados. Beneficios sujetos a elegibilidad, exclusiones, límites y términos de cada póliza. El seguro complementario no sustituye un seguro médico integral.</p>
  </section>;
}
