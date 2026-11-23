import type { MetadataRoute } from "next";
import { ROUTES as TRANSPORT_ROUTES, SITE_URL as BASE_URL } from "@/lib/content";

const ROUTES = [
  "",
  "/services",
  "/how-it-works",
  "/faq",
  "/contact",
  "/reviews",
  "/quote",
  ...TRANSPORT_ROUTES.map((r) => `/routes/${r.slug}`),
  "/privacy",
  "/terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
