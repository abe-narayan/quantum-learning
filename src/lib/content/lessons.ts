import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { LessonMeta, LessonMetaWithSlug } from "./types";

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

async function walk(dir: string, base = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      slugs.push(...(await walk(path.join(dir, entry.name), relativePath)));
    } else if (entry.name.endsWith(".mdx")) {
      slugs.push(relativePath.replace(/\.mdx$/, ""));
    }
  }

  return slugs;
}

/** All authored lesson slugs, e.g. "quantum-computing/qubits-and-quantum-states/what-is-a-qubit". */
export async function getAllLessonSlugs(): Promise<string[]> {
  try {
    return await walk(LESSONS_ROOT);
  } catch {
    return [];
  }
}

type LessonModule = {
  default: ComponentType;
  lessonMeta: LessonMeta;
};

/** Dynamically loads a single lesson's MDX component and metadata by slug. */
export async function loadLesson(slug: string): Promise<LessonModule | null> {
  try {
    const mod = (await import(`@/content/lessons/${slug}.mdx`)) as LessonModule;
    return mod;
  } catch {
    return null;
  }
}

/** Metadata for every authored lesson, used to drive catalog pages. */
export async function getAllLessonsMeta(): Promise<LessonMetaWithSlug[]> {
  const slugs = await getAllLessonSlugs();

  const lessons = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await loadLesson(slug);
      if (!mod) return null;
      return { ...mod.lessonMeta, slug };
    })
  );

  return lessons.filter((lesson): lesson is LessonMetaWithSlug => lesson !== null);
}

/** Every authored lesson belonging to a given course slug. */
export async function getLessonsForCourse(courseSlug: string): Promise<LessonMetaWithSlug[]> {
  const all = await getAllLessonsMeta();
  return all.filter((lesson) => lesson.course === courseSlug);
}
