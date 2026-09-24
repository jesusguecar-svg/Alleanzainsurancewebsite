"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ClipboardList, Headphones, HeartHandshake, Hourglass, MapPin, PhoneCall, Scale, ShieldCheck, Users, Video, Wallet } from "lucide-react";
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
import { additionalLifeProducts, featuredLifeProducts, type Product } from "@/lib/content/products";
import { phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";
import type { ResolvedMedia } from "@/lib/media";

const navLinks: NavLink[] = [
  { href: "#conceptos", label: "Entiende la póliza" },
  { href: "#coberturas", label: "Modalidades" },
  { href: "#como", label: "Cómo trabajamos" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "/", label: "Portal" },
];

const concepts = [
  {
    term: "Beneficio por fallecimiento",
    plain: "Lo que puede recibir quien tú designas",
    detail: "El monto que la póliza puede pagar si el fallecimiento está cubierto.",
  },
  {
    term: "Prima",
    plain: "Lo que pagas para mantener la póliza",
    detail: "El pago que mantiene la cobertura vigente, lo uses o no.",
  },
  {
    term: "Beneficiario",
    plain: "Quién recibiría el beneficio",
    detail: "La persona o personas que designas. Conviene revisar esa designación cuando cambia tu familia.",
  },
  {
    term: "Período de contestabilidad",
    plain: "El tiempo en que la compañía puede revisar la solicitud",
    detail: "Si ocurre un fallecimiento en ese período, la compañía puede revisar las respuestas de la solicitud antes de pagar.",
  },
  {
    term: "Exclusiones",
    plain: "Lo que la póliza deja fuera",
    detail: "Situaciones que el contrato no cubre. Cada compañía las escribe en la póliza.",
  },
  {
    term: "Valor en efectivo",
    plain: "Una reserva de algunas pólizas permanentes",
    detail: "No todas las modalidades lo acumulan, y no funciona como una cuenta de banco.",
  },
];

const faqs = [
  {
    question: "¿En qué se diferencia una póliza temporal de una permanente?",
    answer:
      "La temporal cubre un plazo definido. Al terminar ese plazo, la cobertura termina, salvo que el contrato permita renovarla o convertirla. La permanente está pensada para mantenerse mientras se cumplan las condiciones, incluida la prima. El precio, el monto y cualquier valor en efectivo dependen de la modalidad y de la compañía.",
  },
  {
    question: "¿Qué es una póliza de gastos finales?",
    answer:
      "Es un seguro de vida de monto más acotado, pensado para dejar un beneficio que ayude con gastos finales. No está diseñada para reemplazar el ingreso de una familia durante muchos años. El monto y las condiciones están en la póliza.",
  },
  {
    question: "¿Quién puede ser beneficiario?",
    answer:
      "La persona o personas que tú designas, según lo que permita la póliza. Puedes revisar y cambiar esa designación cuando cambia tu familia. Si la designación no está actualizada, el beneficio puede llegar a alguien distinto de quien tú tienes en mente hoy.",
  },
  {
    question: "¿Qué pasa si dejo de pagar la prima?",
    answer:
      "La póliza puede vencer, según el contrato y el período de gracia que establezca la compañía. Antes de dejar de pagar, conviene preguntar qué opciones existen para esa modalidad.",
  },
  {
    question: "¿Cómo se presenta un reclamo de vida?",
    answer:
      "Quien corresponda presenta el reclamo ante la compañía que emitió la póliza, normalmente con el certificado de defunción y la designación de beneficiarios. La compañía lo evalúa según el contrato. Nosotros te orientamos sobre la documentación que suele pedirse. La decisión y los tiempos dependen de la compañía.",
  },
];

export type LifeMedia = {
  hero: ResolvedMedia;
  concepts: ResolvedMedia;
  process: ResolvedMedia;
};

export default function LifeLanding({ media }: { media: LifeMedia }) {
  const reveal = useReveal();
  const entranceBadge = useEntrance({ opacity: 0, y: 20 });
  const entranceTitle = useEntrance({ opacity: 0, y: 45 });
  const entranceLede = useEntrance({ opacity: 0 });
  const entranceCta = useEntrance({ opacity: 0, y: 20 });

  const hero = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);

  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 180]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 320]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.18]);
  const fade = useTransform(scrollYProgress, [0, .8], [1, reduceMotion ? 1 : 0]);

  return (
    <main>
      <div className="noise" />
      <SiteHeader links={navLinks} cta={{ href: "#contacto", label: "Hablar con un asesor" }} />

      <section ref={hero} className="relative flex min-h-[165vh] items-start overflow-hidden bg-navy px-5 pb-20 pt-32 text-white">
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
            <ShieldCheck aria-hidden="true" size={15} /> Seguro de vida explicado en español
          </motion.div>

          <motion.h1 {...entranceTitle} transition={{ delay: .3, duration: 1, ease }} className="max-w-4xl font-display text-[clamp(3.2rem,7.4vw,6.6rem)] font-bold leading-[.92] tracking-[-.045em]">
            El seguro de vida no debería ser un misterio.<br />
            <span className="text-cyan">Nosotros te lo explicamos.</span>
          </motion.h1>

          <motion.p {...entranceLede} transition={{ delay: .75, duration: 1 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Te ayudamos a comparar una póliza temporal, una permanente y una de gastos finales.
            Qué puede dejar cada una, a quién designas y qué conviene leer antes de firmar.
          </motion.p>

          <motion.div {...entranceCta} transition={{ delay: .9, duration: .8 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contacto" className="group flex w-fit items-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy shadow-[0_15px_45px_rgba(4,192,254,.25)]">
              Quiero orientación gratuita <ArrowRight aria-hidden="true" size={17} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#conceptos" className="flex w-fit items-center gap-3 px-4 py-3 text-sm font-medium text-white/75">
              <ArrowDown aria-hidden="true" size={17} /> Entender la póliza primero
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
              Dejar un respaldo no debería sentirse como adivinar.
            </h2>
          </motion.div>
          <motion.div {...reveal} transition={{ duration: .9, delay: .15, ease }} className="relative md:pl-20">
            <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-cyan to-transparent md:block" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-navy/65">
              Plazo, beneficiarios, preguntas de salud, exclusiones. Son decisiones con
              consecuencias reales para tu familia, y merecen una explicación tranquila.{" "}
              <strong className="font-semibold text-navy">Te acompañamos a entender antes de decidir</strong>,
              con un agente de seguros con licencia y en tu idioma.
            </p>
          </motion.div>
        </div>
      </section>

      <CoverageConceptsSection
        media={media.concepts}
        eyebrow="Entiende la póliza"
        heading="Las palabras del seguro de vida, en español claro."
        intro="Beneficio, beneficiario, contestabilidad, valor en efectivo. Son las palabras que deciden qué queda protegido, y casi nunca te las explican con calma. Aquí empezamos por ahí."
        concepts={concepts}
        mediaLabel="Visual de una póliza de vida: beneficio, beneficiario y prima."
        footnote="Definiciones generales con fines informativos. Los términos exactos, montos y condiciones los establece cada póliza y deben confirmarse con la compañía aseguradora."
      />

      <StorySection
        heading="Durante años, una póliza de vida se firmaba sin saber a quién dejaba protegida."
        paragraphs={[
          "Muchas familias contrataron un monto sin entender la diferencia entre una cobertura temporal y una permanente, o dejaron beneficiarios que ya no correspondían. Otras creyeron que gastos finales y un seguro para sostener el hogar eran la misma cosa.",
          <>
            No es falta de previsión. Es que la explicación llega en inglés, con prisa y en lenguaje
            técnico. <strong className="font-semibold text-white">Nosotros empezamos por la conversación</strong>,
            en tu idioma, antes de hablar de ningún monto.
          </>,
        ]}
      />

      <div id="coberturas">
        <ProductsSection
          onSelect={setSelectedProduct}
          featured={featuredLifeProducts}
          additional={additionalLifeProducts}
          eyebrow="Modalidades"
          heading="Compara cómo puedes proteger a tu familia."
          intro="Temporal, permanente y gastos finales. Te explicamos cada una en español, con sus alcances y sus límites."
          featuredLabel="Modalidades de vida"
          footnote="El beneficio por fallecimiento está sujeto a los términos, condiciones, limitaciones y exclusiones de la póliza. La disponibilidad, el monto y la elegibilidad varían según el estado y la compañía aseguradora."
        />
      </div>

      <DirectSupportSection
        eyebrow="Cómo llega el beneficio"
        heading="El beneficio llega a quien tú designas."
        title="Un pago según la póliza"
        body="Cuando el fallecimiento está cubierto, el beneficio se paga a las personas beneficiarias según la póliza. Si el contrato incluye un beneficio en vida, ese beneficio también se rige por lo que la póliza escriba."
        disclosure="El beneficio por fallecimiento está sujeto a los términos, condiciones, limitaciones, exclusiones y períodos de contestabilidad de la póliza aplicable. La póliza emitida determina el monto, los beneficiarios y cuándo corresponde pagarlo."
      />

      <ProcessSection
        media={media.process}
        mediaLabel="Visual del proceso para comparar un seguro de vida."
        steps={[
          { icon: Headphones, title: "Escuchamos a quién quieres proteger", copy: "Quién depende de ti, qué gastos quieres dejar cubiertos y qué presupuesto manejas." },
          { icon: Scale, title: "Comparamos modalidades", copy: "Temporal, permanente y gastos finales, lado a lado, con lo que cada compañía ofrece en tu estado." },
          { icon: Wallet, title: "Te explicamos monto y límites", copy: "Prima, beneficiarios, preguntas de salud, período de contestabilidad y exclusiones." },
          { icon: ClipboardList, title: "Te acompañamos después de elegir", copy: "Dudas, cambios de beneficiario, renovaciones y orientación si hay que presentar un reclamo." },
        ]}
      />

      <QualificationSection
        criteria={[
          { icon: Hourglass, title: "Edad y preguntas de salud", copy: "La edad de solicitud y las preguntas de salud dependen de la modalidad y de la compañía." },
          { icon: MapPin, title: "Lugar de residencia", copy: "Debes residir donde esa póliza esté disponible." },
          { icon: Users, title: "Beneficiarios", copy: "Hay que designar a quién corresponde el beneficio y revisar esa designación cuando cambia la familia." },
          { icon: HeartHandshake, title: "Evaluación de la compañía", copy: "La emisión puede depender de la información que pida la compañía. La cobertura existe cuando la póliza se emite." },
        ]}
      />

      <TrustSection />

      <FaqSection faqs={faqs} />

      <ContactSection lines={["life"]} />

      <SiteFooter />

      <ProductDialog product={selectedProduct} onClose={closeProduct} />
    </main>
  );
}
