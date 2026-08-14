"use client";

import { companyFacts, type CompanyFacts, type VerifiedFact } from "@/lib/config/company";
import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";

const pending = "Pendiente de confirmación";

function displayFact<T>(fact: VerifiedFact<T>, format: (value: T) => string) {
  return fact.verified ? format(fact.value) : pending;
}

const factRows: { label: string; key: keyof CompanyFacts; format: (value: never) => string }[] = [
  { label: "Agentes", key: "agents", format: (value) => String(value) },
  { label: "Clientes atendidos", key: "clientsServed", format: (value) => String(value) },
  { label: "Años de experiencia", key: "yearsOfExperience", format: (value) => String(value) },
  { label: "Estados con licencia", key: "licensedStates", format: (value) => (value as readonly string[]).join(", ") },
  { label: "Relaciones con aseguradoras", key: "carrierRelationships", format: (value) => (value as readonly string[]).join(", ") },
  { label: "Testimonios aprobados", key: "testimonials", format: (value) => `${(value as readonly unknown[]).length} aprobados` },
];

export function TrustSection() {
  const reveal = useReveal({ y: 32 });

  return (
    <section id="confianza" className="bg-navy px-5 py-28 text-white md:py-40">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Transparencia primero</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">La confianza se demuestra con datos verificados.</h2>
          <p className="mt-6 leading-relaxed text-white/60">No publicamos cifras, relaciones ni historias hasta completar su verificación.</p>
        </motion.div>
        <div aria-label="Revisión de publicación" className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {factRows.map(({ label, key, format }) => {
            const fact = companyFacts[key] as VerifiedFact<never>;
            return <div key={key} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/45">{label}</p><p className={`mt-3 font-bold ${fact.verified ? "text-white" : "text-cyan"}`}>{displayFact(fact, format)}</p></div>;
          })}
        </div>
      </div>
    </section>
  );
}
