"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Briefcase, GraduationCap, HeartPulse, Home, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { CinematicCanvas } from "./cinematic/CinematicCanvas";
import type { CinematicRenderContext } from "./cinematic/types";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { LogoMark } from "./Logo";
import { portalRoutes, portalNavLinks, type PortalRoute } from "@/lib/config/routes";
import { phones } from "@/lib/config/contact";

const icons: Record<PortalRoute["id"], LucideIcon> = { health: HeartPulse, life: Users, "property-casualty": Home, academy: GraduationCap, work: Briefcase };
const worlds = [
  { accent: [4, 192, 254], label: "Bienestar", numeral: "01" },
  { accent: [68, 221, 195], label: "Legado", numeral: "02" },
  { accent: [83, 149, 255], label: "Patrimonio", numeral: "03" },
  { accent: [146, 112, 255], label: "Crecimiento", numeral: "04" },
  { accent: [255, 188, 88], label: "Futuro", numeral: "05" },
] as const;
const renderedWorlds: Record<PortalRoute["id"], { src: string; alt: string }> = {
  health: { src: "/cinematic/business-worlds/salud.webp", alt: "Escultura tridimensional de salud dentro de una esfera protectora" },
  life: { src: "/cinematic/business-worlds/vida.webp", alt: "Escultura tridimensional de una familia rodeada por un abrazo protector" },
  "property-casualty": { src: "/cinematic/business-worlds/property-casualty.webp", alt: "Escultura tridimensional de un hogar protegido por anillos luminosos" },
  academy: { src: "/cinematic/business-worlds/academia.webp", alt: "Escultura tridimensional de escalones ascendentes hacia una meta" },
  work: { src: "/cinematic/business-worlds/work.webp", alt: "Escultura tridimensional de una trayectoria profesional en ascenso" },
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
  const Icon = icons[route.id], active = index === current, distance = index - current;
  const { accent, label, numeral } = worlds[index], color = `rgb(${accent.join(",")})`;
  return <motion.article animate={{ opacity: active ? 1 : 0, y: distance * 80, scale: active ? 1 : .92, filter: active ? "blur(0px)" : "blur(10px)" }} transition={{ type: "spring", stiffness: 90, damping: 20, mass: .8 }} className={`absolute inset-0 flex flex-col justify-center ${active ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!active}>
    <div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[.3em] text-white/35">{numeral} / 05</span><span className="h-px w-10" style={{ background: color }}/><span className="text-[10px] font-bold uppercase tracking-[.28em]" style={{ color }}>{label}</span></div>
    <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[.06]" style={{ color, boxShadow: `0 0 50px rgba(${accent.join(",")},.14)` }}><Icon size={27}/></div>
    <h2 className="mt-7 max-w-xl text-[clamp(3.7rem,8vw,7.7rem)] font-bold leading-[.83] tracking-[-.065em] text-white">{route.title}</h2>
    <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 md:text-lg">{route.description}</p>
    <a href={route.href} tabIndex={active ? 0 : -1} className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">Entrar a {route.label} <ArrowRight size={16} className="transition group-hover:translate-x-1"/></a>
  </motion.article>;
}

function RenderedWorld({ route, active }: { route: PortalRoute; active: boolean }) {
  const visual = renderedWorlds[route.id];
  return <motion.div
    animate={{ opacity: active ? 1 : 0, scale: active ? 1.04 : 1.16, rotate: active ? 0 : 2, filter: active ? "blur(0px)" : "blur(16px)" }}
    transition={{ duration: .85, ease: [.22, 1, .36, 1] }}
    aria-hidden={!active}
    className="absolute inset-y-[4%] right-[-4%] w-[74%] max-md:inset-x-[-18%] max-md:top-[4%] max-md:h-[58%] max-md:w-auto"
  >
    <motion.div animate={active ? { y: [0, -10, 0], rotate: [0, .7, 0] } : undefined} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
      <Image src={visual.src} alt={active ? visual.alt : ""} fill priority={route.id === "health"} sizes="(min-width: 768px) 74vw, 136vw" className="object-contain" />
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
  return <main className="bg-[#030a1a]">
    <div className="noise"/><SiteHeader links={portalNavLinks} cta={{ href: "/health", label: "Orientación en salud" }}/>
    <section ref={journey} className="relative h-[500vh] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={reduceMotion ? undefined : { scale: universeScale }} className="absolute inset-0">
          {portalRoutes.map((route, index) => <RenderedWorld key={route.id} route={route} active={index === current}/>) }
          <div className="absolute inset-0 opacity-35 mix-blend-screen"><CinematicCanvas className="h-full w-full" ariaLabel="Partículas que orbitan los mundos tridimensionales de Alleanza" progressRoot={journey} render={render}/></div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 portal-vignette"/><div className="pointer-events-none absolute inset-0 grid-lines opacity-35"/>
        <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/10"><motion.div style={{ width: progressWidth }} className="h-full bg-cyan shadow-[0_0_18px_rgba(4,192,254,.9)]"/></div>
        <div className="relative z-10 mx-auto grid h-full max-w-7xl px-5 pb-12 pt-28 md:grid-cols-[minmax(0,1fr)_minmax(320px,.72fr)] md:items-center md:px-8 md:pt-24">
          <div className="relative h-[470px] self-end md:h-[610px] md:self-auto">{portalRoutes.map((route, index) => <WorldPanel key={route.id} route={route} index={index} current={current}/>)}</div>
          <div className="pointer-events-none absolute inset-x-5 top-28 flex justify-between md:static md:flex md:h-full md:flex-col md:items-end md:justify-between md:py-12 md:text-right">
            <div className="flex items-center gap-3 md:flex-col md:items-end"><LogoMark light size={44}/><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-cyan">El universo Alleanza</p><p className="mt-1 hidden max-w-[240px] text-xs leading-relaxed text-white/38 md:block">Cinco caminos. Una misión: proteger lo que estás construyendo.</p></div></div>
            <div className="hidden items-center gap-6 md:flex"><div className="flex gap-1.5">{portalRoutes.map((route, index) => <span key={route.id} className={`h-1 rounded-full transition-all duration-500 ${index === current ? "w-8 bg-cyan" : "w-1 bg-white/20"}`}/>)}</div><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30"><ArrowDown size={13}/> Desliza</span></div>
          </div>
        </div>
      </div>
    </section>
    <section className="relative bg-white px-5 py-20 text-navy md:py-28"><div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-cyan">Tu próximo paso</p><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-.04em] md:text-6xl">Cinco caminos. Un equipo cerca de ti.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy/55">Explora a tu ritmo o conversa directamente con una persona que pueda orientarte en español.</p><a href={`tel:${phones[0].href}`} className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-xl">Llamar al {phones[0].label} <ArrowRight size={16}/></a></div></section>
    <SiteFooter/>
  </main>;
}
