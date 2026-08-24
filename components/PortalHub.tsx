"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Grid2X2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

type GalleryItem = { label: string; kicker: string; description: string; href: string; src: string; secondarySrc?: string; kind?: "video"; position?: string };

const gallery: GalleryItem[] = [
  { label: "Salud", kicker: "Cuidado", description: "Seguro ACA, seguros complementarios y seguros privados.", href: "/health", src: "/cinematic/gallery/media/salud.jpg", position: "50% 38%" },
  { label: "Vida", kicker: "Familia", description: "Seguro de vida temporal, permanente y protección para gastos finales.", href: "/life", src: "/cinematic/gallery/media/vida.jpg", position: "50% 48%" },
  { label: "Propiedad", kicker: "Patrimonio", description: "Protección para tu hogar, tus autos y otros bienes importantes.", href: "/property-casualty", src: "/cinematic/gallery/media/hogar.jpg", secondarySrc: "/cinematic/gallery/media/auto.jpg" },
  { label: "Academia", kicker: "Formación", description: "Capacitación, herramientas y acompañamiento para agentes.", href: "/academy", src: "/cinematic/gallery/media/academia.mp4", kind: "video" },
  { label: "Trabajo", kicker: "Oportunidad", description: "Oportunidades profesionales para crecer con propósito.", href: "/work", src: "/cinematic/gallery/media/trabajo.png" },
];

function GalleryMedia({ item, active }: { item: GalleryItem; active: boolean }) {
  if (item.kind === "video") return <video src={item.src} muted loop autoPlay playsInline preload="metadata" aria-label="Formación en la Academia Alleanza" className="h-full w-full object-cover" />;
  if (item.secondarySrc) return <span className="gallery-property-pair"><span><Image src={item.src} alt={active ? "Casa protegida por Alleanza" : ""} fill sizes="42vw" className="object-cover" /></span><span><Image src={item.secondarySrc} alt={active ? "Automóvil protegido por Alleanza" : ""} fill sizes="24vw" className="object-cover" /></span></span>;
  return <Image src={item.src} alt={active ? `Cobertura de ${item.label} de Alleanza` : ""} fill priority={item.label === "Salud"} sizes="(min-width: 768px) 62vw, 88vw" className="object-cover" style={{ objectPosition: item.position ?? "center" }} />;
}

