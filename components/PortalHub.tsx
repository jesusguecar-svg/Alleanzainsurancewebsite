"use client";

import { animate as animateMotion, AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Grid2X2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { LiquidHeadline } from "./cinematic/LiquidHeadline";
import { LiquidGallerySurface } from "./cinematic/LiquidGallerySurface";

type GalleryItem = { label: string; kicker: string; description: string; cta: string; href: string; src: string; secondarySrc?: string; kind?: "video"; position?: string };

const gallery: GalleryItem[] = [
  { label: "Salud", kicker: "Cuidado", description: "Seguro ACA, seguros complementarios y seguros privados.", cta: "Obtener mi cobertura", href: "/health", src: "/cinematic/gallery/media/salud.mp4", kind: "video", position: "50% 38%" },
  { label: "Vida", kicker: "Familia", description: "Seguro de vida temporal, permanente y protección para gastos finales.", cta: "Dejar un legado para mi familia", href: "/life", src: "/cinematic/gallery/media/vida.mp4", kind: "video", position: "50% 48%" },
  { label: "Propiedad", kicker: "Patrimonio", description: "Protección para tu hogar, tus autos y otros bienes importantes.", cta: "Ver mi cobertura", href: "/property-casualty", src: "/cinematic/gallery/media/propiedad.mp4", kind: "video" },
  { label: "Academia", kicker: "Formación", description: "Capacitación, herramientas y acompañamiento para agentes.", cta: "Aprender ahora", href: "/academy", src: "/cinematic/gallery/media/academia.mp4", kind: "video" },
  { label: "Trabajo", kicker: "Oportunidad", description: "Oportunidades profesionales para crecer con propósito.", cta: "Trabaja con nosotros", href: "/work", src: "/cinematic/gallery/media/oportunidad.mp4", kind: "video" },
];

function GalleryMedia({ item, active }: { item: GalleryItem; active: boolean }) {
  if (item.kind === "video") return <video src={item.src} muted loop autoPlay playsInline preload="metadata" aria-label={active ? `Video de ${item.label} de Alleanza` : undefined} className="h-full w-full object-cover" style={{ objectPosition: item.position ?? "center" }} />;
  if (item.secondarySrc) return <span className="gallery-property-pair"><span><Image src={item.src} alt={active ? "Casa protegida por Alleanza" : ""} fill sizes="42vw" className="object-cover" /></span><span><Image src={item.secondarySrc} alt={active ? "Automóvil protegido por Alleanza" : ""} fill sizes="24vw" className="object-cover" /></span></span>;
  return <Image src={item.src} alt={active ? `Cobertura de ${item.label} de Alleanza` : ""} fill priority={item.label === "Salud"} sizes="(min-width: 768px) 62vw, 88vw" className="object-cover" style={{ objectPosition: item.position ?? "center" }} />;
}

function MagneticLink({ href, label }: { href: string; label: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 190, damping: 18, mass: .55 });
  const springY = useSpring(y, { stiffness: 190, damping: 18, mass: .55 });
  return <span className="gallery-magnetic-zone" onPointerMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); x.set(Math.max(-13, Math.min(13, (event.clientX - box.left - box.width / 2) * .22))); y.set(Math.max(-9, Math.min(9, (event.clientY - box.top - box.height / 2) * .22))); }} onPointerLeave={() => { x.set(0); y.set(0); }}><motion.a href={href} style={{ x: springX, y: springY }}>{label}</motion.a></span>;
}

