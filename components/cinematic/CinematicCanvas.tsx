"use client";

import { useEffect, useRef, useState } from "react";
import { StaticCinematicFallback } from "./StaticCinematicFallback";
import type { CinematicCanvasProps } from "./types";

export function CinematicCanvas({ ariaLabel, className = "", manifest, progressRoot, render }: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia("(min-width: 480px) and (prefers-reduced-motion: no-preference)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setMounted(entry.isIntersecting), { rootMargin: "160px 0px" });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let active = true;
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time: number) => {
      if (!active) return;
      const rect = (progressRoot?.current ?? canvas).getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = progressRoot ? Math.min(1, Math.max(0, -rect.top / travel)) : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const bounds = canvas.getBoundingClientRect();
      context.clearRect(0, 0, bounds.width, bounds.height);
      render({ ctx: context, width: bounds.width, height: bounds.height, progress, time: time / 1000, mobile });
      frameRef.current = requestAnimationFrame(draw);
    };
    size();
    window.addEventListener("resize", size, { passive: true });
    frameRef.current = requestAnimationFrame(draw);
    return () => { active = false; cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", size); };
  }, [mounted, progressRoot, render]);

  return (
    <div className={`relative ${className}`} data-sequence={manifest?.id}>
      {!mounted && <StaticCinematicFallback className="absolute inset-0" />}
      <canvas ref={canvasRef} className="h-full w-full" role="img" aria-label={ariaLabel} />
    </div>
  );
}
