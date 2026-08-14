"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Menu, ShieldCheck } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Logo } from "./Logo";
import { HeroSequence } from "./cinematic";
import { CareersSection } from "./sections/CareersSection";
import { ContactSection } from "./sections/ContactSection";
import { DirectSupportSection } from "./sections/DirectSupportSection";
import { FaqSection } from "./sections/FaqSection";
import { ProductsSection } from "./sections/ProductsSection";
import { QualificationSection } from "./sections/QualificationSection";
import { TrustSection } from "./sections/TrustSection";
import { ProductDialog } from "./ui/ProductDialog";
import { type Product } from "@/lib/content/products";
import { academyUrl, officeAddressLines, officeHours, phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";


function Wing({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-[100%_0_100%_0] border border-cyan/30 bg-gradient-to-br from-cyan/25 to-transparent shadow-[inset_0_0_35px_rgba(4,192,254,.12),0_0_60px_rgba(4,192,254,.08)] backdrop-blur-sm ${className}`} />;
}

const navLinks = [
  { href: "#productos", label: "Productos" },
  { href: "#promesa", label: "Nuestra promesa" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#trabajo", label: "Trabajo" },
];

export default function LandingPage() {
  const reveal = useReveal();
  const revealStep = useReveal({ scale: .95, duration: .8 });
  const entranceBadge = useEntrance({ opacity: 0, y: 20 });
  const entranceTitle = useEntrance({ opacity: 0, y: 45 });
  const entranceLede = useEntrance({ opacity: 0 });
  const entranceCta = useEntrance({ opacity: 0, y: 20 });
  const hero = useRef<HTMLElement>(null); const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 180]); const sceneY = useTransform(scrollYProgress, [0, 1], [0, 320]); const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]); const fade = useTransform(scrollYProgress, [0, .8], [1, 0]);
  return <main>
    <div className="noise" />
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-[0_12px_40px_rgba(6,20,49,.08)] backdrop-blur-xl md:px-7">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-7 text-[13px] font-semibold lg:flex">{navLinks.map((link) => <a key={link.href} href={link.href} className="hover:text-cyan">{link.label}</a>)}</nav>
        <a href="#contacto" className="hidden items-center gap-2 rounded-full bg-cyan px-5 py-3 text-xs font-semibold text-navy shadow-[0_8px_25px_rgba(4,192,254,.35)] transition hover:-translate-y-0.5 md:flex">Hablar con un asesor <ArrowRight aria-hidden="true" size={15}/></a>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" className="lg:hidden" aria-label="Abrir menú"><Menu aria-hidden="true" /></button>
      </div>
      {open && <nav id="menu-movil" aria-label="Principal" className="mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl lg:hidden">{navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}<a href="#contacto" onClick={() => setOpen(false)} className="font-bold text-cyan">Hablar con un asesor</a></nav>}
    </header>

    <section ref={hero} className="relative flex min-h-[165vh] items-start overflow-hidden bg-navy px-5 pb-20 pt-32 text-white">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[62%]"><div className="sticky top-0 h-screen"><HeroSequence progressRoot={hero}/></div></div>
      <motion.div style={{ y: sceneY, scale: sceneScale }} className="absolute inset-0">
        <div className="absolute inset-0 grid-lines"/><div className="absolute left-[55%] top-[18%] h-[440px] w-[440px] rounded-full bg-cyan/20 blur-[110px]"/>
      </motion.div>
      <motion.div style={{ y: copyY, opacity: fade }} className="sticky top-0 z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center py-24">
        <motion.div {...entranceBadge} transition={{ delay: .2, duration: .8 }} className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-cyan"><ShieldCheck size={15}/> Protección hecha para tu familia</motion.div>
        <motion.h1 {...entranceTitle} transition={{ delay: .3, duration: 1, ease }} className="max-w-4xl font-display text-[clamp(3.7rem,8.2vw,7.5rem)] leading-[.88] tracking-[-.055em] font-bold">Que la vida siga.<br/><span className="text-cyan">Nosotros protegemos.</span></motion.h1>
        <motion.p {...entranceLede} transition={{ delay: .75, duration: 1 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">Protección complementaria que te acompaña cuando un diagnóstico cambia los planes. En español, con claridad y corazón.</motion.p>
        <motion.div {...entranceCta} transition={{ delay: .9, duration: .8 }} className="mt-10 flex flex-col gap-4 sm:flex-row"><a href="#contacto" className="group flex w-fit items-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy shadow-[0_15px_45px_rgba(4,192,254,.25)]">Quiero proteger a mi familia <ArrowRight size={17} className="transition group-hover:translate-x-1"/></a><a href="#promesa" className="flex w-fit items-center gap-3 px-4 py-3 text-sm font-bold text-white/75"><ArrowDown size={17}/> Descubre nuestra promesa</a></motion.div>
      </motion.div>
    </section>

    <section className="relative overflow-hidden px-5 py-32 md:py-48"><div className="absolute right-[-10%] top-20 h-80 w-80 rounded-full bg-cyan/10 blur-3xl"/><div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:items-center">
      <motion.div {...reveal}><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-cyan">La vida no avisa</p><h2 className="text-balance font-display text-5xl leading-[1.02] tracking-tight md:text-7xl font-bold">Un diagnóstico no debería decidir el futuro de tu familia.</h2></motion.div>
      <motion.div {...reveal} transition={{ duration: .9, delay: .15, ease }} className="relative md:pl-20"><div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-cyan to-transparent md:block"/><p className="text-xl leading-relaxed text-navy/65">Las cuentas siguen llegando. La renta, la comida, el cuidado de los tuyos. Por eso creamos una protección que te entrega apoyo directo, para que tu energía esté donde debe estar: <strong className="text-navy">en recuperarte y seguir juntos.</strong></p></motion.div>
    </div></section>

    <DirectSupportSection />
    <QualificationSection />

    <section id="promesa" className="relative overflow-hidden bg-navy px-5 py-32 text-white md:py-44"><Wing className="-left-20 top-10 h-80 w-56 -rotate-12 opacity-30"/><div className="mx-auto max-w-7xl">
      <motion.div {...reveal} className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan text-navy shadow-[0_0_45px_rgba(4,192,254,.35)]"><ShieldCheck size={31}/></div><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">La promesa Alleanza</p><h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl font-bold">Protección que se siente cerca.</h2><p className="mt-7 text-lg leading-relaxed text-white/60">No vendemos miedo. Construimos tranquilidad con conversaciones honestas, opciones comprensibles y un equipo que conoce tu historia.</p></motion.div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">{[["01","Te escuchamos","Tu familia no cabe en un formulario. Empezamos por entender lo que de verdad necesitas."],["02","Te explicamos","Sin letra pequeña en la conversación. Cada decisión, clara y acompañada."],["03","Respondemos","Cuando llega un momento difícil, no eres un número. Estamos contigo."]].map((item,i)=><motion.div key={item[0]} {...reveal} transition={{ duration: .8, delay: i*.12, ease }} className="glass rounded-3xl p-8 md:p-10"><span className="text-xs font-bold text-cyan">{item[0]}</span><h3 className="mt-12 text-2xl font-bold">{item[1]}</h3><p className="mt-4 text-sm leading-relaxed text-white/55">{item[2]}</p></motion.div>)}</div>
    </div></section>

    <ProductsSection onSelect={setSelectedProduct} />

    <section id="como" className="overflow-hidden bg-mist px-5 py-32 md:py-44"><div className="mx-auto max-w-7xl"><motion.div {...reveal} className="text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">Simple desde el inicio</p><h2 className="mt-5 font-display text-5xl md:text-7xl font-bold">Tu tranquilidad, en tres pasos.</h2></motion.div><div className="relative mt-20 grid gap-12 md:grid-cols-3"><div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-cyan/30 md:block"/>{[["1","Conversemos","Cuéntanos qué quieres proteger. Sin presión, a tu ritmo."],["2","Diseñamos contigo","Revisamos opciones que tengan sentido para tu familia y presupuesto."],["3","Sigues viviendo","Quedas acompañado por un equipo listo para responder."]].map((s,i)=><motion.div key={s[0]} {...revealStep} transition={{duration:.8,delay:i*.16,ease}} className="relative text-center"><div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#eaf8fd] bg-navy text-lg font-bold text-cyan shadow-xl">{s[0]}</div><h3 className="mt-7 text-xl font-bold">{s[1]}</h3><p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-navy/55">{s[2]}</p></motion.div>)}</div></div></section>

    <TrustSection />

    <FaqSection />

    <CareersSection />

    <ContactSection />

    <footer className="bg-navy px-5 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/40">Alleanza Insurance acompaña a familias con opciones de seguro de salud, de vida y de protección complementaria. La disponibilidad de productos puede variar según el estado y la compañía aseguradora.</p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[.2em] text-cyan">Oficina</h2>
            <address className="mt-4 text-xs not-italic leading-relaxed text-white/55">
              {officeAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <h2 className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-cyan">Horario</h2>
            <dl className="mt-4 text-xs leading-relaxed text-white/55">
              {officeHours.map((entry) => (
                <div key={entry.days} className="flex flex-wrap gap-x-2">
                  <dt>{entry.days}:</dt>
                  <dd className="text-white/75">{entry.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[.2em] text-cyan">Teléfonos</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/55">
              {phones.map((phone) => (
                <li key={phone.href}>
                  <a href={`tel:${phone.href}`} className="underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">{phone.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[.2em] text-cyan">Enlaces</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/55">
              <li><a href="#productos" className="transition hover:text-white">Productos</a></li>
              <li><a href="#trabajo" className="transition hover:text-white">Trabaja con nosotros</a></li>
              <li><a href="#preguntas" className="transition hover:text-white">Preguntas frecuentes</a></li>
              <li><a href={academyUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Academia Alleanza</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Alleanza Insurance</p>
          <div className="flex flex-wrap gap-6"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Licencias</a></div>
        </div>
      </div>
    </footer>
    <ProductDialog product={selectedProduct} onClose={closeProduct} />
  </main>;
}
