import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore } from "@/lib/gallery";
import { buildStoragePath, processImage } from "@/lib/gallery/image";
import { inspectAudio, inspectVideo } from "@/lib/gallery/video";
import { validateUpload } from "@/lib/gallery/validate";
import type { CreateInput, GalleryMeta } from "@/lib/gallery/types";
import { isGalleryCategory, type GalleryCategory } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Frame extraction is fast (a single seek + decode), but large video files
// take real time just to arrive over the network - generous headroom here
// costs nothing on a self-hosted Node deployment; on a serverless platform
// with its own hard timeout, raise that platform's setting instead.
export const maxDuration = 300;

/** "gate-motor-install.JPG" -> "Gate Motor Install" */
function titleFromFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return base
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, 120);
}

/**
 * POST /api/admin/gallery/upload   (multipart/form-data)
 *
 * Fields:
 *   files[]      one or more images, MP4 videos, and/or MP3 audio files
 *   title        applied to every file in the batch; falls back to the
 *                filename when blank
 *   description  optional
 *   category     must be one of GALLERY_CATEGORIES
 *   is_visible   "true" | "false"
 *
 * Each file is validated, processed and stored independently, so one bad
 * file in a batch of twenty does not fail the other nineteen. The response
 * reports both lists, which is what drives the "18 uploaded, 2 failed" UI.
 *
 * Photos are re-encoded to WebP. Video and audio are stored as uploaded -
 * only inspected (poster frame + duration for video, duration for audio) -
 * because transcoding is a different feature with its own codec/bitrate
 * decisions.
 */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the upload. Please try again." },
      { status: 400 },
    );
  }

  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files were selected." }, { status: 400 });
  }

  const rawCategory = String(form.get("category") ?? "Other");
  const category: GalleryCategory = isGalleryCategory(rawCategory) ? rawCategory : "Other";
  const batchTitle = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim() || null;
  const isVisible = String(form.get("is_visible") ?? "true") !== "false";

  const store = galleryStore();
  const uploaded = [];
  const failed: { name: string; error: string }[] = [];

  for (const file of files) {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());

      const validation = validateUpload({
        name: file.name,
        type: file.type,
        size: file.size,
        bytes,
      });

      if (!validation.ok) {
        failed.push({ name: file.name, error: validation.error });
        continue;
      }

      const baseMeta = {
        title: batchTitle || titleFromFilename(file.name),
        description,
        category,
        is_visible: isVisible,
        uploaded_by: session.sub,
      };

      let input: CreateInput;

      if (validation.mediaType === "image") {
        const processed = await processImage(Buffer.from(bytes));
        const meta: GalleryMeta = {
          ...baseMeta,
          media_type: "image",
          width: processed.width,
          height: processed.height,
          duration_seconds: null,
        };
        input = {
          full: {
            buffer: processed.full.buffer,
            contentType: processed.full.contentType,
            storagePath: buildStoragePath(file.name, processed.full.ext),
          },
          thumb: {
            buffer: processed.thumb.buffer,
            contentType: processed.thumb.contentType,
            storagePath: buildStoragePath(file.name, processed.thumb.ext, "gallery/thumbs"),
          },
          meta,
        };
      } else if (validation.mediaType === "video") {
        const inspection = await inspectVideo(Buffer.from(bytes));
        const meta: GalleryMeta = {
          ...baseMeta,
          media_type: "video",
          width: inspection.width,
          height: inspection.height,
          duration_seconds: inspection.durationSeconds,
        };
        input = {
          full: {
            buffer: Buffer.from(bytes),
            contentType: "video/mp4",
            storagePath: buildStoragePath(file.name, "mp4"),
          },
          thumb: inspection.posterBuffer
            ? {
                buffer: inspection.posterBuffer,
                contentType: "image/webp",
                storagePath: buildStoragePath(file.name, "webp", "gallery/thumbs"),
              }
            : undefined,
          meta,
        };
      } else {
        const inspection = await inspectAudio(Buffer.from(bytes));
        const meta: GalleryMeta = {
          ...baseMeta,
          media_type: "audio",
          width: null,
          height: null,
          duration_seconds: inspection.durationSeconds,
        };
        input = {
          full: {
            buffer: Buffer.from(bytes),
            contentType: "audio/mpeg",
            storagePath: buildStoragePath(file.name, "mp3"),
          },
          // No per-file thumbnail - the driver points every audio row at the
          // one shared cover asset instead.
          meta,
        };
      }

      uploaded.push(await store.create(input));
    } catch (error) {
      console.error(`[api/admin/gallery/upload] "${file.name}" failed:`, error);
      failed.push({
        name: file.name,
        error: "Upload failed. Please check your connection and try again.",
      });
    }
  }

  const status = uploaded.length === 0 ? 422 : failed.length > 0 ? 207 : 201;

  return NextResponse.json(
    { uploaded, failed, uploadedCount: uploaded.length, failedCount: failed.length },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
