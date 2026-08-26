/**
 * JSON-LD structured data (schema.org) builders.
 *
 * Pure functions that return plain JSON-LD objects — pages are responsible
 * for serializing the result into a `<script type="application/ld+json">`
 * tag (see `src/app/layout.tsx`, `src/app/lessons/[...slug]/page.tsx`,
 * `src/app/problems/[slug]/page.tsx`, and the pillar pages for examples).
 *
 * Every value here is real, derived data — titles, descriptions, and URLs
 * pulled from the same content sources `generateMetadata` already uses.
 * Nothing here fabricates ratings, reviews, prices, or any other property
 * that would require data this platform doesn't actually have.
 */

import type { Course, Difficulty, Pillar } from "./content/types";
import { DIFFICULTY_LABEL } from "./content/types";
import type { ProblemDifficulty } from "./problems/types";
import { PROBLEM_TO_DIFFICULTY } from "./problems/types";

// Placeholder domain — no production domain is configured anywhere in this
// repo. Matches the placeholder used in src/app/sitemap.ts, src/app/robots.ts,
// and src/app/layout.tsx; swap all of them for the real deployed domain
// together.
export const BASE_URL = "https://quantumlearn.example";

const SITE_NAME = "QuantumLearn";
const SITE_DESCRIPTION =
  "An interactive platform for learning quantum mechanics and quantum computing — lessons, simulators, and problem sets for advanced high-school and early-college students.";

/** A JSON-LD document: always includes "@context" and "@type". */
export type JsonLd = Record<string, unknown>;

export type BreadcrumbItem = { name: string; url: string };

// Mirrors TRACK_NAV_ITEMS in src/lib/nav.ts, keyed by pillar slug instead of
// nav label — the one place a pillar's slug (from lib/content/curriculum.ts)
// and its route path (a standalone top-level page, not /learn/[pillar]) are
// tied together.
const PILLAR_PATH: Record<Pillar, string> = {
  "quantum-mechanics": "/mechanics",
  "quantum-computing": "/computing",
  "quantum-hardware": "/hardware",
  "quantum-software": "/software",
  // Quantum Mastery now has its own pillar landing page (src/app/mastery) —
  // previously pointed at "/learn" because no dedicated page existed yet.
  "quantum-mastery": "/mastery",
  apex: "/apex",
};

/** The real, canonical URL for a pillar's listing page. */
export function pillarUrl(pillar: Pillar): string {
  return `${BASE_URL}${PILLAR_PATH[pillar]}`;
}

/** Site-wide `Organization` schema — who publishes this site. */
export function buildOrganizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
  };
}

/** Site-wide `WebSite` schema — what this site is. */
export function buildWebSiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en",
  };
}

/** A `BreadcrumbList` for the given path, in order from the site root. */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Per-lesson `LearningResource` schema.
 *
 * `LearningResource` (rather than `Article`) is the more accurate schema.org
 * type here: these pages teach a specific concept toward a curriculum, with
 * a difficulty level and a parent course, not an editorial/news article.
 */
export function buildLessonSchema(opts: {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  courseTitle: string;
  courseUrl?: string;
}): JsonLd {
  const url = `${BASE_URL}/lessons/${opts.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#lesson`,
    name: opts.title,
    headline: opts.title,
    description: opts.description,
    url,
    inLanguage: "en",
    learningResourceType: "Lesson",
    educationalLevel: DIFFICULTY_LABEL[opts.difficulty],
    isPartOf: {
      "@type": "Course",
      name: opts.courseTitle,
      ...(opts.courseUrl ? { url: opts.courseUrl } : {}),
    },
    provider: { "@id": `${BASE_URL}/#organization` },
  };
}

/** Per-problem `LearningResource` schema (a practice problem, not a lesson). */
export function buildProblemSchema(opts: {
  slug: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  courseTitle?: string;
  courseUrl?: string;
}): JsonLd {
  const url = `${BASE_URL}/problems/${opts.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#problem`,
    name: opts.title,
    description: opts.description,
    url,
    inLanguage: "en",
    learningResourceType: "Practice Problem",
    educationalLevel: DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY[opts.difficulty]],
    ...(opts.courseTitle
      ? {
          isPartOf: {
            "@type": "Course",
            name: opts.courseTitle,
            ...(opts.courseUrl ? { url: opts.courseUrl } : {}),
          },
        }
      : {}),
    provider: { "@id": `${BASE_URL}/#organization` },
  };
}

/** A single `Course` schema entry. `url` should point at a real page that represents this course (e.g. its pillar page, or its first lesson). */
export function buildCourseSchema(course: Course, url: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course-${course.slug}`,
    name: course.title,
    description: course.description,
    url,
    inLanguage: "en",
    educationalLevel: DIFFICULTY_LABEL[course.difficulty],
    provider: { "@id": `${BASE_URL}/#organization` },
    ...(course.prerequisites.length > 0
      ? { coursePrerequisites: course.prerequisites.join(", ") }
      : {}),
  };
}

/** An `ItemList` of `Course` entries, for a pillar/listing page. */
export function buildCourseListSchema(
  entries: { course: Course; url: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map(({ course, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildCourseSchema(course, url),
    })),
  };
}
