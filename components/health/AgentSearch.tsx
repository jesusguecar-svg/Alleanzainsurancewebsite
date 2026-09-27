"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { agents } from "@/lib/content/agents";
import s from "./health.module.css";

export function AgentSearch({ city, locale = "es", addressLine, localityLine, mapUrl }: { city?: string | null; locale?: "es" | "en"; addressLine?: string; localityLine?: string; mapUrl?: string }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("es");
  const matches = useMemo(() => {
    const pool = city && !normalized ? agents.filter((agent) => agent.city === city) : agents;
    if (!normalized) return pool.slice(0, 3);
    return pool.filter((agent) => [agent.fullName, agent.city, locale === "en" ? agent.officeNameEn : agent.officeName, ...(locale === "en" ? agent.serviceStatesEn : agent.serviceStates)]
      .some((value) => value.toLocaleLowerCase("es").includes(normalized))).slice(0, 3);
  }, [city, locale, normalized]);

  return <div className={s.agentFinder}>
    {addressLine && localityLine && mapUrl && <a className={s.officeAddressCard} href={mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={15} /><span><small>{locale === "en" ? `${city} office` : `Oficina de ${city}`}</small><strong>{addressLine}</strong><em>{localityLine}</em></span><ArrowUpRight size={14} /></a>}
    <label className={s.agentSearch}>
      <Search size={14} aria-hidden="true" />
      <span className="sr-only">{locale === "en" ? "Search for an agent by name, city, or state" : "Buscar un agente por nombre, ciudad o estado"}</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "Search for an agent" : "Busca un agente"} />
    </label>
    {matches.length > 0 ? <div className={s.agentResults} aria-live="polite">
      {matches.map((agent) => <Link href={`${locale === "en" ? "/en/agents" : "/agentes"}/${agent.slug}`} className={s.agentPreview} key={agent.slug}>
        <Image src={agent.image} alt={locale === "en" ? `Professional portrait of ${agent.fullName}` : `Retrato profesional de ${agent.fullName}`} width={56} height={56} />
        <span><strong>{agent.fullName}</strong><small>{locale === "en" ? agent.titleEn : agent.title}</small><em><ShieldCheck size={11} /> NPN {agent.npn}</em></span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>)}
    </div> : <p className={s.agentEmpty}>{locale === "en" ? "There is no published profile for this city yet. Search by name or choose another office." : "Aún no hay un perfil publicado para esta ciudad. Busca por nombre o elige otra oficina."}</p>}
    <Link href={locale === "en" ? "/en/agents" : "/agentes"} className={s.agentDirectoryLink}>{locale === "en" ? "View agent directory" : "Ver directorio de agentes"} <ArrowUpRight size={14} /></Link>
  </div>;
}
