import { Logo } from "../Logo";
import { academyUrl, officeAddressLines, officeHours, phones } from "@/lib/config/contact";
import { portalRoutes } from "@/lib/config/routes";

/** Shared footer for every route. Carries the office details and portal map. */
export function SiteFooter() {
  return (
    <footer className="bg-navy px-5 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light width={200} />
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/40">
              Alleanza Insurance acompaña a familias con opciones de seguro de salud, de vida y de
              protección complementaria. La disponibilidad de productos puede variar según el estado
              y la compañía aseguradora.
            </p>
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
                  <a href={route.href} className="transition hover:text-white">{route.label}</a>
                </li>
              ))}
              <li>
                <a href={academyUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  Academia Alleanza ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Alleanza Insurance</p>
          <div className="flex flex-wrap gap-6">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Licencias</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
