"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ClipboardList, FileSearch, Headphones, Home, MapPin, PhoneCall, Scale, ShieldCheck, SlidersHorizontal, Video, Wallet } from "lucide-react";
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
import { additionalPropertyProducts, featuredPropertyProducts, type Product } from "@/lib/content/products";
import { phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";
import type { ResolvedMedia } from "@/lib/media";

const navLinks: NavLink[] = [
  { href: "#conceptos", label: "Entiende la póliza" },
  { href: "#coberturas", label: "Coberturas" },
  { href: "#como", label: "Cómo trabajamos" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "/", label: "Portal" },
];

const concepts = [
  {
    term: "Prima",
    plain: "Lo que pagas para mantener la póliza",
    detail: "El pago que mantiene vigente la cobertura de tu casa, tu auto u otro bien.",
  },
  {
    term: "Deducible",
    plain: "Lo que pagas tú en un reclamo cubierto",
    detail: "La cantidad que asumes antes de que la compañía pague el resto, hasta el límite.",
  },
  {
    term: "Límite de cobertura",
    plain: "El máximo que la póliza puede pagar",
    detail: "El tope del contrato para una pérdida o un reclamo cubierto. Por encima de ese monto, la diferencia queda a tu cargo.",
  },
  {
    term: "Responsabilidad civil",
    plain: "Si debes responder ante otra persona",
    detail: "La parte de la póliza que puede cubrir reclamos de terceros por daños cubiertos, hasta el límite.",
  },
  {
    term: "Exclusión",
    plain: "Lo que queda fuera del contrato",
    detail: "Un evento o un bien que la póliza no cubre. Conviene leerlo antes de que ocurra el daño.",
  },
  {
    term: "Endoso",
    plain: "Un cambio escrito a la póliza",
    detail: "Un anexo que agrega, limita o modifica la cobertura. Forma parte del contrato.",
  },
];

const faqs = [
  {
    question: "¿El seguro del propietario cubre lo que hay dentro si yo rento?",
    answer:
      "La póliza del propietario suele cubrir el edificio. Tus muebles y tu responsabilidad como inquilino corresponden a una póliza de inquilinos, que es un contrato distinto. Conviene confirmarlo por escrito antes de dar por hecho que estás cubierto.",
  },
  {
    question: "¿Qué suele quedar fuera de una póliza de hogar o de auto?",
    answer:
      "Cada contrato tiene exclusiones. En una vivienda, una inundación suele requerir una cobertura aparte. En un auto, el uso, quién conduce y el tipo de daño cambian lo que aplica. La lista exacta está en la póliza, y te ayudamos a leerla antes de contratar.",
  },
  {
    question: "¿Para qué sirve el deducible?",
    answer:
      "Es la parte del reclamo cubierto que pagas tú antes de que la compañía responda por el resto, hasta el límite. Un deducible más alto suele cambiar la prima. Conviene que sea un monto que puedas pagar el día del daño.",
  },
  {
    question: "¿La responsabilidad civil viene incluida?",
    answer:
      "A veces forma parte de la póliza de hogar o de auto, y a veces se contrata aparte. El límite dice hasta dónde responde la compañía. Un agente con licencia puede mostrarte cómo viene armada la opción disponible en tu estado.",
  },
  {
    question: "¿Cómo se presenta un reclamo de propiedad?",
    answer:
      "El reclamo se presenta ante la compañía que emitió la póliza. Suele pedir fotos, un inventario o un reporte, según el daño. Nosotros te orientamos sobre qué documentación suele pedirse. La evaluación y el pago dependen de la compañía y del contrato.",
  },
];

export type PropertyMedia = {
  hero: ResolvedMedia;
  concepts: ResolvedMedia;
  process: ResolvedMedia;
};

export default function PropertyLanding({ media }: { media: PropertyMedia }) {
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
            <ShieldCheck aria-hidden="true" size={15} /> Hogar y auto explicados en español
          </motion.div>

          <motion.h1 {...entranceTitle} transition={{ delay: .3, duration: 1, ease }} className="max-w-4xl font-display text-[clamp(3.2rem,7.4vw,6.6rem)] font-bold leading-[.92] tracking-[-.045em]">
            Tu casa y tu auto merecen claridad.<br />
            <span className="text-cyan">Nosotros te los explicamos.</span>
          </motion.h1>

          <motion.p {...entranceLede} transition={{ delay: .75, duration: 1 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Te ayudamos a entender la cobertura de hogar, de auto y de inquilino: qué suele estar
            incluido, qué suele quedar fuera y qué deducible te tocaría pagar.
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
              Renovar una póliza no debería ser firmar sin mirar.
            </h2>
          </motion.div>
          <motion.div {...reveal} transition={{ duration: .9, delay: .15, ease }} className="relative md:pl-20">
            <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-cyan to-transparent md:block" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-navy/65">
              Límites, deducibles, exclusiones, responsabilidad. Son decisiones con consecuencias
              reales para tu casa y tu auto, y merecen una explicación tranquila.{" "}
              <strong className="font-semibold text-navy">Te acompañamos a entender antes de decidir</strong>,
              con un agente de seguros con licencia y en tu idioma.
            </p>
          </motion.div>
        </div>
      </section>

      <CoverageConceptsSection
        media={media.concepts}
        eyebrow="Entiende la póliza"
        heading="Las palabras del seguro de propiedad, en español claro."
        intro="Deducible, límite, exclusión, endoso. Son las palabras que deciden qué paga la póliza el día del daño, y casi nunca te las explican con calma. Aquí empezamos por ahí."
        concepts={concepts}
        mediaLabel="Visual de una póliza de propiedad: deducible, límite y exclusiones."
        footnote="Definiciones generales con fines informativos. Los términos exactos, montos, deducibles y exclusiones los establece cada póliza y deben confirmarse con la compañía aseguradora."
      />

      <StorySection
        heading="Durante años, el seguro de la casa o del auto se renovaba sin leer qué había cambiado."
        paragraphs={[
          "Muchas familias descubrieron una exclusión el día del reclamo: una inundación que no estaba incluida, un deducible más alto de lo que recordaban, o pertenencias que el seguro del propietario no cubría porque rentaban.",
          <>
            No es descuido. Es que la póliza llega larga, en inglés y en el momento de firmar.{" "}
            <strong className="font-semibold text-white">Nosotros empezamos por la conversación</strong>,
            para que sepas qué está dentro y qué queda fuera.
          </>,
        ]}
      />

      <div id="coberturas">
        <ProductsSection
          onSelect={setSelectedProduct}
          featured={featuredPropertyProducts}
          additional={additionalPropertyProducts}
          eyebrow="Coberturas"
          heading="Compara cómo proteger lo que ya tienes."
          intro="Hogar, auto, inquilinos y responsabilidad civil. Te explicamos cada opción en español, con sus alcances y sus límites."
          featuredLabel="Coberturas de propiedad"
          footnote="La cobertura está sujeta a los términos, condiciones, límites, deducibles y exclusiones de la póliza. La disponibilidad varía según el estado, el bien y la compañía aseguradora."
        />
      </div>

      <DirectSupportSection
        eyebrow="Cómo responde la póliza"
        heading="La póliza responde por lo que el contrato cubre."
        title="Hasta el límite, después del deducible"
        body="Una póliza de propiedad o de responsabilidad puede pagar una pérdida o un reclamo cubierto hasta el límite del contrato, después del deducible cuando aplica. El documento que rige es la póliza emitida."
        disclosure="La respuesta de la póliza está sujeta a los términos, límites, deducibles, exclusiones y condiciones del contrato. La póliza emitida determina qué pérdida o qué reclamo está cubierto."
      />

      <ProcessSection
        media={media.process}
        mediaLabel="Visual del proceso para revisar una póliza de hogar o de auto."
        steps={[
          { icon: Headphones, title: "Escuchamos qué quieres proteger", copy: "La casa, el auto, lo que hay dentro de una vivienda rentada, y qué ya tienes contratado." },
          { icon: Scale, title: "Comparamos opciones", copy: "Lo disponible en tu estado, con límites y deducibles lado a lado." },
          { icon: Wallet, title: "Te explicamos qué queda fuera", copy: "Exclusiones, endosos y la diferencia entre cubrir un bien y cubrir tu responsabilidad ante otros." },
          { icon: ClipboardList, title: "Te acompañamos después de elegir", copy: "Renovaciones, cambios de dirección o de vehículo, y orientación si necesitas presentar un reclamo." },
        ]}
      />

      <QualificationSection
        criteria={[
          { icon: Home, title: "El bien asegurado", copy: "La vivienda, el vehículo o las pertenencias deben coincidir con lo que describe la póliza." },
          { icon: MapPin, title: "Ubicación", copy: "La dirección y el estado determinan qué se puede ofrecer y a qué precio." },
          { icon: FileSearch, title: "Solicitud", copy: "La compañía puede pedir datos del inmueble, del vehículo o del historial antes de emitir." },
          { icon: SlidersHorizontal, title: "Límites y deducible", copy: "El monto de cobertura y el deducible se eligen dentro de lo que la compañía permite." },
        ]}
      />

      <TrustSection />

      <FaqSection faqs={faqs} />

      <ContactSection lines={["property"]} />

      <SiteFooter />

      <ProductDialog product={selectedProduct} onClose={closeProduct} />
    </main>
  );
}
