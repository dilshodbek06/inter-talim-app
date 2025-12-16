import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";
import { eduGames } from "@/mock/mock-data";

const staticRoutes = ["/", "/resources", "/contact", "/sign-in", "/sign-up"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const gameRoutes = eduGames.map((game) => ({
    url: getAbsoluteUrl(game.webUrl),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const baseRoutes = staticRoutes.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  return [...baseRoutes, ...gameRoutes];
}
