"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { agents } from "@/lib/content/agents";
import s from "./health.module.css";

export function AgentSearch({ city }: { city?: string | null }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("es");
  const matches = useMemo(() => {
    const pool = city && !normalized ? agents.filter((agent) => agent.city === city) : agents;
    if (!normalized) return pool.slice(0, 3);
    return pool.filter((agent) => [agent.fullName, agent.city, agent.officeName, ...agent.serviceStates]
      .some((value) => value.toLocaleLowerCase("es").includes(normalized))).slice(0, 3);
  }, [city, normalized]);

  return <div className={s.agentFinder}>
    <label className={s.agentSearch}>
      <Search size={14} aria-hidden="true" />
      <span className="sr-only">Buscar un agente por nombre, ciudad o estado</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca un agente" />
    </label>
    {matches.length > 0 ? <div className={s.agentResults} aria-live="polite">
      {matches.map((agent) => <Link href={`/agentes/${agent.slug}`} className={s.agentPreview} key={agent.slug}>
        <Image src={agent.image} alt={`Retrato profesional de ${agent.fullName}`} width={56} height={56} />
        <span><strong>{agent.fullName}</strong><small>{agent.title}</small><em><ShieldCheck size={11} /> NPN {agent.npn}</em></span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>)}
    </div> : <p className={s.agentEmpty}>Aún no hay un perfil publicado para esta ciudad. Busca por nombre o elige otra oficina.</p>}
    <Link href="/agentes" className={s.agentDirectoryLink}>Ver directorio de agentes <ArrowUpRight size={14} /></Link>
  </div>;
}
