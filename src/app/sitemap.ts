import type { MetadataRoute } from "next";
import { getAllLessonSlugs } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/registry";

// No production domain is configured anywhere in this repo (checked
// next.config.ts, .env*, and src/app/ for an existing "https://" reference).
// This is a placeholder — swap it for the real deployed domain.
const BASE_URL = "https://quantumlearn.example";

const STATIC_ROUTES = [
  "",
  "/about",
  "/learn",
  "/lessons",
  "/simulators",
  "/problems",
  "/hardware",
  "/software",
  "/mechanics",
  "/computing",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lessonSlugs, problemMeta] = await Promise.all([
    getAllLessonSlugs(),
    Promise.resolve(getAllProblemMeta()),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const lessonEntries: MetadataRoute.Sitemap = lessonSlugs.map((slug) => ({
    url: `${BASE_URL}/lessons/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const problemEntries: MetadataRoute.Sitemap = problemMeta.map((meta) => ({
    url: `${BASE_URL}/problems/${meta.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...lessonEntries, ...problemEntries];
}
