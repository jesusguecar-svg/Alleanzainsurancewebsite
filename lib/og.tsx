import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const publicDir = path.join(process.cwd(), "public");

/**
 * Shared social card. Official white lockup on azul marino — a sanctioned
 * combination, artwork unmodified, descriptor intact.
 *
 * satori cannot parse the variable font, so the card uses static Inter
 * instances subsetted to the glyphs it renders (see docs/brand/README.md).
 */
export async function renderOgCard({
  headline,
  accent,
  subtitle,
}: {
  headline: string;
  accent: string;
  subtitle: string;
}) {
  const [logo, interRegular, interBold] = await Promise.all([
    readFile(path.join(publicDir, "brand/alleanza/logo-light-horizontal.svg")),
    readFile(path.join(publicDir, "fonts/Inter-Regular-og.ttf")),
    readFile(path.join(publicDir, "fonts/Inter-Bold-og.ttf")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#061431",
          padding: "72px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori renders a plain img */}
        <img src={logoSrc} width={420} height={68} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#FFFFFF", fontSize: 68, fontWeight: 700, lineHeight: 1.06 }}>
            {headline}
          </div>
          <div style={{ color: "#04C0FE", fontSize: 68, fontWeight: 700, lineHeight: 1.06 }}>
            {accent}
          </div>
          <div style={{ color: "rgba(255,255,255,.65)", fontSize: 26, marginTop: 26, fontWeight: 400 }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}
