"use client";

import { ArrowUpRight, Check, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { consentText } from "@/lib/content/contact";
import { healthEmail, healthServices, validateHealthLead } from "@/lib/content/health";
import { phones } from "@/lib/config/contact";
import states from "./us-states.json";
import s from "./health.module.css";

export const healthWhatsapp = `https://wa.me/${phones[0].href.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, me gustaría recibir orientación sobre seguros de salud con Alleanza.")}`;

export function HealthContact({ selectedState, onState, selectedService, onService }: { selectedState: string; onState: (value: string) => void; selectedService: string; onService: (value: string) => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [emailDraft, setEmailDraft] = useState(`mailto:${healthEmail}`);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    const value = { name: form.get("name"), email: form.get("email"), phone: form.get("phone"), state: selectedState, service: selectedService, consent: form.get("consent") === "on", company_fax_hp: form.get("company_fax_hp") };
    const result = validateHealthLead(value);
    if (!result.lead) { setError(result.error!); setStatus("error"); return; }
    const lead = result.lead;
    const stateName = states.find(state => state.id === lead.state)?.name;
    const serviceName = lead.service === "review" ? "Revisión de cobertura existente" : healthServices.find(service => service.id === lead.service)?.title ?? "Orientación general";
    setEmailDraft(`mailto:${healthEmail}?subject=${encodeURIComponent("Solicitud de asesoría de salud — Alleanza")}&body=${encodeURIComponent(`Nombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nEstado: ${stateName}\nInterés: ${serviceName}\n\n${consentText}`)}`);
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/health/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? "No pudimos enviar tu solicitud. Inténtalo otra vez.");
      setStatus("success");
    } catch (cause) { setStatus("error"); setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "No pudimos conectar. Inténtalo otra vez o escríbenos directamente."); }
  }

  return <section id="contacto" className={s.contact} aria-labelledby="contact-heading">
    <div className={s.contactCopy}><span className={s.eyebrow}>05 / HABLEMOS DE TI</span><h2 id="contact-heading">El primer paso<br />es una <em>conversación.</em></h2><p>Cuéntanos qué necesitas. Un asesor de Alleanza te ayudará a entender tus opciones, en español y sin compromiso.</p><a href={healthWhatsapp} target="_blank" rel="noopener noreferrer" className={s.whatsappLink}><MessageCircle size={21} /> Prefiero hablar por WhatsApp <ArrowUpRight size={17} /></a><div className={s.contactDirect}><a href={`mailto:${healthEmail}`}><Mail size={15} /> {healthEmail}</a><a href={`tel:${phones[0].href}`}><Phone size={15} /> {phones[0].label}</a></div></div>
    <div className={s.formCard}>
      {status === "success" ? <div className={s.formSuccess} role="status"><span><Check size={34} /></span><h3>Tu tranquilidad<br />ya tiene un comienzo.</h3><p>Recibimos tu solicitud. Un asesor se pondrá en contacto contigo para orientarte.</p><button type="button" className={s.textLink} onClick={() => setStatus("idle")}>Enviar otra consulta <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit}>
        <div className={s.formTitle}><h3>{selectedService === "review" ? "Revisemos tu cobertura." : "Encuentra tu cobertura."}</h3><span>ASESORÍA GRATUITA</span></div>
        <label className={s.field}>Nombre completo<input name="name" autoComplete="name" placeholder="¿Cómo te llamas?" minLength={2} maxLength={120} required /></label>
        <div className={s.formRow}><label className={s.field}>Correo electrónico<input name="email" autoComplete="email" type="email" placeholder="tu@correo.com" maxLength={180} required /></label><label className={s.field}>Teléfono<input name="phone" autoComplete="tel" type="tel" placeholder="(000) 000-0000" minLength={7} maxLength={30} required /></label></div>
        <div className={s.formRow}><label className={s.field}>Estado<select name="state" value={selectedState} onChange={event => onState(event.target.value)} required><option value="">Selecciona tu estado</option>{states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}</select></label><label className={s.field}>Me interesa<select name="service" value={selectedService} onChange={event => onService(event.target.value)}><option value="guidance">Necesito orientación</option><option value="review">Revisar mi cobertura actual</option>{healthServices.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label></div>
        <div className={s.honeypot} aria-hidden="true"><label>Dejar vacío<input name="company_fax_hp" tabIndex={-1} autoComplete="off" /></label></div>
        <label className={s.consent}><input name="consent" type="checkbox" required /><span>{consentText} He leído el <a href="/privacidad">aviso de privacidad</a>.</span></label>
        {status === "error" && <div className={s.formError} role="alert"><p>{error}</p><a href={emailDraft}>Enviar mi solicitud desde mi correo <ArrowUpRight size={14} /></a></div>}
        <button type="submit" className={s.submit} disabled={status === "sending"}>{status === "sending" ? <>Enviando <Loader2 size={18} className={s.spinner} /></> : <>Quiero mi asesoría gratuita <ArrowUpRight size={18} /></>}</button><p className={s.formFootnote}>Tus datos se usan para atender esta solicitud. No incluyas información médica.</p>
      </form>}
    </div>
  </section>;
}
