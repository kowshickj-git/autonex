import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin console and its APIs must never be crawled.
      disallow: ["/admin", "/admin/", "/api/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
