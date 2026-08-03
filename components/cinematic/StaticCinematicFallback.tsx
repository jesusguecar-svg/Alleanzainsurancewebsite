type Props = { className?: string; variant?: "family" | "cells" | "pulse" | "enclosure" | "reconnect" };

export function StaticCinematicFallback({ className = "", variant = "family" }: Props) {
  return (
    <div className={`cinematic-fallback cinematic-fallback--${variant} ${className}`} aria-hidden="true">
      <span className="cinematic-orbit cinematic-orbit--one" />
      <span className="cinematic-orbit cinematic-orbit--two" />
      <span className="cinematic-core" />
    </div>
  );
}
