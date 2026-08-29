/**
 * Full "Current Quantum" entries — meta joined to prose.
 *
 * SERVER-ONLY, because it imports `data.ts`. Every consumer of this module
 * renders whole cards (`/current-quantum`, `RelatedCurrentQuantum` at the
 * foot of each lesson), and all of them are server components that hand the
 * finished entries down as props.
 *
 * If all you need is a slug/date/title/category/lesson — as the concept
 * map's client panel does — import `metaRegistry.ts` instead. Importing this
 * file from a `"use client"` component pulls the whole collection's prose,
 * citations and image metadata into the browser bundle; see the header of
 * `metaRegistry.ts`, and `src/lib/design/__tests__/clientBoundary.test.ts`,
 * which fails if that ever happens again.
 *
 * The parallel to `src/lib/problems`: this is `registry.ts` to
 * `metaRegistry.ts`, in the same relationship and for the same reason.
 */
import { CURRENT_QUANTUM_BODIES } from "./data";
import { CURRENT_QUANTUM_META, getAllCurrentQuantumMeta } from "./metaRegistry";
import type {
  CurrentQuantumEntry,
  CurrentQuantumEntryBody,
  CurrentQuantumEntryMeta,
} from "./types";

export type {
  CurrentQuantumEntry,
  CurrentQuantumEntryMeta,
  CurrentQuantumEntryBody,
  CurrentQuantumCategory,
  CurrentQuantumSource,
} from "./types";

// Widened to a string index only because `CurrentQuantumEntryMeta.slug` is
// the public `string` type rather than the literal slug union. The lookup
// below is total by construction: `CURRENT_QUANTUM_BODIES` is typed
// `Record<CurrentQuantumSlug, ...>` over exactly the slugs in
// `CURRENT_QUANTUM_META`, so a missing body is a compile error in `data.ts`
// long before it could be an `undefined` here.
const BODIES: Record<string, CurrentQuantumEntryBody> = CURRENT_QUANTUM_BODIES;

function joinEntry(meta: CurrentQuantumEntryMeta): CurrentQuantumEntry {
  return { ...meta, ...BODIES[meta.slug] };
}

/**
 * All "Current Quantum" entries, newest first.
 *
 * Ordering is not decided here: it comes from `getAllCurrentQuantumMeta()`,
 * so the full-entry list and the meta-only list a client surface sees can
 * never disagree about what "newest" means.
 */
export function getAllCurrentQuantumEntries(): CurrentQuantumEntry[] {
  return getAllCurrentQuantumMeta().map(joinEntry);
}

export function getCurrentQuantumEntry(slug: string): CurrentQuantumEntry | undefined {
  const meta = CURRENT_QUANTUM_META.find((entry) => entry.slug === slug);
  return meta ? joinEntry(meta) : undefined;
}

/** Every entry that links back to a given lesson slug, for a "current developments" widget on a lesson page. */
export function getEntriesForLesson(lessonSlug: string): CurrentQuantumEntry[] {
  return getAllCurrentQuantumEntries().filter((entry) => entry.relatedLessonSlug === lessonSlug);
}
