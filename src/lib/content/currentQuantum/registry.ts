import { CURRENT_QUANTUM_ENTRIES } from "./data";
import type { CurrentQuantumEntry } from "./types";

export type { CurrentQuantumEntry, CurrentQuantumCategory, CurrentQuantumSource } from "./types";

/**
 * All "Current Quantum" entries, newest first.
 *
 * `CURRENT_QUANTUM_ENTRIES` itself is kept chronological (oldest first) in
 * `data.ts` for ease of hand-editing; this is the one place that ordering
 * gets reversed for display, mirroring how `getAllProblemMeta()` /
 * `getAllLessonsMeta()` in this codebase each own their catalog's public
 * ordering rather than leaving it to call sites.
 */
export function getAllCurrentQuantumEntries(): CurrentQuantumEntry[] {
  return [...CURRENT_QUANTUM_ENTRIES].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getCurrentQuantumEntry(slug: string): CurrentQuantumEntry | undefined {
  return CURRENT_QUANTUM_ENTRIES.find((entry) => entry.slug === slug);
}

/** Every entry that links back to a given lesson slug, for a "current developments" widget on a lesson page. */
export function getEntriesForLesson(lessonSlug: string): CurrentQuantumEntry[] {
  return getAllCurrentQuantumEntries().filter((entry) => entry.relatedLessonSlug === lessonSlug);
}
