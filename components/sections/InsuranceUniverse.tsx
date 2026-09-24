"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BedDouble,
  Car,
  HeartHandshake,
  HeartPulse,
  Home,
  Hourglass,
  KeyRound,
  Landmark,
  Lock,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { CinematicCanvas } from "../cinematic/CinematicCanvas";
import type { CinematicRenderContext } from "../cinematic/types";
import { products, type Product, type ProductId } from "@/lib/content/products";

const icons: Record<ProductId, LucideIcon> = {
  cardiaca: HeartPulse,
  "cuidados-intensivos": Stethoscope,
  cancer: Sparkles,
  accidentes: ShieldAlert,
  "indemnizacion-hospitalaria": BedDouble,
  "aca-obamacare": Landmark,
  "seguro-medico": Activity,
  "seguro-privado": Lock,
  "vida-temporal": Hourglass,
  "vida-permanente": Shield,
  "gastos-finales": HeartHandshake,
  hogar: Home,
  auto: Car,
  inquilinos: KeyRound,
  responsabilidad: Scale,
};

const colors = [
  [4, 192, 254], [62, 229, 255], [135, 119, 255], [255, 119, 180], [255, 176, 77],
  [76, 222, 171], [45, 167, 255], [174, 133, 255], [255, 219, 117],
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function renderUniverse({ ctx, width, height, progress, time, mobile }: CinematicRenderContext) {
  const stageFloat = clamp(progress) * (products.length - 1);
  const stage = Math.min(products.length - 1, Math.round(stageFloat));
  const local = stageFloat - Math.floor(stageFloat);
  const rgb = colors[stage % colors.length];
  const cx = mobile ? width * .5 : width * .64;
  const cy = height * .48;
  const min = Math.min(width, height);

  const background = ctx.createRadialGradient(cx, cy, 0, cx, cy, min * .75);
  background.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.17)`);
  background.addColorStop(.42, "rgba(5,21,50,.3)");
  background.addColorStop(1, "rgba(3,10,25,0)");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // A deep star tunnel makes the scroll feel like forward movement through space.
  const stars = mobile ? 65 : 145;
  for (let i = 0; i < stars; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const angle = seed / 233280 * Math.PI * 2;
    const cycle = (i * .067 + progress * 2.2) % 1;
    const radius = Math.pow(cycle, 1.8) * min * .72;
    const x = cx + Math.cos(angle) * radius * (1.45 + Math.sin(i) * .12);
    const y = cy + Math.sin(angle) * radius;
    const size = .35 + cycle * 2.2;
    ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${.08 + cycle * .6})`;
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    if (cycle > .7) {
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(cycle - .7) * .5})`;
      ctx.lineWidth = size * .3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + (x - cx) * 1.08, cy + (y - cy) * 1.08); ctx.stroke();
    }
  }

  ctx.save();
  ctx.translate(cx, cy);
  const breathe = 1 + Math.sin(time * 1.4) * .025;
  const sphereRadius = min * (mobile ? .205 : .245) * breathe;
  const sphere = ctx.createRadialGradient(-sphereRadius * .32, -sphereRadius * .38, 0, 0, 0, sphereRadius);
  sphere.addColorStop(0, "rgba(255,255,255,.98)");
  sphere.addColorStop(.13, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.94)`);
  sphere.addColorStop(.58, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.23)`);
  sphere.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  ctx.fillStyle = sphere;
  ctx.beginPath(); ctx.arc(0, 0, sphereRadius * 1.35, 0, Math.PI * 2); ctx.fill();

  // Rotating latitude and protection rings create the dimensional object.
  for (let ring = 0; ring < 7; ring++) {
    const r = sphereRadius * (.68 + ring * .13);
    ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${.24 - ring * .023})`;
    ctx.lineWidth = ring === 0 ? 2.4 : 1;
    ctx.setLineDash(ring % 2 ? [4, 9] : []);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * (.18 + ring * .055), time * (.08 + ring * .014) + local * .4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  for (let i = 0; i < 5; i++) {
    const angle = time * (.18 + i * .015) + i * 1.256 + progress * Math.PI * 4;
    const orbit = sphereRadius * (1.02 + i * .07);
    const x = Math.cos(angle) * orbit;
    const y = Math.sin(angle) * orbit * .32;
    const dot = 2 + (Math.sin(angle) + 1) * 2;
    ctx.shadowColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    ctx.shadowBlur = 16;
    ctx.fillStyle = "rgba(255,255,255,.95)";
    ctx.beginPath(); ctx.arc(x, y, dot, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0;

  // A subtle shield contour resolves the abstract world back to protection.
  ctx.rotate(Math.sin(time * .3) * .025);
  ctx.strokeStyle = `rgba(255,255,255,${.24 + Math.sin(time) * .04})`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -sphereRadius * .66);
  ctx.bezierCurveTo(sphereRadius * .55, -sphereRadius * .5, sphereRadius * .56, sphereRadius * .28, 0, sphereRadius * .68);
  ctx.bezierCurveTo(-sphereRadius * .56, sphereRadius * .28, -sphereRadius * .55, -sphereRadius * .5, 0, -sphereRadius * .66);
  ctx.stroke();
  ctx.restore();
}

