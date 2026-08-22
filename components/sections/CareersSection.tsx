"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Building2, GraduationCap, LifeBuoy, TrendingUp, Wrench } from "lucide-react";
import { academyUrl } from "@/lib/config/contact";
import { ease, useReveal } from "@/lib/motion";

const benefits = [
  {
    icon: Building2,
    title: "Acceso a varias compañías",
    copy: "Trabajamos con distintos proveedores, así que puedes ofrecer más de una alternativa y encontrar la que realmente le sirva a cada familia.",
  },
  {
    icon: LifeBuoy,
    title: "Acompañamiento real",
    copy: "No te dejamos solo frente al cliente. Tienes respaldo del equipo para resolver dudas, preparar una cita o entender un producto nuevo.",
  },
  {
    icon: TrendingUp,
    title: "Compensación competitiva",
    copy: "Un esquema de compensación acorde al mercado, explicado con claridad desde el primer día. Los detalles se conversan en la entrevista.",
  },
  {
    icon: Wrench,
    title: "Herramientas de venta",
    copy: "Sistemas y materiales que te ayudan a organizar tu cartera, dar seguimiento y presentar las opciones de forma ordenada.",
  },
];

const growth = [
  { icon: GraduationCap, label: "Formación", copy: "Capacitación continua sobre productos y procesos." },
  { icon: BookOpen, label: "Aprendizaje", copy: "Espacios para seguir estudiando el mercado y sus cambios." },
  { icon: TrendingUp, label: "Superación", copy: "Un camino claro para crecer a tu ritmo." },
  { icon: LifeBuoy, label: "Liderazgo", copy: "Oportunidad de formar y guiar a otros agentes." },
];

export function CareersSection() {
  const reveal = useReveal({ y: 40 });

  return (
    <section id="trabajo" className="relative overflow-hidden bg-navy px-5 py-28 text-white md:py-40">
      <div className="absolute right-[-10%] top-10 h-96 w-96 rounded-full bg-cyan/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">Trabaja con nosotros</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl font-bold">Construye una carrera ayudando a familias.</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60">Buscamos personas que quieran crecer en el mundo de los seguros y acompañar a su comunidad en español. Si te interesa, conversemos sobre cómo sería tu camino con nosotros.</p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit, i) => (
            <motion.article key={benefit.title} {...reveal} transition={{ duration: .8, delay: Math.min(i, 3) * .09, ease }} className="glass rounded-3xl p-8">
              <benefit.icon aria-hidden="true" className="text-cyan" size={28} />
              <h3 className="mt-6 text-xl font-bold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{benefit.copy}</p>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal} className="mt-14">
          <h3 className="text-xs font-bold uppercase tracking-[.22em] text-aqua">Crecimiento</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {growth.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[.05] p-6">
                <item.icon aria-hidden="true" className="text-aqua" size={22} />
                <p className="mt-4 font-bold">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="mt-14 flex flex-col gap-5 rounded-[2rem] border border-cyan/25 bg-cyan/10 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-semibold">¿Te gustaría formar parte?</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">Escríbenos por el formulario de contacto y cuéntanos sobre ti. También puedes conocer nuestra academia para ver cómo acompañamos la formación de nuevos agentes.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href="#contacto" className="flex items-center justify-center gap-2 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Quiero postularme <ArrowRight aria-hidden="true" size={16} />
            </a>
            <a href={academyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-aqua/40 px-7 py-4 text-sm font-semibold text-aqua transition hover:border-aqua hover:bg-aqua/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Ver la academia
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
