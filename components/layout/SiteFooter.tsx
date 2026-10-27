import { Instagram } from "lucide-react";
import { instagramProfileUrl } from "@/lib/config/site";
import f from "./site-footer.module.css";
import { Logo } from "../Logo";
import { officeAddressLines, officeHours, phones } from "@/lib/config/contact";
import { companyRoutes, legalRoutes, portalRoutes } from "@/lib/config/routes";

/** Shared footer for every route. Carries the office details and portal map. */
export function SiteFooter({ editorial = false }: { editorial?: boolean }) {
  if (editorial) return <footer className={f.footer}><div className={f.inner}><div className={f.brand}><Logo light width={180} /><p>Te ayudamos a entender tus opciones de cobertura y comparar alternativas según tus necesidades.</p><span>Una alianza contigo.</span><a className={f.social} href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="Alleanza en Instagram"><Instagram size={18} aria-hidden="true" /></a></div><div className={f.columns}><div><h2>Oficina</h2><address>{officeAddressLines.map(line => <span key={line}>{line}</span>)}</address><h2>Horario</h2><dl>{officeHours.map(entry => <div key={entry.days}><dt>{entry.days}</dt><dd>{entry.hours}</dd></div>)}</dl></div><div><h2>Hablemos</h2>{phones.map(phone => <a key={phone.href} href={`tel:${phone.href}`}>{phone.label}</a>)}</div><nav aria-label="Explora Alleanza"><h2>Explora</h2>{portalRoutes.map(route => <a key={route.id} href={route.href} {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{route.label}{route.external ? " ↗" : ""}</a>)}{companyRoutes.map(route => <a key={route.href} href={route.href}>{route.label}</a>)}</nav></div><div className={f.legal}><p>© {new Date().getFullYear()} Alleanza Insurance Corp.</p><nav aria-label="Información legal">{legalRoutes.map(route => <a key={route.href} href={route.href}>{route.label}</a>)}</nav></div><p className={f.note}>Alleanza Insurance Corp. es una agencia independiente. Las pólizas y coberturas las emiten las compañías aseguradoras correspondientes; están sujetas a disponibilidad, elegibilidad, términos y condiciones.</p></div></footer>;
  return (
    <footer className="bg-navy px-5 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light width={200} />
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/40">
              Alleanza Insurance Corp. orienta a familias para entender, comparar y acceder a opciones de
              seguro de salud, vida y protección complementaria. Las pólizas las emiten las compañías
              aseguradoras correspondientes; su disponibilidad varía según el estado y la compañía.
            </p>
            <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="Alleanza en Instagram" className="mt-6 grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition hover:border-cyan hover:text-cyan">
              <Instagram size={18} aria-hidden="true" />
            </a>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[.2em] text-cyan">Oficina</h2>
            <address className="mt-4 text-xs not-italic leading-relaxed text-white/55">
              {officeAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-[.2em] text-cyan">Horario</h2>
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
            <h2 className="text-[11px] font-semibold uppercase tracking-[.2em] text-cyan">Teléfonos</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/55">
              {phones.map((phone) => (
                <li key={phone.href}>
                  <a href={`tel:${phone.href}`} className="underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
                    {phone.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[.2em] text-cyan">Alleanza</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/55">
              {portalRoutes.map((route) => (
                <li key={route.id}>
                  <a
                    href={route.href}
                    className="transition hover:text-white"
                    {...(route.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {route.label}{route.external ? " ↗" : ""}
                  </a>
                </li>
              ))}
              {companyRoutes.map((route) => (
                <li key={route.href}>
                  <a href={route.href} className="transition hover:text-white">
                    {route.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Alleanza Insurance Corp.</p>
          <div className="flex flex-wrap gap-6">
            {legalRoutes.map((route) => (
              <a key={route.href} href={route.href} className="transition hover:text-white">
                {route.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
