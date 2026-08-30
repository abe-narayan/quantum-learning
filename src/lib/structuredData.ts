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
// A value import, unlike the type-only line above. `curriculum.ts` is a plain
// data module (930 lines of course records, one `import type` and nothing
// else — verified, not assumed), already inside the client-data budget at
// ~12 KB in clientBoundary.test.ts, so pulling it in here to resolve a
// prerequisite slug to its real course costs the build none of what the
// problem/lesson registries would. It is needed for `coursePrerequisites`,
// which was emitting raw slugs.
import { getCourse } from "./content/curriculum";
import type { ProblemDifficulty } from "./problems/types";
import { PROBLEM_TO_DIFFICULTY } from "./problems/types";
import { PROBLEM_METAS } from "./problems/problemMeta.generated";

// Single source of truth for the site origin — src/app/sitemap.ts, robots.ts,
// and layout.tsx import this rather than redeclaring it (they used to carry
// four independent copies of the placeholder that all had to be swapped
// together). Resolution order:
//   1. NEXT_PUBLIC_SITE_URL — explicit override for any host.
//   2. VERCEL_PROJECT_PRODUCTION_URL — set automatically in every Vercel
//      build (bare domain, no protocol), so canonicals/OG/sitemap/robots are
//      correct on Vercel with zero configuration.
//   3. The literal production origin, https://studyquantum.org — the real
//      public home of the site, and the answer for a local build or any host
//      that sets neither env var. It used to be a `.example` placeholder;
//      it is now the actual domain, so a build that falls all the way through
//      still emits correct absolute URLs rather than unresolvable ones.
// Read at build time only (this is a pure-SSG site), so a changed env var
// takes effect on the next build, which is the only place it could anyway.
// `?.trim() || undefined` (not `??`): an env var set to "" or whitespace must
// fall through to the next source, not produce a BASE_URL that makes
// `new URL("")` throw at build time with an obscure message.
const configuredOrigin =
  (process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined) ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
    : undefined);
export const BASE_URL = (configuredOrigin ?? "https://studyquantum.org").replace(/\/+$/, "");

/**
 * The site's name, as it appears in JSON-LD (`Organization.name`,
 * `WebSite.name`) and now also as `og:site_name` on every route.
 *
 * Exported rather than module-private so `lib/pageMetadata.ts` can build the
 * Open Graph `siteName` from the same constant instead of retyping the word:
 * the same three files that used to each carry their own copy of the site
 * description are the reason this is a shared export.
 */
export const SITE_NAME = "StudyQuantum";

/**
 * How many graded problems the site has, counted rather than typed.
 *
 * The figure appeared as a literal in four files (`app/layout.tsx`,
 * `app/manifest.ts`, and `app/opengraph-image.tsx` twice) plus this one, with
 * a comment in `lib/nav.ts` asking a future editor to change all of them by
 * hand. It said 549 while the corpus held 556, having drifted twice in a
 * single day as problems were added, which is what a hand-kept figure does.
 *
 * `problemMeta.generated.ts` is the right thing to count from: it imports
 * nothing but the `ProblemMeta` type (verified, not assumed), so this reaches
 * no problem body and none of the `lib/quantum` graph that the build-memory
 * architecture exists to keep out of every route. Importing `problems/registry`
 * here instead would drag all 556 problem modules into every page that renders
 * a breadcrumb, which is the exact failure that architecture prevents.
 *
 * Server-only by construction: `clientBoundary.test.ts` lists both
 * `problems/metaRegistry` and `problems/problemMeta.generated` as SERVER_ONLY,
 * and no client component imports this module (every importer is a page, a
 * route handler, or `lib/pageMetadata.ts`, which itself has no client
 * readers). A future `"use client"` file reaching for `BASE_URL` would fail
 * that test loudly rather than shipping the index.
 */
export const PROBLEM_COUNT = PROBLEM_METAS.length;

/** Kept verbatim in step with `description` in src/app/layout.tsx and
 *  `description` in src/app/manifest.ts, which now import this constant rather
 *  than restating it: the same claim reaches a reader three times, as the
 *  search-result snippet, as JSON-LD and as an installed shortcut's blurb, and
 *  a crawler that finds them disagreeing trusts neither. */
export const SITE_DESCRIPTION = `Learn quantum mechanics and quantum computing from the ground up. 219 lessons, 14 simulators you can experiment with, and ${PROBLEM_COUNT} problems with worked solutions, from your first qubit to research-level fault tolerance.`;

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
    ...buildCoursePrerequisites(course),
  };
}

/**
 * `coursePrerequisites` as real, resolvable courses rather than raw slugs.
 *
 * This used to emit `course.prerequisites.join(", ")`, which put the literal
 * string `"classical-to-quantum"` into the graph: not a name a reader would
 * recognise, not a URL a crawler could follow, and not something schema.org
 * consumers can join up with the `Course` node that slug actually names.
 * Each prerequisite now resolves through `getCourse` to the course's authored
 * title and its own canonical `/courses/<slug>` page, both of which already
 * exist and are already rendered elsewhere on the site.
 *
 * A slug that resolves to nothing is dropped rather than emitted as bare
 * text: `/courses/<unknown>` would 404, and a prerequisite pointing at a
 * missing page is worse than a prerequisite that goes unmentioned.
 * `curriculum.test.ts` already asserts every prerequisite slug names a real
 * course, so in practice nothing is dropped — this is the belt for the day
 * that assertion is relaxed.
 */
function buildCoursePrerequisites(course: Course): JsonLd {
  const resolved = course.prerequisites
    .map((slug) => ({ slug, prerequisite: getCourse(slug) }))
    .filter(
      (entry): entry is { slug: string; prerequisite: Course } => entry.prerequisite !== undefined
    );
  if (resolved.length === 0) return {};
  return {
    coursePrerequisites: resolved.map(({ slug, prerequisite }) => ({
      "@type": "Course",
      name: prerequisite.title,
      url: `${BASE_URL}/courses/${slug}`,
      provider: { "@id": `${BASE_URL}/#organization` },
    })),
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
