"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Activity, ArrowRight, BedDouble, HeartPulse, Landmark, Lock, ShieldAlert, Sparkles, Stethoscope, Users, type LucideIcon } from "lucide-react";
import { ProtectionWorld, type ProtectionState } from "../cinematic";
import { additionalProducts, featuredProducts, type Product, type ProductId } from "@/lib/content/products";
import { ease, useReveal } from "@/lib/motion";

const icons: Record<ProductId, LucideIcon> = {
  cardiaca: HeartPulse,
  "cuidados-intensivos": Stethoscope,
  cancer: Sparkles,
  accidentes: ShieldAlert,
  "indemnizacion-hospitalaria": BedDouble,
  "aca-obamacare": Landmark,
  "seguro-medico": Activity,
  "seguro-privado": Lock,
  "seguro-vida": Users,
};

/** Only the featured products have a cinematic sequence behind the card. */
const cinematicStates: Partial<Record<ProductId, ProtectionState>> = {
  cardiaca: "cardiac",
  "cuidados-intensivos": "intensive",
  cancer: "cancer",
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-.5, .5], [8, -8]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-.5, .5], [-8, 8]), { stiffness: 160, damping: 20 });
  return <motion.div style={reduceMotion ? { transformStyle: "preserve-3d" } : { rotateX, rotateY, transformStyle: "preserve-3d" }} onMouseMove={reduceMotion ? undefined : (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX-r.left)/r.width-.5); y.set((e.clientY-r.top)/r.height-.5); }} onMouseLeave={reduceMotion ? undefined : () => { x.set(0); y.set(0); }} className="group relative h-full rounded-[2rem] border border-navy/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(6,20,49,.35)] transition-shadow duration-500 hover:shadow-[0_35px_90px_-30px_rgba(4,192,254,.5)] md:p-10">{children}</motion.div>;
}

type CardProps = { product: Product; onSelect: (product: Product) => void };

function FeaturedCard({ product, onSelect }: CardProps) {
  const Icon = icons[product.id];
  const state = cinematicStates[product.id];
  return (
    <TiltCard>
      {state && <ProtectionWorld state={state} />}
      <div style={{ transform: "translateZ(32px)" }}>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-cyan"><Icon aria-hidden="true" size={26} /></div>
        <p className="mt-12 text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan">{product.eyebrow}</p>
        <h3 className="mt-3 font-display text-4xl">{product.shortName}</h3>
        <p className="mt-5 min-h-24 text-sm leading-relaxed text-navy/55">{product.summary}</p>
        <button type="button" onClick={() => onSelect(product)} aria-haspopup="dialog" aria-label={`Conocer protección ${product.shortName}`} className="mt-8 flex items-center gap-2 text-sm font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
          Conocer protección <ArrowRight aria-hidden="true" size={16} className="transition group-hover:translate-x-1" />
        </button>
      </div>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/0 blur-2xl transition duration-500 group-hover:bg-cyan/30" />
    </TiltCard>
  );
}

function CompactCard({ product, onSelect }: CardProps) {
  const Icon = icons[product.id];
  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-navy/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_25px_60px_-35px_rgba(6,20,49,.4)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/12 text-navy"><Icon aria-hidden="true" size={22} /></div>
      <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan">{product.eyebrow}</p>
      <h3 className="mt-2 text-2xl font-extrabold leading-tight">{product.shortName}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/55">{product.summary}</p>
      <button type="button" onClick={() => onSelect(product)} aria-haspopup="dialog" aria-label={`Conocer más sobre ${product.name}`} className="mt-6 flex items-center gap-2 text-sm font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
        Conocer más <ArrowRight aria-hidden="true" size={15} className="transition group-hover:translate-x-1" />
      </button>
    </article>
  );
}

export function ProductsSection({ onSelect }: { onSelect: (product: Product) => void }) {
  const reveal = useReveal();

  return (
    <section id="productos" className="px-5 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Nuestras coberturas</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">Protección para cada etapa de tu familia.</h2>
          <p className="mt-6 text-lg leading-relaxed text-navy/60">Desde salud y vida hasta coberturas complementarias que acompañan los momentos difíciles. Te explicamos cada opción en español, con sus alcances y sus límites.</p>
        </motion.div>

        <h3 className="sr-only">Protección esencial</h3>
        <div className="perspective mt-16 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product, i) => (
            <motion.div key={product.id} {...reveal} transition={{ duration: .8, delay: i * .1, ease }}>
              <FeaturedCard product={product} onSelect={onSelect} />
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal} className="mt-20">
          <h3 className="font-display text-3xl tracking-tight md:text-4xl">También te acompañamos con</h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalProducts.map((product, i) => (
              <motion.div key={product.id} {...reveal} transition={{ duration: .7, delay: Math.min(i, 3) * .08, ease }}>
                <CompactCard product={product} onSelect={onSelect} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="mt-10 text-center text-[11px] text-navy/40">Beneficios sujetos a términos, condiciones, limitaciones y exclusiones de la póliza. La disponibilidad y la elegibilidad varían según el estado y la compañía aseguradora.</p>
      </div>
    </section>
  );
}