export default function PortalHub() {
  const [turn, setTurn] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [intro, setIntro] = useState(true);
  const [wordPointer, setWordPointer] = useState({ active: false, x: .5, y: .5 });
  const lastWheel = useRef(0);
  const reduceMotion = useReducedMotion();
  const active = ((turn % gallery.length) + gallery.length) % gallery.length;
  const current = gallery[active];
  const move = useCallback((step: number) => setTurn((value) => value + step), []);
  const choose = useCallback((index: number) => setTurn((value) => {
    const selected = ((value % gallery.length) + gallery.length) % gallery.length;
    let delta = index - selected;
    if (delta > gallery.length / 2) delta -= gallery.length;
    if (delta < -gallery.length / 2) delta += gallery.length;
    return value + delta;
  }), []);
  useEffect(() => { const timer = window.setTimeout(() => setIntro(false), 1900); return () => window.clearTimeout(timer); }, []);

  const handleWheel = (event: React.WheelEvent) => {
    const now = Date.now();
    const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (now - lastWheel.current < 520 || Math.abs(distance) < 12) return;
    lastWheel.current = now;
    move(distance > 0 ? 1 : -1);
  };

  return (
    <main className="gallery-home" onWheel={handleWheel}>
      <svg className="gallery-filters" aria-hidden="true"><filter id="gallery-wave"><feTurbulence type="fractalNoise" baseFrequency={`${(.004 + wordPointer.x * .009).toFixed(4)} ${(.012 + wordPointer.y * .026).toFixed(4)}`} numOctaves="2" seed={Math.round(4 + wordPointer.x * 18)} result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={wordPointer.active && !reduceMotion ? 16 + wordPointer.x * 24 : 0} xChannelSelector="R" yChannelSelector="B" /></filter></svg>
      <AnimatePresence>{intro && <motion.div className="gallery-intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.12 }} transition={{ duration: .75, ease: [.76,0,.24,1] }}><motion.div className="gallery-intro-ring" initial={{ rotate: -110, scale: .72 }} animate={{ rotate: 250, scale: 1 }} transition={{ duration: 1.65, ease: [.16,1,.3,1] }}><i/><i/><i/><i/><i/></motion.div><motion.div initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: .35 }}><Logo width={190}/><span>PROTECCIÓN EN MOVIMIENTO</span></motion.div></motion.div>}</AnimatePresence>
      <header className="gallery-header">
        <a href="/" aria-label="Alleanza — inicio"><Logo width={160} /></a>
        <h1><a href="#galeria">Alleanza</a> protege lo que estás construyendo.</h1>
        <p>{String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</p>
      </header>

      <section id="galeria" className="gallery-stage" aria-label="Áreas de protección de Alleanza">
        <div className={`gallery-display-word ${wordPointer.active ? "is-liquid" : ""}`} aria-hidden="true" style={{ transform: wordPointer.active && !reduceMotion ? `skewX(${(wordPointer.x - .5) * 3}deg) scaleY(${.985 + wordPointer.y * .03})` : "none" }} onPointerEnter={() => setWordPointer((value) => ({ ...value, active: true }))} onPointerMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); setWordPointer({ active: true, x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) }); }} onPointerLeave={() => setWordPointer((value) => ({ ...value, active: false }))}>PROTECCIÓN</div>
        <div className="gallery-aura" aria-hidden="true" />
        <motion.div className="gallery-orbit" animate={{ rotateY: turn * -72 + dragOffset * .18, rotateX: reduceMotion ? 0 : [0, 1.4, -.65, 0], y: reduceMotion ? 0 : [0, -8, 5, 0] }} transition={{ rotateY: dragStart === null ? { duration: 1.15, ease: [.16, 1, .3, 1] } : { duration: 0 }, rotateX: { duration: 1.05, ease: [.16, 1, .3, 1] }, y: { duration: 1.05, ease: [.16, 1, .3, 1] } }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragStart(event.clientX); setDragOffset(0); }} onPointerMove={(event) => { if (dragStart !== null) setDragOffset(event.clientX - dragStart); }} onPointerUp={(event) => { if (dragStart === null) return; const delta = event.clientX - dragStart; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); setDragStart(null); setDragOffset(0); }} onPointerCancel={() => { setDragStart(null); setDragOffset(0); }}>
          {gallery.map((item, index) => {
            return <a key={`${item.label}-${item.src}`} href={item.href} aria-label={`Explorar ${item.label}`} aria-hidden={index !== active} aria-current={index === active ? "true" : undefined} data-active={index === active} tabIndex={index === active ? 0 : -1} className="gallery-card" style={{ "--panel-angle": `${index * 72}deg` } as React.CSSProperties} onPointerMove={(event) => { if (index !== active) return; const box = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--spot-x", `${Math.max(0, Math.min(100, (event.clientX - box.left) / box.width * 100))}%`); event.currentTarget.style.setProperty("--spot-y", `${Math.max(0, Math.min(100, (event.clientY - box.top) / box.height * 100))}%`); }} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--spot-x", "52%"); event.currentTarget.style.setProperty("--spot-y", "39%"); }} onClick={(event) => { if (index !== active) { event.preventDefault(); choose(index); } }}>
              <GalleryMedia item={item} active={index === active} /><div className={`gallery-deep-light ${index === active ? "is-active" : ""}`} /><div className="gallery-card-shine" />
            </a>;
          })}
        </motion.div>

        <AnimatePresence mode="wait"><motion.div key={`reflejo-${current.label}`} className="gallery-reflection" initial={{ opacity: 0 }} animate={{ opacity: .58 }} exit={{ opacity: 0 }} transition={{ duration: .75 }}><div className="gallery-reflection-media"><GalleryMedia item={current} active /></div><div className="gallery-reflection-ripples" /></motion.div></AnimatePresence>
        <Image src="/cinematic/gallery/glass-plinth.png" alt="Plataforma tridimensional de vidrio creada para Alleanza" width={1800} height={1100} className="gallery-plinth" priority />
        <AnimatePresence mode="wait"><motion.div key={current.label} className="gallery-card-title" initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(8px)" }} transition={{ duration: .55 }}><span>{current.kicker}</span><strong>{current.label}</strong><p>{current.description}</p><a href={current.href}>Ver cobertura</a></motion.div></AnimatePresence>
      </section>

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
    </main>
  );
}
