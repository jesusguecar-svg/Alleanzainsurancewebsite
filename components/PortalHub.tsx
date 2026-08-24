"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { CinematicCanvas } from "./cinematic/CinematicCanvas";
import type { CinematicRenderContext } from "./cinematic/types";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { portalRoutes, portalNavLinks, type PortalRoute } from "@/lib/config/routes";
import { phones } from "@/lib/config/contact";

const worlds = [
  { accent: [0, 100, 150], label: "Cuidarte hoy", numeral: "01", word: "BIENESTAR" },
  { accent: [116, 66, 44], label: "Proteger su mañana", numeral: "02", word: "LEGADO" },
  { accent: [25, 72, 112], label: "Lo que construyes", numeral: "03", word: "PATRIMONIO" },
  { accent: [88, 55, 124], label: "Aprender y avanzar", numeral: "04", word: "CRECIMIENTO" },
  { accent: [122, 74, 32], label: "Crecer juntos", numeral: "05", word: "OPORTUNIDAD" },
] as const;
const renderedWorlds: Record<PortalRoute["id"], { src: string; alt: string }> = {
  health: { src: "/cinematic/people/salud.jpg", alt: "Madre abrazando a su hija con alegría" },
  life: { src: "/cinematic/people/vida.jpg", alt: "Familia de varias generaciones reunida" },
  "property-casualty": { src: "/cinematic/people/propiedad.jpg", alt: "Familia sosteniendo las llaves de su hogar" },
  academy: { src: "/cinematic/people/academia.jpg", alt: "Profesionales aprendiendo juntos con una tableta" },
  work: { src: "/cinematic/people/trabajo.jpg", alt: "Equipo de profesionales de seguros" },
};
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function drawPortal({ ctx, width, height, progress, time, mobile }: CinematicRenderContext) {
  const floatingStage = clamp(progress) * portalRoutes.length;
  const stage = Math.min(portalRoutes.length - 1, Math.floor(floatingStage));
  const blend = floatingStage - Math.floor(floatingStage);
  const rgb = worlds[stage].accent;
  const color = rgb.join(",");
  const cx = mobile ? width * .5 : width * .68;
  const cy = mobile ? height * .33 : height * .49;
  const unit = Math.min(width, height);
  const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * .85);
  wash.addColorStop(0, `rgba(${color},.20)`); wash.addColorStop(.38, "rgba(6,20,49,.26)"); wash.addColorStop(1, "rgba(3,10,26,0)");
  ctx.fillStyle = wash; ctx.fillRect(0, 0, width, height);
  const count = mobile ? 60 : 130;
  for (let i = 0; i < count; i++) {
    const seed = ((i * 193 + 47) % 997) / 997, angle = seed * Math.PI * 2, travel = (i * .071 + progress * 1.75) % 1;
    const radius = Math.pow(travel, 1.65) * unit * .78, x = cx + Math.cos(angle) * radius * 1.45, y = cy + Math.sin(angle) * radius;
    ctx.fillStyle = `rgba(${color},${.08 + travel * .6})`; ctx.beginPath(); ctx.arc(x, y, .45 + travel * 1.9, 0, Math.PI * 2); ctx.fill();
  }
  ctx.save(); ctx.translate(cx, cy);
  const pulse = 1 + Math.sin(time * 1.25) * .025, r = unit * (mobile ? .17 : .235) * pulse;
  const sphere = ctx.createRadialGradient(-r * .35, -r * .42, 0, 0, 0, r * 1.35);
  sphere.addColorStop(0, "rgba(255,255,255,.98)"); sphere.addColorStop(.12, `rgba(${color},.95)`); sphere.addColorStop(.48, `rgba(${color},.28)`); sphere.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = sphere; ctx.beginPath(); ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(${color},${.27 - i * .023})`; ctx.lineWidth = i === 0 ? 2 : 1; ctx.setLineDash(i % 2 ? [4, 10] : []);
    ctx.beginPath(); ctx.ellipse(0, 0, r * (.7 + i * .11), r * (.17 + i * .045), time * (.07 + i * .013) + blend, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.setLineDash([]);
  for (let i = 0; i < 5; i++) {
    const a = time * (.19 + i * .01) + i * 1.256 + progress * 8, orbit = r * (1.02 + i * .08), x = Math.cos(a) * orbit, y = Math.sin(a) * orbit * .34;
    ctx.shadowColor = `rgb(${color})`; ctx.shadowBlur = 16; ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(x, y, 2.2 + Math.max(0, Math.sin(a)) * 2.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -r * .62);
  ctx.bezierCurveTo(r * .55, -r * .46, r * .53, r * .27, 0, r * .67); ctx.bezierCurveTo(-r * .53, r * .27, -r * .55, -r * .46, 0, -r * .62); ctx.stroke(); ctx.restore();
}

function WorldPanel({ route, index, current }: { route: PortalRoute; index: number; current: number }) {
  const active = index === current, distance = index - current;
  const { accent, label, numeral, word } = worlds[index], color = `rgb(${accent.join(",")})`;
  return <motion.article animate={{ opacity: active ? 1 : 0, y: distance * 90, filter: active ? "blur(0px)" : "blur(8px)" }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className={`absolute inset-0 flex flex-col justify-end pb-8 md:pb-12 ${active ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!active}>
    <div className="mb-auto mt-[29vh] flex items-center gap-3 md:mt-[34vh]"><span className="font-mono text-[10px] font-semibold tracking-[.25em] text-navy/60">{numeral} / 05</span><span className="h-px w-10 bg-navy/35"/><span className="text-[10px] font-bold uppercase tracking-[.24em] text-navy/75">{label}</span></div>
    <p className="max-w-xs text-[11px] font-semibold leading-snug text-navy/75 md:max-w-sm md:text-sm">{route.description}</p>
    <h2 className="portrait-word -ml-1 mt-2 whitespace-nowrap text-[clamp(4.5rem,13.5vw,13rem)] font-black uppercase leading-[.74] tracking-[-.085em]" style={{ color }}>{route.title}</h2>
    <div className="mt-5 flex items-end justify-between gap-5">
      <div><p className="text-[9px] font-bold uppercase tracking-[.28em] text-navy/50">Alleanza conecta</p><p className="mt-1 text-[clamp(1rem,2vw,1.6rem)] font-bold uppercase tracking-[-.04em] text-navy">{word}</p></div>
      <a href={route.href} tabIndex={active ? 0 : -1} className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-navy px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-1 hover:bg-cyan hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">Descubrir {route.label} <ArrowRight size={15} className="transition group-hover:translate-x-1"/></a>
    </div>
  </motion.article>;
}

