"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Grid2X2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Logo } from "./Logo";

type GalleryItem = { label: string; kicker: string; href: string; src: string; kind?: "video"; position?: string };

const gallery: GalleryItem[] = [
  { label: "Salud", kicker: "Cuidado", href: "/health", src: "/cinematic/gallery/media/salud.jpg", position: "50% 38%" },
  { label: "Vida", kicker: "Familia", href: "/life", src: "/cinematic/gallery/media/vida.jpg", position: "50% 48%" },
  { label: "Autos", kicker: "Movimiento", href: "/property-casualty", src: "/cinematic/gallery/media/auto.jpg" },
  { label: "Hogar", kicker: "Patrimonio", href: "/property-casualty", src: "/cinematic/gallery/media/hogar.jpg" },
  { label: "Propiedad", kicker: "Protección", href: "/property-casualty", src: "/cinematic/gallery/media/propiedad.jpg" },
  { label: "Academia", kicker: "Formación", href: "/academy", src: "/cinematic/gallery/media/academia.mp4", kind: "video" },
  { label: "Trabajo", kicker: "Oportunidad", href: "/work", src: "/cinematic/gallery/media/trabajo.png" },
];

function signedOffset(index: number, active: number) {
  let distance = index - active;
  const half = gallery.length / 2;
  if (distance > half) distance -= gallery.length;
  if (distance < -half) distance += gallery.length;
  return distance;
}

function GalleryMedia({ item, active }: { item: GalleryItem; active: boolean }) {
  if (item.kind === "video") return <video src={item.src} muted loop autoPlay playsInline preload="metadata" aria-label="Formación en la Academia Alleanza" className="h-full w-full object-cover" />;
  return <Image src={item.src} alt={active ? `Cobertura de ${item.label} de Alleanza` : ""} fill priority={item.label === "Salud"} sizes="(min-width: 768px) 62vw, 88vw" className="object-cover" style={{ objectPosition: item.position ?? "center" }} />;
}

export default function PortalHub() {
  const [active, setActive] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const lastWheel = useRef(0);
  const reduceMotion = useReducedMotion();
  const current = gallery[active];
  const move = useCallback((step: number) => setActive((value) => (value + step + gallery.length) % gallery.length), []);

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
        <div className="gallery-orbit" onPointerDown={(event) => setDragStart(event.clientX)} onPointerUp={(event) => { if (dragStart === null) return; const delta = event.clientX - dragStart; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); setDragStart(null); }} onPointerCancel={() => setDragStart(null)}>
          {gallery.map((item, index) => {
            const offset = signedOffset(index, active);
            const visible = Math.abs(offset) <= 2;
            return <motion.a key={`${item.label}-${item.src}`} href={item.href} aria-label={`Explorar ${item.label}`} aria-hidden={!visible} tabIndex={index === active ? 0 : -1} className="gallery-card" animate={{ x: `${offset * 54}%`, rotateY: offset * -42, rotateZ: offset * .6, scale: index === active ? 1 : .82, opacity: visible ? (index === active ? 1 : .48) : 0, z: -Math.abs(offset) * 210 }} transition={reduceMotion ? { duration: 0 } : { duration: .9, ease: [.16, 1, .3, 1] }} style={{ zIndex: 20 - Math.abs(offset) }} onClick={(event) => { if (index !== active) { event.preventDefault(); setActive(index); } }}>
              <GalleryMedia item={item} active={index === active} /><div className="gallery-card-shine" />
            </motion.a>;
          })}
        </div>

        <Image src="/cinematic/gallery/glass-plinth.png" alt="Plataforma tridimensional de vidrio creada para Alleanza" width={1800} height={1100} className="gallery-plinth" priority />
        <AnimatePresence mode="wait"><motion.div key={current.label} className="gallery-card-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: .45 }}><span>{current.kicker}</span><strong>{current.label}</strong></motion.div></AnimatePresence>
      </section>

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
