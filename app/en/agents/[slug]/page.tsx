import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Building2, Check, Languages, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { EnglishSiteFooter } from "@/components/layout/EnglishSiteFooter";
import { agents, getAgent } from "@/lib/content/agents";
import { healthEmail } from "@/lib/content/health";
import { siteUrl } from "@/lib/config/site";
import a from "../../../agentes/agents.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = getAgent((await params).slug);
  if (!agent) return {};
  const title = `${agent.fullName} | ${agent.titleEn} in ${agent.city}`;
  const description = `${agent.fullName}, ${agent.titleEn.toLocaleLowerCase("en")}. NPN ${agent.npn}. English and Spanish service from the ${agent.officeNameEn}.`;
  return {
    title,
    description,
    alternates: { canonical: `/en/agents/${agent.slug}`, languages: { "es-US": `/agentes/${agent.slug}`, "en-US": `/en/agents/${agent.slug}`, "x-default": `/agentes/${agent.slug}` } },
    openGraph: { type: "profile", title, description, url: `/en/agents/${agent.slug}`, locale: "en_US", images: [{ url: agent.image, alt: `Professional portrait of ${agent.fullName}` }] },
    twitter: { card: "summary", title, description, images: [agent.image] },
  };
}

export default async function EnglishAgentProfilePage({ params }: Props) {
  const agent = getAgent((await params).slug);
  if (!agent) notFound();
  const profileUrl = `${siteUrl}/en/agents/${agent.slug}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${agent.address.street}, ${agent.address.locality}, ${agent.address.region} ${agent.address.postalCode}`)}`;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: agent.fullName,
    url: profileUrl,
    image: `${siteUrl}${agent.image}`,
    jobTitle: agent.titleEn,
    description: agent.shortBioEn,
    knowsLanguage: ["English", "Spanish"],
    telephone: agent.phone.href,
    identifier: { "@type": "PropertyValue", name: "National Producer Number (NPN)", value: agent.npn },
    areaServed: agent.serviceStatesEn.map((name) => ({ "@type": "State", name })),
    worksFor: { "@type": "InsuranceAgency", name: "Alleanza Insurance Corp.", url: siteUrl },
    workLocation: {
      "@type": "Place",
      name: agent.officeNameEn,
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
      { "@type": "Question", name: `In which states is ${agent.fullName} licensed?`, acceptedAnswer: { "@type": "Answer", text: `${agent.fullName} reports a resident license in ${agent.residentState} and nonresident licenses in ${agent.nonResidentStatesEn.join(", ")}. Current status should be confirmed with the applicable regulator.` } },
      { "@type": "Question", name: `Which languages does ${agent.fullName} speak?`, acceptedAnswer: { "@type": "Answer", text: `${agent.fullName} serves clients in English and Spanish.` } },
      { "@type": "Question", name: `Where is ${agent.fullName}'s office?`, acceptedAnswer: { "@type": "Answer", text: `${agent.address.street}, ${agent.address.locality}, ${agent.address.region} ${agent.address.postalCode}.` } },
    ],
  };

  return <div className={a.page} lang="en">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
    <header className={a.header}><Link href="/"><Logo width={174} /></Link><nav><LanguageSwitch locale="en" spanishHref={`/agentes/${agent.slug}`} englishHref={`/en/agents/${agent.slug}`} className={a.languageSwitch} /><Link href="/en/agents"><ArrowLeft size={15} /> All agents</Link><a href={`tel:${agent.phone.href}`} className={a.headerCta}>Contact Jesus <ArrowUpRight size={15} /></a></nav></header>
    <main>
      <section className={a.profileHero}>
        <div className={a.profilePhoto}><Image src={agent.image} alt={`Professional portrait of ${agent.fullName}`} width={422} height={332} priority /><span><BadgeCheck size={16} /> Professional profile</span></div>
        <div className={a.profileIntro}>
          <span className={a.eyebrow}>{agent.officeNameEn} · ENGLISH / SPANISH</span>
          <h1>{agent.fullName}</h1>
          <p className={a.profileRole}>{agent.titleEn}<small>{agent.title}</small></p>
          <p className={a.profileLead}>{agent.shortBioEn}</p>
          <div className={a.profileActions}><a href={`tel:${agent.phone.href}`}><Phone size={17} /> Call {agent.phone.label}</a><a href={`mailto:${healthEmail}`}>Request guidance <ArrowUpRight size={17} /></a></div>
          <div className={a.trustStrip}><span><ShieldCheck size={17} /><strong>NPN {agent.npn}</strong><small>National identifier</small></span><span><Languages size={17} /><strong>Bilingual</strong><small>English and Spanish</small></span><span><MapPin size={17} /><strong>4 states</strong><small>Check availability</small></span></div>
        </div>
      </section>

      <section className={a.profileContent}>
        <div className={a.story}><span className={a.eyebrow}>MEET YOUR AGENT</span><h2>Clarity before<br />you decide.</h2>{agent.bioEn.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className={a.specialties}>{agent.specialtiesEn.map((specialty) => <span key={specialty}><Check size={14} /> {specialty}</span>)}</div></div>
        <aside className={a.credentials} aria-labelledby="credentials-title-en">
          <div className={a.credentialHeading}><span><ShieldCheck size={18} /></span><div><small>CREDENTIALS</small><h2 id="credentials-title-en">Verifiable information</h2></div></div>
          <dl><div><dt>Full name</dt><dd>{agent.fullName}</dd></div><div><dt>NPN</dt><dd>{agent.npn}</dd></div><div><dt>Resident license</dt><dd>{agent.residentState}</dd></div><div><dt>Nonresident licenses</dt><dd>{agent.nonResidentStatesEn.join(" · ")}</dd></div><div><dt>Languages</dt><dd>English · Spanish</dd></div></dl>
          <a className={a.verifyLink} href="https://nipr.com/licensing-center" target="_blank" rel="noopener noreferrer">Review information through NIPR <ArrowUpRight size={15} /></a>
          <p>An NPN is a national identifier. Current license status, authority, and product availability should be confirmed with each state insurance department.</p>
        </aside>
      </section>

      <section className={a.officeSection}><div><span className={a.eyebrow}>OFFICE AND CONTACT</span><h2>A conversation<br /><em>close to home.</em></h2></div><div className={a.officeCard}><Building2 size={27} /><div><strong>{agent.officeNameEn}</strong><address>{agent.address.street}<br />{agent.address.locality}, {agent.address.region} {agent.address.postalCode}</address></div><div className={a.officeLinks}><a href={`tel:${agent.phone.href}`}>{agent.phone.label}</a><a href={`mailto:${healthEmail}`}>{healthEmail}</a><a href={mapUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={14} /></a></div></div></section>

      <section className={a.profileFaq} aria-labelledby="profile-faq-title-en"><div><span className={a.eyebrow}>DIRECT ANSWERS</span><h2 id="profile-faq-title-en">Before you speak<br />with Jesus.</h2></div><div>
        <details><summary>In which states is he licensed?</summary><p>Resident license in {agent.residentState} and nonresident licenses in {agent.nonResidentStatesEn.join(", ")}. Product availability varies by state.</p></details>
        <details><summary>Which languages does he speak?</summary><p>Jesus provides guidance in English and Spanish.</p></details>
        <details><summary>Can I meet in person?</summary><p>Call to schedule a visit at the Carrollton office or request guidance by phone or video call.</p></details>
      </div></section>
    </main>
      <EnglishSiteFooter />
  </div>;
}
