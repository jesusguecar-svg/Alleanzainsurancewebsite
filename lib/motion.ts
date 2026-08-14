"use client";

import { useReducedMotion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

type RevealOptions = {
  /** Distance travelled on the way in, in pixels. */
  y?: number;
  duration?: number;
  /** Starting scale, when the reveal should also grow into place. */
  scale?: number;
};

/**
 * Scroll-reveal props that respect `prefers-reduced-motion`.
 *
 * The reduced-motion branch must state the *visible* values explicitly rather
 * than only `initial: false`.
 *
 * During server rendering `useReducedMotion()` reports null, so the animated
 * branch is what gets rendered and framer inlines `style="opacity:0"` on the
 * element. If the client then resolves to reduced motion and the props carry
 * no `animate` target, framer has nothing to resolve that inline style to and
 * the element stays at opacity 0 forever — leaving whole sections invisible
 * for precisely the people who asked for less motion. Giving the branch an
 * explicit `animate` target clears the inlined value on hydration, and
 * `initial: false` keeps it from animating on the way there.
 */
export function useReveal(options?: RevealOptions) {
  const reduceMotion = useReducedMotion();
  const y = options?.y ?? 50;
  const duration = options?.duration ?? 0.9;
  const scale = options?.scale;
  const target = { opacity: 1, y: 0, ...(scale === undefined ? {} : { scale: 1 }) };

  if (reduceMotion) {
    return { initial: false as const, animate: target };
  }

  return {
    initial: { opacity: 0, y, ...(scale === undefined ? {} : { scale }) },
    whileInView: target,
    viewport: { once: true, margin: "-80px" },
    transition: { duration, ease },
  };
}

/**
 * Entrance props for above-the-fold elements that animate on mount rather than
 * on scroll. Same reasoning as `useReveal` for the reduced-motion branch.
 */
export function useEntrance(initial: { opacity?: number; y?: number; scale?: number }) {
  const reduceMotion = useReducedMotion();
  const target = { opacity: 1, y: 0, ...(initial.scale === undefined ? {} : { scale: 1 }) };

  if (reduceMotion) {
    return { initial: false as const, animate: target };
  }

  return { initial, animate: target };
}
