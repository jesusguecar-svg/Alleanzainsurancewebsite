import { trackCtaClick, trackPhoneClick, trackWhatsAppClick, type ProductLine } from "./index";

/**
 * One delegated listener instead of handlers on every link:
 *  - any `tel:` link → phone_click; any WhatsApp link → whatsapp_click;
 *  - links marked `data-cta="<name>"` → cta_click (optionally `data-product-line`).
 * Location comes from the nearest `data-cta-location`, else the enclosing header/footer or
 * section id. Only clicks on visible links count: no hover, scroll, gallery movement or plain
 * buttons. Links inside aria-hidden content (the homepage's inactive gallery cards, where a click
 * only rotates the gallery) are skipped.
 */
function locationOf(link: Element) {
  const marked = link.closest<HTMLElement>("[data-cta-location]")?.dataset.ctaLocation;
  if (marked) return marked;
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  const section = link.closest("section[id]")?.id;
  return section ? `section_${section.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}` : "page";
}

function handleClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement) || link.closest('[aria-hidden="true"]')) return;
  const href = link.getAttribute("href") ?? "";
  const location = locationOf(link);
  if (href.startsWith("tel:")) return trackPhoneClick(location);
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return trackWhatsAppClick(location);
  const name = link.dataset.cta;
  if (name) trackCtaClick({ cta_name: name, cta_location: location, product_line: link.dataset.productLine as ProductLine | undefined });
}

export function installClickTracking() {
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}
