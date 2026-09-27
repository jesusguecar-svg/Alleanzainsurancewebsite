import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Languages, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { agents } from "@/lib/content/agents";
import a from "./agents.module.css";

export const metadata: Metadata = {
  title: "Directorio de agentes de seguros | Alleanza Insurance Corp.",
  description: "Conoce a los agentes de seguros de Alleanza, sus oficinas, idiomas, NPN y estados donde cuentan con licencia.",
  alternates: { canonical: "/agentes" },
  openGraph: {
    title: "Conoce a tu agente | Alleanza Insurance Corp.",
    description: "Perfiles profesionales, información de contacto y credenciales de los agentes de Alleanza.",
    url: "/agentes",
  },
};

export default function AgentsPage() {
  return <div className={a.page}>
    <header className={a.header}><Link href="/"><Logo width={174} /></Link><Link href="/health#presencia" className={a.back}><ArrowLeft size={15} /> Volver al mapa</Link></header>
    <main>
      <section className={a.directoryHero}>
        <span className={a.eyebrow}>DIRECTORIO DE AGENTES</span>
        <h1>Personas reales.<br /><em>Credenciales claras.</em></h1>
        <p>Conoce a la persona que te orientará antes de conversar. Consulta su ubicación, idiomas, NPN y estados donde cuenta con licencia.</p>
      </section>
      <section className={a.directoryGrid} aria-label="Agentes de Alleanza">
        {agents.map((agent) => <article className={a.directoryCard} key={agent.slug}>
          <div className={a.directoryPhoto}><Image src={agent.image} alt={`Retrato profesional de ${agent.fullName}`} fill sizes="(max-width: 700px) 100vw, 420px" /></div>
          <div className={a.directoryBody}><span className={a.verified}><ShieldCheck size={14} /> Identidad profesional</span><h2>{agent.fullName}</h2><p className={a.role}>{agent.title}</p><p>{agent.shortBio}</p><div className={a.cardFacts}><span><MapPin size={14} /> {agent.officeName}</span><span><Languages size={14} /> {agent.languages.join(" · ")}</span></div><Link href={`/agentes/${agent.slug}`}>Ver perfil y credenciales <ArrowUpRight size={16} /></Link></div>
        </article>)}
      </section>
    </main>
    <SiteFooter editorial />
  </div>;
}
