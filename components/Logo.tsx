/**
 * Official Alleanza Insurance lockup.
 *
 * Brand rules this component enforces (brandbook pp. 6-11):
 * - The horizontal lockup is the primary application and keeps the
 *   "Health & Life Insurance" descriptor. Removing the descriptor is listed
 *   as misuse, so the wordmark is never rendered without it.
 * - Colour version follows the background: the primary (cyan/navy) mark on
 *   light surfaces, the all-white mark on navy or other dark surfaces.
 * - Minimum legible size for the full lockup is 120px wide; the symbol alone
 *   is the sanctioned fallback below that, at a 64px minimum.
 * - The artwork is used unmodified — never recoloured, rotated or distorted.
 */

/** Intrinsic aspect ratios of the official SVGs. */
const HORIZONTAL_RATIO = 2162.07 / 350;
const ICON_RATIO = 551 / 477.18;

type LogoProps = {
  /** Use the white version, for navy and other dark backgrounds. */
  light?: boolean;
  /** Rendered width in px. Full lockup must stay at or above 120. */
  width?: number;
  className?: string;
};

export function Logo({ light = false, width = 190, className = "" }: LogoProps) {
  const src = light
    ? "/brand/alleanza/logo-light-horizontal.svg"
    : "/brand/alleanza/logo-primary-horizontal.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no optimisation wanted
    <img
      src={src}
      alt="Alleanza Insurance — Health & Life Insurance"
      width={width}
      height={Math.round(width / HORIZONTAL_RATIO)}
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}

/** The symbol on its own, for tight spaces where the lockup would fall below 120px. */
export function LogoMark({ light = false, size = 64, className = "" }: { light?: boolean; size?: number; className?: string }) {
  const src = light
    ? "/brand/alleanza/logo-light-icon.svg"
    : "/brand/alleanza/logo-primary-icon.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no optimisation wanted
    <img
      src={src}
      alt="Alleanza Insurance"
      width={size}
      height={Math.round(size / ICON_RATIO)}
      className={className}
      style={{ width: size, height: "auto" }}
    />
  );
}
