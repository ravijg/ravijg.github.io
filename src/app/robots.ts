import type { MetadataRoute } from "next";
import { profile } from "@/data/resume";

// Prerendered at build time for the static GitHub Pages export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
