"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";
import type { GalleryImage } from "@/lib/gallery/types";
import { canOptimize } from "@/lib/images";

type Props = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/**
 * Full-screen viewer (spec sections 23, 24, 41). Handles all three media
 * types: photos render as before; video and audio get a native HTML5 player
 * with the browser's own controls.
 *
 * Keyboard: Escape closes, Left/Right navigate (unless a video/audio element
 * has focus, in which case the browser's own seek-by-arrow-key behaviour
 * takes priority - navigating the gallery out from under someone scrubbing a
 * video would be jarring).
 * Touch:    horizontal drag past 80px moves to the previous/next photo. Drag
 *           navigation is disabled on video/audio so a scrub gesture on the
 *           native controls is never mistaken for a swipe.
 * Focus is trapped to the dialog and returned to the trigger on close.
 */
export function GalleryLightbox({ images, index, onClose, onIndexChange }: Props) {
  const open = index !== null;
  const image = open ? images[index] : null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const goPrevious = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  /* Keyboard control + focus management */
  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      const onMediaElement =
        document.activeElement?.tagName === "VIDEO" || document.activeElement?.tagName === "AUDIO";

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft" && !onMediaElement) {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight" && !onMediaElement) {
        event.preventDefault();
        goNext();
      } else if (event.key === "Tab") {
        // Simple focus trap across the dialog's own controls.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose, goPrevious, goNext]);

  const dragEnabled = images.length > 1 && image?.media_type === "image";

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE.precise }}
          className="fixed inset-0 z-[95] flex flex-col bg-navy-950/95 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <p className="numeric text-xs text-white/50">
              {index + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
            {images.length > 1 && (
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous item"
                className="absolute left-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}

            <motion.div
              key={image.id}
              drag={dragEnabled ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) goNext();
                else if (info.offset.x > 80) goPrevious();
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE.outQuint }}
              className={`relative flex max-h-full w-full max-w-5xl items-center justify-center ${
                dragEnabled ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              {image.media_type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={image.id}
                  src={image.image_url}
                  poster={image.thumb_url}
                  controls
                  playsInline
                  className="max-h-[62vh] w-auto rounded-lg bg-black sm:max-h-[68vh]"
                />
              ) : image.media_type === "audio" ? (
                <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
                  <div className="relative w-full max-w-[280px] overflow-hidden rounded-xl">
                    <Image
                      src={image.thumb_url}
                      alt=""
                      width={640}
                      height={480}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio key={image.id} src={image.image_url} controls className="mt-6 w-full" />
                </div>
              ) : (
                <Image
                  src={image.image_url}
                  alt={image.title}
                  width={image.width || 1600}
                  height={image.height || 1200}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  unoptimized={!canOptimize(image.image_url)}
                  className="max-h-[62vh] w-auto rounded-lg object-contain sm:max-h-[68vh]"
                />
              )}
            </motion.div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next item"
                className="absolute right-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>

          {/* Caption */}
          <motion.div
            key={`caption-${image.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE.outQuint, delay: 0.08 }}
            className="shrink-0 px-4 pb-8 pt-5 text-center sm:px-6"
          >
            <p className="eyebrow text-[10px] text-royal-300">{image.category}</p>
            <h2 className="mx-auto mt-2 max-w-2xl text-lg font-bold !text-white sm:text-xl">
              {image.title}
            </h2>
            {image.description && (
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                {image.description}
              </p>
            )}
            {images.length > 1 && (
              <p className="mt-4 hidden text-[11px] text-white/30 sm:block">
                Use the arrow keys to browse &middot; Esc to close
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
