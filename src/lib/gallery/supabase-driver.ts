import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  AUDIO_COVER_URL,
  VIDEO_COVER_URL,
  type GalleryDriver,
  type GalleryImage,
  type GalleryPatch,
  type GalleryStats,
  type ListOptions,
} from "./types";

/**
 * Production driver: Supabase Postgres + Supabase Storage.
 *
 * The service-role key is read from STORAGE_KEY and used only here, on the
 * server. It is never sent to the browser - the public gallery reaches the
 * database through this app's own `/api/gallery` route, not directly.
 *
 * Table DDL and row-level security policies live in `supabase/schema.sql`.
 */

const TABLE = "gallery_images";

let cached: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.STORAGE_URL || process.env.DATABASE_URL;
  const key = process.env.STORAGE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set STORAGE_URL (or DATABASE_URL) and STORAGE_KEY, or switch GALLERY_DRIVER to \"local\".",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

const bucket = () => process.env.STORAGE_BUCKET || "gallery";

function publicUrl(storagePath: string): string {
  const { data } = client().storage.from(bucket()).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function upload(storagePath: string, buffer: Buffer, contentType: string) {
  const { error } = await client()
    .storage.from(bucket())
    .upload(storagePath, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
}

export const supabaseDriver: GalleryDriver = {
  name: "supabase",

  async list(options: ListOptions = {}) {
    let query = client()
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options.visibleOnly) query = query.eq("is_visible", true);
    if (options.category && options.category !== "All") {
      query = query.eq("category", options.category);
    }
    if (options.search) {
      const term = options.search.replace(/[%,()]/g, " ").trim();
      if (term) {
        query = query.or(
          `title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`,
        );
      }
    }
    if (options.limit) {
      const from = options.offset ?? 0;
      query = query.range(from, from + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as GalleryImage[];
  },

  async get(id) {
    const { data, error } = await client().from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return (data as GalleryImage | null) ?? null;
  },

  async create({ full, thumb, meta }) {
    await upload(full.storagePath, full.buffer, full.contentType);

    if (thumb) {
      try {
        await upload(thumb.storagePath, thumb.buffer, thumb.contentType);
      } catch (error) {
        // Do not leave the full-size object behind if the thumbnail failed.
        await client().storage.from(bucket()).remove([full.storagePath]);
        throw error;
      }
    }

    let displayOrder = meta.display_order;
    if (displayOrder === undefined) {
      const { data } = await client()
        .from(TABLE)
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);
      displayOrder = data?.length ? (data[0].display_order as number) + 1 : 0;
    }

    // Audio never has a per-file thumbnail; video falls back to a static
    // poster on the rare occasion frame extraction failed.
    const thumbUrl = thumb
      ? publicUrl(thumb.storagePath)
      : meta.media_type === "audio"
        ? AUDIO_COVER_URL
        : VIDEO_COVER_URL;

    const row = {
      title: meta.title,
      description: meta.description,
      category: meta.category,
      media_type: meta.media_type,
      image_url: publicUrl(full.storagePath),
      thumb_url: thumbUrl,
      storage_path: full.storagePath,
      thumb_path: thumb ? thumb.storagePath : null,
      width: meta.width,
      height: meta.height,
      duration_seconds: meta.duration_seconds,
      display_order: displayOrder,
      is_visible: meta.is_visible,
      uploaded_by: meta.uploaded_by,
    };

    const { data, error } = await client().from(TABLE).insert(row).select().single();

    if (error) {
      // Roll the storage objects back so a failed insert leaves no orphans.
      const orphans = thumb ? [full.storagePath, thumb.storagePath] : [full.storagePath];
      await client().storage.from(bucket()).remove(orphans);
      throw new Error(error.message);
    }

    return data as GalleryImage;
  },

  async update(id, patch: GalleryPatch) {
    const { data, error } = await client()
      .from(TABLE)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as GalleryImage | null) ?? null;
  },

  async remove(id) {
    const existing = await supabaseDriver.get(id);
    if (!existing) return false;

    const paths = [existing.storage_path, existing.thumb_path].filter(Boolean) as string[];
    const { error: storageError } = await client().storage.from(bucket()).remove(paths);
    if (storageError) throw new Error(`Storage delete failed: ${storageError.message}`);

    const { error } = await client().from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  },

  async reorder(orderedIds) {
    const now = new Date().toISOString();
    // Sequential rather than parallel: a handful of rows, and it keeps the
    // final ordering deterministic if two admins reorder at once.
    for (const [index, id] of orderedIds.entries()) {
      const { error } = await client()
        .from(TABLE)
        .update({ display_order: index, updated_at: now })
        .eq("id", id);
      if (error) throw new Error(error.message);
    }
  },

  async stats(): Promise<GalleryStats> {
    const { data, error } = await client().from(TABLE).select("category, is_visible");
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as { category: string; is_visible: boolean }[];
    return {
      total: rows.length,
      visible: rows.filter((row) => row.is_visible).length,
      hidden: rows.filter((row) => !row.is_visible).length,
      categories: new Set(rows.map((row) => row.category)).size,
    };
  },
};
