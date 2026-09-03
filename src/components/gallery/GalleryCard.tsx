"use client";

import Image from "next/image";
import { ArrowUpRight, Music, Play } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery/types";
import { canOptimize } from "@/lib/images";
import { formatDuration } from "@/lib/gallery/format";

/**
 * One tile in the public gallery.
 *
 * The grid loads the 640px WebP thumbnail for every media type - a photo
 * thumbnail, an extracted video poster frame, or the shared audio cover - so
 * this component never has to render a <video> or <audio> element itself; it
 * only needs to signal what opening the tile will do. Aspect ratio comes from
 * the stored width/height where known (photos, most videos) and falls back
 * to 4:3 for audio, which has none.
 */
export function GalleryCard({
  image,
  index,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ratio =
    image.width && image.height ? `${image.width} / ${image.height}` : "4 / 3";

  const ariaVerb =
    image.media_type === "video" ? "Play" : image.media_type === "audio" ? "Play" : "View";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      data-cursor="card"
      aria-label={`${ariaVerb} "${image.title}"`}
      className="group relative block w-full overflow-hidden rounded-xl bg-slate-2 text-left ring-1 ring-slate-3 transition-shadow duration-300 hover:shadow-e3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-500"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={image.thumb_url}
        alt={image.title}
        fill
        // Matches the responsive column counts below so the browser never
        // downloads a wider image than the slot actually needs.
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw"
        loading={index < 8 ? "eager" : "lazy"}
        unoptimized={!canOptimize(image.thumb_url)}
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      {/* Play affordance - persistent (not hover-only), so a video/audio tile reads as playable at rest */}
      {(image.media_type === "video" || image.media_type === "audio") && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-navy-950/55 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {image.media_type === "video" ? (
              <Play className="ml-0.5 size-6" fill="currentColor" strokeWidth={0} />
            ) : (
              <Music className="size-5" strokeWidth={2} />
            )}
          </span>
        </span>
      )}

      {/* Duration badge */}
      {image.duration_seconds !== null && (
        <span className="numeric absolute right-2.5 top-2.5 rounded-md bg-navy-950/70 px-1.5 py-0.5 text-[10px] text-white/90 backdrop-blur">
          {formatDuration(image.duration_seconds)}
        </span>
      )}

      {/* Overlay - fades in on hover, always present on touch via focus */}
      <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="eyebrow block text-[9px] text-royal-300">{image.category}</span>
        <span className="mt-1 flex items-end justify-between gap-3">
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-white">
            {image.title}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-white/80">
            {ariaVerb}
            <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
          </span>
        </span>
      </span>
    </button>
  );
}
