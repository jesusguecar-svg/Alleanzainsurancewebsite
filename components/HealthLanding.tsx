"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, PhoneCall, ShieldCheck, Video } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { HeroSequence } from "./cinematic";
import { SiteHeader, type NavLink } from "./layout/SiteHeader";
import { SiteFooter } from "./layout/SiteFooter";
import { ContactSection } from "./sections/ContactSection";
import { CoverageConceptsSection } from "./sections/CoverageConceptsSection";
import { DirectSupportSection } from "./sections/DirectSupportSection";
import { FaqSection } from "./sections/FaqSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ProductsSection } from "./sections/ProductsSection";
import { QualificationSection } from "./sections/QualificationSection";
import { StorySection } from "./sections/StorySection";
import { TrustSection } from "./sections/TrustSection";
import { MediaSlot } from "./ui/MediaSlot";
import { ProductDialog } from "./ui/ProductDialog";
import { type Product } from "@/lib/content/products";
import { phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";
import type { ResolvedMedia } from "@/lib/media";

const navLinks: NavLink[] = [
  { href: "#conceptos", label: "Entiende tu plan" },
  { href: "#coberturas", label: "Coberturas" },
  { href: "#como", label: "Cómo trabajamos" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "/", label: "Portal" },
];

export type HealthMedia = {
  hero: ResolvedMedia;
  concepts: ResolvedMedia;
  process: ResolvedMedia;
};

export default function HealthLanding({ media }: { media: HealthMedia }) {
  const reveal = useReveal();
  const entranceBadge = useEntrance({ opacity: 0, y: 20 });
  const entranceTitle = useEntrance({ opacity: 0, y: 45 });
  const entranceLede = useEntrance({ opacity: 0 });
  const entranceCta = useEntrance({ opacity: 0, y: 20 });

  const hero = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);

  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const fade = useTransform(scrollYProgress, [0, .8], [1, 0]);

  return (
    <main>
      <div className="noise" />
      <SiteHeader links={navLinks} cta={{ href: "#contacto", label: "Hablar con un asesor" }} />

      <section ref={hero} className="relative flex min-h-[165vh] items-start overflow-hidden bg-navy px-5 pb-20 pt-32 text-white">
        {/* Media slot: /media/health/hero-remote-consultation.mp4 (poster .webp).
            Falls back to the cinematic sequence until the file exists. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[62%]">
          <div className="sticky top-0 h-screen">
            {media.hero.image || media.hero.video ? (
              <div className="h-full w-full opacity-70">
                <MediaSlot media={media.hero} priority />
              </div>
            ) : (
              <HeroSequence progressRoot={hero} />
            )}
          </div>
        </div>

        <motion.div style={{ y: sceneY, scale: sceneScale }} className="absolute inset-0">
          <div className="absolute inset-0 grid-lines" />
          <div className="absolute left-[55%] top-[18%] h-[440px] w-[440px] rounded-full bg-cyan/20 blur-[110px]" />
        </motion.div>

        <motion.div style={{ y: copyY, opacity: fade }} className="sticky top-0 z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center py-24">
          <motion.div {...entranceBadge} transition={{ delay: .2, duration: .8 }} className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-cyan">
            <ShieldCheck aria-hidden="true" size={15} /> Seguros de salud explicados en español
          </motion.div>

          <motion.h1 {...entranceTitle} transition={{ delay: .3, duration: 1, ease }} className="max-w-4xl font-display text-[clamp(3.2rem,7.4vw,6.6rem)] font-bold leading-[.92] tracking-[-.045em]">
            El seguro médico es confuso.<br />
            <span className="text-cyan">Nosotros te lo explicamos.</span>
          </motion.h1>

          <motion.p {...entranceLede} transition={{ delay: .75, duration: 1 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Te ayudamos a comparar Obamacare (ACA), seguro médico privado y coberturas
            complementarias, con sus costos y sus límites sobre la mesa. Sin tecnicismos y sin
            presión.
          </motion.p>

          <motion.div {...entranceCta} transition={{ delay: .9, duration: .8 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contacto" className="group flex w-fit items-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy shadow-[0_15px_45px_rgba(4,192,254,.25)]">
              Quiero orientación gratuita <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#conceptos" className="flex w-fit items-center gap-3 px-4 py-3 text-sm font-medium text-white/75">
              <ArrowDown aria-hidden="true" size={17} /> Entender mi plan primero
            </a>
          </motion.div>

          <motion.div {...entranceCta} transition={{ delay: 1, duration: .8 }} className="mt-10 flex flex-col gap-3 text-sm text-white/55 sm:flex-row sm:items-center sm:gap-7">
            <span className="inline-flex items-center gap-2"><Video aria-hidden="true" size={16} className="text-cyan" /> Orientación por videollamada</span>
            <span className="inline-flex items-center gap-2">
              <PhoneCall aria-hidden="true" size={16} className="text-cyan" />
              <a href={`tel:${phones[0].href}`} className="underline-offset-4 transition hover:text-white hover:underline">{phones[0].label}</a>
            </span>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-white px-5 py-28 md:py-40">
        <div className="absolute right-[-10%] top-20 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:items-center">
          <motion.div {...reveal}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.22em] text-cyan">Sin letra pequeña en la conversación</p>
            <h2 className="text-balance font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
              Elegir un plan de salud no debería sentirse como adivinar.
            </h2>
          </motion.div>
          <motion.div {...reveal} transition={{ duration: .9, delay: .15, ease }} className="relative md:pl-20">
            <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-cyan to-transparent md:block" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-navy/65">
              Redes, deducibles, períodos de inscripción, exclusiones. Son decisiones con
              consecuencias reales para tu familia, y merecen una explicación tranquila.{" "}
              <strong className="font-semibold text-navy">Te acompañamos a entender antes de decidir</strong>,
              con un agente de seguros con licencia y en tu idioma.
            </p>
          </motion.div>
        </div>
      </section>

      <CoverageConceptsSection media={media.concepts} />

      <StorySection />

      <div id="coberturas">
        <ProductsSection onSelect={setSelectedProduct} />
      </div>

      <DirectSupportSection />

      <ProcessSection media={media.process} />

      <QualificationSection />

      <TrustSection />

      <FaqSection />

      <ContactSection />

      <SiteFooter />

      <ProductDialog product={selectedProduct} onClose={closeProduct} />
    </main>
  );
}
