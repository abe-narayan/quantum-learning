import type { MetadataRoute } from "next";
import { COURSES } from "@/lib/content/curriculum";
import { getAllLessonSlugs } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";

import { BASE_URL } from "@/lib/structuredData";

const STATIC_ROUTES = [
  "",
  "/about",
  "/learn",
  // Not a redirect stub any more — `/lessons` is now the complete, grouped,
  // filterable index of every authored lesson (src/app/lessons/page.tsx).
  "/lessons",
  "/simulators",
  "/problems",
  "/hardware",
  "/software",
  "/mechanics",
  "/computing",
  "/mastery",
  "/apex",
  "/glossary",
  "/map",
  "/current-quantum",
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

  // `/courses/<slug>` is generated from this exact list too (the route's
  // `generateStaticParams` maps `COURSES`, with `dynamicParams = false`), so
  // the sitemap and the generated pages cannot drift apart: one array feeds
  // both. Ranked above lessons — a course page is the entry point a search
  // result should land on, and it links onward to every lesson it contains.
  const courseEntries: MetadataRoute.Sitemap = COURSES.map((course) => ({
    url: `${BASE_URL}/courses/${course.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
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

  return [...staticEntries, ...courseEntries, ...lessonEntries, ...problemEntries];
}
