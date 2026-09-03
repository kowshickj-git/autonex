import type { MediaType } from "./types";

/**
 * Upload validation (spec section 33).
 *
 * Three independent checks per file, in order of cost:
 *   1. declared MIME type is on the allowlist
 *   2. size is within the limit for that media type
 *   3. the FILE'S OWN BYTES start with a matching signature
 *
 * Step 3 is the one that matters: it is why renaming `payload.exe` to
 * `photo.jpg` (or `.mp4`) does not get past this. SVG is rejected outright -
 * it is a scriptable document, not a photograph.
 */

export const ALLOWED_IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export const ALLOWED_VIDEO_MIME = ["video/mp4"] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4"] as const;

export const ALLOWED_AUDIO_MIME = ["audio/mpeg", "audio/mp3"] as const;
export const ALLOWED_AUDIO_EXTENSIONS = ["mp3"] as const;

/** @deprecated Use ALLOWED_IMAGE_MIME - kept as an alias so existing imports keep working. */
export const ALLOWED_MIME = ALLOWED_IMAGE_MIME;
/** @deprecated Use ALLOWED_IMAGE_EXTENSIONS. */
export const ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS;

export const ALL_ALLOWED_MIME = [
  ...ALLOWED_IMAGE_MIME,
  ...ALLOWED_VIDEO_MIME,
  ...ALLOWED_AUDIO_MIME,
] as const;

export type AllowedMime = (typeof ALL_ALLOWED_MIME)[number];

export const maxUploadBytes = () => Number(process.env.MAX_UPLOAD_MB ?? 10) * 1024 * 1024;
export const maxVideoBytes = () => Number(process.env.MAX_VIDEO_MB ?? 100) * 1024 * 1024;
export const maxAudioBytes = () => Number(process.env.MAX_AUDIO_MB ?? 20) * 1024 * 1024;

/** The size ceiling that applies to a given declared MIME type. */
export function maxBytesForMime(mime: string): number {
  if ((ALLOWED_VIDEO_MIME as readonly string[]).includes(mime)) return maxVideoBytes();
  if ((ALLOWED_AUDIO_MIME as readonly string[]).includes(mime)) return maxAudioBytes();
  return maxUploadBytes();
}

/** Same, keyed off an already-known media kind rather than a raw MIME string. */
export function maxBytesForKind(kind: MediaType): number {
  if (kind === "video") return maxVideoBytes();
  if (kind === "audio") return maxAudioBytes();
  return maxUploadBytes();
}

/** Best-effort classification from a declared MIME type, for client-side UX only. */
export function mediaKindFromMime(mime: string): MediaType | null {
  if ((ALLOWED_IMAGE_MIME as readonly string[]).includes(mime)) return "image";
  if ((ALLOWED_VIDEO_MIME as readonly string[]).includes(mime)) return "video";
  if ((ALLOWED_AUDIO_MIME as readonly string[]).includes(mime)) return "audio";
  return null;
}

/**
 * Same idea, with an extension fallback - some browser/OS combinations leave
 * `file.type` empty for less common formats. Client-side only; the server
 * never trusts either the name or the declared MIME, only the file's bytes.
 */
export function mediaKindFromFile(name: string, mime: string): MediaType | null {
  const fromMime = mediaKindFromMime(mime);
  if (fromMime) return fromMime;

  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  if ((ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) return "image";
  if ((ALLOWED_VIDEO_EXTENSIONS as readonly string[]).includes(extension)) return "video";
  if ((ALLOWED_AUDIO_EXTENSIONS as readonly string[]).includes(extension)) return "audio";
  return null;
}

export type ValidationResult =
  | { ok: true; mime: AllowedMime; mediaType: MediaType }
  | { ok: false; error: string };

/** Reads the leading magic bytes and reports the real image type, if any. */
export function sniffImageType(bytes: Uint8Array): (typeof ALLOWED_IMAGE_MIME)[number] | null {
  if (bytes.length < 16) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((byte, i) => bytes[i] === byte)) return "image/png";

  // RIFF....WEBP
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "image/webp";

  // ISO-BMFF container: ....ftyp<brand>; AVIF brands are avif / avis.
  const ftyp = String.fromCharCode(...bytes.slice(4, 8));
  if (ftyp === "ftyp") {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    if (brand === "avif" || brand === "avis") return "image/avif";
  }

  return null;
}

/**
 * MP4 is the same ISO-BMFF container family as AVIF/HEIC - both are a
 * `....ftyp<brand>` box - so this only returns true for the common MP4/M4V
 * brands, and image sniffing above only returns true for avif/avis. A file
 * cannot satisfy both.
 */
const MP4_BRANDS = new Set([
  "isom",
  "iso2",
  "iso4",
  "iso5",
  "iso6",
  "mp41",
  "mp42",
  "mp4v",
  "avc1",
  "dash",
  "M4V ",
  "M4A ",
  "qt  ",
]);

export function sniffVideoType(bytes: Uint8Array): "video/mp4" | null {
  if (bytes.length < 12) return null;
  const ftyp = String.fromCharCode(...bytes.slice(4, 8));
  if (ftyp !== "ftyp") return null;
  const brand = String.fromCharCode(...bytes.slice(8, 12));
  return MP4_BRANDS.has(brand) ? "video/mp4" : null;
}

/**
 * MP3: either an ID3v2 tag (`ID3` at byte 0, present on almost every real-
 * world file) or a bare MPEG audio frame sync - 11 set bits, i.e. byte 0 is
 * 0xFF and the top three bits of byte 1 are all set.
 */
export function sniffAudioType(bytes: Uint8Array): "audio/mpeg" | null {
  if (bytes.length < 4) return null;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return "audio/mpeg"; // "ID3"
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  return null;
}

const humanMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

export function validateUpload(file: {
  name: string;
  type: string;
  size: number;
  bytes: Uint8Array;
}): ValidationResult {
  if (file.size === 0) {
    return { ok: false, error: `"${file.name}" is empty.` };
  }

  const limit = maxBytesForMime(file.type);
  if (file.size > limit) {
    return {
      ok: false,
      error: `"${file.name}" is ${humanMb(file.size)} MB. The limit is ${humanMb(limit)} MB for this file type.`,
    };
  }

  if ((ALLOWED_IMAGE_MIME as readonly string[]).includes(file.type)) {
    const actual = sniffImageType(file.bytes);
    if (!actual) return { ok: false, error: `"${file.name}" is not a readable image file.` };
    return { ok: true, mime: actual, mediaType: "image" };
  }

  if ((ALLOWED_VIDEO_MIME as readonly string[]).includes(file.type)) {
    const actual = sniffVideoType(file.bytes);
    if (!actual) return { ok: false, error: `"${file.name}" is not a readable MP4 video file.` };
    return { ok: true, mime: actual, mediaType: "video" };
  }

  if ((ALLOWED_AUDIO_MIME as readonly string[]).includes(file.type)) {
    const actual = sniffAudioType(file.bytes);
    if (!actual) return { ok: false, error: `"${file.name}" is not a readable MP3 audio file.` };
    return { ok: true, mime: actual, mediaType: "audio" };
  }

  return {
    ok: false,
    error: "Invalid file type. Please upload JPG, PNG, WEBP, AVIF, MP4 or MP3.",
  };
}
