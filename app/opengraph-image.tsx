import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Alleanza Insurance — Que la vida siga. Nosotros protegemos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const brandRoot = path.join(process.cwd(), "public");

export default async function OpengraphImage() {
  // Official white lockup on azul marino — a sanctioned combination, with the
  // artwork used unmodified and the descriptor intact.
  // satori cannot parse the variable font, so the card uses static Inter
  // instances subsetted to the glyphs it renders (see docs/brand/README.md).
  const [logo, interRegular, interBold] = await Promise.all([
    readFile(path.join(brandRoot, "brand/alleanza/logo-light-horizontal.svg")),
    readFile(path.join(brandRoot, "fonts/Inter-Regular-og.ttf")),
    readFile(path.join(brandRoot, "fonts/Inter-Bold-og.ttf")),
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
          <div style={{ color: "#FFFFFF", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Que la vida siga.
          </div>
          <div style={{ color: "#04C0FE", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Nosotros protegemos.
          </div>
          <div style={{ color: "rgba(255,255,255,.65)", fontSize: 27, marginTop: 28, fontWeight: 400 }}>
            Salud, vida y protección complementaria para tu familia en Texas.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}