function StageCard({ product, index, current, onSelect }: { product: Product; index: number; current: number; onSelect: (product: Product) => void }) {
  const Icon = icons[product.id];
  const distance = index - current;
  const active = distance === 0;
  const rgb = colors[index];
  return (
    <motion.article
      animate={{
        opacity: Math.abs(distance) > 1 ? 0 : active ? 1 : .28,
        y: distance * 92,
        x: active ? 0 : 34,
        scale: active ? 1 : .82,
        filter: active ? "blur(0px)" : "blur(2px)",
      }}
      transition={{ type: "spring", stiffness: 95, damping: 18, mass: .85 }}
      className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${Math.abs(distance) > 1 ? "pointer-events-none" : ""}`}
      aria-hidden={!active}
    >
      <div className="max-w-xl rounded-[2rem] border border-white/15 bg-[#071630]/70 p-7 shadow-[0_30px_100px_rgba(0,0,0,.34)] backdrop-blur-2xl md:p-9">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15" style={{ color: `rgb(${rgb.join(",")})`, background: `rgba(${rgb.join(",")},.12)` }}><Icon aria-hidden="true" size={27}/></div>
          <span className="font-mono text-xs tracking-[.22em] text-white/35">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
        </div>
        <p className="mt-9 text-[10px] font-extrabold uppercase tracking-[.24em]" style={{ color: `rgb(${rgb.join(",")})` }}>{product.eyebrow}</p>
        <h3 className="mt-3 font-display text-4xl leading-none tracking-tight text-white md:text-6xl">{product.shortName}</h3>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/58 md:text-base">{product.summary}</p>
        <button type="button" onClick={() => onSelect(product)} tabIndex={active ? 0 : -1} className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-extrabold text-navy transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
          Explorar esta protección <ArrowRight size={15}/>
        </button>
      </div>
    </motion.article>
  );
}

export function InsuranceUniverse({ onSelect }: { onSelect: (product: Product) => void }) {
  const root = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: .5 });
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const universeScale = useTransform(smoothProgress, [0, .5, 1], [1, 1.06, .92]);
  const render = useCallback((frame: CinematicRenderContext) => renderUniverse(frame), []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(products.length - 1, Math.floor(latest * products.length));
    setCurrent((value) => value === next ? value : next);
  });

  return (
    <section ref={root} id="productos" className="relative h-[900vh] bg-[#030a19] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={reduceMotion ? undefined : { scale: universeScale }} className="absolute inset-0">
          <CinematicCanvas className="h-full w-full" ariaLabel="Universo tridimensional de opciones de protección" progressRoot={root} render={render}/>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,25,.96)_0%,rgba(3,10,25,.72)_40%,transparent_72%)] max-md:bg-[linear-gradient(180deg,rgba(3,10,25,.34),rgba(3,10,25,.92)_62%)]"/>
        <div className="pointer-events-none absolute inset-0 insurance-vignette"/>

        <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/10"><motion.div style={{ width: progressWidth }} className="h-full bg-cyan shadow-[0_0_18px_rgba(4,192,254,.9)]"/></div>

        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 px-5 pb-16 pt-28 md:grid-cols-[minmax(0,1fr)_minmax(360px,.68fr)] md:items-center md:px-8 md:pt-24">
          <div className="relative hidden h-[520px] md:block">
            {products.map((product, index) => <StageCard key={product.id} product={product} index={index} current={current} onSelect={onSelect}/>)}
          </div>

          <div className="pointer-events-none flex h-full flex-col justify-between md:items-end md:py-12">
            <div className="self-start md:self-end md:text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-[.25em] text-cyan">El universo Alleanza</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/45 md:ml-auto">Desliza para viajar por cada forma de proteger lo que más importa.</p>
            </div>
            <div className="pointer-events-auto relative h-[330px] w-full md:hidden">
              {products.map((product, index) => <StageCard key={product.id} product={product} index={index} current={current} onSelect={onSelect}/>)}
            </div>
            <div className="flex items-end justify-between gap-6 md:w-full md:justify-end">
              <div className="flex gap-1.5" aria-hidden="true">{products.map((product, index) => <span key={product.id} className={`h-1 rounded-full transition-all duration-500 ${index === current ? "w-8 bg-cyan" : "w-1 bg-white/20"}`}/>)}</div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/35"><ArrowDown size={14}/> Sigue explorando</div>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">Beneficios sujetos a términos, condiciones, limitaciones y exclusiones de la póliza. La disponibilidad y la elegibilidad varían según el estado y la compañía aseguradora.</p>
    </section>
  );
}
