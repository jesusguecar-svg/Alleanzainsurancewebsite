"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import p from "./platform.module.css";
import s from "./factor-carousel.module.css";

type Locale = "es" | "en";

export function FactorCarousel({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const pay = t("Lo que pagas", "What you pay");
  const care = t("Dónde te atiendes", "Where you get care");
  const included = t("Qué incluye", "What’s included");
  const payNote = t("Mira el costo completo, no solo la mensualidad.", "Look at the full cost, beyond the monthly payment.");
  const careNote = t("Tu cobertura también depende de quién te atiende.", "Coverage also depends on who provides your care.");
  const includedNote = t("Los detalles que importan en tu día a día.", "The details that matter in your daily life.");

  const cards = [
    { id: "premium", group: pay, note: payNote, title: t("Prima mensual", "Monthly premium"), text: t("Lo que pagas por mantener la cobertura, incluso si no la usas.", "What you pay to keep coverage, even when you don’t use it."), alt: t("Una mujer revisa un calendario en blanco junto a una tarjeta azul.", "A woman looks over a blank calendar beside a blue card.") },
    { id: "deductible", group: pay, note: payNote, title: t("Deducible", "Deductible"), text: t("Lo que pagas por ciertos servicios cubiertos antes de que el plan empiece a compartir esos costos.", "What you pay for certain covered services before the plan starts sharing those costs."), alt: t("Sobres en escalera que se detienen ante una cinta azul.", "Envelopes in a rising row stop before a blue ribbon.") },
    { id: "maximum", group: pay, note: payNote, title: t("Máximo de bolsillo", "Out-of-pocket maximum"), text: t("En planes ACA, el límite anual por servicios cubiertos dentro de la red. No incluye primas ni servicios no cubiertos.", "For ACA plans, the annual limit for covered in-network services. Premiums and non-covered services are excluded."), alt: t("Un frasco de vidrio lleno de piedras, con una tapa azul.", "A glass jar filled with stones, under a blue lid.") },
    { id: "copay", group: pay, note: payNote, title: t("Copagos", "Copays"), text: t("Cantidades fijas por determinados servicios. Revisa también el coseguro: el porcentaje que te corresponde pagar.", "Fixed amounts for certain services. Also check coinsurance: the percentage you pay."), alt: t("Un hombre sostiene una tarjeta azul sobre un mostrador de madera.", "A man holds a blue card over a wood counter.") },
    { id: "doctors", group: care, note: careNote, title: t("Médicos", "Doctors"), text: t("Confirma que tus médicos participan en la red del plan específico.", "Confirm your doctors participate in the specific plan’s network."), alt: t("Una médica con estetoscopio, junto a una cortina iluminada.", "A physician with a stethoscope beside a sunlit curtain.") },
    { id: "hospitals", group: care, note: careNote, title: t("Hospitales", "Hospitals"), text: t("Revisa los centros cercanos y los especialistas que podrías necesitar.", "Check nearby facilities and the specialists you may need."), alt: t("Una sala clara con una cruz verde, un banco y una planta.", "A bright room with a teal cross, a bench, and a plant.") },
    { id: "network", group: care, note: careNote, title: t("Tipo de red", "Network type"), text: t("HMO, PPO y EPO tienen distintas reglas para especialistas y atención fuera de la red.", "HMO, PPO, and EPO plans have different rules for specialists and out-of-network care."), alt: t("Un hombre entre dos puertas abiertas en un pasillo claro.", "A man between two open doorways in a light hallway.") },
    { id: "prescriptions", group: included, note: includedNote, title: t("Medicamentos", "Prescriptions"), text: t("Consulta la lista de medicamentos, sus costos y las autorizaciones que pueden requerir.", "Review covered drugs, their costs, and any required authorizations."), alt: t("Un frasco ámbar sin etiqueta y tabletas sobre un lienzo.", "An unlabeled amber bottle and tablets on linen.") },
    { id: "telehealth", group: included, note: includedNote, title: t("Telemedicina", "Telehealth"), text: t("Comprueba qué consultas virtuales cubre el plan y con qué proveedores.", "Check which virtual visits the plan covers and with which providers."), alt: t("Una mujer en un sofá, con una computadora de pantalla vacía.", "A woman on a sofa with a computer and an empty screen.") },
    { id: "extras", group: included, note: includedNote, title: t("Beneficios adicionales", "Additional benefits"), text: t("Distingue lo incluido de los productos adicionales. Revisa límites, exclusiones y períodos de espera.", "Distinguish included benefits from additional products. Review limits, exclusions, and waiting periods."), alt: t("Unos lentes y un modelo dental sobre un suéter claro.", "Eyeglasses and a dental model on a cream sweater.") },
  ];

  function measure() {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft <= 8;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }

  useEffect(() => {
    measure();
    const el = scroller.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const el = scroller.current;
    const card = el?.querySelector("article");
    if (!el || !card) return;
    const gap = 18;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section id="comparar" className={s.section} aria-labelledby="factors-heading">
      <div className={s.intro}>
        <span className={p.eyebrow}>{t("COMPARAR CON CRITERIO", "COMPARE WITH PERSPECTIVE")}</span>
        <div className={s.titleRow}>
          <h2 id="factors-heading">
            {t("El precio es solo", "Price is only")}
            <br />
            <em>{t("una parte de la decisión.", "part of the decision.")}</em>
          </h2>
          <a className={s.shop} href="#compare">
            {t("Comparar opciones", "Compare options")}
            <ChevronRight size={18} aria-hidden="true" />
          </a>
        </div>
        <p className={s.deck}>{t("Un plan económico no siempre es el plan que más sentido tiene para ti.", "An inexpensive plan isn’t always the plan that makes the most sense for you.")}</p>
        <p className={s.deck}>{t("No buscamos simplemente mostrarte el plan más barato. Queremos ayudarte a entender qué estás comprando y qué diferencias pueden afectar tu experiencia.", "Our goal is more than showing the cheapest plan. We help you understand what you’re buying and which differences may affect your experience.")}</p>
      </div>
      <div className={s.scroller} ref={scroller} onScroll={measure} tabIndex={0} aria-label={t("Aspectos para comparar", "Comparison factors")}>
        {cards.map((card) => {
          const expanded = open === card.id;
          return (
            <article className={s.card} key={card.id}>
              <span className={s.kicker}>{card.group}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <p className={s.note} id={`factor-note-${card.id}`} hidden={!expanded}>
                {card.note}
              </p>
              <div className={s.art}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.plate} src={`/health/factors/${card.id}.webp`} alt={card.alt} width={1248} height={832} decoding="async" />
              </div>
              <button
                type="button"
                className={s.more}
                aria-expanded={expanded}
                aria-controls={`factor-note-${card.id}`}
                aria-label={expanded ? t(`Cerrar ${card.title}`, `Close ${card.title}`) : t(`Más sobre ${card.title}`, `More about ${card.title}`)}
                onClick={() => setOpen(expanded ? null : card.id)}
              >
                <Plus size={18} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
      <div className={s.controls}>
        <button type="button" className={s.arrow} aria-label={t("Tarjetas anteriores", "Previous cards")} disabled={edges.start} onClick={() => move(-1)}>
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" className={s.arrow} aria-label={t("Tarjetas siguientes", "Next cards")} disabled={edges.end} onClick={() => move(1)}>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p className={`${p.legal} ${s.caption}`}>{t("Fotografías ilustrativas. No representan documentos, pagos ni beneficios reales.", "Illustrative photographs. They do not represent real documents, payments, or benefits.")}</p>
    </section>
  );
}
