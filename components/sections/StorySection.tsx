"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";

/**
 * Storytelling beat between the concepts and the coverage grid. Written to the
 * brandbook's tone rule: no drama, no fear, no commercial pressure — just the
 * ordinary experience of not being explained anything.
 */
export function StorySection() {
  const reveal = useReveal({ y: 40 });

  return (
    <section className="relative overflow-hidden bg-navy px-5 py-28 text-white md:py-40">
      <div className="absolute left-[-8%] top-1/3 h-96 w-96 rounded-full bg-cyan/10 blur-[130px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <motion.div {...reveal}>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Pero esto no fue siempre así</p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Durante años, entender un seguro dependía de tener a alguien que te lo tradujera.
          </h2>
        </motion.div>

        <motion.div {...reveal} className="mt-10 grid gap-6 text-lg leading-relaxed text-white/65 md:grid-cols-2">
          <p>
            Muchas familias firmaron lo que les pusieron enfrente, sin saber qué era un deducible ni
            qué quedaba fuera. Otras dejaron pasar la inscripción porque nadie les explicó las fechas
            a tiempo, o supusieron que no calificaban para nada.
          </p>
          <p>
            No es falta de interés. Es que la información llega en inglés, con prisa y en lenguaje
            técnico. <strong className="font-semibold text-white">Nosotros empezamos por la conversación</strong>,
            en tu idioma y a tu ritmo, antes de hablar de ningún plan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
