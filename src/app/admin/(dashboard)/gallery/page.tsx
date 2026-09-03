"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EASE } from "@/lib/motion";
import { GALLERY_CATEGORIES } from "@/lib/services";
import {
  deletePhoto,
  fetchAdminGallery,
  reorderPhotos,
  setVisibility,
} from "@/lib/galleryService";
import type { GalleryImage, MediaType } from "@/lib/gallery/types";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/Modal";
import { GalleryAdminGrid } from "@/components/gallery/GalleryAdminGrid";
import { EditPhotoModal } from "@/components/gallery/EditPhotoModal";
import { UploadGalleryModal } from "@/components/gallery/UploadGalleryModal";

type Visibility = "all" | "visible" | "hidden";

const MEDIA_LABEL: Record<MediaType, string> = { image: "photo", video: "video", audio: "audio file" };

export default function AdminGalleryPage() {
  const { notify } = useToast();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visibility, setVisibility_] = useState<Visibility>("all");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState<GalleryImage | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* ---------------- Loading ---------------- */

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setImages(await fetchAdminGallery());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load the gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* ---------------- Filtering (client-side) ---------------- */

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return images.filter((image) => {
      if (category !== "All" && image.category !== category) return false;
      if (visibility === "visible" && !image.is_visible) return false;
      if (visibility === "hidden" && image.is_visible) return false;
      if (!needle) return true;
      return [image.title, image.description ?? "", image.category].some((field) =>
        field.toLowerCase().includes(needle),
      );
    });
  }, [images, search, category, visibility]);

  const filtersActive = search !== "" || category !== "All" || visibility !== "all";

  /* ---------------- Mutations ---------------- */

  const toggleVisibility = async (image: GalleryImage) => {
    setBusyId(image.id);
    // Optimistic: flip immediately, roll back if the server disagrees.
    const previous = images;
    setImages((current) =>
      current.map((item) =>
        item.id === image.id ? { ...item, is_visible: !item.is_visible } : item,
      ),
    );

    try {
      const updated = await setVisibility(image.id, !image.is_visible);
      setImages((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      notify(updated.is_visible ? "Now visible on the public gallery." : "Now hidden from the public gallery.");
    } catch (error) {
      setImages(previous);
      notify(error instanceof Error ? error.message : "Could not update visibility.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      await deletePhoto(deleting.id);
      setImages((current) => current.filter((item) => item.id !== deleting.id));
      setSelected((current) => {
        const next = new Set(current);
        next.delete(deleting.id);
        return next;
      });
      notify("Deleted.");
      setDeleting(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not delete this file.", "error");
    } finally {
      setWorking(false);
    }
  };

  const confirmBulkDelete = async () => {
    setWorking(true);
    const ids = Array.from(selected);
    const failures: string[] = [];

    for (const id of ids) {
      try {
        await deletePhoto(id);
        setImages((current) => current.filter((item) => item.id !== id));
      } catch {
        failures.push(id);
      }
    }

    setSelected(new Set(failures));
    setBulkDeleteOpen(false);
    setWorking(false);

    const deleted = ids.length - failures.length;
    if (failures.length === 0) {
      notify(`${deleted} ${deleted === 1 ? "file" : "files"} deleted.`);
    } else {
      notify(`${deleted} deleted, ${failures.length} could not be removed.`, "error");
    }
  };

  /**
   * Reordering applies locally first so the drag feels instant, then persists.
   * The ids sent are the FULL list, not the filtered view, so reordering while
   * a filter is active cannot silently renumber the hidden remainder.
   */
  const handleReorder = async (orderedFilteredIds: string[]) => {
    const byId = new Map(images.map((image) => [image.id, image]));
    const inFilter = new Set(orderedFilteredIds);

    // Walk the full list; wherever a filtered photo sat, drop in the next
    // photo from the new filtered order. Unfiltered photos never move.
    const reordered: GalleryImage[] = [];
    let cursor = 0;
    for (const image of images) {
      if (inFilter.has(image.id)) {
        const next = byId.get(orderedFilteredIds[cursor++]);
        if (next) reordered.push(next);
      } else {
        reordered.push(image);
      }
    }

    const previous = images;
    setImages(reordered);

    try {
      await reorderPhotos(reordered.map((image) => image.id));
    } catch (error) {
      setImages(previous);
      notify(error instanceof Error ? error.message : "Could not save the new order.", "error");
    }
  };

  const handleUploaded = (uploaded: GalleryImage[]) => {
    setImages((current) => [...current, ...uploaded]);
    notify(
      uploaded.length === 1
        ? "File uploaded successfully."
        : `${uploaded.length} files uploaded successfully.`,
    );
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((image) => selected.has(image.id));

  const toggleSelectAll = () =>
    setSelected((current) => {
      if (allFilteredSelected) {
        const next = new Set(current);
        filtered.forEach((image) => next.delete(image.id));
        return next;
      }
      return new Set([...current, ...filtered.map((image) => image.id)]);
    });

  /* ---------------- Render ---------------- */

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Gallery Management</h1>
          <p className="mt-1.5 text-sm text-slate-6">
            Manage photos, videos and audio displayed on the Autonex Solutions website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="btn btn-primary shrink-0"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          Add Media
        </button>
      </header>

      {/* Filters */}
      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-5"
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search gallery..."
            aria-label="Search the gallery"
            className="field !py-2.5 !pl-10"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="field !py-2.5 lg:w-56"
        >
          <option value="All">All categories</option>
          {GALLERY_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={visibility}
          onChange={(event) => setVisibility_(event.target.value as Visibility)}
          aria-label="Filter by visibility"
          className="field !py-2.5 lg:w-44"
        >
          <option value="all">All media</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>

        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setVisibility_("all");
            }}
            className="btn btn-ghost !py-2.5 text-sm"
          >
            <X className="size-4" />
            Clear
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.28, ease: EASE.outQuint }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy-900 px-4 py-3 text-white">
              <p className="text-sm">
                Selected <span className="numeric font-semibold">{selected.size}</span>{" "}
                {selected.size === 1 ? "file" : "files"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {allFilteredSelected ? "Deselect all" : "Select all"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setBulkDeleteOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-red-700"
                >
                  <Trash2 className="size-3.5" strokeWidth={2.2} />
                  Delete Selected
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count + select all */}
      {!loading && images.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-5">
            Showing <span className="numeric">{filtered.length}</span> of{" "}
            <span className="numeric">{images.length}</span> items
          </p>
          {filtered.length > 0 && selected.size === 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-royal-700 transition-colors hover:text-royal-800"
            >
              Select All
            </button>
          )}
        </div>
      )}

      {/* Grid / states */}
      <div className="mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-5">
            <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            <p className="mt-4 text-sm">Loading gallery...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-3">
            <p className="text-base font-semibold text-navy-900">Could not load the gallery</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-6">{loadError}</p>
            <button type="button" onClick={() => void load()} className="btn btn-outline mt-6">
              Try again
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center ring-1 ring-slate-3">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-2 text-slate-5">
              <ImagePlus className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="mt-6 text-base font-semibold text-navy-900">No media uploaded yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-6">
              Upload your first project photo, video or audio clip to start building the public
              gallery.
            </p>
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="btn btn-primary mt-6"
            >
              <Plus className="size-4" strokeWidth={2.4} />
              Add Media
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-3">
            <p className="text-sm font-semibold text-navy-900">No items match these filters</p>
            <p className="mt-2 text-sm text-slate-6">Try clearing the search or category filter.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-slate-5">
              Drag an item onto another to reorder, or use the arrows on each card. The public
              gallery follows this order.
            </p>
            <GalleryAdminGrid
              images={filtered}
              selected={selected}
              onToggleSelect={toggleSelect}
              onEdit={setEditing}
              onDelete={setDeleting}
              onToggleVisibility={(image) => void toggleVisibility(image)}
              onReorder={(ids) => void handleReorder(ids)}
              busyId={busyId}
            />
          </>
        )}
      </div>

      {/* Dialogs */}
      <UploadGalleryModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />

      <EditPhotoModal
        image={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => {
          setImages((current) =>
            current.map((item) => (item.id === updated.id ? updated : item)),
          );
          notify("Changes saved.");
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
        title={`Delete ${deleting ? MEDIA_LABEL[deleting.media_type] : "file"}`}
        message={`Are you sure you want to delete this ${deleting ? MEDIA_LABEL[deleting.media_type] : "file"}? "${deleting?.title ?? ""}" will be removed from the website and permanently deleted from storage. This cannot be undone.`}
        confirmLabel={`Delete ${deleting ? MEDIA_LABEL[deleting.media_type] : "File"}`}
        busy={working}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={() => void confirmBulkDelete()}
        title="Delete selected items"
        message={`Are you sure you want to delete ${selected.size} ${selected.size === 1 ? "file" : "files"}? They will be removed from the website and permanently deleted from storage. This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} ${selected.size === 1 ? "File" : "Files"}`}
        busy={working}
      />
    </>
  );
}
