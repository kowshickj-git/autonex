import { localDriver } from "./local-driver";
import { supabaseDriver } from "./supabase-driver";
import type { GalleryDriver } from "./types";

export * from "./types";

/**
 * Resolves the storage + database driver from the environment.
 *
 * GALLERY_DRIVER=supabase -> Supabase Postgres + Storage (production)
 * GALLERY_DRIVER=local    -> ./.data + ./public/uploads  (development)
 *
 * If it is unset we infer: configured Supabase credentials mean Supabase,
 * otherwise local. Adding an S3 or Cloudinary driver means implementing the
 * `GalleryDriver` interface and adding one case here - nothing else changes.
 */
export function galleryStore(): GalleryDriver {
  const configured = process.env.GALLERY_DRIVER?.toLowerCase();

  if (configured === "supabase") return supabaseDriver;
  if (configured === "local") return localDriver;

  const hasSupabase = Boolean(
    (process.env.STORAGE_URL || process.env.DATABASE_URL) && process.env.STORAGE_KEY,
  );
  return hasSupabase ? supabaseDriver : localDriver;
}

/** True when the active driver is not suitable for production traffic. */
export function isDevelopmentDriver(): boolean {
  return galleryStore().name === "local";
}
