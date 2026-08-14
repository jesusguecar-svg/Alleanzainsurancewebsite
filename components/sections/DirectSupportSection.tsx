"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";
import { HandHeart, ShieldCheck } from "lucide-react";

export function DirectSupportSection() {
  const reveal = useReveal({ y: 32 });

  return (
    <section id="apoyo-directo" className="overflow-hidden bg-[#eaf8fd] px-5 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="mb-12 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Cómo funciona el apoyo</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">Apoyo que se adapta al momento.</h2>
        </motion.div>
        <div className="grid overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-[0_30px_80px_-45px_rgba(6,20,49,.3)] md:grid-cols-2">
          <div className="p-8 md:p-12">
            <HandHeart className="text-cyan" size={36} />
            <h3 className="mt-8 text-2xl font-extrabold">Beneficios para tus necesidades</h3>
            <p className="mt-5 text-base leading-relaxed text-navy/65">Dependiendo de la póliza y del evento cubierto, los beneficios elegibles pueden pagarse directamente a la persona asegurada y utilizarse según sus necesidades, mientras el seguro médico mayor se ocupa de los gastos que le correspondan.</p>
          </div>
          <aside aria-label="Divulgación de la póliza" className="border-t border-navy/10 bg-navy p-8 text-white md:border-l md:border-t-0 md:p-12">
            <ShieldCheck className="text-cyan" size={32} />
            <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-cyan">Información importante</p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">Todos los beneficios están sujetos a los términos, condiciones, limitaciones, exclusiones, requisitos de elegibilidad y demás disposiciones de la póliza aplicable. La póliza emitida es la que determina la cobertura y los beneficios disponibles.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

