"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Grid2X2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
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

  const handleWheel = (event: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 520 || Math.abs(event.deltaY) < 12) return;
    lastWheel.current = now;
    move(event.deltaY > 0 ? 1 : -1);
  };

  return (
    <main className="gallery-home" onWheel={handleWheel}>
      <header className="gallery-header">
        <a href="/" aria-label="Alleanza — inicio"><Logo width={160} /></a>
        <h1><a href="#galeria">Alleanza</a> protege lo que estás construyendo.</h1>
        <p>{String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</p>
      </header>

      <section id="galeria" className="gallery-stage" aria-label="Áreas de protección de Alleanza">
        <div className="gallery-display-word" aria-hidden="true">PROTECCIÓN</div>
        <motion.div className="gallery-orbit" animate={{ rotateY: turn * -72, rotateX: reduceMotion ? 0 : [0, 1.4, -.65, 0], y: reduceMotion ? 0 : [0, -8, 5, 0] }} transition={{ rotateY: { duration: 1.15, ease: [.16, 1, .3, 1] }, rotateX: { duration: 1.05, ease: [.16, 1, .3, 1] }, y: { duration: 1.05, ease: [.16, 1, .3, 1] } }} onPointerDown={(event) => setDragStart(event.clientX)} onPointerUp={(event) => { if (dragStart === null) return; const delta = event.clientX - dragStart; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); setDragStart(null); }} onPointerCancel={() => setDragStart(null)}>
          {gallery.map((item, index) => {
            return <a key={`${item.label}-${item.src}`} href={item.href} aria-label={`Explorar ${item.label}`} aria-hidden={index !== active} tabIndex={index === active ? 0 : -1} className="gallery-card" style={{ "--panel-angle": `${index * 72}deg` } as React.CSSProperties} onClick={(event) => { if (index !== active) { event.preventDefault(); choose(index); } }}>
              <GalleryMedia item={item} active={index === active} /><div className={`gallery-deep-light ${index === active ? "is-active" : ""}`} /><div className="gallery-card-shine" />
            </a>;
          })}
        </motion.div>

        <Image src="/cinematic/gallery/glass-plinth.png" alt="Plataforma tridimensional de vidrio creada para Alleanza" width={1800} height={1100} className="gallery-plinth" priority />
        <AnimatePresence mode="wait"><motion.div key={current.label} className="gallery-card-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: .45 }}><span>{current.kicker}</span><strong>{current.label}</strong><p>{current.description}</p></motion.div></AnimatePresence>
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
