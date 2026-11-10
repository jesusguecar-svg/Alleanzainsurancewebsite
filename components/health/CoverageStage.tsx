"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { acaAgentCertification, healthServices, healthServicesEn, licensingStatement } from "@/lib/content/health";
import u from "./health.module.css";
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
    <section id="coberturas" className={`${u.sec} ${u.white}`} aria-labelledby="coverage-types-heading">
      <div className={u.wrap}>
        <div className={s.head}>
          <p className={u.eyebrow}>{t("Distintas necesidades, distintos caminos", "Different needs, different paths")}</p>
          <h2 id="coverage-types-heading" className={u.h2}>
            {t("No todas las necesidades", "Different needs")}
            <br />
            <span className={u.soft}>{t("requieren la misma cobertura", "Different coverage")}</span>
          </h2>
        </div>
        <div className={s.cov}>
          <div className={s.list} role="group" aria-label={t("Tipos de cobertura", "Coverage types")}>
            {services.map((service, index) => {
              const open = active === index;
              return (
                <div className={s.item} key={service.id}>
                  <h3>
                    <button
                      id={`coverage-${service.id}`}
                      type="button"
                      className={s.tab}
                      aria-expanded={open}
                      aria-controls={`coverage-panel-${service.id}`}
                      onClick={() => choose(index)}
                      onKeyDown={(event) => onKey(event, index)}
                    >
                      {titles[index]}
                      <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`coverage-panel-${service.id}`} className={s.panel} hidden={!open}>
                    <p className={u.body}>{descriptions[index]}</p>
                    <ul className={u.checks}>
                      {service.details.map((detail) => (
                        <li key={detail}><Check size={18} strokeWidth={1.5} aria-hidden="true" />{detail}</li>
                      ))}
                    </ul>
                    {notes[index] ? <p className={u.fine}>{notes[index]}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <figure className={s.figure}>
            {plates.map((plate, index) => (
              // Photographic plates. Labels stay in the controls, never baked into the image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={plate.id}
                src={plate.src}
                alt={alts[index]}
                width={2400}
                height={1350}
                hidden={index !== active}
                loading={index === 0 ? "eager" : "lazy"}
                style={{ objectPosition: plate.position }}
              />
            ))}
          </figure>
          <p className={u.sr} aria-live="polite">{titles[active]}</p>
        </div>
        <p className={`${u.fine} ${s.legal}`}>
          {t(
            "Escenas ilustrativas. La cobertura complementaria no sustituye un seguro médico integral. La disponibilidad de compañías, productos y beneficios puede variar según el estado, la elegibilidad y las condiciones de cada cobertura. Este sitio no pertenece al gobierno federal ni implica su respaldo.",
            "Illustrative scenes. Supplemental coverage does not replace comprehensive health insurance. Company, product, and benefit availability may vary by state, eligibility, and coverage terms. This website is not operated or endorsed by the federal government.",
          )}
        </p>
      </div>
    </section>
  );
}
