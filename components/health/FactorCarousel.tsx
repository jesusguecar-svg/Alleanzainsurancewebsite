import { ArrowRight } from "lucide-react";
import u from "./health.module.css";
import s from "./factor-carousel.module.css";

type Locale = "es" | "en";

/**
 * "What to compare" (#comparar): three columns of term and definition. The sand highlighter
 * under each term is the page's signature detail and appears only in this section.
 */
export function FactorCarousel({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const groups = [
    {
      title: t("Lo que pagas", "What you pay"),
      terms: [
        [t("Prima mensual", "Monthly premium"), t("Lo que pagas por mantener la cobertura, incluso si no la usas.", "What you pay to keep coverage, even when you don’t use it.")],
        [t("Deducible", "Deductible"), t("Lo que pagas por ciertos servicios cubiertos antes de que el plan empiece a compartir esos costos.", "What you pay for certain covered services before the plan starts sharing those costs.")],
        [t("Máximo de bolsillo", "Out-of-pocket maximum"), t("En planes ACA, el límite anual por servicios cubiertos dentro de la red. No incluye primas ni servicios no cubiertos.", "For ACA plans, the annual limit for covered in-network services. Premiums and non-covered services are excluded.")],
        [t("Copagos", "Copays"), t("Cantidades fijas por determinados servicios. Revisa también el coseguro: el porcentaje que te corresponde pagar.", "Fixed amounts for certain services. Also check coinsurance: the percentage you pay.")],
      ],
    },
    {
      title: t("Dónde te atiendes", "Where you get care"),
      terms: [
        [t("Médicos", "Doctors"), t("Confirma que tus médicos participan en la red del plan específico.", "Confirm your doctors participate in the specific plan’s network.")],
        [t("Hospitales", "Hospitals"), t("Revisa los centros cercanos y los especialistas que podrías necesitar.", "Check nearby facilities and the specialists you may need.")],
        [t("Tipo de red", "Network type"), t("HMO, PPO y EPO tienen distintas reglas para especialistas y atención fuera de la red.", "HMO, PPO, and EPO plans have different rules for specialists and out-of-network care.")],
      ],
    },
    {
      title: t("Qué incluye", "What’s included"),
      terms: [
        [t("Medicamentos", "Prescriptions"), t("Consulta la lista de medicamentos, sus costos y las autorizaciones que pueden requerir.", "Review covered drugs, their costs, and any required authorizations.")],
        [t("Telemedicina", "Telehealth"), t("Comprueba qué consultas virtuales cubre el plan y con qué proveedores.", "Check which virtual visits the plan covers and with which providers.")],
        [t("Beneficios adicionales", "Additional benefits"), t("Distingue lo incluido de los productos adicionales. Revisa límites, exclusiones y períodos de espera.", "Distinguish included benefits from additional products. Review limits, exclusions, and waiting periods.")],
      ],
    },
  ];

  return (
    <section id="comparar" className={u.sec} aria-labelledby="factors-heading">
      <div className={u.wrap}>
        <div className={s.head}>
          <div>
            <p className={u.eyebrow}>{t("Comparar con criterio", "Compare with perspective")}</p>
            <h2 id="factors-heading" className={u.h2}>
              {t("El precio es solo", "Price is only")}
              <br />
              <span className={u.soft}>{t("una parte de la decisión", "part of the decision")}</span>
            </h2>
          </div>
          <div>
            <p className={`${u.lead} ${s.lead}`}>{t("Un plan económico no siempre es el plan que más sentido tiene para ti.", "An inexpensive plan isn’t always the plan that makes the most sense for you.")}</p>
            <p className={u.body}>{t("No buscamos simplemente mostrarte el plan más barato. Queremos ayudarte a entender qué estás comprando y qué diferencias pueden afectar tu experiencia.", "Our goal is more than showing the cheapest plan. We help you understand what you’re buying and which differences may affect your experience.")}</p>
            <a className={`${u.btn} ${u.btnP} ${s.cta}`} href="#compare" data-cta="health_factor_compare" data-product-line="health">
              {t("Comparar opciones", "Compare options")}
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className={s.grid}>
          {groups.map((group) => (
            <div className={s.group} key={group.title}>
              <h3 className={u.eyebrow}>{group.title}</h3>
              <dl>
                {group.terms.map(([term, definition]) => (
                  <div key={term}>
                    <dt><span className={u.mark}>{term}</span></dt>
                    <dd>{definition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
