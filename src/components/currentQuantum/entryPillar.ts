import type { Pillar } from "@/lib/content/types";
import type { CurrentQuantumEntry } from "@/lib/content/currentQuantum/types";
import { PILLAR_ORDER } from "@/lib/design/pillars";

const PILLAR_SET = new Set<string>(PILLAR_ORDER);

/**
 * The curriculum pillar an entry connects back to, read directly off its
 * `relatedLessonSlug` rather than a second, hand-maintained mapping that
 * could drift out of sync with the data. Lesson slugs are always
 * `${pillar}/${module}/${lesson}` (see `src/content/lessons/*`, whose six
 * top-level folders are exactly `PILLAR_ORDER`), so the first path segment
 * *is* the pillar.
 *
 * Returns `undefined` (never a guess) for the impossible case of a slug that
 * doesn't start with a real pillar folder, so a caller can render an
 * untinted default instead of a wrong color.
 */
export function entryPillar(entry: CurrentQuantumEntry): Pillar | undefined {
  const [first] = entry.relatedLessonSlug.split("/");
  return PILLAR_SET.has(first) ? (first as Pillar) : undefined;
}
