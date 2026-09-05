"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  HeartPulse,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { Logo } from "./Logo";
import { SiteHeader, type NavLink } from "./layout/SiteHeader";
import { phones } from "@/lib/config/contact";
import { ease, useReveal } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";
type FormErrors = Partial<Record<"name" | "company" | "email" | "phone" | "employees" | "consent", string>>;

const navLinks: NavLink[] = [
  { href: "#coverage", label: "Coverage" },
  { href: "#approach", label: "How it works" },
  { href: "#questions", label: "Questions" },
  { href: "/", label: "Alleanza home" },
];

const coverage = [
  { icon: HeartPulse, title: "Accident", text: "Benefits that may help with eligible expenses after a covered accidental injury." },
  { icon: Building2, title: "Hospital indemnity", text: "Fixed benefits for covered hospital events, subject to the policy's terms." },
  { icon: Stethoscope, title: "Critical illness", text: "Benefits designed for covered diagnoses such as cancer, heart attack, or stroke." },
  { icon: CircleDollarSign, title: "Life insurance", text: "Options that can help employees protect the people who depend on them." },
];

const steps = [
  { number: "01", title: "Understand your goals", text: "We learn about your workforce, timing, existing benefits, and enrollment priorities." },
  { number: "02", title: "Shape the offering", text: "A licensed agent explains available options, limitations, and implementation considerations." },
  { number: "03", title: "Educate your employees", text: "We support a clear enrollment experience so employees can make informed choices." },
  { number: "04", title: "Stay available", text: "Your organization has a point of contact for ongoing benefit questions and future enrollments." },
];

const faqs = [
  { question: "What are supplemental benefits?", answer: "Supplemental insurance is designed to complement—not replace—major medical coverage. Depending on the policy, it may pay a defined benefit after a covered accident, illness, hospitalization, or other qualifying event." },
  { question: "Can employees choose whether to participate?", answer: "Many worksite supplemental plans are offered on a voluntary basis. Participation, eligibility, payroll setup, and employer contribution options depend on the plan and carrier." },
  { question: "How much administrative work is involved?", answer: "We begin by understanding your current process and available resources. Our goal is to give your team a clear implementation plan and support employees through education and enrollment." },
  { question: "Is this available in every state?", answer: "Product availability, features, eligibility, and carrier options vary by state. A licensed agent will confirm what is available for your organization before making a recommendation." },
];

const fieldClass = "mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-cyan focus:ring-4 focus:ring-cyan/10";

function EmployerInquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      employees: String(data.get("employees") ?? ""),
      needs: String(data.get("needs") ?? "").trim(),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };
    const nextErrors: FormErrors = {};
    if (values.name.length < 2) nextErrors.name = "Please enter your name.";
    if (values.company.length < 2) nextErrors.company = "Please enter your organization.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Please enter a valid work email.";
    if (!/^[\d\s()+.-]{7,}$/.test(values.phone)) nextErrors.phone = "Please enter a valid phone number.";
    if (!values.employees) nextErrors.employees = "Please select a workforce size.";
    if (!values.consent) nextErrors.consent = "Please authorize us to contact you.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    const params = new URLSearchParams(window.location.search);
    const attribution = ["utm_source", "utm_medium", "utm_campaign"]
      .map((key) => params.get(key) ? `${key}: ${params.get(key)}` : "")
      .filter(Boolean)
      .join(" | ");
    const message = [
      "Employer benefits inquiry",
      `Organization: ${values.company}`,
      `Workforce size: ${values.employees}`,
      values.needs ? `Goals / questions: ${values.needs}` : "",
      attribution ? `Campaign: ${attribution}` : "",
      document.referrer ? `Referrer: ${document.referrer}` : "",
    ].filter(Boolean).join("\n").slice(0, 2000);

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          productId: "",
          message,
          consent: values.consent,
          website: values.website,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setFormError("We couldn't send your request. Please call us or try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[520px] flex-col justify-center" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-aqua/15 text-navy"><Check size={28} /></span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-navy/50">Request received</p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight">Let&apos;s build something useful for your team.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-navy/60">A member of Alleanza will review your information and follow up to discuss your organization&apos;s needs.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan">Start a conversation</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Tell us about your organization.</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/55">No commitment. A licensed agent will follow up to understand your goals.</p>
      </div>
      {formError && <p className="mb-5 rounded-xl bg-mist px-4 py-3 text-sm font-medium" role="alert">{formError}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Full name<input className={fieldClass} name="name" autoComplete="name" aria-invalid={!!errors.name} required />{errors.name && <span className="mt-1.5 block text-xs font-medium text-navy/60">{errors.name}</span>}</label>
        <label className="text-sm font-semibold">Organization<input className={fieldClass} name="company" autoComplete="organization" aria-invalid={!!errors.company} required />{errors.company && <span className="mt-1.5 block text-xs font-medium text-navy/60">{errors.company}</span>}</label>
        <label className="text-sm font-semibold">Work email<input className={fieldClass} name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} required />{errors.email && <span className="mt-1.5 block text-xs font-medium text-navy/60">{errors.email}</span>}</label>
        <label className="text-sm font-semibold">Phone<input className={fieldClass} name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} required />{errors.phone && <span className="mt-1.5 block text-xs font-medium text-navy/60">{errors.phone}</span>}</label>
        <label className="text-sm font-semibold sm:col-span-2">Approximate workforce size<select className={fieldClass} name="employees" defaultValue="" aria-invalid={!!errors.employees} required><option value="" disabled>Select one</option><option>2–24 employees</option><option>25–49 employees</option><option>50–99 employees</option><option>100–249 employees</option><option>250+ employees</option></select>{errors.employees && <span className="mt-1.5 block text-xs font-medium text-navy/60">{errors.employees}</span>}</label>
        <label className="text-sm font-semibold sm:col-span-2">What would you like to improve? <span className="font-normal text-navy/45">(optional)</span><textarea className={`${fieldClass} resize-y`} name="needs" rows={3} maxLength={1200} placeholder="Retention, employee choice, enrollment support…" /></label>
        <div className="absolute left-[-9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="flex items-start gap-3 text-xs font-normal leading-relaxed text-navy/55 sm:col-span-2"><input className="mt-0.5 h-5 w-5 shrink-0 accent-navy" name="consent" type="checkbox" aria-invalid={!!errors.consent} required /><span>I authorize a licensed insurance agent to contact me by phone, text, or email about coverage options. I can ask to stop communications at any time.</span></label>
        {errors.consent && <p className="-mt-3 text-xs font-medium text-navy/60 sm:col-span-2">{errors.consent}</p>}
        <button className="group flex items-center justify-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy shadow-[0_14px_35px_rgba(4,192,254,.25)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 sm:col-span-2" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Sending…" : <>Request a benefits conversation <ArrowRight size={17} className="transition group-hover:translate-x-1" /></>}</button>
        <p className="text-[11px] leading-relaxed text-navy/40 sm:col-span-2">Submitting this form does not create an application for insurance or guarantee coverage. Product availability and eligibility vary.</p>
      </div>
    </form>
  );
}

