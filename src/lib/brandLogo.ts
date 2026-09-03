import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves the brand logo on the SERVER, before any HTML is sent.
 *
 * Why not just render <img> and handle onError in the browser: the image 404s
 * during the initial paint, which is before React has hydrated and attached
 * the handler. The error event fires into the void, the fallback never runs,
 * and the visitor is left staring at broken-image alt text. Checking the file
 * here means a missing logo is simply never rendered as an <img> at all.
 *
 * Candidates are ordered by preference - SVG stays sharp at any size, so it
 * wins if the owner supplies one.
 */
const CANDIDATES = ["/logo.svg", "/logo.png", "/logo.webp", "/logo.jpg", "/logo.jpeg"] as const;

export function resolveBrandLogo(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const candidate of CANDIDATES) {
    if (existsSync(path.join(publicDir, candidate.replace(/^\//, "")))) return candidate;
  }
  return null;
}
