"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { openEnrollmentCopy, readerOpenEnrollmentPhase, type OpenEnrollmentPhase } from "@/lib/content/open-enrollment";
import { primaryPhone } from "@/lib/config/contact";
import { getHealthWhatsapp } from "./HealthContact";
import c from "./cinematic-hero.module.css";
import s from "./open-enrollment.module.css";

/**
 * First thing on /health and /en/health during Open Enrollment: the deadline, and the three existing ways to
 * reach an advisor (the #contacto form, the phone line and WhatsApp). Clicks are tracked by the existing
 * global listeners: data-cta for the form link, tel:/wa.me for phone_click / whatsapp_click, all with
 * cta_location "oe_notice". Renders nothing outside Open Enrollment.
 *
 * The deadline follows the reader's local date (see lib/content/open-enrollment.ts). The page passes the phase
 * all US zones agree on (serverOpenEnrollmentPhase, computed once on the server so the first browser render
 * matches it), and after loading the browser switches to the reader's own phase, again at their local midnight
 * and whenever the tab becomes visible.
 */
export function OpenEnrollmentNotice({ locale, serverPhase }: { locale: "es" | "en"; serverPhase: OpenEnrollmentPhase | null | "pending" }) {
  const [phase, setPhase] = useState(serverPhase);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      setPhase(readerOpenEnrollmentPhase());
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      clearTimeout(timer);
      timer = setTimeout(update, nextMidnight.getTime() - now.getTime() + 1000);
    };
    const onVisible = () => { if (document.visibilityState === "visible") update(); };
    update();
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  if (!phase || phase === "pending") return null;
  const t = openEnrollmentCopy[locale][phase];
  return <section className={s.notice} aria-labelledby="oe-notice-title" data-cta-location="oe_notice">
    <div className={s.inner}>
      <div className={s.copy}>
        <span className={c.eyebrow}>{t.label}</span>
        <p id="oe-notice-title" className={s.message}>{t.message}</p>
      </div>
      <div className={s.actions}>
        <a className={`${c.primary} ${s.advisor}`} href="#contacto" data-cta="health_oe_advisor" data-product-line="health">{t.advisor}<ArrowUpRight size={17} aria-hidden="true" /></a>
        <a className={`${c.secondary} ${s.direct}`} href={`tel:${primaryPhone.href}`} aria-label={`${t.call} ${primaryPhone.label}`}><Phone size={16} aria-hidden="true" />{t.call}<span className={s.number}>{primaryPhone.label}</span></a>
        <a className={`${c.secondary} ${s.direct}`} href={getHealthWhatsapp(locale)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" />{t.whatsapp}</a>
      </div>
      <p className={s.note}>{t.note}</p>
    </div>
  </section>;
}
