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
 * `generateMetadata` from per-item content and call `pageOpenGraph` /
 * `pageCanonical` directly rather than this wrapper.
 */

import type { Metadata } from "next";
import { BASE_URL } from "./structuredData";

export { BASE_URL };

/** Absolute canonical URL for a site-root-relative path (e.g. "/about"). */
export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  const url = canonicalUrl(path);
  // The root layout's `title.template` ("%s · QuantumLearn") only applies to
  // the <title> tag, not to `openGraph`/`twitter` titles — those need the
  // site name spelled out explicitly to match what the <title> tag renders.
  const fullTitle = `${title} · QuantumLearn`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
