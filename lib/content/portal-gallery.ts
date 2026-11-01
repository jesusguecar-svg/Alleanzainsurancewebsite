import { academyUrl } from "@/lib/config/contact";
import type { ProductLine } from "@/lib/analytics";

export type GalleryItem = { label: string; kicker: string; description: string; cta: string; href: string; src: string; secondarySrc?: string; kind?: "video"; position?: string; external?: boolean; track?: { cta: string; line: ProductLine } };

export const portalGallery: GalleryItem[] = [
  { label: "Salud", kicker: "Decide con claridad", description: "Compara opciones ACA, privadas y complementarias con orientación en español.", cta: "Explorar mis opciones", href: "/health", src: "/cinematic/gallery/media/salud.mp4", kind: "video", position: "50% 38%" , track: { cta: "home_health", line: "health" } },
  { label: "Vida", kicker: "Familia", description: "Conoce opciones de seguro de vida temporal, permanente y gastos finales.", cta: "Conocer opciones de vida", href: "/life", src: "/cinematic/gallery/media/vida.mp4", kind: "video", position: "50% 48%" , track: { cta: "home_life", line: "life" } },
  { label: "Propiedad", kicker: "Property & Casualty · Próximamente", description: "En desarrollo. Aún no disponible: estará sujeto a los requisitos de licencia y disponibilidad correspondientes.", cta: "Ver más", href: "/property-casualty", src: "/cinematic/gallery/media/propiedad.mp4", kind: "video" },
  { label: "Academia", kicker: "Formación", description: "Capacitación, herramientas y acompañamiento para agentes.", cta: "Aprender ahora", href: academyUrl, src: "/cinematic/gallery/media/academia.mp4", kind: "video", external: true , track: { cta: "home_academy", line: "academy" } },
  { label: "Trabajo", kicker: "Oportunidad", description: "Oportunidades profesionales para crecer con propósito.", cta: "Trabaja con nosotros", href: "/work", src: "/cinematic/gallery/media/oportunidad.mp4", kind: "video" , track: { cta: "home_work", line: "work" } },
  { label: "Empresas", kicker: "Beneficios", description: "Explora alternativas de beneficios complementarios para tu equipo.", cta: "Explorar beneficios", href: "/employers", src: "/cinematic/gallery/media/trabajo.png", position: "50% 48%" , track: { cta: "home_employers", line: "employer" } },
];

/** Agency description shown in the footer and the home directory. */
export const agencySummary =
  "Alleanza Insurance Corp. orienta a familias para entender, comparar y acceder a opciones de seguro de salud, vida y protección complementaria. Las pólizas las emiten las compañías aseguradoras correspondientes; su disponibilidad varía según el estado y la compañía.";
