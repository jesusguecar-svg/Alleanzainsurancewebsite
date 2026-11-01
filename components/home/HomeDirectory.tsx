import { legalName, officeAddressLines, officeHours, publicContactLines } from "@/lib/config/contact";
import { companyRoutes } from "@/lib/config/routes";
import { agencySummary, portalGallery } from "@/lib/content/portal-gallery";

/** Crawlable text and links below the home gallery. Copy comes from the gallery and the footer. */
export function HomeDirectory() {
  return (
    <section className="home-directory" aria-labelledby="home-directory-title" data-cta-location="home_directory">
      <div className="home-directory-inner">
        <div>
          <h2 id="home-directory-title">Seis formas de orientarte</h2>
          <p className="home-directory-summary">{agencySummary}</p>
          <ul className="home-directory-lines">
            {portalGallery.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(item.track ? { "data-cta": item.track.cta, "data-product-line": item.track.line } : {})}
                >
                  <span>{item.kicker}</span>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="home-directory-details">
          <div>
            <h3>Oficina</h3>
            <address>
              <span>{legalName}</span>
              {officeAddressLines.map((line) => <span key={line}>{line}</span>)}
            </address>
          </div>
          <div>
            <h3>Horario</h3>
            <dl>
              {officeHours.map((entry) => <div key={entry.days}><dt>{entry.days}:</dt><dd>{entry.hours}</dd></div>)}
            </dl>
          </div>
          <div>
            <h3>Contacto</h3>
            <ul>
              {publicContactLines.map((line) => (
                <li key={line.id}>
                  <a href={line.href} {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{line.label}: {line.display}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Alleanza</h3>
            <ul>
              {/* TODO-COPY: no approved short label exists for the agent directory. */}
              <li><a href="/agentes">Agentes</a></li>
              {companyRoutes.map((route) => <li key={route.href}><a href={route.href}>{route.label}</a></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
