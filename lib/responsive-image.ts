import { getImageProps } from "next/image";

/**
 * Props for a plain <img> served through the Next.js image optimizer: AVIF/WebP, a srcset sized to
 * the layout, lazy loading unless `priority`. Keeps the element, class names and CSS of the
 * existing markup, so the layout does not change; only the bytes do.
 *
 * `priority` is for the one above-the-fold image that is the page's LCP: eager, fetchpriority=high.
 */
export function responsiveImg({
  src,
  width,
  height,
  sizes,
  alt,
  quality = 75,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  sizes: string;
  alt: string;
  quality?: 60 | 75;
  priority?: boolean;
}) {
  // getImageProps does not add fetchpriority for `priority` (only <Image> does), so it is set here.
  const { props } = getImageProps({ src, width, height, sizes, alt, quality, priority, loading: priority ? "eager" : "lazy", fetchPriority: priority ? "high" : undefined });
  // getImageProps adds an inline style (color: transparent) that fights some existing CSS; the
  // components keep their own styles.
  const { style: _style, ...rest } = props;
  return rest;
}

/**
 * Optimizer URL for an image used where srcset is not available (an SVG <image href>), at the
 * image's own width: AVIF/WebP by content negotiation, never upscaled.
 */
export function optimizedSrc(src: string, width: number, height: number, quality: 60 | 75 = 75) {
  return getImageProps({ src, width, height, quality, alt: "" }).props.src;
}
