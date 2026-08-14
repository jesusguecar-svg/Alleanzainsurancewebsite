"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/lib/motion";
import { MediaSlot } from "../ui/MediaSlot";
import type { ResolvedMedia } from "@/lib/media";

const concepts = [
  {
    term: "Prima",
    plain: "Lo que pagas cada mes",
    detail: "El pago mensual que mantiene el plan activo, lo uses o no.",
  },
  {
    term: "Deducible",
    plain: "Lo que pagas antes de que el plan empiece a pagar",
    detail: "El monto que asumes primero en el año antes de que la cobertura comparta los gastos.",
  },
  {
    term: "Copago",
    plain: "Lo que pagas en cada visita",
    detail: "Una cantidad fija por consulta, receta o servicio, según lo que indique el plan.",
  },
  {
    term: "Coaseguro",
    plain: "El porcentaje que te toca",
    detail: "Después del deducible, el plan cubre una parte y tú cubres la otra.",
  },
  {
    term: "Máximo de bolsillo",
    plain: "El techo de lo que pagarías en el año",
    detail: "El límite anual de tu gasto por servicios cubiertos. Al llegar ahí, el plan asume el resto.",
  },
  {
    term: "Red de proveedores",
    plain: "Los médicos y hospitales incluidos",
    detail: "Los prestadores con acuerdo con el plan. Fuera de la red, el costo suele ser mayor.",
  },
];

export function CoverageConceptsSection({ media }: { media: ResolvedMedia }) {
  const reveal = useReveal({ y: 40 });

  return (
    <section id="conceptos" className="bg-white px-5 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Entiende tu plan</p>
          <h2 className="mt-5 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Las palabras del seguro, en español claro.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy/60">
            Deducible, copago, coaseguro, máximo de bolsillo. Son las palabras que deciden cuánto
            pagas en realidad, y casi nunca te las explican con calma. Aquí empezamos por ahí.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <motion.dl {...reveal} className="grid gap-3 sm:grid-cols-2">
            {concepts.map((concept) => (
              <div key={concept.term} className="rounded-2xl border border-navy/10 bg-mist/60 p-6">
                <dt className="text-lg font-semibold">{concept.term}</dt>
                <dd>
                  <p className="mt-1 text-sm font-medium text-cyan">{concept.plain}</p>
                  <p className="mt-2 text-sm leading-relaxed text-navy/55">{concept.detail}</p>
                </dd>
              </div>
            ))}
          </motion.dl>

          {/* Media slot: /media/health/coverage-life-health-card.webp */}
          <motion.div {...reveal} className="overflow-hidden rounded-[2rem] border border-navy/10 bg-mist">
            <div className="aspect-[4/5] w-full">
              <MediaSlot media={media} label="Visual de tarjeta de seguro: deducible, copago y máximo de bolsillo." />
            </div>
          </motion.div>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed text-navy/45">
          Definiciones generales con fines informativos. Los términos exactos, montos y condiciones
          los establece cada plan y deben confirmarse con la compañía aseguradora o el Mercado de
          Salud según corresponda.
        </p>
      </div>
    </section>
  );
}
