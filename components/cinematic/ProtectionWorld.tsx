"use client";
import { useCallback } from "react";
import { CinematicCanvas } from "./CinematicCanvas";
import { glowDot } from "./drawing";
import type { CinematicRenderContext } from "./types";

export type ProtectionState = "cancer" | "cardiac" | "intensive";

export function ProtectionWorld({ state }: { state: ProtectionState }) {
  const render = useCallback(({ ctx, width, height, time, mobile }: CinematicRenderContext) => {
    const cx = width / 2, cy = height / 2, count = mobile ? 12 : 22;
    if (state === "cancer") for (let i = 0; i < count; i++) { const a = i * 2.399 + time * .05; const r = 18 + (i % 6) * 10; glowDot(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.4 + i % 3, .45); }
    if (state === "cardiac") { ctx.strokeStyle = "rgba(4,192,254,.9)"; ctx.lineWidth = 4; ctx.shadowBlur = 18; ctx.shadowColor = "#04c0fe"; ctx.beginPath(); for (let x = 12; x < width - 12; x += 3) { const n = x / width; const y = cy + Math.sin(n * Math.PI * 4 + time) * 3 - Math.exp(-Math.pow((n - .5) * 10, 2)) * Math.sin((n - .5) * 35) * 38; x === 12 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); } ctx.stroke(); ctx.shadowBlur = 0; }
    if (state === "intensive") { for (let i = 0; i < 4; i++) { const inset = 14 + i * 13; ctx.strokeStyle = `rgba(4,192,254,${.75 - i * .13})`; ctx.lineWidth = 2; ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2); } glowDot(ctx,cx,cy,8,.7); }
  }, [state]);
  return <CinematicCanvas className="h-40 w-full" ariaLabel={state === "cancer" ? "Células luminosas en equilibrio" : state === "cardiac" ? "Pulso cardíaco escultórico" : "Recinto arquitectónico protector"} render={render} />;
}
