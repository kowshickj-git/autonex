/**
 * Neither package ships TypeScript declarations. Both have a trivial shape:
 * `ffmpeg-static` exports the resolved binary path directly, `ffprobe-static`
 * exports an object wrapping its own path + version.
 */

declare module "ffmpeg-static" {
  const ffmpegPath: string | null;
  export default ffmpegPath;
}

declare module "ffprobe-static" {
  const ffprobe: { path: string; version: string };
  export default ffprobe;
}
