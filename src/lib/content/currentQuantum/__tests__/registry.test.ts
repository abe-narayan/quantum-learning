import { describe, expect, it } from "vitest";
import { CURRENT_QUANTUM_BODIES } from "../data";
import {
  CURRENT_QUANTUM_META,
  getAllCurrentQuantumMeta,
  getCurrentQuantumMetaForLesson,
} from "../metaRegistry";
import {
  getAllCurrentQuantumEntries,
  getCurrentQuantumEntry,
  getEntriesForLesson,
} from "../registry";

/**
 * THE integrity guard for the meta/body split.
 *
 * The "Current Quantum" collection is authored in two halves on purpose:
 * `metaRegistry.ts` holds the five link-shaped fields (slug, date, title,
 * category, related lesson) and is the only half a client bundle may reach;
 * `data.ts` holds the summary, "why this matters", citation, difficulty and
 * figure, keyed by slug, and is server-only. `registry.ts` rejoins them.
 * `src/lib/design/__tests__/clientBoundary.test.ts` enforces the boundary
 * itself — its size budget and its SERVER_ONLY list. This file enforces that
 * the split stayed *lossless*: every entry still has both halves, the join
 * puts them back together intact, and the meta-only lookups agree with their
 * full-entry twins about which entries exist and in what order.
 *
 * Unlike `src/lib/problems/__tests__/metaRegistry.test.ts` — where the metas
 * are text-extracted from the real problem modules by a generator and can
 * drift from them — nothing here is duplicated between the two files, so
 * there is no field-level drift to catch. What can go wrong is a *missing or
 * orphaned half* (mostly caught at compile time by
 * `Record<CurrentQuantumSlug, CurrentQuantumEntryBody>`, re-checked here so
 * the failure is legible) and the two lookup families disagreeing.
 */
describe("the Current Quantum meta/body split stays lossless", () => {
  it("has a unique slug per meta entry", () => {
    const slugs = CURRENT_QUANTUM_META.map((meta) => meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has exactly one body per meta entry and no orphan bodies", () => {
    const metaSlugs = [...CURRENT_QUANTUM_META.map((meta) => meta.slug)].sort();
    const bodySlugs = Object.keys(CURRENT_QUANTUM_BODIES).sort();
    expect(bodySlugs).toEqual(metaSlugs);
  });

  it("guards the guard: the collection is non-trivial", () => {
    // If either half were ever emptied, every assertion here would pass over
    // nothing.
    expect(CURRENT_QUANTUM_META.length).toBeGreaterThan(20);
  });

  it("rejoins both halves into a complete entry, with no field lost or clobbered", () => {
    const entries = getAllCurrentQuantumEntries();
    expect(entries.length).toBe(CURRENT_QUANTUM_META.length);

    for (const entry of entries) {
      const meta = CURRENT_QUANTUM_META.find((candidate) => candidate.slug === entry.slug);
      const body = CURRENT_QUANTUM_BODIES[entry.slug as keyof typeof CURRENT_QUANTUM_BODIES];
      // Element-wise, so a failure names the entry that broke rather than
      // dumping all 32.
      expect(entry, `entry "${entry.slug}"`).toEqual({ ...meta, ...body });
    }
  });

  it("keeps every entry's required prose and citation non-empty", () => {
    for (const entry of getAllCurrentQuantumEntries()) {
      expect(entry.summary.length, `summary of "${entry.slug}"`).toBeGreaterThan(0);
      expect(entry.whyThisMatters.length, `whyThisMatters of "${entry.slug}"`).toBeGreaterThan(0);
      expect(entry.source.name.length, `source.name of "${entry.slug}"`).toBeGreaterThan(0);
      expect(entry.source.url, `source.url of "${entry.slug}"`).toMatch(/^https:\/\//);
    }
  });

  it("keeps alt text and attribution attached to every figure", () => {
    // These live in the body half; the split must not have separated an
    // image from the credit that makes it legal to show or the alt text that
    // makes it legible to a screen reader.
    const withImages = getAllCurrentQuantumEntries().filter((entry) => entry.imageUrl);
    expect(withImages.length).toBeGreaterThan(0);
    for (const entry of withImages) {
      expect(entry.imageAlt, `imageAlt of "${entry.slug}"`).toBeTruthy();
      expect(entry.imageAttribution?.credit, `credit of "${entry.slug}"`).toBeTruthy();
      expect(entry.imageAttribution?.license, `license of "${entry.slug}"`).toBeTruthy();
    }
  });
});

describe("meta-only lookups agree with their full-entry twins", () => {
  it("getAllCurrentQuantumMeta and getAllCurrentQuantumEntries return the same slugs in the same order", () => {
    // Display order is decided once, in `getAllCurrentQuantumMeta`. If these
    // diverged, the concept map's mini-cards and the /current-quantum
    // timeline would disagree about which development is the most recent.
    expect(getAllCurrentQuantumEntries().map((entry) => entry.slug)).toEqual(
      getAllCurrentQuantumMeta().map((meta) => meta.slug)
    );
  });

  it("orders newest first", () => {
    const dates = getAllCurrentQuantumMeta().map((meta) => meta.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("getCurrentQuantumMetaForLesson matches getEntriesForLesson for every referenced lesson", () => {
    const lessons = new Set(CURRENT_QUANTUM_META.map((meta) => meta.relatedLessonSlug));
    expect(lessons.size).toBeGreaterThan(0);
    for (const lesson of lessons) {
      expect(getCurrentQuantumMetaForLesson(lesson).map((meta) => meta.slug)).toEqual(
        getEntriesForLesson(lesson).map((entry) => entry.slug)
      );
    }
  });

  it("returns nothing for a lesson with no entry, on both sides", () => {
    expect(getCurrentQuantumMetaForLesson("definitely/not/a-lesson")).toEqual([]);
    expect(getEntriesForLesson("definitely/not/a-lesson")).toEqual([]);
  });

  it("getCurrentQuantumEntry finds a real slug and misses a fake one", () => {
    const first = getAllCurrentQuantumEntries()[0];
    expect(getCurrentQuantumEntry(first.slug)).toEqual(first);
    expect(getCurrentQuantumEntry("definitely-not-an-entry-slug")).toBeUndefined();
  });
});
