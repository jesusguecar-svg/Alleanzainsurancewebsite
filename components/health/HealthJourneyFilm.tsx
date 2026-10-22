"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import s from "./journey-film.module.css";

type Locale = "es" | "en";

type Widget = {
  kind: "chip" | "pill" | "column" | "check" | "note";
  title: string;
  detail?: string;
  kicker?: string;
  depth: number;
};

type JourneyScene = {
  id: string;
  image: string;
  alt: string;
  position: string;
  layout: "situation" | "paths" | "compare" | "review" | "advisor";
  number: string;
  chapter: string;
  title: string;
  text: string;
  widgets: Widget[];
};

const copy = (locale: Locale) => (es: string, en: string) => (locale === "en" ? en : es);

function journeyScenes(locale: Locale): JourneyScene[] {
  const t = copy(locale);
  return [
    {
      id: "situation",
      image: "/health/journey/situation.jpg",
      alt: t("Una mujer revisa un cuaderno en la mesa de su cocina, por la mañana.", "A woman looks over a notebook at her kitchen table in the morning."),
      position: "34% 42%",
      layout: "situation",
      number: "01",
      chapter: t("Tu situación", "Your situation"),
      title: t("Cuéntanos sobre tu situación", "Tell us about your situation"),
      text: t("Hogar, médicos, medicamentos y cómo usas la atención.", "Home, doctors, medicines, and how you use care."),
      widgets: [
        { kind: "chip", title: t("Hogar", "Home"), detail: t("Tu código postal y quién vive contigo.", "Your ZIP code and who lives with you."), depth: 0.7 },
        { kind: "chip", title: t("Médicos", "Doctors"), detail: t("Los que quieres conservar.", "The ones you want to keep."), depth: 1.15 },
        { kind: "chip", title: t("Medicamentos", "Medicines"), detail: t("Los que usas ahora.", "The ones you take now."), depth: 0.85 },
        { kind: "chip", title: t("Atención", "Care you use"), detail: t("Consultas, especialistas, urgencias.", "Visits, specialists, urgent care."), depth: 1.35 },
      ],
    },
    {
      id: "paths",
      image: "/health/journey/paths.jpg",
      alt: t("Cinco arcos iluminados con luces distintas en una galería vacía.", "Five arches, each filled with a different light, in an empty gallery."),
      position: "center 62%",
      layout: "paths",
      number: "02",
      chapter: t("Los caminos", "The paths"),
      title: t("Identificamos los caminos disponibles", "We identify available paths"),
      text: t("Según tu ubicación y tu situación. No todos aplican.", "Based on your location and situation. Not every path applies."),
      widgets: [
        { kind: "pill", title: "ACA", depth: 0.45 },
        { kind: "pill", title: t("Salud privada", "Private medical"), depth: 0.9 },
        { kind: "pill", title: t("Dental y visión", "Dental and vision"), depth: 0.55 },
        { kind: "pill", title: t("Complementaria", "Supplemental"), depth: 1.1 },
        { kind: "pill", title: t("Descuento", "Discount plan"), depth: 0.7 },
        { kind: "pill", title: "Medicare", depth: 1 },
      ],
    },
    {
      id: "compare",
      image: "/health/journey/compare.jpg",
      alt: t("Dos hojas en blanco sobre un escritorio, listas para comparar.", "Two blank sheets on a desk, ready to compare."),
      position: "center 46%",
      layout: "compare",
      number: "03",
      chapter: t("Comparar", "Compare"),
      title: t("Comparamos información relevante", "We compare relevant information"),
      text: t("La misma información, lado a lado. Esta vista no es una cotización.", "The same information, side by side. This view is not a quote."),
      widgets: [
        { kind: "column", kicker: "01", title: t("Médicos", "Doctors"), detail: t("Consultorios y hospitales de la red.", "In-network offices and hospitals."), depth: 0.8 },
        { kind: "column", kicker: "02", title: t("Medicamentos", "Medicines"), detail: t("La lista, los costos y las autorizaciones.", "The list, the costs, and any authorizations."), depth: 1.2 },
        { kind: "column", kicker: "03", title: t("Costo completo", "Full cost"), detail: t("Deducible, copagos y máximo. No solo la prima.", "Deductible, copays, and the maximum. Not only the premium."), depth: 0.95 },
      ],
    },
    {
      id: "review",
      image: "/health/journey/review.jpg",
      alt: t("Un hombre mira la ciudad al anochecer, junto a una ventana.", "A man looks out at the city at dusk, beside a window."),
      position: "70% center",
      layout: "review",
      number: "04",
      chapter: t("Tu revisión", "Your review"),
      title: t("Tú revisas tus opciones", "You review your options"),
      text: t("La decisión se queda contigo.", "The decision stays with you."),
      widgets: [
        { kind: "check", title: t("La red", "The network"), depth: 0.7 },
        { kind: "check", title: t("El costo completo", "The full cost"), depth: 1.05 },
        { kind: "check", title: t("Lo que incluye", "What is included"), depth: 0.85 },
      ],
    },
    {
      id: "advisor",
      image: "/health/journey/advisor.jpg",
      alt: t("Dos personas conversan en una sala luminosa.", "Two people talk in a bright living room."),
      position: "center 36%",
      layout: "advisor",
      number: "05",
      chapter: t("Un asesor", "An advisor"),
      title: t("Un asesor puede ayudarte cuando lo necesites", "An advisor can help when you need one"),
      text: t("Orientación con licencia, cuando la pidas.", "Licensed guidance, when you ask for it."),
      widgets: [
        {
          kind: "note",
          kicker: t("CUANDO LO PIDAS", "WHEN YOU ASK"),
          title: t("Un asesor autorizado", "A licensed advisor"),
          detail: t("Por teléfono o por Zoom, donde el agente está autorizado y el producto está disponible.", "By phone or Zoom, where the agent is licensed and the product is available."),
          depth: 1,
        },
      ],
    },
  ];
}