export default function EmployerLanding() {
  const reveal = useReveal({ y: 32 });
  return (
    <main lang="en" className="bg-white text-navy">
      <div className="noise" />
      <SiteHeader links={navLinks} cta={{ href: "#contact", label: "Talk to a benefits advisor" }} locale="en" />

      <section className="relative overflow-hidden bg-navy px-5 pb-24 pt-36 text-white md:pb-32 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-80" aria-hidden="true" />
        <div className="absolute -right-40 top-10 h-[620px] w-[620px] rounded-full border border-cyan/20" aria-hidden="true" />
        <div className="absolute -right-20 top-32 h-[440px] w-[440px] rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute right-[14%] top-[20%] h-80 w-80 rounded-full bg-cyan/15 blur-[100px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-cyan"><BriefcaseBusiness size={15} /> Supplemental benefits for employers</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .85, ease }} className="mt-8 max-w-4xl text-balance text-[clamp(3.2rem,6.8vw,6.4rem)] font-bold leading-[.93] tracking-[-.05em]">Benefits your people can <span className="text-cyan">understand.</span> Support they can <span className="text-aqua">feel.</span></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45, duration: .8 }} className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">Give employees access to voluntary supplemental insurance with a clear enrollment experience—and give your team a hands-on partner from planning through ongoing support.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .7 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="group flex w-fit items-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy shadow-[0_16px_45px_rgba(4,192,254,.25)]">Explore benefits for your team <ArrowRight size={17} className="transition group-hover:translate-x-1" /></a>
              <a href={`tel:${phones[0].href}`} className="flex w-fit items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-white/45"><Phone size={16} /> {phones[0].label}</a>
            </motion.div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/55"><span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-cyan" /> Licensed guidance</span><span className="inline-flex items-center gap-2"><MessageSquareText size={15} className="text-cyan" /> Employee education</span><span className="inline-flex items-center gap-2"><Users size={15} className="text-cyan" /> Enrollment support</span></div>
          </div>

          <motion.div initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25, duration: .9, ease }} className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.08] p-6 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="flex items-start justify-between border-b border-white/10 pb-6"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/40">Your benefits plan</p><p className="mt-2 text-xl font-semibold">Built around your workforce</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan text-navy"><ShieldCheck size={22} /></span></div>
              <div className="mt-6 space-y-3">{["Coverage options explained clearly", "Enrollment approach shaped to your team", "A point of contact beyond sign-up"].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-aqua/15 text-aqua"><Check size={15} /></span><span className="text-sm text-white/75">{item}</span><span className="ml-auto text-[10px] font-medium text-white/30">0{index + 1}</span></div>)}</div>
              <div className="mt-6 rounded-2xl bg-white p-5 text-navy"><p className="text-xs font-semibold uppercase tracking-[.16em] text-navy/45">The goal</p><p className="mt-2 text-lg font-semibold leading-snug">A benefit experience that respects your time and your employees&apos; choices.</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-navy/10 bg-mist px-5 py-7"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"><p className="text-sm font-semibold">Designed for growing teams and established organizations.</p><div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-navy/50"><span>Voluntary options</span><span>Clear communication</span><span>Human support</span><span>Licensed agents</span></div></div></section>

      <section id="coverage" className="px-5 py-24 md:py-36">
        <motion.div {...reveal} className="mx-auto max-w-7xl"><div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">A more complete benefits conversation</p><h2 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">Help employees prepare for life beyond the deductible.</h2></div><p className="max-w-xl text-lg leading-relaxed text-navy/60 md:justify-self-end">Major medical insurance is essential, but it may not address every financial consequence of an unexpected event. Supplemental coverage can add another layer of protection, depending on the policy selected.</p></div>
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{coverage.map(({ icon: Icon, title, text }, index) => <article key={title} className="group min-h-72 rounded-[1.75rem] border border-navy/10 bg-white p-7 transition hover:-translate-y-1 hover:border-cyan/50 hover:shadow-[0_24px_55px_-35px_rgba(6,20,49,.45)]"><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist transition group-hover:bg-cyan"><Icon size={22} /></span><span className="text-[10px] font-semibold text-navy/30">0{index + 1}</span></div><h3 className="mt-12 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-navy/55">{text}</p></article>)}</div>
          <p className="mt-6 text-xs leading-relaxed text-navy/40">These are general coverage categories, not an offer or policy summary. Benefits, exclusions, limitations, and availability vary by policy, carrier, and state.</p>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-mist px-5 py-24 md:py-36"><div className="absolute inset-y-0 left-1/2 w-px bg-navy/10" aria-hidden="true" /><motion.div {...reveal} className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Why employers consider it</p><h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">More choice for employees. More clarity for everyone.</h2></div><div className="grid gap-4 sm:grid-cols-2">{[{ icon: Users, title: "Employee choice", text: "Let eligible employees evaluate coverage based on their own needs and budget." }, { icon: BriefcaseBusiness, title: "A stronger offering", text: "Expand the benefits conversation with options that may complement your core plan." }, { icon: MessageSquareText, title: "Clear education", text: "Replace jargon with plain-language explanations of benefits and limitations." }, { icon: ShieldCheck, title: "Guided implementation", text: "Work with a team that stays engaged through planning, enrollment, and follow-up." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl bg-white p-6"><Icon size={21} className="text-cyan" /><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-navy/55">{text}</p></article>)}</div></motion.div></section>

      <section id="approach" className="bg-navy px-5 py-24 text-white md:py-36"><motion.div {...reveal} className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">A practical path forward</p><h2 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">From first conversation to confident enrollment.</h2></div><div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <article key={step.number} className="bg-navy p-7 md:min-h-72"><p className="font-mono text-xs text-cyan">{step.number}</p><h3 className="mt-14 text-xl font-semibold">{step.title}</h3><p className="mt-4 text-sm leading-relaxed text-white/55">{step.text}</p></article>)}</div></motion.div></section>

      <section id="questions" className="px-5 py-24 md:py-36"><motion.div {...reveal} className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Common questions</p><h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">What employers usually ask first.</h2><p className="mt-6 max-w-sm leading-relaxed text-navy/55">Every organization is different. These answers are a starting point—not a substitute for reviewing specific policy terms with a licensed agent.</p></div><div className="divide-y divide-navy/10 border-y border-navy/10">{faqs.map((faq) => <details key={faq.question} className="group py-2"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold"><span>{faq.question}</span><ChevronDown size={19} className="shrink-0 transition group-open:rotate-180" /></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-navy/60">{faq.answer}</p></details>)}</div></motion.div></section>

      <section id="contact" className="relative overflow-hidden bg-mist px-5 py-24 md:py-36"><div className="absolute -left-52 top-10 h-[500px] w-[500px] rounded-full border border-navy/10" aria-hidden="true" /><div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><motion.div {...reveal}><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">A credible benefit starts with a clear plan</p><h2 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">Let&apos;s talk about what would work for your team.</h2><p className="mt-6 max-w-lg text-lg leading-relaxed text-navy/60">Share a few details. We&apos;ll help you explore available options and decide whether supplemental benefits make sense for your organization.</p><div className="mt-9 flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-cyan"><Phone size={18} /></span><div><p className="text-xs font-medium text-navy/45">Prefer to call?</p><a className="font-semibold underline-offset-4 hover:underline" href={`tel:${phones[0].href}`}>{phones[0].label}</a></div></div></motion.div><motion.div {...reveal} transition={{ delay: .12, duration: .8, ease }} className="rounded-[2rem] bg-white p-7 shadow-[0_35px_80px_-45px_rgba(6,20,49,.45)] md:p-10"><EmployerInquiryForm /></motion.div></div></section>

      <footer className="bg-navy px-5 py-12 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><Logo light width={190} /><p className="mt-6 max-w-xl text-xs leading-relaxed text-white/40">Insurance products are subject to eligibility, availability, policy terms, exclusions, and limitations. A licensed insurance agent can explain options available for your organization.</p></div><div className="flex flex-wrap gap-6 text-xs text-white/55"><a className="hover:text-white" href="/">Alleanza home</a><a className="hover:text-white" href={`tel:${phones[0].href}`}>Call us</a><a className="hover:text-white" href="#contact">Contact</a></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-[11px] text-white/35">© {new Date().getFullYear()} Alleanza Insurance</div></footer>
    </main>
  );
}
