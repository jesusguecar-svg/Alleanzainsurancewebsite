import { academyUrl } from "./contact";

/**
 * The portal's spokes. `/` is the hub; each entry below is a destination card
 * on it and a route in the app.
 */
export type PortalRoute = {
  id: "health" | "life" | "property-casualty" | "academy" | "work";
  href: string;
  /** Short label for navigation. */
  label: string;
  /** Card title on the portal hub. */
  title: string;
  /** One-line promise shown on the card. */
  description: string;
  /** True when the destination leaves the site. */
  external?: boolean;
  /** False while the route is still a branded shell rather than a full page. */
  complete: boolean;
};

export const portalRoutes: PortalRoute[] = [
  {
    id: "health",
    href: "/health",
    label: "Salud",
    title: "Health",
    description: "Seguros de salud, ACA y protección complementaria.",
    complete: true,
  },
  {
    id: "life",
    href: "/life",
    label: "Vida",
    title: "Life",
    description: "Protección financiera para tu familia.",
    complete: false,
  },
  {
    id: "property-casualty",
    href: "/property-casualty",
    label: "Propiedad",
    title: "P&C",
    description: "Cobertura para propiedad y riesgos cotidianos.",
    complete: false,
  },
  {
    id: "academy",
    href: "/academy",
    label: "Academia",
    title: "Academy",
    description: "Formación y recursos para crecer.",
    complete: false,
  },
  {
    id: "work",
    href: "/work",
    label: "Trabajo",
    title: "Work",
    description: "Una carrera con acompañamiento y oportunidad.",
    complete: true,
  },
];

export const academyExternalUrl = academyUrl;

/** Navigation shown in the header on every route except the health landing. */
export const portalNavLinks = portalRoutes.map(({ href, label }) => ({ href, label }));
