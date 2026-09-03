import type { GalleryCategory } from "@/lib/services";

export type MediaType = "image" | "video" | "audio";

/**
 * Audio has no visual frame to derive a thumbnail from, so every audio row
 * points at this one bundled site asset instead of an uploaded object.
 * `thumb_path` stays null for these rows - there is nothing to delete.
 */
export const AUDIO_COVER_URL = "/gallery-audio-cover.svg";

/**
 * Fallback poster for the rare video whose frame extraction fails (missing
 * ffmpeg binary, an unusual codec). Same nullable-thumb_path treatment as
 * audio - the upload still succeeds, it just displays generically.
 */
export const VIDEO_COVER_URL = "/gallery-video-cover.svg";

/**
 * One row of `gallery_images` (spec sections 8 and 44).
 * Field names match the database columns exactly so nothing has to be mapped
 * by hand between the API and the UI.
 *
 * Despite the table name, a row can hold a photo, a video or an audio track -
 * `media_type` discriminates. `image_url` is always the primary playable
 * asset (the optimised photo, or the original video/audio file as uploaded);
 * `thumb_url` is always a real, renderable image (photo thumbnail, extracted
 * video poster frame, or the shared audio cover) so grid components never
 * need to branch on whether a thumbnail exists - only on how to open it.
 */
export type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  category: GalleryCategory;
  media_type: MediaType;
  /** Public URL of the full-size photo, or the video/audio file itself. */
  image_url: string;
  /** Public URL of the grid thumbnail - always a real image. */
  thumb_url: string;
  /** Object-storage key - needed to delete the file alongside the row. */
  storage_path: string;
  /** Thumbnail key, deleted with the record too. Null for audio (see AUDIO_COVER_URL). */
  thumb_path: string | null;
  width: number | null;
  height: number | null;
  /** Video/audio runtime in whole seconds. Null for photos. */
  duration_seconds: number | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  uploaded_by: string | null;
};

export type NewGalleryImage = Omit<GalleryImage, "id" | "created_at" | "updated_at">;

/** Metadata supplied by the admin when creating a record. */
export type GalleryMeta = {
  title: string;
  description: string | null;
  category: GalleryCategory;
  media_type: MediaType;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  /** Omit to append to the end of the current order. */
  display_order?: number;
  is_visible: boolean;
  uploaded_by: string | null;
};

/** One processed asset variant, ready to be written to object storage. */
export type StorageObject = {
  buffer: Buffer;
  contentType: string;
  /** Pre-computed unique key, e.g. gallery/2026/08/<uuid>-name.webp */
  storagePath: string;
};

export type CreateInput = {
  full: StorageObject;
  /**
   * Absent for audio - there is no per-file thumbnail to store, the driver
   * falls back to AUDIO_COVER_URL and leaves thumb_path null.
   */
  thumb?: StorageObject;
  meta: GalleryMeta;
};

export type GalleryPatch = Partial<
  Pick<GalleryImage, "title" | "description" | "category" | "display_order" | "is_visible">
>;

export type ListOptions = {
  /** Public callers must pass `true`; the admin grid passes `false`. */
  visibleOnly?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export type GalleryStats = {
  total: number;
  visible: number;
  hidden: number;
  categories: number;
};

/**
 * Storage + database operations the app needs. Implemented once for Supabase
 * (production) and once for the local filesystem (development), so switching
 * providers is a single environment variable.
 */
export interface GalleryDriver {
  readonly name: string;
  list(options?: ListOptions): Promise<GalleryImage[]>;
  get(id: string): Promise<GalleryImage | null>;
  /** Stores the processed bytes and inserts the matching row. */
  create(input: CreateInput): Promise<GalleryImage>;
  update(id: string, patch: GalleryPatch): Promise<GalleryImage | null>;
  /** Deletes the row AND both stored objects - no orphans (spec section 15). */
  remove(id: string): Promise<boolean>;
  reorder(orderedIds: string[]): Promise<void>;
  stats(): Promise<GalleryStats>;
}