function ranges(index: number, count: number) {
  const start = index / count;
  const end = (index + 1) / count;
  const fade = 0.035;
  const i0 = index === 0 ? 0 : start - fade;
  const i1 = index === 0 ? 0.001 : start;
  const i2 = index === count - 1 ? 0.998 : end - fade;
  const i3 = index === count - 1 ? 1 : end;
  return { start, end, i0, i1, i2, i3 };
}

function WidgetBody({ widget }: { widget: Widget }) {
  if (widget.kind === "pill") return <span className={s.pill}>{widget.title}</span>;
  if (widget.kind === "check") return <span className={s.check}><Check size={15} strokeWidth={2.4} aria-hidden="true" />{widget.title}</span>;
  if (widget.kind === "column" || widget.kind === "note") {
    return <span className={widget.kind === "note" ? s.note : s.column}><small>{widget.kicker}</small><strong>{widget.title}</strong><span>{widget.detail}</span></span>;
  }
  return <span className={s.chip}><strong>{widget.title}</strong><span>{widget.detail}</span></span>;
}

function SceneArt({ scene }: { scene: JourneyScene }) {
  return <div className={s.art} data-layout={scene.layout}>
    <div className={s.photoWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.photo} src={scene.image} alt={scene.alt} width={1800} height={1012} style={{ objectPosition: scene.position }} />
    </div>
    <div className={s.shade} aria-hidden="true" />
    <div className={s.copy}><span className={s.num}>{scene.number}</span><h3>{scene.title}</h3><p>{scene.text}</p></div>
    <div className={s.widgets}>{scene.widgets.map(widget => <div className={s.widget} key={widget.title}><WidgetBody widget={widget} /></div>)}</div>
  </div>;
}

function DriftWidget({ progress, start, end, depth, children }: { progress: MotionValue<number>; start: number; end: number; depth: number; children: ReactNode }) {
  const y = useTransform(progress, [start, start + 0.012, end - 0.012, end], [20 * depth, 0, 0, -14 * depth]);
  const rotateX = useTransform(progress, [start, start + 0.012, end - 0.012, end], [6, 0, 0, -3]);
  return <motion.div className={s.widget} style={{ y, rotateX }}>{children}</motion.div>;
}

function FilmPlate({ scene, index, count, progress, active }: { scene: JourneyScene; index: number; count: number; progress: MotionValue<number>; active: boolean }) {
  const { start, end, i0, i1, i2, i3 } = ranges(index, count);
  const opacity = useTransform(progress, [i0, i1, i2, i3], [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]);
  const x = useTransform(progress, [i0, i1, i2, i3], [index === 0 ? "0%" : "5%", "0%", "0%", index === count - 1 ? "0%" : "-5%"]);
  const scale = useTransform(progress, [start, end], [1.08, 1]);
  return <motion.div className={s.scene} data-layout={scene.layout} style={{ opacity, x }} inert={active ? undefined : true} aria-hidden={active ? undefined : true}>
    <motion.div className={s.photoWrap} style={{ scale }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.photo} src={scene.image} alt={scene.alt} width={1800} height={1012} style={{ objectPosition: scene.position }} draggable={false} />
    </motion.div>
    <div className={s.shade} aria-hidden="true" />
    <div className={s.copy}><span className={s.num}>{scene.number}</span><h3>{scene.title}</h3><p>{scene.text}</p></div>
    <div className={s.widgets}>{scene.widgets.map(widget => <DriftWidget progress={progress} start={start} end={end} depth={widget.depth} key={widget.title}><WidgetBody widget={widget} /></DriftWidget>)}</div>
  </motion.div>;
}

