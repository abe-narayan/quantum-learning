/**
 * Shared `Metadata` builder for static pages.
 *
 * Every top-level route (about, glossary, map, learn, the five pillar pages,
 * simulators, problems, lessons) had its own hand-rolled `title`/`description`
 * export with no `openGraph`, `twitter`, or `alternates.canonical`. Since
 * Next.js does *not* deep-merge a child segment's `openGraph`/`twitter` with
 * the parent layout's — a segment that omits them inherits the parent's
 * *whole* object — every one of those pages was silently showing the
 * homepage's Open Graph title/description on social previews instead of its
 * own. This centralizes the fix so each page only has to supply its real
 * title, description, and path.
 *
 * Dynamic routes (lessons/[...slug], problems/[slug]) build their own
 * `generateMetadata` from per-item content and call `pageOpenGraph` directly
 * rather than this wrapper; `src/app/not-found.tsx` does the same, because a
 * 404 has a title and a card but no canonical URL of its own. Those three are
 * the reason `pageOpenGraph` is a separate export: it is the one place the
 * social card and `og:site_name` are named, and every metadata family on the
 * site now goes through it.
 */

import type { Metadata } from "next";
import { BASE_URL, SITE_NAME } from "./structuredData";

export { BASE_URL, SITE_NAME };

/** Absolute canonical URL for a site-root-relative path (e.g. "/about"). */
export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

/**
 * The site-wide social card, declared explicitly so every route emits it.
 *
 * `src/app/opengraph-image.tsx` is the file-convention default, and Next.js
 * only merges it into a segment's `openGraph` when that segment does not
 * declare `images` itself. Look at how it does the merge
 * (`mergeStaticMetadata` in next/dist/lib/metadata/resolve-metadata.js):
 * the static image is attached to the *root* segment's resolved object, and
 * a child segment's own `openGraph` then REPLACES that object outright rather
 * than merging into it. Every route on this site declares `openGraph` — that
 * is what gives each page its own social title instead of the homepage's —
 * so every route was dropping the image with it. 813 of 815 routes shipped
 * with no `og:image` at all: every lesson, every problem, every course,
 * /about, /glossary. Only `/` and the 404 (which inherits root metadata
 * wholesale) kept it.
 *
 * Re-declaring the same route path here is the fix, and it is the one Next
 * documents: a relative URL resolves against `metadataBase` (set in
 * src/app/layout.tsx from `BASE_URL`), so this becomes an absolute
 * https://studyquantum.org/opengraph-image in a production build. Scrapers
 * are given the same bytes the file convention serves, from the same route.
 *
 * `width`/`height` mirror the `size` export in src/app/opengraph-image.tsx —
 * 1200x630, the Open Graph standard the card is drawn at. They let a scraper
 * lay the card out before the image finishes downloading. `alt` is
 * deliberately NOT restated: that string lives in `opengraph-image.tsx` and
 * carries a derived problem count, and a second hand-kept copy of it here is
 * exactly the drift this codebase has already been bitten by twice. `/` and
 * the 404 still emit `og:image:alt` from the file convention.
 */
export const SITE_OG_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630 }];

/**
 * The shared Open Graph object every route builds from.
 *
 * `siteName` and `images` are the two properties that must appear on every
 * route and were on none of them but `/`; funnelling all four metadata
 * families (this file's static pages, courses, lessons, problems) through one
 * builder is what keeps that true as routes are added.
 *
 * The `type` branch is written as two literal object spreads rather than one
 * object with a `type: "website" | "article"` field because Next's `OpenGraph`
 * type is a discriminated union on `type` — a widened field does not narrow to
 * either arm.
 */
export function pageOpenGraph(opts: {
  title: string;
  description: string;
  /** Absolute canonical URL. Omitted for pages with no URL of their own (the 404). */
  url?: string;
  type?: "website" | "article";
}): Metadata["openGraph"] {
  const shared = {
    title: opts.title,
    description: opts.description,
    siteName: SITE_NAME,
    images: SITE_OG_IMAGES,
    ...(opts.url ? { url: opts.url } : {}),
  };
  return opts.type === "article"
    ? { ...shared, type: "article" as const }
    : { ...shared, type: "website" as const };
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  const url = canonicalUrl(path);
  // The root layout's `title.template` ("%s · StudyQuantum") only applies to
  // the <title> tag, not to `openGraph`/`twitter` titles — those need the
  // site name spelled out explicitly to match what the <title> tag renders.
  const fullTitle = `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: pageOpenGraph({ title: fullTitle, description, url, type: "website" }),
    // No `images` here on purpose: Next fills `twitter.images` from
    // `openGraph.images` when twitter declares none, so the card above is the
    // single place the image is named. No `site`/`creator` either — this
    // project has no verified account to point them at, and a handle that
    // does not exist is worse than an absent tag.
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
