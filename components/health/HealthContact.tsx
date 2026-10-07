"use client";

import { ArrowUpRight, Check, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { consentText, consentTextEn } from "@/lib/content/contact";
import { healthEmail, healthServices, healthServicesEn, validateHealthLead } from "@/lib/content/health";
import { phones } from "@/lib/config/contact";
import states from "./us-states.json";
import { stateNamesEn } from "./state-names";
import s from "./health.module.css";

export function getHealthWhatsapp(locale: "es" | "en" = "es") {
  const message = locale === "en"
    ? "Hello, I would like guidance about health insurance options with Alleanza Insurance Corp."
    : "Hola, me gustaría recibir orientación sobre seguros de salud con Alleanza Insurance Corp.";
  return `https://wa.me/${phones[0].href.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const healthWhatsapp = getHealthWhatsapp("es");

type Props = {
  selectedState: string;
  onState: (value: string) => void;
  selectedService: string;
  onService: (value: string) => void;
  locale?: "es" | "en";
};

export function HealthContact({ selectedState, onState, selectedService, onService, locale = "es" }: Props) {
  const english = locale === "en";
  const services = english ? healthServicesEn : healthServices;
  const consent = english ? consentTextEn : consentText;
  const whatsapp = getHealthWhatsapp(locale);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [emailDraft, setEmailDraft] = useState(`mailto:${healthEmail}`);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    const value = { name: form.get("name"), email: form.get("email"), phone: form.get("phone"), state: selectedState, service: selectedService, consent: form.get("consent") === "on", company_fax_hp: form.get("company_fax_hp"), locale };
    const result = validateHealthLead(value);
    if (!result.lead) { setError(result.error!); setStatus("error"); return; }
    const lead = result.lead;
    const stateRecord = states.find(state => state.id === lead.state);
    const stateName = english ? stateNamesEn[lead.state] : stateRecord?.name;
    const serviceName = lead.service === "review" ? (english ? "Existing coverage review" : "Revisión de cobertura existente") : services.find(service => service.id === lead.service)?.title ?? (english ? "General guidance" : "Orientación general");
    const subject = english ? "Health insurance guidance request — Alleanza Insurance Corp." : "Solicitud de asesoría de salud — Alleanza Insurance Corp.";
    const body = english
      ? `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nState: ${stateName}\nInterest: ${serviceName}\n\n${consent}`
      : `Nombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nEstado: ${stateName}\nInterés: ${serviceName}\n\n${consent}`;
    setEmailDraft(`mailto:${healthEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/health/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? (english ? "We could not send your request. Please try again." : "No pudimos enviar tu solicitud. Inténtalo otra vez."));
      setStatus("success");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : (english ? "We could not connect. Try again or contact us directly." : "No pudimos conectar. Inténtalo otra vez o escríbenos directamente."));
    }
  }

  return <section id="contacto" className={s.contact} aria-labelledby="contact-heading">
    <div className={s.contactCopy}><span className={s.eyebrow}>{english ? "HELP WHEN YOU NEED IT" : "AYUDA CUANDO LA NECESITES"}</span><h2 id="contact-heading">{english ? <>Prefer to review your options<br /><em>with an advisor?</em></> : <>¿Prefieres revisar tus opciones<br /><em>con un asesor?</em></>}</h2><p>{english ? "Tell us how to reach you. One of our advisors can help you understand the next steps." : "Cuéntanos cómo contactarte y uno de nuestros asesores podrá ayudarte a entender los próximos pasos."}</p><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={s.whatsappLink}><MessageCircle size={21} /> {english ? "I prefer WhatsApp" : "Prefiero hablar por WhatsApp"} <ArrowUpRight size={17} /></a><div className={s.contactDirect}><a href={`mailto:${healthEmail}`}><Mail size={15} /> {healthEmail}</a><a href={`tel:${phones[0].href}`}><Phone size={15} /> {phones[0].label}</a></div></div>
    <div className={s.formCard}>
      {status === "success" ? <div className={s.formSuccess} role="status"><span><Check size={34} /></span><h3>{english ? <>We received<br />your request.</> : <>Recibimos<br />tu solicitud.</>}</h3><p>{english ? "We received your request. An agent will contact you to provide guidance." : "Recibimos tu solicitud. Un asesor se pondrá en contacto contigo para orientarte."}</p><button type="button" className={s.textLink} onClick={() => setStatus("idle")}>{english ? "Send another request" : "Enviar otra consulta"} <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit}>
        <div className={s.formTitle}><h3>{selectedService === "review" ? (english ? "Let’s review your coverage." : "Revisemos tu cobertura.") : (english ? "Find your coverage." : "Encuentra tu cobertura.")}</h3><span>{english ? "FREE GUIDANCE" : "ASESORÍA GRATUITA"}</span></div>
        <label className={s.field}>{english ? "Full name" : "Nombre completo"}<input name="name" autoComplete="name" placeholder={english ? "What is your name?" : "¿Cómo te llamas?"} minLength={2} maxLength={120} required /></label>
        <div className={s.formRow}><label className={s.field}>{english ? "Email" : "Correo electrónico"}<input name="email" autoComplete="email" type="email" placeholder="you@email.com" maxLength={180} required /></label><label className={s.field}>{english ? "Phone" : "Teléfono"}<input name="phone" autoComplete="tel" type="tel" placeholder="(000) 000-0000" minLength={7} maxLength={30} required /></label></div>
        <div className={s.formRow}><label className={s.field}>{english ? "State" : "Estado"}<select name="state" value={selectedState} onChange={event => onState(event.target.value)} required><option value="">{english ? "Select your state" : "Selecciona tu estado"}</option>{states.map(state => <option key={state.id} value={state.id}>{english ? stateNamesEn[state.id] : state.name}</option>)}</select></label><label className={s.field}>{english ? "I’m interested in" : "Me interesa"}<select name="service" value={selectedService} onChange={event => onService(event.target.value)}><option value="guidance">{english ? "I need guidance" : "Necesito orientación"}</option><option value="review">{english ? "Review my current coverage" : "Revisar mi cobertura actual"}</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label></div>
        <div className={s.honeypot} aria-hidden="true"><label>{english ? "Leave blank" : "Dejar vacío"}<input name="company_fax_hp" tabIndex={-1} autoComplete="off" /></label></div>
        <label className={s.consent}><input name="consent" type="checkbox" required /><span>{consent} {english ? <>I have read the <a href="/privacidad">privacy notice</a>.</> : <>He leído el <a href="/privacidad">aviso de privacidad</a>.</>}</span></label>
        {status === "error" && <div className={s.formError} role="alert"><p>{error}</p><a href={emailDraft}>{english ? "Send my request by email" : "Enviar mi solicitud desde mi correo"} <ArrowUpRight size={14} /></a></div>}
        <button type="submit" className={s.submit} disabled={status === "sending"}>{status === "sending" ? <>{english ? "Sending" : "Enviando"} <Loader2 size={18} className={s.spinner} /></> : <>{english ? "Get my free guidance" : "Quiero mi asesoría gratuita"} <ArrowUpRight size={18} /></>}</button><p className={s.formFootnote}>{english ? "We use your information to respond to this request. Do not include medical information." : "Tus datos se usan para atender esta solicitud. No incluyas información médica."}</p>
      </form>}
    </div>
  </section>;
}
