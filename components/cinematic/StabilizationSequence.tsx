"use client";
import { useCallback } from "react";
import { CinematicCanvas } from "./CinematicCanvas";
import { familyForms } from "./drawing";
import { stabilizationSequenceManifest } from "./manifests";

export function StabilizationSequence() {
  const render = useCallback((frame: Parameters<typeof familyForms>[0]) => familyForms({ ...frame, progress: .95 }, true), []);
  return <CinematicCanvas className="h-full" ariaLabel="La familia vuelve a conectarse alrededor de lo vivido" manifest={stabilizationSequenceManifest} render={render} />;
}
