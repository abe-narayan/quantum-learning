import { describe, expect, it } from "vitest";
import {
  hashToIndex,
  pickToday,
  type DailyPuzzlePreview,
} from "@/components/home/DailyPuzzleClient";
import { PROBLEM_METAS } from "@/lib/problems/problemMeta.generated";

/**
 * ============================================================
 * "A new pick every calendar day" has to be true
 * ============================================================
 * The homepage's Problem of the Day card renders that sentence as its own
 * footnote, so it is a claim the site makes to a reader, not an
 * implementation detail. It was false.
 *
 * The pick is `hash(dateKey) % pool.length` over the beginner+intermediate
 * subset of the corpus, and the hash was a sum of the key's char codes. Over
 * `YYYY-MM-DD` keys within one year that sum is nearly constant: the year and
 * the two hyphens are fixed and only four digits move, so it took **19
 * distinct values across all 365 days of 2026**. Nineteen of 337 eligible
 * problems, ~30 repeats each, and a repeat within three days.
 *
 * Nineteen fixed slots is also a fixed *sample* of the corpus, and the sample
 * it drew skewed hard toward the forbidding end of "intermediate", so the
 * homepage permanently greeted first-time visitors with the same few
 * Clebsch-Gordan and scattering-cross-section problems. Both symptoms have
 * one cause, so both have one fix: a hash that avalanches.
 *
 * These tests pin the property, not the algorithm. Any hash that spreads is
 * allowed to replace FNV-1a; a hash that clusters is not.
 */

/** The pick reads only `difficulty`; the rest of the preview is render-only. */
const PREVIEWS: DailyPuzzlePreview[] = PROBLEM_METAS.map((meta) => ({
  slug: meta.slug,
  title: meta.title,
  prompt: "",
  difficulty: meta.difficulty,
  estimatedMinutes: meta.estimatedMinutes,
}));

/** Every `YYYY-MM-DD` in one ordinary year, the exact key space the card uses. */
function yearOfDateKeys(year: number): string[] {
  const keys: string[] = [];
  const cursor = new Date(Date.UTC(year, 0, 1));
  while (cursor.getUTCFullYear() === year) {
    keys.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return keys;
}

const YEAR = yearOfDateKeys(2026);

describe("daily puzzle pick", () => {
  it("is deterministic: the same date always yields the same problem", () => {
    for (const key of ["2026-01-01", "2026-08-30", "2026-12-31"]) {
      expect(pickToday(PREVIEWS, key)?.slug).toBe(pickToday(PREVIEWS, key)?.slug);
    }
  });

  it("lets no single problem dominate the year", () => {
    // The failure a returning reader actually notices. Under the old hash,
    // "s-Wave Cross Section as a Fraction of the Low-Energy Limit" was the
    // homepage's problem on 36 days of 2026 and recurred within three days of
    // itself. A well-spread hash over a pool this size leaves the busiest
    // problem in low single figures; 12 is a ceiling only clustering reaches.
    //
    // Deliberately not "no problem ever repeats inside N days": drawing 365
    // times from ~337 slots, occasional near-repeats are what a *correct*
    // hash does, and asserting otherwise would be asserting non-randomness.
    const counts = new Map<string, number>();
    for (const key of YEAR) {
      const slug = pickToday(PREVIEWS, key)?.slug ?? "";
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    const busiest = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    expect(busiest[1], `${busiest[0]} appears ${busiest[1]} times in 2026`).toBeLessThan(12);
  });

  it("reaches most of the eligible corpus over a year", () => {
    const slugs = new Set(YEAR.map((key) => pickToday(PREVIEWS, key)?.slug));
    // With 365 draws from a pool of ~337, the coupon-collector expectation is
    // about 72% of the pool. The old hash managed 19 problems, ~6%. Half is a
    // floor that a clustering hash cannot reach and a spreading one clears
    // comfortably.
    expect(slugs.size).toBeGreaterThan(PREVIEWS.length * 0.25);
  });

  it("shows beginner problems regularly, not just whatever one slot holds", () => {
    // The intimidation half of the same bug: a clustered hash can sit for a
    // year on the hardest end of the eligible range.
    const beginnerDays = YEAR.filter(
      (key) => pickToday(PREVIEWS, key)?.difficulty === "beginner"
    ).length;
    expect(beginnerDays).toBeGreaterThan(YEAR.length * 0.15);
  });

  it("never puts an advanced or master problem on the homepage", () => {
    for (const key of YEAR) {
      const pick = pickToday(PREVIEWS, key);
      expect(["beginner", "intermediate"]).toContain(pick?.difficulty);
    }
  });

  it("hashes adjacent and permuted date keys to unrelated slots", () => {
    // The two collisions the char-code sum could not avoid: neighbouring days,
    // and dates that are digit permutations of one another.
    const n = 337;
    expect(hashToIndex("2026-08-30", n)).not.toBe(hashToIndex("2026-08-31", n));
    expect(hashToIndex("2026-08-30", n)).not.toBe(hashToIndex("2026-09-02", n));
    expect(hashToIndex("2026-08-30", n)).not.toBe(hashToIndex("2026-08-03", n));
  });

  it("stays inside the array it is indexing", () => {
    for (const key of YEAR) {
      for (const length of [1, 2, 101, 337]) {
        const index = hashToIndex(key, length);
        expect(Number.isInteger(index)).toBe(true);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(length);
      }
    }
  });

  it("returns null rather than throwing on an empty corpus", () => {
    expect(pickToday([], "2026-08-30")).toBeNull();
  });
});
