"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { acaAgentCertification, healthServices, healthServicesEn, licensingStatement } from "@/lib/content/health";
import p from "./platform.module.css";
import s from "./coverage-stage.module.css";

type Locale = "es" | "en";

const plates = [
  { id: "aca", src: "/health/coverage/aca.jpg", position: "74% 40%" },
  { id: "private", src: "/health/coverage/private.jpg", position: "78% 42%" },
  { id: "dental", src: "/health/coverage/dental.jpg", position: "70% 46%" },
  { id: "supplemental", src: "/health/coverage/supplemental.jpg", position: "76% 42%" },
  { id: "discount", src: "/health/coverage/discount.jpg", position: "82% 42%" },
] as const;

export function CoverageStage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const services = locale === "en" ? healthServicesEn : healthServices;
  const [active, setActive] = useState(0);

  const descriptions = [
    t("Compara opciones disponibles en el Marketplace según tu ubicación y situación.", "Compare Marketplace options based on your location and situation."),
    t("Explora alternativas fuera del Marketplace cuando puedan tener sentido para tu situación.", "Explore alternatives outside the Marketplace when they may make sense for you."),
    t("Coberturas diseñadas específicamente para servicios dentales y de visión.", "Coverage designed specifically for dental and vision services."),
    t("Beneficios adicionales para situaciones como accidentes, hospitalización o enfermedades graves.", "Additional benefits for situations such as accidents, hospitalization, or serious illness."),
    services[4].description,
  ];
  const titles = [
    t("Seguro médico ACA", "ACA health insurance"),
    t("Cobertura médica privada", "Private medical coverage"),
    services[2].title,
    services[3].title,
    services[4].title,
  ];
  const notes = [
    t(`El Marketplace es un mercado, no una aseguradora ni una alianza corporativa. ${acaAgentCertification.es} ${licensingStatement.es}`, `The Marketplace is a marketplace, not an insurance company or a corporate partnership. ${acaAgentCertification.en} ${licensingStatement.en}`),
    t("Los beneficios y las condiciones pueden ser distintos a los de un plan ACA. Revisa exclusiones y límites antes de elegir.", "Benefits and terms may differ from an ACA plan. Review exclusions and limits before choosing."),
    "",
    t("La cobertura complementaria no sustituye un seguro médico integral.", "Supplemental coverage does not replace comprehensive health insurance."),
    "",
  ];
  const alts = [
    t("Escena ilustrativa: una mujer con el cabello cobrizo revisa opciones en su laptop, con el teléfono al lado.", "Illustrative scene: a red-haired woman reviews options on her laptop, with a phone beside her."),
    t("Escena ilustrativa: un hombre en una videollamada, decidiendo con calma.", "Illustrative scene: a man on a video call, deciding calmly."),
    t("Escena ilustrativa: una mujer con lentes ríe en una terraza al sol.", "Illustrative scene: a woman in glasses laughs at a sunny café."),
    t("Escena ilustrativa: un hombre habla por teléfono en su taller, con el día en marcha.", "Illustrative scene: a man talks on the phone in his workshop while the day keeps moving."),
    t("Escena ilustrativa: una mujer sonríe en el mostrador de una farmacia.", "Illustrative scene: a woman smiles at a pharmacy counter."),
  ];

  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace("#", "");
      const index = plates.findIndex((plate) => hash === `coverage-${plate.id}`);
      if (index >= 0) setActive(index);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  function choose(index: number, focus = false) {
    const next = (index + plates.length) % plates.length;
    setActive(next);
    if (focus) document.getElementById(`coverage-${plates[next].id}`)?.focus({ preventScroll: true });
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowDown" ? index + 1 : event.key === "ArrowUp" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? plates.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    choose(next, true);
  }

  return (
    <section id="coberturas" className={s.stage} aria-labelledby="coverage-types-heading">
      <div className={s.intro}>
        <span className={p.eyebrow}>{t("DISTINTAS NECESIDADES. DISTINTOS CAMINOS.", "DIFFERENT NEEDS. DIFFERENT PATHS.")}</span>
        <h2 id="coverage-types-heading">
          {t("No todas las necesidades", "Different needs.")}
          <br />
          <em>{t("requieren la misma cobertura.", "Different coverage.")}</em>
        </h2>
      </div>
      <div className={s.frame}>
        <div className={s.photos}>
          {plates.map((plate, index) => (
            // Photographic plates. Labels stay in the controls, never baked into the image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={plate.id}
              className={s.plate}
              src={plate.src}
              alt={index === active ? alts[index] : ""}
              width={2400}
              height={1350}
              data-active={index === active}
              aria-hidden={index !== active}
              style={{ "--plate-pos": plate.position } as CSSProperties}
            />
          ))}
          <div className={s.scrim} />
        </div>
        <div className={s.controls}>
          <div className={s.chevrons}>
            <button type="button" className={s.chevron} aria-label={t("Camino anterior", "Previous path")} onClick={() => choose(active - 1, true)}>
              <ChevronUp size={18} aria-hidden="true" />
            </button>
            <button type="button" className={s.chevron} aria-label={t("Camino siguiente", "Next path")} onClick={() => choose(active + 1, true)}>
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </div>
          <div className={s.rail} role="group" aria-label={t("Tipos de cobertura", "Coverage types")}>
            {services.map((service, index) => {
              const open = active === index;
              return (
                <button
                  key={service.id}
                  id={`coverage-${service.id}`}
                  type="button"
                  className={open ? s.card : s.pill}
                  aria-expanded={open}
                  aria-controls={`coverage-panel-${service.id}`}
                  onClick={() => choose(index)}
                  onKeyDown={(event) => onKey(event, index)}
                >
                  {open ? (
                    <span id={`coverage-panel-${service.id}`}>
                      <strong>{titles[index]}</strong>
                      <span className={s.blurb}>{descriptions[index]}</span>
                      <ul>
                        {service.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      {notes[index] ? <span className={s.note}>{notes[index]}</span> : null}
                    </span>
                  ) : (
                    <>
                      <span className={s.plus}>
                        <Plus size={16} aria-hidden="true" />
                      </span>
                      {titles[index]}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <p className={s.live} aria-live="polite">
          {titles[active]}
        </p>
      </div>
      <div className={s.legalWrap}>
        <p className={p.legal}>
          {t(
            "Escenas ilustrativas. La cobertura complementaria no sustituye un seguro médico integral. La disponibilidad de compañías, productos y beneficios puede variar según el estado, la elegibilidad y las condiciones de cada cobertura. Este sitio no pertenece al gobierno federal ni implica su respaldo.",
            "Illustrative scenes. Supplemental coverage does not replace comprehensive health insurance. Company, product, and benefit availability may vary by state, eligibility, and coverage terms. This website is not operated or endorsed by the federal government.",
          )}
        </p>
      </div>
    </section>
  );
}
