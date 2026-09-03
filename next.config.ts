import type { NextConfig } from "next";

/**
 * Remote image hosts are opt-in via env so that a deployment can point at
 * Supabase Storage / S3 / Cloudinary without a code change.
 * e.g. NEXT_PUBLIC_IMAGE_HOSTS="xyz.supabase.co,res.cloudinary.com"
 */
const remoteHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Lets the dev server accept requests proxied through a Cloudflare quick
   * tunnel. Dev-only setting - `next start` ignores it entirely, so this has
   * no effect on production.
   */
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: remoteHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  /**
   * ffmpeg-static/ffprobe-static locate their bundled binary via a
   * `path.join(__dirname, ...)` computed at require time. Left to Next's
   * default webpack bundling, the route handler that imports them gets
   * inlined into a single server chunk - and webpack rewrites `__dirname`
   * to that chunk's own output location, not the real node_modules folder,
   * so the binary path resolves to a file that was never copied there
   * (ENOENT at runtime, silently caught and treated as "ffmpeg unavailable").
   * Marking both as external keeps them as plain `require()` calls resolved
   * from node_modules at runtime, where `__dirname` is correct.
   */
  serverExternalPackages: ["ffmpeg-static", "ffprobe-static"],
  experimental: {
    // Gallery uploads are multipart; allow reasonable bulk batches.
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default nextConfig;
