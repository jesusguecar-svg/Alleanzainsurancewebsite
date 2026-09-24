"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeftRight, ArrowUpRight, Check, CreditCard, FileCheck2, HeartPulse, ShieldCheck, X } from "lucide-react";
import c from "./cinematic-hero.module.css";

const chapters = [
  { title: "Tu atención médica", short: "Seguro médico", icon: CreditCard, left: "Una consulta. Y todas las preguntas.", right: "Tu atención, con un plan.", risk: "Sin seguro médico", benefit: "Seguro médico", description: "Revisamos médicos, medicamentos, deducibles y lo que pagarías de tu bolsillo." },
  { title: "Tu respaldo económico", short: "Protección extra", icon: FileCheck2, left: "La vida se detiene. Las cuentas no.", right: "Un respaldo para seguir adelante.", risk: "Sin beneficios complementarios", benefit: "Beneficios ante eventos cubiertos", description: "Exploramos protección ante accidentes, cáncer, derrame cerebral y hospitalización." },
  { title: "Tu bienestar diario", short: "Dental y visión", icon: HeartPulse, left: "Lo que pospones también importa.", right: "Más razones para sonreír.", risk: "Sin cobertura dental ni de visión", benefit: "Dental y visión", description: "Comparamos redes, beneficios, límites y períodos de espera para cuidar lo cotidiano." },
] as const;
const coverages = ["Seguro médico", "Accidentes", "Cáncer y derrame cerebral", "Indemnización hospitalaria", "Dental y visión"];