function Chapters({ scenes, active, onSeek, label }: { scenes: JourneyScene[]; active: number; onSeek: (index: number) => void; label: string }) {
  return <div className={s.chapters} role="tablist" aria-label={label} onKeyDown={event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? active + 1 : event.key === "ArrowLeft" ? active - 1 : event.key === "Home" ? 0 : scenes.length - 1;
    const index = (next + scenes.length) % scenes.length;
    onSeek(index);
    document.getElementById(`journey-tab-${index}`)?.focus();
  }}>
    {scenes.map((scene, index) => <button id={`journey-tab-${index}`} key={scene.id} type="button" role="tab" aria-selected={active === index} aria-controls="journey-panel" tabIndex={active === index ? 0 : -1} onClick={() => onSeek(index)}><span className={s.num}>{scene.number}</span><span className={s.label}>{scene.chapter}</span></button>)}
  </div>;
}

function Dots({ count, active, onSeek }: { count: number; active: number; onSeek: (index: number) => void }) {
  return <div className={s.dots} aria-hidden="true">{Array.from({ length: count }, (_, index) => <button key={index} type="button" tabIndex={-1} data-on={active === index} onClick={() => onSeek(index)}><i /></button>)}</div>;
}

function Intro({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return <header className={s.intro}><span className={s.kicker}>{t("ASÍ TE ACOMPAÑAMOS", "HOW WE HELP")}</span><h2 id="process-heading">{t("Una forma más clara", "A clearer way")}<br /><em>{t("de encontrar cobertura.", "to find coverage.")}</em></h2></header>;
}

function Legal({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return <p className={s.legal}>{t("Escenas ilustrativas. La comparación puede requerir orientación de un asesor o continuar en la plataforma correspondiente. No todos los productos se cotizan directamente en este sitio.", "Illustrative scenes. Comparison may require advisor guidance or continue on the relevant platform. Not every product is quoted directly on this website.")}</p>;
}

function ScrollFilm({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const scenes = journeyScenes(locale);
  const count = scenes.length;
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const t = copy(locale);

  useMotionValueEvent(scrollYProgress, "change", value => {
    const next = Math.min(count - 1, Math.floor(Math.min(0.9999, value) * count));
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
  });

  function seek(index: number) {
    const el = root.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, index));
    const start = window.scrollY + el.getBoundingClientRect().top;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + (travel * (clamped + 0.5)) / count, behavior: "smooth" });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { x: event.clientX, y: event.clientY };
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current = null;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    seek(activeRef.current + (dx < 0 ? 1 : -1));
  }

  return <section id="como-funciona" ref={root} className={s.film} aria-labelledby="process-heading">
    <div className={s.pin}>
      <Intro locale={locale} />
      <Chapters scenes={scenes} active={active} onSeek={seek} label={t("Cinco pasos", "Five steps")} />
      <div id="journey-panel" className={s.stage} role="tabpanel" aria-labelledby={`journey-tab-${active}`} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; }}>
        {scenes.map((scene, index) => <FilmPlate key={scene.id} scene={scene} index={index} count={count} progress={scrollYProgress} active={active === index} />)}
        <Dots count={count} active={active} onSeek={seek} />
        <p className={s.live} aria-live="polite">{scenes[active].title}</p>
      </div>
      <Legal locale={locale} />
    </div>
  </section>;
}

function CalmFilm({ locale }: { locale: Locale }) {
  const scenes = journeyScenes(locale);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const t = copy(locale);

  function seek(index: number) {
    const clamped = Math.max(0, Math.min(scenes.length - 1, index));
    const slide = track.current?.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "auto", inline: "start", block: "nearest" });
    setActive(clamped);
  }

  return <section id="como-funciona" className={s.calm} aria-labelledby="process-heading">
    <Intro locale={locale} />
    <Chapters scenes={scenes} active={active} onSeek={seek} label={t("Cinco pasos", "Five steps")} />
    <div id="journey-panel" className={s.track} role="tabpanel" aria-labelledby={`journey-tab-${active}`} ref={track} onScroll={() => {
      const el = track.current;
      if (!el) return;
      setActive(Math.max(0, Math.min(scenes.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
    }}>
      {scenes.map(scene => <article className={s.slide} key={scene.id}><SceneArt scene={scene} /></article>)}
    </div>
    <Legal locale={locale} />
  </section>;
}

export function HealthJourneyFilm({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);
  useEffect(() => setSettled(true), []);
  if (settled && reduce) return <CalmFilm locale={locale} />;
  return <ScrollFilm locale={locale} />;
}
