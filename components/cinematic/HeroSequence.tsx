"use client";
import { useCallback } from "react";
import { CinematicCanvas } from "./CinematicCanvas";
import { familyForms } from "./drawing";
import { openingSequenceManifest } from "./manifests";
import type { CinematicCanvasProps } from "./types";

export function HeroSequence({ progressRoot }: Pick<CinematicCanvasProps, "progressRoot">) {
  const render = useCallback((frame: Parameters<typeof familyForms>[0]) => familyForms(frame), []);
  return <CinematicCanvas className="h-full" ariaLabel="Una familia se reúne dentro de una estructura protectora" manifest={openingSequenceManifest} progressRoot={progressRoot} render={render} />;
}
