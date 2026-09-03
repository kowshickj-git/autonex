"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  Music,
  Pencil,
  Play,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import type { GalleryImage } from "@/lib/gallery/types";
import { canOptimize } from "@/lib/images";
import { formatDuration } from "@/lib/gallery/format";

/**
 * Admin gallery grid (spec sections 14, 18, 32, 48).
 *
 * Reordering uses the native HTML drag-and-drop API rather than a library -
 * it is a handful of events, it works with the browser's own drag image, and
 * it adds nothing to the bundle. Because native DnD is mouse-only, every card
 * also carries keyboard-reachable "move back / move forward" buttons, so the
 * order can be changed without a pointer.
 */
export function GalleryAdminGrid({
  images,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  onToggleVisibility,
  onReorder,
  busyId,
}: {
  images: GalleryImage[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleVisibility: (image: GalleryImage) => void;
  onReorder: (orderedIds: string[]) => void;
  busyId: string | null;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const move = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length || fromIndex === toIndex) return;
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next.map((image) => image.id));
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const fromIndex = images.findIndex((image) => image.id === dragId);
    const toIndex = images.findIndex((image) => image.id === targetId);
    move(fromIndex, toIndex);
    setDragId(null);
    setOverId(null);
  };

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {images.map((image, index) => {
        const isSelected = selected.has(image.id);
        const isBusy = busyId === image.id;

        return (
          <motion.li
            key={image.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: isBusy ? 0.55 : 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE.outQuint, delay: Math.min(index, 9) * 0.04 }}
            draggable
            onDragStart={() => setDragId(image.id)}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (overId !== image.id) setOverId(image.id);
            }}
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(image.id);
            }}
            className={`card group relative flex flex-col overflow-hidden transition-shadow ${
              dragId === image.id ? "opacity-40" : ""
            } ${
              overId === image.id && dragId !== image.id
                ? "ring-2 ring-royal-500 ring-offset-2"
                : ""
            } ${isSelected ? "ring-2 ring-royal-600" : ""}`}
          >
            {/* Media */}
            <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-2">
              <Image
                src={image.thumb_url}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 24vw"
                loading={index < 6 ? "eager" : "lazy"}
                unoptimized={!canOptimize(image.thumb_url)}
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />

              {/* Selection checkbox */}
              <label className="absolute left-2.5 top-2.5 flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(image.id)}
                  aria-label={`Select ${image.title}`}
                  className="size-5 cursor-pointer rounded border-white/60 bg-white/85 accent-royal-600"
                />
              </label>

              {/* Drag handle */}
              <span
                aria-hidden="true"
                title="Drag to reorder"
                className="absolute right-2.5 top-2.5 grid size-7 cursor-grab place-items-center rounded-lg bg-white/85 text-slate-6 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </span>

              {/* Visibility + media type badges */}
              <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur ${
                    image.is_visible
                      ? "bg-emerald-500/90 text-white"
                      : "bg-navy-900/85 text-white/80"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      image.is_visible ? "bg-white" : "bg-white/60"
                    }`}
                  />
                  {image.is_visible ? "Visible" : "Hidden"}
                </span>

                {image.media_type !== "image" && (
                  <span className="flex items-center gap-1 rounded-full bg-navy-950/75 px-2.5 py-1 text-[10px] font-semibold text-white/85 backdrop-blur">
                    {image.media_type === "video" ? (
                      <Play className="size-2.5" fill="currentColor" strokeWidth={0} />
                    ) : (
                      <Music className="size-2.5" strokeWidth={2.4} />
                    )}
                    {image.duration_seconds !== null
                      ? formatDuration(image.duration_seconds)
                      : image.media_type}
                  </span>
                )}
              </div>

              <span className="numeric absolute bottom-2.5 right-2.5 rounded-md bg-navy-950/70 px-1.5 py-0.5 text-[10px] text-white/80 backdrop-blur">
                #{index + 1}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-1 flex-col p-4">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-navy-900">
                {image.title}
              </p>
              <p className="mt-1 text-xs text-slate-6">{image.category}</p>
              <p className="numeric mt-1 text-[11px] text-slate-5">
                {new Date(image.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-1.5 border-t border-slate-2 pt-3">
                <button
                  type="button"
                  onClick={() => onEdit(image)}
                  disabled={isBusy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-royal-700 transition-colors hover:bg-royal-50 disabled:opacity-50"
                >
                  <Pencil className="size-3.5" strokeWidth={2.1} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onToggleVisibility(image)}
                  disabled={isBusy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-7 transition-colors hover:bg-slate-2 disabled:opacity-50"
                >
                  {image.is_visible ? (
                    <>
                      <EyeOff className="size-3.5" strokeWidth={2.1} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" strokeWidth={2.1} />
                      Show
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(image)}
                  disabled={isBusy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" strokeWidth={2.1} />
                  Delete
                </button>
              </div>

              {/* Keyboard-accessible reordering */}
              <div className="mt-2 flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move "${image.title}" earlier`}
                  className="grid size-7 place-items-center rounded-md text-slate-5 transition-colors hover:bg-slate-2 hover:text-navy-900 disabled:opacity-30"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span className="text-[10px] text-slate-5">Reorder</span>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label={`Move "${image.title}" later`}
                  className="grid size-7 place-items-center rounded-md text-slate-5 transition-colors hover:bg-slate-2 hover:text-navy-900 disabled:opacity-30"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
