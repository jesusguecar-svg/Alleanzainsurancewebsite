import { Logo } from "@/components/Logo";
import { officeAddressLines, phones } from "@/lib/config/contact";
import { legalRoutes, portalRoutes } from "@/lib/config/routes";
import f from "@/components/layout/site-footer.module.css";

export function EnglishAgentFooter() {
  const routeLabels: Record<string, string> = { health: "Health", life: "Life", "property-casualty": "Property", academy: "Academy", work: "Careers", employers: "Employers" };
  return <footer className={f.footer} lang="en"><div className={f.inner}>
    <div className={f.brand}><Logo light width={180} /><p>We help you understand your coverage options and compare alternatives based on your needs.</p><span>An alliance with you.</span></div>
    <div className={f.columns}>
      <div><h2>Office</h2><address>{officeAddressLines.map((line) => <span key={line}>{line}</span>)}</address><h2>Hours</h2><dl><div><dt>Monday–Friday</dt><dd>8:00 AM–7:00 PM</dd></div><div><dt>Saturday</dt><dd>10:00 AM–5:00 PM</dd></div></dl></div>
      <div><h2>Contact</h2>{phones.map((phone) => <a key={phone.href} href={`tel:${phone.href}`}>{phone.label}</a>)}</div>
      <nav aria-label="Explore Alleanza"><h2>Explore</h2>{portalRoutes.map((route) => <a key={route.id} href={route.href} {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{routeLabels[route.id]}{route.external ? " ↗" : ""}</a>)}</nav>
    </div>
    <div className={f.legal}><p>© {new Date().getFullYear()} Alleanza Insurance Corp.</p><nav aria-label="Legal information">{legalRoutes.map((route) => <a key={route.href} href={route.href}>{route.labelEn}</a>)}</nav></div>
    <p className={f.note}>Alleanza Insurance Corp. is an independent insurance agency. Policies and coverage are issued by the applicable insurance companies and remain subject to availability, eligibility, terms, and conditions.</p>
  </div></footer>;
}
