import { ImageResponse } from "next/og";

export const alt = "Alleanza Insurance — Que la vida siga. Nosotros protegemos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg width="52" height="64" viewBox="0 0 39 48">
            <path d="M3 7C13 8 19 13 20 23C11 22 5 17 3 7Z" fill="#04c0fe" />
            <path d="M36 3C24 7 18 15 20 28C31 24 36 16 36 3Z" fill="#ffffff" />
            <path d="M7 25C13 27 18 32 19 43C10 39 6 33 7 25Z" fill="#04c0fe" opacity=".7" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 800, letterSpacing: "0.22em" }}>
              ALLEANZA
            </div>
            <div style={{ color: "#04c0fe", fontSize: 16, fontWeight: 700, letterSpacing: "0.42em" }}>
              INSURANCE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ffffff", fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            Que la vida siga.
          </div>
          <div style={{ color: "#04c0fe", fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            Nosotros protegemos.
          </div>
          <div style={{ color: "rgba(255,255,255,.62)", fontSize: 28, marginTop: 28 }}>
            Protección complementaria para familias hispanas en Texas.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