export default function PortalHub() {
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const [intro, setIntro] = useState(true);
  const rotation = useMotionValue(0);
  const orbitRef = useRef<HTMLDivElement>(null);
  const motionControl = useRef<ReturnType<typeof animateMotion> | null>(null);
  const wheelSettle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelVelocity = useRef(0);
  const drag = useRef({ startX: 0, startRotation: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const velocity = useRef({ value: 0, time: 0, timer: null as ReturnType<typeof setTimeout> | null });
  const liquidVelocity = useRef(0);
  const reduceMotion = useReducedMotion();
  const current = gallery[active];
  const settle = useCallback((projected: number) => {
    const target = Math.round(projected / 72) * 72;
    motionControl.current?.stop();
    motionControl.current = animateMotion(rotation, target, reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 72, damping: 16, mass: .9, velocity: wheelVelocity.current });
    wheelVelocity.current = 0;
  }, [reduceMotion, rotation]);
  const move = useCallback((step: number) => settle(Math.round(rotation.get() / 72) * 72 - step * 72), [rotation, settle]);
  const choose = useCallback((index: number) => {
    const selected = ((Math.round(-rotation.get() / 72) % gallery.length) + gallery.length) % gallery.length;
    let delta = index - selected;
    if (delta > gallery.length / 2) delta -= gallery.length;
    if (delta < -gallery.length / 2) delta += gallery.length;
    settle(Math.round(rotation.get() / 72) * 72 - delta * 72);
  }, [rotation, settle]);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const timer = window.setTimeout(() => setIntro(false), mobile ? 1100 : 1900);
    return () => window.clearTimeout(timer);
  }, []);
  useMotionValueEvent(rotation, "change", (value) => {
    const index = ((Math.round(-value / 72) % gallery.length) + gallery.length) % gallery.length;
    setActive((currentIndex) => currentIndex === index ? currentIndex : index);
    const now = performance.now();
    const elapsed = Math.max(8, now - velocity.current.time);
    const raw = (value - velocity.current.value) / elapsed;
    const normalized = Math.max(-1, Math.min(1, raw * 5));
    liquidVelocity.current = normalized;
    orbitRef.current?.style.setProperty("--ribbon-velocity", normalized.toFixed(3));
    orbitRef.current?.style.setProperty("--ribbon-speed", Math.abs(normalized).toFixed(3));
    velocity.current.value = value;
    velocity.current.time = now;
    if (velocity.current.timer) clearTimeout(velocity.current.timer);
    velocity.current.timer = setTimeout(() => { liquidVelocity.current = 0; orbitRef.current?.style.setProperty("--ribbon-velocity", "0"); orbitRef.current?.style.setProperty("--ribbon-speed", "0"); }, 90);
  });

  const handleWheel = (event: React.WheelEvent) => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(distance) < 1) return;
    motionControl.current?.stop();
    wheelVelocity.current = wheelVelocity.current * .72 - distance * .018;
    rotation.set(rotation.get() - distance * .075);
    if (wheelSettle.current) clearTimeout(wheelSettle.current);
    wheelSettle.current = setTimeout(() => settle(rotation.get() + wheelVelocity.current * 18), 125);
  };

  return (
    <main className={`gallery-home ${intro ? "is-loading" : ""}`} onWheel={handleWheel}>
      <AnimatePresence>{intro && <motion.div className="gallery-intro" role="status" aria-label="Cargando sitio de Alleanza" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.12 }} transition={{ duration: .75, ease: [.76,0,.24,1] }}><motion.div className="gallery-intro-ring" initial={{ rotate: -110, scale: .72 }} animate={{ rotate: 250, scale: 1 }} transition={{ duration: 1.65, ease: [.16,1,.3,1] }}><i/><i/><i/><i/><i/></motion.div><motion.div initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: .25 }}><Logo width={190}/><span>PROTECCIÓN EN MOVIMIENTO</span></motion.div></motion.div>}</AnimatePresence>
      <header className="gallery-header">
        <a href="/" aria-label="Alleanza — inicio"><Logo width={160} /></a>
        <h1><a href="#galeria">Alleanza</a> protege lo que estás construyendo.</h1>
        <p>{String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</p>
      </header>

      <div className="mobile-story">
        <section className="mobile-protection-scene" aria-labelledby="mobile-protection-title">
          <h1 id="mobile-protection-title" className="sr-only">Protección Alleanza</h1>
          <p className="mobile-scene-index" aria-hidden="true">01 / 03</p>
          <LiquidHeadline text="PROTECCIÓN" className="mobile-protection-liquid" />
          <p className="mobile-touch-hint">Toca y mueve tus dedos</p>
          <a className="mobile-scroll-cue" href="#formas-de-ayudarte">
            <span>Desliza para continuar</span>
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </section>

        <section id="formas-de-ayudarte" className="mobile-message-scene" aria-labelledby="mobile-message-title">
          <p className="mobile-scene-index" aria-hidden="true">02 / 03</p>
          <div>
            <span>Estamos contigo</span>
            <h2 id="mobile-message-title">Tenemos 5 formas de ayudarte.</h2>
            <p>Dale scroll un momento más.</p>
          </div>
          <a className="mobile-scroll-cue" href="#galeria">
            <span>Conócelas</span>
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </section>
      </div>

      <section id="galeria" className="gallery-stage" aria-label="Áreas de protección de Alleanza">
        <LiquidHeadline text="PROTECCIÓN" className="gallery-desktop-headline" />
        <p className="mobile-scene-index mobile-gallery-index" aria-hidden="true">03 / 03</p>
        <p className="mobile-gallery-label">Cinco formas de protegerte</p>
        <div className="gallery-aura" aria-hidden="true" />
        <div className="gallery-orbit-tilt">
          <motion.div ref={orbitRef} className="gallery-orbit" style={{ rotateY: rotation }} onDragStart={(event) => event.preventDefault()} onPointerDown={(event) => { motionControl.current?.stop(); event.currentTarget.setPointerCapture(event.pointerId); const now = performance.now(); drag.current = { startX: event.clientX, startRotation: rotation.get(), lastX: event.clientX, lastTime: now, velocity: 0 }; dragging.current = true; }} onPointerMove={(event) => { if (!dragging.current) return; const now = performance.now(); const elapsed = Math.max(8, now - drag.current.lastTime); drag.current.velocity = (event.clientX - drag.current.lastX) / elapsed; drag.current.lastX = event.clientX; drag.current.lastTime = now; rotation.set(drag.current.startRotation + (event.clientX - drag.current.startX) * .18); }} onPointerUp={() => { if (!dragging.current) return; dragging.current = false; settle(rotation.get() + drag.current.velocity * 90); }} onPointerCancel={() => { dragging.current = false; settle(rotation.get()); }}>
            {gallery.map((item, index) => {
              return <a key={`${item.label}-${item.src}`} href={item.href} aria-label={`Explorar ${item.label}`} aria-hidden={index !== active} aria-current={index === active ? "true" : undefined} data-active={index === active} tabIndex={index === active ? 0 : -1} className="gallery-card" style={{ "--panel-angle": `${index * 72}deg` } as React.CSSProperties} onPointerMove={(event) => { if (index !== active) return; const box = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--spot-x", `${Math.max(0, Math.min(100, (event.clientX - box.left) / box.width * 100))}%`); event.currentTarget.style.setProperty("--spot-y", `${Math.max(0, Math.min(100, (event.clientY - box.top) / box.height * 100))}%`); }} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--spot-x", "52%"); event.currentTarget.style.setProperty("--spot-y", "39%"); }} onClick={(event) => { if (index !== active) { event.preventDefault(); choose(index); } }}>
                <span className="gallery-card-surface"><GalleryMedia item={item} active={index === active} /><LiquidGallerySurface src={item.src} secondarySrc={item.secondarySrc} kind={item.kind} position={item.position} velocity={liquidVelocity} /><div className={`gallery-deep-light ${index === active ? "is-active" : ""}`} /><div className="gallery-card-shine" /></span>
              </a>;
            })}
          </motion.div>
        </div>

        <AnimatePresence mode="wait"><motion.div key={`reflejo-${current.label}`} className="gallery-reflection" initial={{ opacity: 0 }} animate={{ opacity: .58 }} exit={{ opacity: 0 }} transition={{ duration: .75 }}><div className="gallery-reflection-media"><GalleryMedia item={current} active /></div><div className="gallery-reflection-ripples" /></motion.div></AnimatePresence>
        <Image src="/cinematic/gallery/glass-plinth.png" alt="Plataforma tridimensional de vidrio creada para Alleanza" width={1800} height={1100} className="gallery-plinth" priority />
        <AnimatePresence mode="wait"><motion.div key={current.label} className="gallery-card-title" initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(8px)" }} transition={{ duration: .55 }}><span>{current.kicker}</span><strong>{current.label}</strong><p>{current.description}</p><MagneticLink href={current.href} label={current.cta}/></motion.div></AnimatePresence>

        <nav className="gallery-options" aria-label="Seleccionar una categoría">
          {gallery.map((item, index) => <button key={item.label} type="button" className={index === active ? "is-active" : ""} aria-current={index === active ? "true" : undefined} onClick={() => choose(index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}
        </nav>

        <nav className="gallery-float-nav" aria-label="Control de la galería">
          <button type="button" onClick={() => move(-1)} aria-label="Categoría anterior"><ArrowLeft size={16} /></button>
          <a href={current.href} className="gallery-current"><span className="gallery-thumb"><GalleryMedia item={current} active /></span><span><small>Categoría</small><strong>{current.label}</strong></span></a>
          <button type="button" onClick={() => move(1)} aria-label="Categoría siguiente"><ArrowRight size={16} /></button>
          <a href={current.href} className="gallery-enter" aria-label={`Entrar a ${current.label}`}><Grid2X2 size={18} /></a>
        </nav>
        <p className="gallery-hint">Arrastra o desliza para explorar</p>
      </section>
    </main>
  );
}
