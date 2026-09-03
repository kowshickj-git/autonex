"use client";

import { CircleAlert, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/services";
import { updatePhoto } from "@/lib/galleryService";
import type { GalleryImage } from "@/lib/gallery/types";
import { canOptimize } from "@/lib/images";
import { formatDuration } from "@/lib/gallery/format";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";

const MEDIA_LABEL = { image: "Photo", video: "Video", audio: "Audio" } as const;

/**
 * Metadata editor (spec section 16). The underlying file is never re-
 * uploaded - only the row is patched. The preview is media-aware: photos get
 * the usual crop, video gets its poster with a play badge and audio gets a
 * playable strip so the admin can confirm the right file was picked.
 */
export function EditPhotoModal({
  image,
  onClose,
  onSaved,
}: {
  image: GalleryImage | null;
  onClose: () => void;
  onSaved: (image: GalleryImage) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Other");
  const [isVisible, setIsVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;
    setTitle(image.title);
    setDescription(image.description ?? "");
    setCategory(image.category);
    setIsVisible(image.is_visible);
    setError(null);
  }, [image]);

  const save = async () => {
    if (!image) return;

    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await updatePhoto(image.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        is_visible: isVisible,
      });
      onSaved(updated);
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={image !== null}
      onClose={onClose}
      title={`Edit ${image ? MEDIA_LABEL[image.media_type] : "Photo"}`}
      description="Update the details shown in the public gallery."
      footer={
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={saving}>
            Cancel
          </button>
          <button type="button" onClick={save} className="btn btn-royal" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      }
    >
      {image && (
        <div className="space-y-5">
          {image.media_type === "audio" ? (
            <div className="rounded-xl bg-slate-2 p-4">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio src={image.image_url} controls className="w-full" />
            </div>
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-2">
              <Image
                src={image.thumb_url}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 92vw, 640px"
                unoptimized={!canOptimize(image.thumb_url)}
                className="object-cover"
              />
              {image.media_type === "video" && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full bg-navy-950/55 text-white ring-1 ring-white/25">
                    <Play className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} />
                  </span>
                </span>
              )}
            </div>
          )}

          <div>
            <label htmlFor="edit-title" className="mb-1.5 block text-sm font-medium text-navy-900">
              Title
            </label>
            <input
              id="edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1.5 block text-sm font-medium text-navy-900"
            >
              Description <span className="font-normal text-slate-5">(optional)</span>
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="field resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-category"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as GalleryCategory)}
                className="field"
              >
                {GALLERY_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-navy-900">Visibility</span>
              <div className="flex h-[46px] items-center gap-3 rounded-[10px] px-3 shadow-[inset_0_0_0_1px_var(--color-slate-4)]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isVisible}
                  aria-label="Visible on the public gallery"
                  onClick={() => setIsVisible((value) => !value)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    isVisible ? "bg-emerald-500" : "bg-slate-4"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isVisible ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-7">{isVisible ? "Visible" : "Hidden"}</span>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-slate-1 p-4 text-xs">
            <div>
              <dt className="text-slate-5">Uploaded</dt>
              <dd className="numeric mt-0.5 text-navy-800">
                {new Date(image.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-slate-5">
                {image.media_type === "image" ? "Dimensions" : "Duration"}
              </dt>
              <dd className="numeric mt-0.5 text-navy-800">
                {image.media_type === "image"
                  ? image.width && image.height
                    ? `${image.width} × ${image.height}`
                    : "—"
                  : image.duration_seconds !== null
                    ? formatDuration(image.duration_seconds)
                    : "—"}
              </dd>
            </div>
          </dl>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
              {error}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
