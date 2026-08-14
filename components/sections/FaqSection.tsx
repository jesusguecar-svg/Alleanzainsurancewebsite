"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useReveal } from "@/lib/motion";

const faqs = [
  {
    question: "¿Por qué elegir Alleanza?",
    answer:
      "Porque explicamos las coberturas en español, sin apuro y sin letra pequeña en la conversación. Trabajamos con distintas compañías, así que podemos mostrarte varias opciones y sus diferencias en lugar de un solo camino. La decisión siempre es tuya, y un agente con licencia te acompaña antes, durante y después de solicitar.",
  },
  {
    question: "¿Qué limitaciones tienen las pólizas?",
    answer:
      "Toda póliza tiene límites. Suelen existir períodos de espera, condiciones preexistentes, definiciones específicas de lo que cuenta como evento cubierto y exclusiones que dependen del producto, del estado y de la compañía. Las coberturas complementarias no sustituyen un seguro médico principal ni cubren todos los gastos. El documento que rige es la póliza emitida: te ayudamos a leerla antes de que decidas.",
  },
  {
    question: "¿Cómo elijo el plan de salud adecuado?",
    answer:
      "Partimos de tu situación: quiénes viven contigo, qué médicos quieres conservar, qué medicamentos tomas y qué presupuesto manejas. Con eso comparamos las opciones disponibles en tu estado y revisamos redes de proveedores, deducibles y copagos. No existe un plan mejor para todos; existe el que se ajusta a tu caso.",
  },
  {
    question: "¿Cada cuánto puedo cambiar de plan?",
    answer:
      "Los planes de salud suelen cambiarse durante el período de inscripción abierta. Fuera de esas fechas, ciertos cambios de vida —como mudarte, casarte, tener un hijo o perder una cobertura— pueden abrir un período especial de inscripción. Las fechas y los requisitos los define el Mercado de Salud o la compañía correspondiente, y conviene confirmarlos cada año.",
  },
  {
    question: "¿Cómo se maneja un reclamo?",
    answer:
      "El reclamo se presenta ante la compañía aseguradora que emitió la póliza, que es quien lo evalúa y decide según los términos del contrato. Nosotros te orientamos sobre qué documentación suele pedirse y te acompañamos en el proceso. Los tiempos y la resolución dependen de la compañía, no de la agencia.",
  },
];

export function FaqSection() {
  const reveal = useReveal({ y: 40 });

  return (
    <section id="preguntas" className="bg-[#eaf8fd] px-5 py-28 md:py-40">
      <div className="mx-auto max-w-4xl">
        <motion.div {...reveal} className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Preguntas frecuentes</p>
          <h2 className="mt-5 font-display text-5xl tracking-tight md:text-6xl">Lo que suelen preguntarnos.</h2>
        </motion.div>

        <motion.div {...reveal} className="mt-12 flex flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-navy/10 bg-white px-6 py-5 md:px-8 md:py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
                {faq.question}
                <Plus aria-hidden="true" size={22} className="shrink-0 text-cyan transition duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-navy/60 md:text-base">{faq.answer}</p>
            </details>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-navy/45">Esta información es general y no sustituye los términos de tu póliza ni la orientación de un agente de seguros con licencia.</p>
      </div>
    </section>
  );
}
