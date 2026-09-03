/**
 * next/image refuses to optimise a remote host that is not declared in
 * `next.config.ts`. Rather than let a missing NEXT_PUBLIC_IMAGE_HOSTS entry
 * break the gallery outright, we detect the situation and fall back to
 * serving the file directly.
 *
 * That fallback is safe here because every uploaded image has already been
 * resized and re-encoded to WebP by sharp at upload time - Next's optimiser
 * is a bonus, not a requirement.
 */
const allowedHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export function canOptimize(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // same-origin, always fine
  try {
    return allowedHosts.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
