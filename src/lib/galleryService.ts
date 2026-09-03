import type { GalleryImage, GalleryStats } from "@/lib/gallery/types";

/**
 * Browser-side wrapper around the gallery API.
 *
 * Every method returns friendly, already-humanised errors - the components
 * that call these never have to interpret a status code, and a stack trace
 * can never reach the screen.
 */

export type UploadResult = {
  uploaded: GalleryImage[];
  failed: { name: string; error: string }[];
  uploadedCount: number;
  failedCount: number;
};

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

/* ---------------------------------------------------------------- *
 * Public
 * ---------------------------------------------------------------- */

export async function fetchPublicGallery(params: {
  category?: string;
  search?: string;
} = {}): Promise<GalleryImage[]> {
  const query = new URLSearchParams();
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const response = await fetch(`/api/gallery?${query.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readError(response, "The gallery could not be loaded."));
  }

  const data = (await response.json()) as { images: GalleryImage[] };
  return data.images ?? [];
}

/* ---------------------------------------------------------------- *
 * Admin
 * ---------------------------------------------------------------- */

export async function fetchAdminGallery(params: {
  category?: string;
  search?: string;
  visibility?: "all" | "visible" | "hidden";
} = {}): Promise<GalleryImage[]> {
  const query = new URLSearchParams();
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.visibility && params.visibility !== "all") query.set("visibility", params.visibility);

  const response = await fetch(`/api/admin/gallery?${query.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not load the gallery."));
  }

  const data = (await response.json()) as { images: GalleryImage[] };
  return data.images ?? [];
}

export async function fetchStats(): Promise<GalleryStats> {
  const response = await fetch("/api/admin/stats", { cache: "no-store" });
  if (!response.ok) throw new Error(await readError(response, "Could not load statistics."));
  const data = (await response.json()) as { stats: GalleryStats };
  return data.stats;
}

/**
 * Uploads a batch with real progress.
 *
 * Uses XMLHttpRequest rather than fetch because `upload.onprogress` is the
 * only way to report bytes-sent in the browser today - fetch has no
 * equivalent. Everything else in the app uses fetch.
 */
export function uploadPhotos(
  files: File[],
  meta: { title: string; description: string; category: string; isVisible: boolean },
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    form.append("title", meta.title);
    form.append("description", meta.description);
    form.append("category", meta.category);
    form.append("is_visible", String(meta.isVisible));

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/gallery/upload");

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      let payload: (UploadResult & { error?: string }) | null = null;
      try {
        payload = JSON.parse(request.responseText);
      } catch {
        /* handled below */
      }

      // 201 all good, 207 partial success - both carry a usable result.
      if (request.status >= 200 && request.status < 300 && payload) {
        resolve(payload);
        return;
      }

      if (request.status === 401) {
        reject(new Error("Your session has expired. Please sign in again."));
        return;
      }

      reject(new Error(payload?.error ?? "Upload failed. Please try again."));
    });

    request.addEventListener("error", () =>
      reject(new Error("Upload failed. Please check your connection and try again.")),
    );
    request.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

    request.send(form);
  });
}

export async function updatePhoto(
  id: string,
  patch: Partial<Pick<GalleryImage, "title" | "description" | "category" | "is_visible">>,
): Promise<GalleryImage> {
  const response = await fetch(`/api/admin/gallery/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw new Error(await readError(response, "Could not save your changes."));
  const data = (await response.json()) as { image: GalleryImage };
  return data.image;
}

export async function setVisibility(id: string, isVisible: boolean): Promise<GalleryImage> {
  const response = await fetch(`/api/admin/gallery/${id}/visibility`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_visible: isVisible }),
  });
  if (!response.ok) throw new Error(await readError(response, "Could not update visibility."));
  const data = (await response.json()) as { image: GalleryImage };
  return data.image;
}

export async function deletePhoto(id: string): Promise<void> {
  const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await readError(response, "Could not delete this photo."));
}

export async function reorderPhotos(ids: string[]): Promise<void> {
  const response = await fetch("/api/admin/gallery/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error(await readError(response, "Could not save the new order."));
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}
