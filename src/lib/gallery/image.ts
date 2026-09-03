import sharp from "sharp";

/**
 * Server-side image optimisation (spec section 26).
 *
 * Every upload is normalised to WebP in two sizes:
 *   - full:  max 2000px on the long edge, quality 82 - opened by the lightbox
 *   - thumb: 640px wide, quality 72        - what the grid actually loads
 *
 * EXIF orientation is applied and the rest of the metadata is dropped, which
 * both shrinks the file and avoids publishing GPS coordinates from a phone
 * photo taken on a client's site.
 */

export type ProcessedImage = {
  full: { buffer: Buffer; ext: "webp"; contentType: "image/webp" };
  thumb: { buffer: Buffer; ext: "webp"; contentType: "image/webp" };
  width: number;
  height: number;
};

const FULL_MAX = 2000;
const THUMB_WIDTH = 640;

export async function processImage(input: Buffer): Promise<ProcessedImage> {
  // `rotate()` with no argument applies the EXIF orientation tag.
  const base = sharp(input, { failOn: "error" }).rotate();
  const metadata = await base.metadata();

  const full = await base
    .clone()
    .resize({
      width: FULL_MAX,
      height: FULL_MAX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  const thumb = await base
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 72, effort: 4 })
    .toBuffer();

  return {
    full: { buffer: full.data, ext: "webp", contentType: "image/webp" },
    thumb: { buffer: thumb, ext: "webp", contentType: "image/webp" },
    width: full.info.width ?? metadata.width ?? 0,
    height: full.info.height ?? metadata.height ?? 0,
  };
}

/**
 * Unique, collision-proof storage key (spec section 34):
 *   gallery/2026/08/<uuid>-<slugified-original-name>.webp
 *
 * The original name is kept only as a readable slug - never used verbatim,
 * and stripped of anything that could traverse a path.
 */
export function buildStoragePath(originalName: string, ext: string, prefix = "gallery"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const slug =
    originalName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image";

  return `${prefix}/${year}/${month}/${crypto.randomUUID()}-${slug}.${ext}`;
}
