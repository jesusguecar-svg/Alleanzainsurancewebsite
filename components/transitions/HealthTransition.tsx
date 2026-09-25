"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/** A persistent photographic bridge across the existing App Router routes. */
export function HealthTransition() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    router.prefetch("/health");
    let overlay: HTMLDivElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function enter(event: MouseEvent) {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href="/health"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const card = document.querySelector<HTMLElement>('.gallery-card[data-active="true"][href="/health"]');
      if (!card) return;
      event.preventDefault();
      if (overlay) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push("/health"); return; }
      const rect = card.getBoundingClientRect();
      overlay = document.createElement("div");
      overlay.className = "health-route-bridge";
      overlay.setAttribute("aria-hidden", "true");
      const photo = document.createElement("div");
      photo.className = "health-route-photo";
      const original = card.querySelector("video, img");
      if (original) {
        const clone = original.cloneNode(true) as HTMLVideoElement | HTMLImageElement;
        if (original instanceof HTMLVideoElement && clone instanceof HTMLVideoElement) {
          clone.currentTime = original.currentTime; clone.muted = true;
          void clone.play().catch(() => undefined);
        }
        photo.append(clone);
      }
      const label = document.createElement("span");
      label.className = "health-route-label";
      label.textContent = "Salud";
      photo.append(label); overlay.append(photo); document.body.append(overlay);
      document.documentElement.classList.add("entering-health");
      photo.animate([
        { transform: `translate(${rect.left}px,${rect.top}px) scale(${rect.width / innerWidth},${rect.height / innerHeight})`, borderRadius: "24px" },
        { transform: "translate(0,0) scale(1)", borderRadius: "0" },
      ], { duration: 800, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      // Keep the bridge mounted until the destination has actually committed.
      overlay.dataset.started = String(performance.now());
      router.push("/health");
      timer = setTimeout(() => { overlay?.remove(); document.documentElement.classList.remove("entering-health"); }, 10000);
    }
    document.addEventListener("click", enter);
    return () => { document.removeEventListener("click", enter); if (timer) clearTimeout(timer); };
  }, [pathname, router]);
  useEffect(() => {
    if (pathname !== "/health") return;
    const bridge = document.querySelector<HTMLElement>(".health-route-bridge");
    if (!bridge) return;
    const timer = setTimeout(() => {
      const animation = bridge.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      void animation.finished.then(() => { bridge.remove(); document.documentElement.classList.remove("entering-health"); });
    }, Math.max(0, 560 - (performance.now() - Number(bridge.dataset.started))));
    return () => { clearTimeout(timer); bridge.remove(); document.documentElement.classList.remove("entering-health"); };
  }, [pathname]);
  return null;
}
