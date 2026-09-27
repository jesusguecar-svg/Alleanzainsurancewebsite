import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Languages, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { EnglishAgentFooter } from "@/components/agents/EnglishAgentFooter";
import { agents } from "@/lib/content/agents";
import a from "../../agentes/agents.module.css";

export const metadata: Metadata = {
  title: "Insurance Agent Directory | Alleanza Insurance Corp.",
  description: "Meet Alleanza insurance agents and review their offices, languages, NPN, and licensed states.",
  alternates: { canonical: "/en/agents", languages: { "es-US": "/agentes", "en-US": "/en/agents", "x-default": "/agentes" } },
  openGraph: {
    title: "Meet Your Agent | Alleanza Insurance Corp.",
    description: "Professional profiles, contact information, and credentials for Alleanza insurance agents.",
    url: "/en/agents",
    locale: "en_US",
  },
};

export default function EnglishAgentsPage() {
  return <div className={a.page} lang="en">
    <header className={a.header}><Link href="/"><Logo width={174} /></Link><nav><LanguageSwitch locale="en" spanishHref="/agentes" englishHref="/en/agents" className={a.languageSwitch} /><Link href="/health#presencia" className={a.back}><ArrowLeft size={15} /> Back to map</Link></nav></header>
    <main>
      <section className={a.directoryHero}>
        <span className={a.eyebrow}>AGENT DIRECTORY</span>
        <h1>Real people.<br /><em>Clear credentials.</em></h1>
        <p>Get to know the person who will guide you before the conversation begins. Review their location, languages, NPN, and the states where they are licensed.</p>
      </section>
      <section className={a.directoryGrid} aria-label="Alleanza agents">
        {agents.map((agent) => <article className={a.directoryCard} key={agent.slug}>
          <div className={a.directoryPhoto}><Image src={agent.image} alt={`Professional portrait of ${agent.fullName}`} fill sizes="(max-width: 700px) 100vw, 420px" /></div>
          <div className={a.directoryBody}><span className={a.verified}><ShieldCheck size={14} /> Professional identity</span><h2>{agent.fullName}</h2><p className={a.role}>{agent.titleEn}</p><p>{agent.shortBioEn}</p><div className={a.cardFacts}><span><MapPin size={14} /> {agent.officeNameEn}</span><span><Languages size={14} /> English · Spanish</span></div><Link href={`/en/agents/${agent.slug}`}>View profile and credentials <ArrowUpRight size={16} /></Link></div>
        </article>)}
      </section>
    </main>
    <EnglishAgentFooter />
  </div>;
}
