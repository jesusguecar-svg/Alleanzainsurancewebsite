import type { MutableRefObject } from "react";

export type SequenceAsset = {
  src: string;
  at: number;
  alt: string;
};

export type SequenceManifest = {
  id: string;
  frames: readonly SequenceAsset[];
  fallback?: string;
};

export type CinematicRenderContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  progress: number;
  time: number;
  mobile: boolean;
};

export type CinematicCanvasProps = {
  ariaLabel: string;
  className?: string;
  manifest?: SequenceManifest;
  render: (frame: CinematicRenderContext) => void;
  progressRoot?: MutableRefObject<HTMLElement | null>;
};
