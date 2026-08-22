"use client";

import type { ResolvedMedia } from "@/lib/media";

/**
 * Renders a media slot, or a branded placeholder when the file is not present.
 *
 * Availability is decided on the server (see lib/media.ts), so this never
 * requests a file that does not exist. The placeholder keeps the layout stable
 * so pages look finished before the media lands.
 */
export function MediaSlot({
  media,
  className = "",
  /** Shown inside the placeholder so it is obvious what belongs here. */
  label,
  priority = false,
}: {
  media: ResolvedMedia;
  className?: string;
  label?: string;
  priority?: boolean;
}) {
  if (media.video) {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        poster={media.image ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        aria-label={media.description}
      >
        <source src={media.video} />
      </video>
    );
  }

  if (media.image) {
    // eslint-disable-next-line @next/next/no-img-element -- local asset, sized by its container
    return (
      <img
        src={media.image}
        alt={media.description}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={media.description}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-navy/[.06] to-cyan/[.08] ${className}`}
    >
      <div className="max-w-xs px-6 text-center">
        <div className="mx-auto mb-3 h-9 w-9 rounded-xl border border-navy/15 bg-white/70" aria-hidden="true" />
        <p className="text-[11px] font-medium leading-relaxed text-navy/45">{label ?? media.description}</p>
      </div>
    </div>
  );
}
