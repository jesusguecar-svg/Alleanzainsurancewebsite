"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, MapPin, Phone } from "lucide-react";
import { useId, useRef, useState } from "react";
import { StabilizationSequence } from "../cinematic";
import { consentText, productOptions, validateContact, type FieldErrors } from "@/lib/content/contact";
import { officeAddressLines, officeHours, phones } from "@/lib/config/contact";
import { useReveal } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

export function ContactSection() {
  const reveal = useReveal({ y: 40 });
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      productId: String(data.get("productId") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };

    const nextErrors = validateContact(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        return;
      }

      const body = await response.json().catch(() => null);
      if (response.status === 422 && body?.errors) {
        setErrors(body.errors as FieldErrors);
        setStatus("idle");
        return;
      }
      setFormError(body?.error ?? "No pudimos enviar tu solicitud. Intenta de nuevo.");
      setStatus("error");
    } catch {
      setFormError("No pudimos enviar tu solicitud. Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-cyan px-5 py-28 text-navy md:py-40">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] opacity-25"><StabilizationSequence /></div>
      <div className="absolute -right-28 -top-40 h-[520px] w-[520px] rounded-full border border-navy/10" />
      <div className="absolute -right-12 -top-20 h-[360px] w-[360px] rounded-full border border-navy/10" />

      <motion.div {...reveal} className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.24em]">Tu familia. Tu historia. Tu protección.</p>
          <h2 className="mt-6 text-balance font-display text-5xl leading-none tracking-tight md:text-7xl">Hoy es un buen día para cuidar el mañana.</h2>
          <p className="mt-7 max-w-md text-base font-medium text-navy/65">Déjanos tus datos y un agente de seguros con licencia te contactará, en tu idioma y sin compromiso. También puedes llamarnos o visitarnos.</p>

          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em]"><MapPin aria-hidden="true" size={15} /> Oficina</h3>
              <address className="mt-3 text-sm not-italic leading-relaxed text-navy/70">
                {officeAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
              </address>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em]"><Clock aria-hidden="true" size={15} /> Horario</h3>
              <dl className="mt-3 text-sm leading-relaxed text-navy/70">
                {officeHours.map((entry) => (
                  <div key={entry.days} className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold">{entry.days}:</dt>
                    <dd>{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sm:col-span-2">
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em]"><Phone aria-hidden="true" size={15} /> Teléfonos</h3>
              <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm text-navy/70 sm:grid-cols-2">
                {phones.map((phone) => (
                  <li key={phone.href}>
                    <a href={`tel:${phone.href}`} className="font-semibold underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">{phone.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(6,20,49,.45)] md:p-9">
          {status === "success" ? (
            <div role="status" className="flex flex-col items-start gap-4 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan text-navy"><Check size={28} aria-hidden="true" /></div>
              <h3 className="font-display text-3xl">Gracias por escribirnos.</h3>
              <p className="text-sm leading-relaxed text-navy/60">Recibimos tus datos. Un agente de seguros con licencia se pondrá en contacto contigo.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div aria-live="polite">
                {formError && <p className="mb-5 rounded-2xl bg-navy/5 px-4 py-3 text-sm font-semibold text-navy">{formError}</p>}
              </div>

              <div className="grid gap-5">
                <div>
                  <label htmlFor={fieldId("name")} className="text-sm font-extrabold">Nombre completo</label>
                  <input id={fieldId("name")} name="name" type="text" autoComplete="name" required aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? errorId("name") : undefined} className={fieldClass} />
                  {errors.name && <p id={errorId("name")} className="mt-2 text-xs font-semibold text-navy/70">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor={fieldId("phone")} className="text-sm font-extrabold">Teléfono</label>
                  <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" required aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? errorId("phone") : undefined} className={fieldClass} />
                  {errors.phone && <p id={errorId("phone")} className="mt-2 text-xs font-semibold text-navy/70">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor={fieldId("email")} className="text-sm font-extrabold">Correo electrónico <span className="font-medium text-navy/45">(opcional)</span></label>
                  <input id={fieldId("email")} name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? errorId("email") : undefined} className={fieldClass} />
                  {errors.email && <p id={errorId("email")} className="mt-2 text-xs font-semibold text-navy/70">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor={fieldId("productId")} className="text-sm font-extrabold">¿Qué te interesa?</label>
                  <select id={fieldId("productId")} name="productId" defaultValue="" className={fieldClass}>
                    {productOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor={fieldId("message")} className="text-sm font-extrabold">Mensaje <span className="font-medium text-navy/45">(opcional)</span></label>
                  <textarea id={fieldId("message")} name="message" rows={3} aria-invalid={!!errors.message} aria-describedby={errors.message ? errorId("message") : undefined} className={`${fieldClass} resize-y`} />
                  {errors.message && <p id={errorId("message")} className="mt-2 text-xs font-semibold text-navy/70">{errors.message}</p>}
                </div>

                {/* Honeypot: hidden from people, tempting to bots. */}
                <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                  <label htmlFor={fieldId("website")}>No completes este campo</label>
                  <input id={fieldId("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input id={fieldId("consent")} name="consent" type="checkbox" required aria-required="true" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? errorId("consent") : undefined} className="mt-1 h-5 w-5 shrink-0 accent-navy" />
                    <label htmlFor={fieldId("consent")} className="text-xs leading-relaxed text-navy/65">{consentText}</label>
                  </div>
                  {errors.consent && <p id={errorId("consent")} className="mt-2 text-xs font-semibold text-navy/70">{errors.consent}</p>}
                </div>

                <button type="submit" disabled={status === "submitting"} className="mt-1 flex w-full items-center justify-center gap-3 rounded-full bg-navy px-8 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60">
                  {status === "submitting" ? "Enviando…" : <>Quiero que me contacten <ArrowRight size={17} aria-hidden="true" /></>}
                </button>

                <p className="text-[11px] leading-relaxed text-navy/45">Enviar este formulario no crea una solicitud de seguro ni garantiza cobertura.</p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
