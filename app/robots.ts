import type { MetadataRoute } from "next";
import { SITE_URL } from "./constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/join-space", "/reset-password", "/settings", "/space/", "/universe"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
