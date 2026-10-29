import type { MetadataRoute } from "next";
import { profile } from "@/data/resume";

// Prerendered at build time for the static GitHub Pages export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
