import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const execFileAsync = promisify(execFile);

/**
 * Server-side video/audio inspection.
 *
 * Neither ffmpeg-static nor ffprobe-static needs a system install - both
 * bundle a platform binary, resolved at `ffmpegPath` / `ffprobeStatic.path`.
 * We shell out directly rather than going through a wrapper library: the
 * only two operations needed are "grab one frame" and "read duration/
 * dimensions as JSON", and the CLI invocations for both are short enough
 * that a wrapper adds a dependency without saving any real code.
 *
 * Video is never re-encoded - only inspected. Transcoding would mean
 * committing to a codec, bitrate and quality ladder, which is a much bigger
 * feature than "accept the format"; the uploaded MP4 is stored as-is.
 *
 * Every operation here is best-effort: if the bundled binary is missing or a
 * file is unusual enough to trip up ffprobe, callers get `null` fields and
 * the upload still succeeds with a generic placeholder rather than failing
 * outright. A corrupt/unreadable file was already rejected earlier by the
 * magic-byte check in validate.ts - by the time code reaches this module the
 * file is a genuine MP4 or MP3, just possibly an edge case ffprobe dislikes.
 */

type ProbeInfo = {
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
};

async function withTempFile<T>(
  buffer: Buffer,
  extension: string,
  task: (filePath: string, dir: string) => Promise<T>,
): Promise<T> {
  const dir = await mkdtemp(path.join(tmpdir(), "autonex-media-"));
  const filePath = path.join(dir, `input.${extension}`);
  try {
    await writeFile(filePath, buffer);
    return await task(filePath, dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function probe(filePath: string): Promise<ProbeInfo> {
  try {
    const { stdout } = await execFileAsync(ffprobeStatic.path, [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=width,height,codec_type",
      "-of",
      "json",
      filePath,
    ]);

    const parsed = JSON.parse(stdout) as {
      format?: { duration?: string };
      streams?: { codec_type?: string; width?: number; height?: number }[];
    };

    const duration = parsed.format?.duration ? Math.round(Number(parsed.format.duration)) : null;
    const videoStream = parsed.streams?.find((stream) => stream.codec_type === "video");

    return {
      durationSeconds: Number.isFinite(duration) ? duration : null,
      width: videoStream?.width ?? null,
      height: videoStream?.height ?? null,
    };
  } catch (error) {
    console.error("[gallery/video] ffprobe failed:", error);
    return { durationSeconds: null, width: null, height: null };
  }
}

export type VideoInspection = {
  /** null when frame extraction failed - caller falls back to a placeholder poster. */
  posterBuffer: Buffer | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
};

const THUMB_WIDTH = 640;

export async function inspectVideo(buffer: Buffer): Promise<VideoInspection> {
  return withTempFile(buffer, "mp4", async (filePath, dir) => {
    const info = await probe(filePath);

    let posterBuffer: Buffer | null = null;
    if (ffmpegPath) {
      try {
        // 10% into the clip (capped at 3s) - past any fade-from-black intro,
        // without waiting to decode a long file just to grab one frame.
        const seekTo = info.durationSeconds
          ? Math.min(3, Math.max(0.1, info.durationSeconds * 0.1))
          : 0.5;
        const frameFile = path.join(dir, "frame.jpg");

        await execFileAsync(ffmpegPath, [
          "-ss",
          String(seekTo),
          "-i",
          filePath,
          "-frames:v",
          "1",
          "-q:v",
          "3",
          "-y",
          frameFile,
        ]);

        const rawFrame = await readFile(frameFile);
        posterBuffer = await sharp(rawFrame)
          .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
          .webp({ quality: 72, effort: 4 })
          .toBuffer();
      } catch (error) {
        console.error("[gallery/video] frame extraction failed:", error);
      }
    }

    return {
      posterBuffer,
      width: info.width,
      height: info.height,
      durationSeconds: info.durationSeconds,
    };
  });
}

export async function inspectAudio(buffer: Buffer): Promise<{ durationSeconds: number | null }> {
  return withTempFile(buffer, "mp3", async (filePath) => {
    const info = await probe(filePath);
    return { durationSeconds: info.durationSeconds };
  });
}
