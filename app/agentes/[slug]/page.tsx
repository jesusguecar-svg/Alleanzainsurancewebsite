import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Building2, Check, Languages, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { agents, getAgent } from "@/lib/content/agents";
import { healthEmail } from "@/lib/content/health";
import { siteUrl } from "@/lib/config/site";
import a from "../agents.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = getAgent((await params).slug);
  if (!agent) return {};
  const title = `${agent.fullName} | ${agent.title} en ${agent.city}`;
  const description = `${agent.fullName}, ${agent.title.toLocaleLowerCase("es")}. NPN ${agent.npn}. Atención en ${agent.languages.join(" y ")} desde ${agent.officeName}.`;
  return {
    title,
    description,
    alternates: { canonical: `/agentes/${agent.slug}` },
    openGraph: { type: "profile", title, description, url: `/agentes/${agent.slug}`, images: [{ url: agent.image, alt: `Retrato profesional de ${agent.fullName}` }] },
    twitter: { card: "summary", title, description, images: [agent.image] },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const agent = getAgent((await params).slug);
  if (!agent) notFound();
  const profileUrl = `${siteUrl}/agentes/${agent.slug}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${agent.address.street}, ${agent.address.locality}, ${agent.address.region} ${agent.address.postalCode}`)}`;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: agent.fullName,
    url: profileUrl,
    image: `${siteUrl}${agent.image}`,
    jobTitle: agent.title,
    description: agent.shortBio,
    knowsLanguage: agent.languages,
    telephone: agent.phone.href,
    identifier: { "@type": "PropertyValue", name: "National Producer Number (NPN)", value: agent.npn },
    areaServed: agent.serviceStates.map((name) => ({ "@type": "State", name })),
    worksFor: { "@type": "InsuranceAgency", name: "Alleanza Insurance Corp.", url: siteUrl },
    workLocation: {
      "@type": "Place",
      name: agent.officeName,
      address: {
        "@type": "PostalAddress",
        streetAddress: agent.address.street,
        addressLocality: agent.address.locality,
        addressRegion: agent.address.region,
        postalCode: agent.address.postalCode,
        addressCountry: agent.address.country,
      },
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `¿En qué estados tiene licencia ${agent.fullName}?`, acceptedAnswer: { "@type": "Answer", text: `${agent.fullName} indica que cuenta con licencia residente en ${agent.residentState} y licencias no residentes en ${agent.nonResidentStates.join(", ")}. La vigencia debe confirmarse con el regulador correspondiente.` } },
      { "@type": "Question", name: `¿En qué idiomas atiende ${agent.fullName}?`, acceptedAnswer: { "@type": "Answer", text: `${agent.fullName} atiende en ${agent.languages.join(" y ")}.` } },
      { "@type": "Question", name: `¿Dónde se encuentra la oficina de ${agent.fullName}?`, acceptedAnswer: { "@type": "Answer", text: `${agent.address.street}, ${agent.address.locality}, ${agent.address.region} ${agent.address.postalCode}.` } },
    ],
  };

  return <div className={a.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
    <header className={a.header}><Link href="/"><Logo width={174} /></Link><nav><Link href="/agentes"><ArrowLeft size={15} /> Todos los agentes</Link><Link href="/health#contacto" className={a.headerCta}>Solicitar orientación <ArrowUpRight size={15} /></Link></nav></header>
    <main>
      <section className={a.profileHero}>
        <div className={a.profilePhoto}>
          <Image src={agent.image} alt={`Retrato profesional de ${agent.fullName}`} width={422} height={332} priority />
          <span><BadgeCheck size={16} /> Perfil profesional</span>
        </div>
        <div className={a.profileIntro}>
          <span className={a.eyebrow}>{agent.officeName} · {agent.languages.join(" / ")}</span>
          <h1>{agent.fullName}</h1>
          <p className={a.profileRole}>{agent.title}<small>{agent.titleEn}</small></p>
          <p className={a.profileLead}>{agent.shortBio}</p>
          <div className={a.profileActions}><a href={`tel:${agent.phone.href}`}><Phone size={17} /> Llamar {agent.phone.label}</a><Link href="/health#contacto">Solicitar orientación <ArrowUpRight size={17} /></Link></div>
          <div className={a.trustStrip}><span><ShieldCheck size={17} /><strong>NPN {agent.npn}</strong><small>Identificador nacional</small></span><span><Languages size={17} /><strong>Bilingüe</strong><small>Español e inglés</small></span><span><MapPin size={17} /><strong>4 estados</strong><small>Consulta disponibilidad</small></span></div>
        </div>
      </section>

      <section className={a.profileContent}>
        <div className={a.story}>
          <span className={a.eyebrow}>CONOCE A TU AGENTE</span>
          <h2>Claridad antes<br />de decidir.</h2>
          {agent.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className={a.specialties}>{agent.specialties.map((specialty) => <span key={specialty}><Check size={14} /> {specialty}</span>)}</div>
        </div>
        <aside className={a.credentials} aria-labelledby="credentials-title">
          <div className={a.credentialHeading}><span><ShieldCheck size={18} /></span><div><small>CREDENCIALES</small><h2 id="credentials-title">Información verificable</h2></div></div>
          <dl>
            <div><dt>Nombre completo</dt><dd>{agent.fullName}</dd></div>
            <div><dt>NPN</dt><dd>{agent.npn}</dd></div>
            <div><dt>Licencia residente</dt><dd>{agent.residentState}</dd></div>
            <div><dt>Licencias no residentes</dt><dd>{agent.nonResidentStates.join(" · ")}</dd></div>
            <div><dt>Idiomas</dt><dd>{agent.languages.join(" · ")}</dd></div>
          </dl>
          <a className={a.verifyLink} href="https://nipr.com/licensing-center" target="_blank" rel="noopener noreferrer">Consultar información en NIPR <ArrowUpRight size={15} /></a>
          <p>El NPN es un identificador nacional. La vigencia, autoridad y disponibilidad de productos deben confirmarse con el departamento de seguros de cada estado.</p>
        </aside>
      </section>

      <section className={a.officeSection}>
        <div><span className={a.eyebrow}>OFICINA Y CONTACTO</span><h2>Una conversación<br /><em>cerca de ti.</em></h2></div>
        <div className={a.officeCard}>
          <Building2 size={27} />
          <div><strong>{agent.officeName}</strong><address>{agent.address.street}<br />{agent.address.locality}, {agent.address.region} {agent.address.postalCode}</address></div>
          <div className={a.officeLinks}><a href={`tel:${agent.phone.href}`}>{agent.phone.label}</a><a href={`mailto:${healthEmail}`}>{healthEmail}</a><a href={mapUrl} target="_blank" rel="noopener noreferrer">Ver indicaciones <ArrowUpRight size={14} /></a></div>
        </div>
      </section>

      <section className={a.profileFaq} aria-labelledby="profile-faq-title"><div><span className={a.eyebrow}>RESPUESTAS DIRECTAS</span><h2 id="profile-faq-title">Antes de hablar<br />con Jesus.</h2></div><div>
        <details><summary>¿En qué estados tiene licencia?</summary><p>Licencia residente en {agent.residentState} y licencias no residentes en {agent.nonResidentStates.join(", ")}. La disponibilidad de productos varía según el estado.</p></details>
        <details><summary>¿En qué idiomas puede atenderme?</summary><p>Jesus ofrece orientación en español e inglés.</p></details>
        <details><summary>¿Puedo reunirme en persona?</summary><p>Puedes llamar para coordinar una visita en la oficina de Carrollton o solicitar orientación por teléfono o videollamada.</p></details>
      </div></section>
    </main>
    <SiteFooter editorial />
  </div>;
}
