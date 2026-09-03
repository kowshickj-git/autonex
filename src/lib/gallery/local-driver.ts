import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
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
 * Development driver: a JSON index in `./.data` plus real image files in
 * `./public/uploads`.
 *
 * This is a genuine persistent store - the files survive a refresh, a logout
 * and a machine restart, which is what makes the whole flow testable without
 * cloud credentials. It is NOT a production driver: files live on the
 * application's own disk, so a redeploy onto fresh infrastructure loses them,
 * and it cannot serve more than one instance. Set GALLERY_DRIVER=supabase
 * before going live.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const INDEX_FILE = path.join(DATA_DIR, "gallery.json");
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

/** Serialises writes so two simultaneous uploads cannot clobber the index. */
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readIndex(): Promise<GalleryImage[]> {
  try {
    const raw = await readFile(INDEX_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GalleryImage[]) : [];
  } catch {
    return [];
  }
}

async function writeIndex(rows: GalleryImage[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INDEX_FILE, JSON.stringify(rows, null, 2), "utf8");
}

async function writeObject(storagePath: string, buffer: Buffer): Promise<string> {
  const target = path.join(UPLOAD_ROOT, storagePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return `/uploads/${storagePath}`;
}

async function deleteObject(storagePath: string | null): Promise<void> {
  if (!storagePath) return;
  // Guard against any key that tries to escape the upload root.
  const target = path.resolve(UPLOAD_ROOT, storagePath);
  if (!target.startsWith(path.resolve(UPLOAD_ROOT))) return;
  await rm(target, { force: true });
}

function applyFilters(rows: GalleryImage[], options: ListOptions = {}): GalleryImage[] {
  let result = rows;

  if (options.visibleOnly) result = result.filter((row) => row.is_visible);

  if (options.category && options.category !== "All") {
    result = result.filter((row) => row.category === options.category);
  }

  if (options.search) {
    const needle = options.search.toLowerCase();
    result = result.filter((row) =>
      [row.title, row.description ?? "", row.category].some((field) =>
        field.toLowerCase().includes(needle),
      ),
    );
  }

  // Public ordering: display_order ASC, then newest first (spec section 19).
  result = [...result].sort((a, b) => {
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return b.created_at.localeCompare(a.created_at);
  });

  const offset = options.offset ?? 0;
  return options.limit ? result.slice(offset, offset + options.limit) : result.slice(offset);
}

export const localDriver: GalleryDriver = {
  name: "local",

  async list(options) {
    return applyFilters(await readIndex(), options);
  },

  async get(id) {
    const rows = await readIndex();
    return rows.find((row) => row.id === id) ?? null;
  },

  async create({ full, thumb, meta }) {
    return withLock(async () => {
      const rows = await readIndex();
      const now = new Date().toISOString();

      const imageUrl = await writeObject(full.storagePath, full.buffer);

      // Audio never has a per-file thumbnail; video falls back to a static
      // poster on the rare occasion frame extraction failed. Images always
      // carry a real thumb (processImage() guarantees one).
      const thumbUrl = thumb
        ? await writeObject(thumb.storagePath, thumb.buffer)
        : meta.media_type === "audio"
          ? AUDIO_COVER_URL
          : VIDEO_COVER_URL;
      const thumbPath = thumb ? thumb.storagePath : null;

      const nextOrder =
        rows.length > 0 ? Math.max(...rows.map((row) => row.display_order)) + 1 : 0;

      const record: GalleryImage = {
        id: crypto.randomUUID(),
        title: meta.title,
        description: meta.description,
        category: meta.category,
        media_type: meta.media_type,
        image_url: imageUrl,
        thumb_url: thumbUrl,
        storage_path: full.storagePath,
        thumb_path: thumbPath,
        width: meta.width,
        height: meta.height,
        duration_seconds: meta.duration_seconds,
        display_order: meta.display_order ?? nextOrder,
        is_visible: meta.is_visible,
        created_at: now,
        updated_at: now,
        uploaded_by: meta.uploaded_by,
      };

      await writeIndex([...rows, record]);
      return record;
    });
  },

  async update(id, patch: GalleryPatch) {
    return withLock(async () => {
      const rows = await readIndex();
      const index = rows.findIndex((row) => row.id === id);
      if (index === -1) return null;

      const updated: GalleryImage = {
        ...rows[index],
        ...patch,
        updated_at: new Date().toISOString(),
      };
      rows[index] = updated;
      await writeIndex(rows);
      return updated;
    });
  },

  async remove(id) {
    return withLock(async () => {
      const rows = await readIndex();
      const row = rows.find((item) => item.id === id);
      if (!row) return false;

      // Files first: if this throws we keep the row and surface the error,
      // rather than losing the record and orphaning the object.
      await deleteObject(row.storage_path);
      await deleteObject(row.thumb_path);
      await writeIndex(rows.filter((item) => item.id !== id));
      return true;
    });
  },

  async reorder(orderedIds) {
    return withLock(async () => {
      const rows = await readIndex();
      const position = new Map(orderedIds.map((id, index) => [id, index]));
      const now = new Date().toISOString();

      await writeIndex(
        rows.map((row) =>
          position.has(row.id)
            ? { ...row, display_order: position.get(row.id)!, updated_at: now }
            : row,
        ),
      );
    });
  },

  async stats(): Promise<GalleryStats> {
    const rows = await readIndex();
    return {
      total: rows.length,
      visible: rows.filter((row) => row.is_visible).length,
      hidden: rows.filter((row) => !row.is_visible).length,
      categories: new Set(rows.map((row) => row.category)).size,
    };
  },
};
