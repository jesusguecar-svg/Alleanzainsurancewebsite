"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Check, HeartPulse, Menu, Phone, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { useRef, useState } from "react";
import { Logo } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = (reduceMotion: boolean | null) => reduceMotion
  ? { initial: false as const }
  : { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: .9, ease } };

const entrance = <T extends Record<string, number>>(reduceMotion: boolean | null, initial: T) =>
  reduceMotion ? { initial: false as const } : { initial, animate: { opacity: 1, y: 0 } };

function Wing({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-[100%_0_100%_0] border border-cyan/30 bg-gradient-to-br from-cyan/25 to-transparent shadow-[inset_0_0_35px_rgba(4,192,254,.12),0_0_60px_rgba(4,192,254,.08)] backdrop-blur-sm ${className}`} />;
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-.5, .5], [8, -8]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-.5, .5], [-8, 8]), { stiffness: 160, damping: 20 });
  return <motion.div style={reduceMotion ? { transformStyle: "preserve-3d" } : { rotateX, rotateY, transformStyle: "preserve-3d" }} onMouseMove={reduceMotion ? undefined : (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX-r.left)/r.width-.5); y.set((e.clientY-r.top)/r.height-.5); }} onMouseLeave={reduceMotion ? undefined : () => { x.set(0); y.set(0); }} className="group relative h-full rounded-[2rem] border border-navy/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(6,20,49,.35)] transition-shadow duration-500 hover:shadow-[0_35px_90px_-30px_rgba(4,192,254,.5)] md:p-10">{children}</motion.div>;
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const hero = useRef<HTMLElement>(null); const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 180]); const sceneY = useTransform(scrollYProgress, [0, 1], [0, 320]); const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]); const fade = useTransform(scrollYProgress, [0, .8], [1, 0]);
  return <main>
    <div className="noise" />
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-[0_12px_40px_rgba(6,20,49,.08)] backdrop-blur-xl md:px-7">
        <Logo />
        <nav className="hidden items-center gap-8 text-[13px] font-semibold md:flex"><a href="#promesa" className="hover:text-cyan">Nuestra promesa</a><a href="#proteccion" className="hover:text-cyan">Protecciones</a><a href="#como" className="hover:text-cyan">Cómo funciona</a></nav>
        <a href="#contacto" className="hidden items-center gap-2 rounded-full bg-cyan px-5 py-3 text-xs font-extrabold text-navy shadow-[0_8px_25px_rgba(4,192,254,.35)] transition hover:-translate-y-0.5 md:flex">Hablar con un asesor <ArrowRight size={15}/></a>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Abrir menú"><Menu /></button>
      </div>
      {open && <div className="mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl md:hidden"><a href="#promesa">Nuestra promesa</a><a href="#proteccion">Protecciones</a><a href="#como">Cómo funciona</a><a href="#contacto" className="font-bold text-cyan">Hablar con un asesor</a></div>}
    </header>

    <section ref={hero} className="relative flex min-h-[105vh] items-center overflow-hidden bg-navy px-5 pb-20 pt-32 text-white">
      <motion.div style={reduceMotion ? undefined : { y: sceneY, scale: sceneScale }} className="absolute inset-0">
        <div className="absolute inset-0 grid-lines"/><div className="absolute left-[55%] top-[18%] h-[440px] w-[440px] rounded-full bg-cyan/20 blur-[110px]"/><Wing className="right-[8%] top-[16%] h-[36vw] w-[24vw] rotate-[18deg]"/><Wing className="right-[25%] top-[36%] h-[28vw] w-[18vw] -rotate-[18deg] opacity-60"/>
        <motion.div animate={reduceMotion ? { y: 0, rotate: 10 } : { y: [0,-20,0], rotate: [10,14,10] }} transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[11%] top-[24%] h-[43vw] max-h-[610px] w-[28vw] max-w-[400px] rounded-[48%_48%_42%_42%] border border-white/20 bg-gradient-to-b from-white/20 via-cyan/10 to-transparent shadow-[inset_0_0_70px_rgba(255,255,255,.1),0_50px_100px_rgba(0,0,0,.25)] backdrop-blur-xl" />
      </motion.div>
      <motion.div style={reduceMotion ? undefined : { y: copyY, opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div {...entrance(reduceMotion, { opacity: 0, y: 20 })} transition={{ delay: .2, duration: .8 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-cyan"><ShieldCheck size={15}/> Protección hecha para tu familia</motion.div>
        <motion.h1 {...entrance(reduceMotion, { opacity: 0, y: 45 })} transition={{ delay: .3, duration: 1, ease }} className="max-w-4xl font-display text-[clamp(3.7rem,8.2vw,7.5rem)] leading-[.88] tracking-[-.055em]">Que la vida siga.<br/><span className="text-cyan">Nosotros protegemos.</span></motion.h1>
        <motion.p {...entrance(reduceMotion, { opacity: 0, y: 0 })} transition={{ delay: .75, duration: 1 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">Protección complementaria que te acompaña cuando un diagnóstico cambia los planes. En español, con claridad y corazón.</motion.p>
        <motion.div {...entrance(reduceMotion, { opacity: 0, y: 20 })} transition={{ delay: .9, duration: .8 }} className="mt-10 flex flex-col gap-4 sm:flex-row"><a href="#contacto" className="group flex w-fit items-center gap-3 rounded-full bg-cyan px-7 py-4 text-sm font-extrabold text-navy shadow-[0_15px_45px_rgba(4,192,254,.25)]">Quiero proteger a mi familia <ArrowRight size={17} className="transition group-hover:translate-x-1"/></a><a href="#promesa" className="flex w-fit items-center gap-3 px-4 py-3 text-sm font-bold text-white/75"><ArrowDown size={17}/> Descubre nuestra promesa</a></motion.div>
      </motion.div>
    </section>

    <div className="relative z-20 -mt-8 mx-4 rounded-3xl bg-white px-6 py-7 shadow-[0_25px_70px_rgba(6,20,49,.12)] md:mx-8"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-7 text-center md:grid-cols-4"><div><b className="text-xl">Atención humana</b><p className="mt-1 text-xs text-navy/50">Siempre en español</p></div><div><b className="text-xl">Texas</b><p className="mt-1 text-xs text-navy/50">Protección local</p></div><div><b className="text-xl">Sin rodeos</b><p className="mt-1 text-xs text-navy/50">Claridad primero</p></div><div><b className="text-xl">A tu lado</b><p className="mt-1 text-xs text-navy/50">Cuando importa</p></div></div></div>

    <section className="relative overflow-hidden px-5 py-32 md:py-48"><div className="absolute right-[-10%] top-20 h-80 w-80 rounded-full bg-cyan/10 blur-3xl"/><div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:items-center">
      <motion.div {...reveal(reduceMotion)}><p className="mb-5 text-xs font-extrabold uppercase tracking-[.22em] text-cyan">La vida no avisa</p><h2 className="text-balance font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">Un diagnóstico no debería decidir el futuro de tu familia.</h2></motion.div>
      <motion.div {...reveal(reduceMotion)} transition={{ duration: .9, delay: .15, ease }} className="relative md:pl-20"><div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-cyan to-transparent md:block"/><p className="text-xl leading-relaxed text-navy/65">Las cuentas siguen llegando. La renta, la comida, el cuidado de los tuyos. Por eso creamos una protección que te entrega apoyo directo, para que tu energía esté donde debe estar: <strong className="text-navy">en recuperarte y seguir juntos.</strong></p></motion.div>
    </div></section>

    <section id="promesa" className="relative overflow-hidden bg-navy px-5 py-32 text-white md:py-44"><Wing className="-left-20 top-10 h-80 w-56 -rotate-12 opacity-30"/><div className="mx-auto max-w-7xl">
      <motion.div {...reveal(reduceMotion)} className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan text-navy shadow-[0_0_45px_rgba(4,192,254,.35)]"><ShieldCheck size={31}/></div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">La promesa Alleanza</p><h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">Protección que se siente cerca.</h2><p className="mt-7 text-lg leading-relaxed text-white/60">No vendemos miedo. Construimos tranquilidad con conversaciones honestas, opciones comprensibles y un equipo que conoce tu historia.</p></motion.div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">{[["01","Te escuchamos","Tu familia no cabe en un formulario. Empezamos por entender lo que de verdad necesitas."],["02","Te explicamos","Sin letra pequeña en la conversación. Cada decisión, clara y acompañada."],["03","Respondemos","Cuando llega un momento difícil, no eres un número. Estamos contigo."]].map((item,i)=><motion.div key={item[0]} {...reveal(reduceMotion)} transition={{ duration: .8, delay: i*.12, ease }} className="glass rounded-3xl p-8 md:p-10"><span className="text-xs font-bold text-cyan">{item[0]}</span><h3 className="mt-12 text-2xl font-bold">{item[1]}</h3><p className="mt-4 text-sm leading-relaxed text-white/55">{item[2]}</p></motion.div>)}</div>
    </div></section>

    <section id="proteccion" className="px-5 py-32 md:py-44"><div className="mx-auto max-w-7xl"><motion.div {...reveal(reduceMotion)} className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Protección esencial</p><h2 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">Tres formas de cuidar lo irremplazable.</h2></motion.div>
      <div className="perspective mt-16 grid gap-6 md:grid-cols-3">{[
        {icon:HeartPulse,n:"Cardíaca",t:"Apoyo económico ante eventos cardíacos cubiertos, para respirar y enfocarte en sanar.",tag:"Corazón protegido"},
        {icon:Stethoscope,n:"Cuidados intensivos",t:"Respaldo diario durante una estadía cubierta en cuidados intensivos.",tag:"Apoyo hospitalario"},
        {icon:Sparkles,n:"Cáncer",t:"Protección pensada para acompañarte desde un diagnóstico cubierto y durante el proceso.",tag:"Fuerza para seguir"}
      ].map((p,i)=><motion.div key={p.n} {...reveal(reduceMotion)} transition={{ duration: .8, delay: i*.1, ease }}><TiltCard><div style={{ transform:"translateZ(32px)" }}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-cyan"><p.icon size={26}/></div><p className="mt-12 text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan">{p.tag}</p><h3 className="mt-3 font-display text-4xl">{p.n}</h3><p className="mt-5 min-h-24 text-sm leading-relaxed text-navy/55">{p.t}</p><button className="mt-8 flex items-center gap-2 text-sm font-extrabold">Conocer protección <ArrowRight size={16} className="transition group-hover:translate-x-1"/></button></div><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/0 blur-2xl transition duration-500 group-hover:bg-cyan/30"/></TiltCard></motion.div>)}</div>
      <p className="mt-8 text-center text-[11px] text-navy/40">Beneficios sujetos a términos, condiciones, limitaciones y exclusiones de la póliza.</p>
    </div></section>

    <section id="como" className="overflow-hidden bg-[#eaf8fd] px-5 py-32 md:py-44"><div className="mx-auto max-w-7xl"><motion.div {...reveal(reduceMotion)} className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Simple desde el inicio</p><h2 className="mt-5 font-display text-5xl md:text-7xl">Tu tranquilidad, en tres pasos.</h2></motion.div><div className="relative mt-20 grid gap-12 md:grid-cols-3"><div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-cyan/30 md:block"/>{[["1","Conversemos","Cuéntanos qué quieres proteger. Sin presión, a tu ritmo."],["2","Diseñamos contigo","Revisamos opciones que tengan sentido para tu familia y presupuesto."],["3","Sigues viviendo","Quedas acompañado por un equipo listo para responder."]].map((s,i)=><motion.div key={s[0]} initial={reduceMotion ? false : {opacity:0,y:50,scale:.95}} whileInView={reduceMotion ? undefined : {opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{duration:.8,delay:i*.16,ease}} className="relative text-center"><div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#eaf8fd] bg-navy text-lg font-bold text-cyan shadow-xl">{s[0]}</div><h3 className="mt-7 text-xl font-extrabold">{s[1]}</h3><p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-navy/55">{s[2]}</p></motion.div>)}</div></div></section>

    <section className="relative min-h-[90vh] overflow-hidden bg-navy px-5 py-28 text-white md:py-40"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(4,192,254,.18),transparent_35%)]"/><motion.div initial={reduceMotion ? false : {scale:1.15}} whileInView={reduceMotion ? undefined : {scale:1}} viewport={{once:true}} transition={{duration:1.8,ease}} className="absolute bottom-[-20%] right-[-5%] h-[85%] w-[58%] rounded-[50%_50%_10%_10%] border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-[inset_0_0_80px_rgba(4,192,254,.08)] backdrop-blur-md"/><div className="relative mx-auto flex min-h-[65vh] max-w-7xl items-center"><motion.div {...reveal(reduceMotion)} className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-cyan">Historias que nos mueven</p><blockquote className="mt-8 font-display text-4xl leading-[1.15] md:text-6xl">“Nuestra mayor tranquilidad fue saber que podíamos concentrarnos en estar juntos.”</blockquote><div className="mt-9 flex items-center gap-4"><div className="h-px w-12 bg-cyan"/><p className="text-sm text-white/55">Una familia como la tuya · Houston, Texas</p></div></motion.div></div></section>

    <section id="contacto" className="relative overflow-hidden bg-cyan px-5 py-28 text-navy md:py-40"><div className="absolute -right-28 -top-40 h-[520px] w-[520px] rounded-full border border-navy/10"/><div className="absolute -right-12 -top-20 h-[360px] w-[360px] rounded-full border border-navy/10"/><motion.div {...reveal(reduceMotion)} className="relative mx-auto max-w-5xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.24em]">Tu familia. Tu historia. Tu protección.</p><h2 className="mt-6 text-balance font-display text-5xl leading-none tracking-tight md:text-8xl">Hoy es un buen día para cuidar el mañana.</h2><p className="mx-auto mt-7 max-w-xl text-base font-medium text-navy/65">Habla con alguien que te escuche, en tu idioma y sin compromiso.</p><a href="tel:+18325550147" className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-full bg-navy px-8 py-5 text-sm font-extrabold text-white shadow-[0_20px_50px_rgba(6,20,49,.25)] transition hover:-translate-y-1"><Phone size={18}/> Hablar con un asesor</a></motion.div></section>

    <footer className="bg-navy px-5 py-12 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><Logo light/><p className="mt-6 max-w-sm text-xs leading-relaxed text-white/40">Alleanza Insurance acompaña a familias con soluciones de protección complementaria. La disponibilidad de productos puede variar.</p></div><div className="flex flex-wrap gap-6 text-xs text-white/50"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Licencias</a><span>© {new Date().getFullYear()} Alleanza Insurance</span></div></div></footer>
  </main>;
}
