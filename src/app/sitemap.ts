import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Public routes only - /admin is excluded and marked noindex. */
const routes = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/automation", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/gate-automation", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/home-lighting-automation", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/boom-barrier", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/engineering-lab-equipment", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/water-solutions", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/water-purifier-ro-plant", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/water-softener", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/security-solutions", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/cctv", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/security-alarm", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/college-projects", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/college-projects/ai-machine-learning", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/college-projects/computer-vision", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/college-projects/esp32-iot", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/college-projects/embedded-systems", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/college-projects/robotics", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
