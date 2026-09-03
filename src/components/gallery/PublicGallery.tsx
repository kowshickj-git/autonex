"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EASE } from "@/lib/motion";
import { fetchPublicGallery } from "@/lib/galleryService";
import type { GalleryImage } from "@/lib/gallery/types";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";
import { GalleryCard } from "./GalleryCard";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryLightbox } from "./GalleryLightbox";

/**
 * The public gallery.
 *
 * Fetches once and then filters in memory: the collection is a company
 * portfolio, not an infinite feed, so a round trip per chip press would be
 * slower and would make the filter animation stutter.
 */
export function PublicGallery({
  initialImages,
  /**
   * Whether the server fetch succeeded. An empty gallery and a failed fetch
   * both arrive as `initialImages: []`, and they need opposite treatment:
   * the first is a finished state to render, the second is worth retrying.
   */
  initialLoaded = true,
}: {
  initialImages: GalleryImage[];
  initialLoaded?: boolean;
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [loading, setLoading] = useState(!initialLoaded);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  /*
   * The page is server-rendered with its images already in place, so this
   * normally does nothing. It only runs when the server could not reach the
   * gallery store, giving the visitor a second chance from the browser.
   */
  useEffect(() => {
    if (initialLoaded) return;

    let cancelled = false;
    fetchPublicGallery()
      .then((result) => {
        if (!cancelled) setImages(result);
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialLoaded]);

  const categories = useMemo(() => {
    const present = new Set(images.map((image) => image.category));
    return ["All", ...Array.from(present).sort()];
  }, [images]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: images.length };
    for (const image of images) {
      result[image.category] = (result[image.category] ?? 0) + 1;
    }
    return result;
  }, [images]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return images.filter((image) => {
      const matchesCategory = category === "All" || image.category === category;
      const matchesSearch =
        !needle ||
        [image.title, image.description ?? "", image.category].some((field) =>
          field.toLowerCase().includes(needle),
        );
      return matchesCategory && matchesSearch;
    });
  }, [images, category, search]);

  /* ---------- Empty / loading / error states ---------- */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-5">
        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        <p className="mt-4 text-sm">Loading the gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-3">
        <p className="text-base font-semibold text-navy-900">The gallery is unavailable</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-6">{error}</p>
      </div>
    );
  }

  /*
   * Spec section 36: an empty gallery says so honestly. It never falls back
   * to stock photography - only photographs the administrator has uploaded
   * ever appear here.
   */
  if (images.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-20 text-center ring-1 ring-slate-3">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-2 text-slate-5">
          <ImageOff className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-xl font-bold text-navy-900">Our Gallery is Coming Soon</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-6">
          Photos and videos of our latest automation and engineering projects will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <GalleryFilters
        categories={categories}
        active={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        counts={counts}
      />

      <p className="mt-6 text-xs text-slate-5" aria-live="polite">
        Showing <span className="numeric">{filtered.length}</span> of{" "}
        <span className="numeric">{images.length}</span> items
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-3">
          <p className="text-sm font-semibold text-navy-900">Nothing matches that search</p>
          <p className="mt-2 text-sm text-slate-6">
            Try a different category, or clear the search box.
          </p>
        </div>
      ) : (
        /*
         * CSS columns give a true masonry layout without measuring anything
         * in JavaScript, so tall and wide photos both sit flush.
         */
        <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((image, index) => (
              <motion.div
                key={image.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.5,
                  ease: EASE.outQuint,
                  // 0.05s cadence, capped so photo 40 does not wait 2 seconds.
                  delay: Math.min(index, 11) * 0.05,
                }}
                className="mb-4 break-inside-avoid"
              >
                <GalleryCard image={image} index={index} onOpen={setLightboxIndex} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <GalleryLightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
