"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";
import { ClipboardCheck, FileSearch, MapPin, SlidersHorizontal } from "lucide-react";

const criteria = [
  { icon: ClipboardCheck, title: "Edades elegibles", copy: "La edad de elegibilidad depende del producto seleccionado." },
  { icon: MapPin, title: "Lugar de residencia", copy: "Debes residir donde la cobertura esté disponible." },
  { icon: FileSearch, title: "Solicitud y evaluación", copy: "La cobertura requiere una solicitud y puede estar sujeta a evaluación de riesgo." },
  { icon: SlidersHorizontal, title: "Disponibilidad variable", copy: "Los productos, características y requisitos pueden variar según el producto y el estado." },
] as const;

export function QualificationSection() {
  const reveal = useReveal({ y: 32 });
  const revealCard = useReveal({ y: 24 });

  return (
    <section id="requisitos" className="px-5 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Criterios generales</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">¿Quién puede solicitar?</h2>
        </motion.div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {criteria.map((criterion, index) => <motion.article key={criterion.title} {...revealCard} transition={{ delay: index * .08 }} className="rounded-3xl border border-navy/10 bg-white p-7 md:p-9"><criterion.icon className="text-cyan" size={27}/><h3 className="mt-6 text-xl font-extrabold">{criterion.title}</h3><p className="mt-3 text-sm leading-relaxed text-navy/60">{criterion.copy}</p></motion.article>)}
        </div>
      </div>
    </section>
  );
}

