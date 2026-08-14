"use client";

import { motion } from "framer-motion";
import { ClipboardList, Headphones, Scale, Wallet } from "lucide-react";
import { ease, useReveal } from "@/lib/motion";
import { MediaSlot } from "../ui/MediaSlot";
import type { ResolvedMedia } from "@/lib/media";

const steps = [
  {
    icon: Headphones,
    title: "Escuchamos tu situación",
    copy: "Quiénes viven contigo, qué médicos quieres conservar, qué medicamentos tomas y qué presupuesto manejas.",
  },
  {
    icon: Scale,
    title: "Comparamos opciones",
    copy: "Revisamos lo que está disponible en tu estado y ponemos las alternativas lado a lado, sin empujarte a una.",
  },
  {
    icon: Wallet,
    title: "Te explicamos costos y límites",
    copy: "Qué pagarías al mes, qué cubre y qué no, qué períodos de espera y exclusiones aplican.",
  },
  {
    icon: ClipboardList,
    title: "Te acompañamos después de elegir",
    copy: "Seguimos disponibles para dudas, cambios de vida, renovaciones y para orientarte si necesitas presentar un reclamo.",
  },
];

export function ProcessSection({ media }: { media: ResolvedMedia }) {
  const reveal = useReveal({ y: 40 });

  return (
    <section id="como" className="bg-mist px-5 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Cómo trabajamos</p>
          <h2 className="mt-5 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Cuatro pasos, sin prisa y sin compromiso.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                {...reveal}
                transition={{ duration: .8, delay: Math.min(i, 3) * .09, ease }}
                className="rounded-3xl border border-navy/10 bg-white p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cyan">
                    {i + 1}
                  </span>
                  <step.icon aria-hidden="true" className="text-cyan" size={22} />
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/55">{step.copy}</p>
              </motion.li>
            ))}
          </ol>

          {/* Media slot: /media/health/process-clarity.webm (poster .webp) */}
          <motion.div {...reveal} className="overflow-hidden rounded-[2rem] border border-navy/10 bg-white">
            <div className="aspect-[3/4] w-full">
              <MediaSlot media={media} label="Visual del proceso de orientación paso a paso." />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