function RenderedWorld({ route, active }: { route: PortalRoute; active: boolean }) {
  const visual = renderedWorlds[route.id];
  return <motion.div
    animate={{ opacity: active ? 1 : 0, scale: active ? 1.035 : 1.12, filter: active ? "blur(0px)" : "blur(12px)" }}
    transition={{ duration: 1, ease: [.22, 1, .36, 1] }}
    aria-hidden={!active}
    className="absolute inset-0"
  >
    <motion.div animate={active ? { scale: [1, 1.025, 1], x: [0, -5, 0] } : undefined} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
      <Image src={visual.src} alt={active ? visual.alt : ""} fill priority={route.id === "health"} sizes="100vw" className="object-cover object-[62%_center] md:object-center" />
    </motion.div>
  </motion.div>;
}

export default function PortalHub() {
  const journey = useRef<HTMLElement>(null), reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const { scrollYProgress } = useScroll({ target: journey, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 25, mass: .45 });
  const progressWidth = useTransform(smooth, [0, 1], ["0%", "100%"]), universeScale = useTransform(smooth, [0, .5, 1], [1, 1.06, .96]);
  const render = useCallback((frame: CinematicRenderContext) => drawPortal(frame), []);
  useMotionValueEvent(scrollYProgress, "change", (value) => { const next = Math.min(portalRoutes.length - 1, Math.floor(value * portalRoutes.length)); setCurrent((old) => old === next ? old : next); });
  return <main className="bg-[#e8eef1]">
    <div className="noise"/><SiteHeader links={portalNavLinks} cta={{ href: "/health", label: "Orientación en salud" }}/>
    <h1 className="sr-only">Alleanza Insurance: protección para cada etapa de tu vida</h1>
    <section ref={journey} className="relative h-[500vh] text-navy">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={reduceMotion ? undefined : { scale: universeScale }} className="absolute inset-0">
          {portalRoutes.map((route, index) => <RenderedWorld key={route.id} route={route} active={index === current}/>) }
          <div className="absolute inset-0 opacity-[.09] mix-blend-multiply"><CinematicCanvas className="h-full w-full" ariaLabel="Destellos sutiles que acompañan las historias de Alleanza" progressRoot={journey} render={render}/></div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 portal-vignette"/><div className="pointer-events-none absolute inset-0 grid-lines opacity-35"/>
        <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/10"><motion.div style={{ width: progressWidth }} className="h-full bg-cyan shadow-[0_0_18px_rgba(4,192,254,.9)]"/></div>
        <div className="relative z-10 mx-auto h-full max-w-[1440px] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
          <div className="relative h-full">{portalRoutes.map((route, index) => <WorldPanel key={route.id} route={route} index={index} current={current}/>)}</div>
          <div className="pointer-events-none absolute right-5 top-28 flex flex-col items-end gap-3 text-right md:right-8">
            <p className="text-[9px] font-black uppercase tracking-[.3em] text-navy/65">Historias que protegen</p>
            <p className="hidden max-w-[210px] text-[11px] font-medium leading-snug text-navy/55 md:block">Cinco caminos. Una misión: estar contigo en lo que importa.</p>
          </div>
          <div className="pointer-events-none absolute bottom-7 right-8 hidden items-center gap-6 md:flex"><div className="flex gap-1.5">{portalRoutes.map((route, index) => <span key={route.id} className={`h-1 rounded-full transition-all duration-500 ${index === current ? "w-8 bg-navy" : "w-1 bg-navy/25"}`}/>)}</div><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.22em] text-navy/50"><ArrowDown size={13}/> Desliza</span></div>
        </div>
      </div>
    </section>
    <section className="relative bg-white px-5 py-20 text-navy md:py-28"><div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-cyan">Tu próximo paso</p><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-.04em] md:text-6xl">Cinco caminos. Un equipo cerca de ti.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy/55">Explora a tu ritmo o conversa directamente con una persona que pueda orientarte en español.</p><a href={`tel:${phones[0].href}`} className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-xl">Llamar al {phones[0].label} <ArrowRight size={16}/></a></div></section>
    <SiteFooter/>
  </main>;
}
