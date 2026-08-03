import type { CinematicRenderContext } from "./types";

export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const phase = (p: number, start: number, end: number) => clamp((p - start) / (end - start));

export function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha = 1) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
  glow.addColorStop(0, `rgba(107,220,255,${alpha})`);
  glow.addColorStop(.22, `rgba(4,192,254,${alpha * .7})`);
  glow.addColorStop(1, "rgba(4,192,254,0)");
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, radius * 3, 0, Math.PI * 2); ctx.fill();
}

export function familyForms({ ctx, width, height, progress, time, mobile }: CinematicRenderContext, reconnect = false) {
  const cx = width * .55, cy = height * .5;
  const interruption = Math.sin(phase(progress, .2, .43) * Math.PI);
  const protectedBy = phase(progress, .48, .78);
  const settle = phase(progress, .76, 1);
  const count = mobile ? 3 : 5;
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const separation = interruption * (30 + i * 9) * (reconnect ? .4 : 1);
    const r = Math.min(width, height) * (.13 + (i % 2) * .035) + separation * (settle ? 1 - settle : 1);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    glowDot(ctx, x, y, mobile ? 6 : 8, .72);
    ctx.strokeStyle = `rgba(205,239,250,${.18 + settle * .2})`;
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
  }
  const pulse = 1 + Math.sin(time * 2.2) * .04 + interruption * .16;
  ctx.fillStyle = "rgba(237,249,252,.92)"; ctx.beginPath(); ctx.ellipse(cx, cy, 38 * pulse, 50 * pulse, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(4,192,254,.7)"; ctx.beginPath(); ctx.arc(cx, cy - 54, 23 * pulse, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = `rgba(4,192,254,${.08 + protectedBy * .7})`; ctx.lineWidth = 2 + protectedBy * 3;
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(width, height) * (.25 + settle * .02), -.75 * Math.PI, .75 * Math.PI); ctx.stroke();
  ctx.strokeStyle = `rgba(170,233,252,${protectedBy * .25})`; ctx.lineWidth = 18;
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(width, height) * .29, -.7 * Math.PI, .7 * Math.PI); ctx.stroke();
}