export function CinematicHealthHero({ onReview, onExplore }: { onReview: () => void; onExplore: () => void }) {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [path, setPath] = useState<"compare" | "without" | "with">("compare");
  const pointerX = useMotionValue(0), pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 70, damping: 24 });
  const rotateX = useSpring(pointerY, { stiffness: 70, damping: 24 });
  const lightX = useMotionValue("50%"), lightY = useMotionValue("50%");
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 65]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -48]);
  const current = chapters[chapter];

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    pointerX.set((x - .5) * 5); pointerY.set((.5 - y) * 4);
    lightX.set(`${x * 100}%`); lightY.set(`${y * 100}%`);
  }

  function choosePath(value: "compare" | "without" | "with") {
    setPath(value);
    if (scene.current && window.matchMedia("(max-width: 640px)").matches) {
      scene.current.scrollTo({ left: value === "with" ? scene.current.clientWidth : 0, behavior: reduced ? "instant" : "smooth" });
    }
  }

  return <section ref={root} className={c.hero} aria-labelledby="health-title">
    <div className={c.intro}>
      <span className={c.eyebrow}><i /> UNA FAMILIA. DOS CAMINOS.</span>
      <h1 id="health-title">No puedes anticiparlo todo.<br /><em>Sí puedes prepararte.</em></h1>
      <p>La diferencia se siente cuando más importa.<br className={c.mobileBreak} /> Descubre qué puede cambiar con la protección adecuada.</p>
    </div>

    <div className={c.viewport} onPointerMove={move} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
      <motion.div className={c.stage} style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        <div ref={scene} className={c.scene} data-path={path} onScroll={event => { if (window.matchMedia("(max-width: 640px)").matches) { const el = event.currentTarget; const next = el.scrollLeft > el.clientWidth / 2 ? "with" : "without"; setPath(next); } }}>
          <article className={`${c.path} ${c.without}`} aria-label="Camino sin protección">
            <motion.div className={c.photo} style={{ y: imageY }}><Image src="/cinematic/people/health-two-paths-v1.webp" alt="Una familia de tres personas, de pie y preocupada, con un sobre de gastos en las manos del padre" fill priority sizes="(max-width: 640px) 200vw, 100vw" /></motion.div>
            <div className={c.shade} />
            <div className={c.pathTop}><span>CAMINO 01</span><strong><i /> Sin protección</strong></div>
            <motion.div className={`${c.document} ${c.bill}`} style={{ y: foregroundY }} key={`bill-${chapter}`}>
              <div className={c.documentHeader}><span>{chapter === 2 ? "CUIDADO PENDIENTE" : "GASTOS POR RESOLVER"}</span><X size={16} /></div>
              <strong>{chapter === 0 ? "Cuenta médica" : chapter === 1 ? "Gastos de hospital" : "Dental + visión"}</strong>
              <div className={c.paperLines}><i /><i /><i /></div>
              <span className={c.documentStatus}>{current.risk}</span>
              <small>Escenario ilustrativo</small>
            </motion.div>
            <div className={c.pathBottom}><h2>{current.left}</h2><p>Cuando no hay cobertura, la incertidumbre pesa más.</p><div className={c.coverageList}>{coverages.map(label => <span key={label}><X size={11} />{label}</span>)}</div></div>
          </article>

          <article className={`${c.path} ${c.withProtection}`} aria-label="Camino con coberturas adecuadas">
            <motion.div className={c.photo} style={{ y: imageY }}><Image src="/cinematic/people/health-two-paths-v1.webp" alt="La misma familia sonriendo y abrazada en un espacio cálido y luminoso" fill priority sizes="(max-width: 640px) 200vw, 100vw" /></motion.div>
            <div className={c.shade} /><div className={c.protectionHalo} aria-hidden="true" />
            <div className={c.pathTop}><span>CAMINO 02</span><strong><ShieldCheck size={14} /> Con protección</strong></div>
            <motion.div className={`${c.document} ${chapter === 1 ? c.claim : c.insuranceCard}`} style={{ y: foregroundY }} key={`card-${chapter}`}>
              <div className={c.documentHeader}><span>{chapter === 1 ? "BENEFICIO COMPLEMENTARIO" : "TU COBERTURA, CONTIGO"}</span><ShieldCheck size={17} /></div>
              <strong>{chapter === 1 ? "Cheque de beneficio" : chapter === 2 ? "Dental & visión" : "Seguro de salud"}</strong>
              {chapter === 1 ? <><div className={c.checkPayee}><span>A favor de</span><b>Tu familia</b></div><div className={c.checkSignature}>Tu tranquilidad</div></> : <><div className={c.cardChip} aria-hidden="true" /><span className={c.cardMember}>FAMILIA · PLAN ILUSTRATIVO</span></>}
              <span className={c.documentStatus}><Check size={12} />{current.benefit}</span><small>Ejemplo ilustrativo · no válido</small>
            </motion.div>
            <div className={c.pathBottom}><h2>{current.right}</h2><p>Más claridad para cuidar de quienes más quieres.</p><div className={c.coverageList}>{coverages.map(label => <span key={label}><Check size={11} />{label}</span>)}</div></div>
          </article>
        </div>
        <motion.div className={c.light} style={{ left: lightX, top: lightY }} aria-hidden="true" />
        <span className={c.seam} aria-hidden="true"><ArrowLeftRight size={17} /></span>
      </motion.div>
    </div>

    <div className={c.sceneControls}>
      <span className={c.interactionHint}><ArrowLeftRight size={13} /> <span className={c.desktopHint}>Mueve el cursor. Explora los dos caminos.</span><span className={c.mobileHint}>Desliza para descubrir el otro camino.</span></span>
      <div className={c.pathButtons} aria-label="Explorar caminos"><button type="button" aria-pressed={path === "without"} onClick={() => choosePath("without")}>Sin protección</button><button className={c.compareButton} type="button" aria-pressed={path === "compare"} onClick={() => choosePath("compare")}>Ambos caminos</button><button type="button" aria-pressed={path === "with"} onClick={() => choosePath("with")}>Con protección <ArrowUpRight size={12} /></button></div>
    </div>

    <div className={c.chapterRow} aria-label="Explora las capas de tu protección">{chapters.map((item, index) => { const Icon = item.icon; return <button type="button" key={item.short} aria-pressed={chapter === index} onClick={() => setChapter(index)}><span className={c.chapterNumber}>0{index + 1}</span><Icon size={18} /><span>{item.short}</span><span className={c.chapterProgress} /></button>; })}</div>
    <p className={c.chapterDescription} aria-live="polite">{current.description}</p>

    <div className={c.reviewCta}><div><span className={c.eyebrow}>¿YA TIENES SEGURO?</span><h2>Tener una tarjeta es el comienzo.<br /><em>Entender tu protección es lo que sigue.</em></h2><p>Revisemos si tu cobertura tiene sentido para tu familia: qué incluye, qué falta y cuánto podrías pagar. Sin compromiso.</p></div><div className={c.ctaActions}><button type="button" className={c.primaryCta} onClick={onReview}>Quiero revisar mi cobertura <ArrowUpRight size={18} /></button><button type="button" className={c.secondaryCta} onClick={onExplore}>No tengo seguro. Quiero orientarme <ArrowUpRight size={14} /></button><span><Check size={12} /> Asesoría en español · Sin costo</span></div></div>
    <p className={c.disclaimer}>Escenas y documentos ilustrativos. Las coberturas se contratan según disponibilidad y elegibilidad; los beneficios dependen de la póliza y del evento cubierto. El seguro complementario no sustituye un plan médico integral.</p>
    <a href="#coberturas" className={c.scrollCue}>CONOCE TUS OPCIONES <ArrowDown size={13} /></a>
  </section>;
}
