/**
 * Date handling shared by every Current Quantum surface (the catalog
 * timeline, its cards, and the lesson-embedded related widget). Centralized
 * here — rather than duplicated per component, as it briefly was — because
 * the timeline's proportional spacing and the cards' displayed date must
 * agree on exactly how a date string is parsed.
 *
 * Entries record dates at one of two precisions: a full "YYYY-MM-DD", or
 * "YYYY-MM" when only a month is confirmable (see `CurrentQuantumEntry.date`
 * in `src/lib/content/currentQuantum/types.ts`). Every function here respects
 * that instead of silently inventing a day.
 */

const MS_PER_DAY = 86_400_000;

function dateParts(iso: string): { year: number; month: number; day: number; hasDay: boolean } {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month ?? 1, day: day ?? 1, hasDay: iso.split("-").length === 3 };
}

/** Parsed as UTC noon-of-day-one-equivalent (midnight UTC) so date-only math
 *  (ordering, day counts) never shifts across a timezone boundary. */
export function parseEntryDate(iso: string): Date {
  const { year, month, day } = dateParts(iso);
  return new Date(Date.UTC(year, month - 1, day));
}

export function entryYear(iso: string): number {
  return parseEntryDate(iso).getUTCFullYear();
}

/** Long-form display date, e.g. "December 9, 2024" or "November 1994" when
 *  the source only confirms a month. */
export function formatEntryDate(iso: string): string {
  const { hasDay } = dateParts(iso);
  return parseEntryDate(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: hasDay ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

/** Value for a `<time dateTime="...">` attribute — the entry's own recorded
 *  precision, unpadded, never a fabricated day. */
export function entryDateTimeAttr(iso: string): string {
  return iso;
}

/** Absolute days between two entries' dates (order-independent). */
export function daysBetween(a: string, b: string): number {
  return Math.abs(parseEntryDate(a).getTime() - parseEntryDate(b).getTime()) / MS_PER_DAY;
}

/**
 * Vertical spacing (px) to place before a timeline entry, derived from the
 * real number of days since the previous (more recent) one. Log-scaled and
 * clamped so a multi-year historical gap doesn't blow the page height out,
 * while entries weeks apart still read as visibly closer together than ones
 * a year apart — the point is to make the field's accelerating pace
 * legible on scroll, not to plot time to a literal pixel scale.
 */
export function spineGapPx(days: number): number {
  const scaled = 20 * Math.log2(days + 2);
  return Math.min(260, Math.max(22, scaled));
}

// A `relativeRecency(iso, now)` helper used to live here — "3 weeks ago"
// style copy computed from `new Date()`. Removed deliberately (see
// docs/UX_REVIEW.md P0-2): this page is statically generated with no
// `export const revalidate`, so `new Date()` is evaluated once at build
// time and the "N weeks ago" readout it produced would be silently frozen
// at that instant and drift further from true with every day the build
// stays deployed — exactly wrong for a page whose entire premise is
// currency. The absolute dates from `formatEntryDate`/`entryDateTimeAttr`
// below are the only time-relative-*looking* facts this module now
// produces, and neither depends on "now" — they're honest for as long as
// the deployment lives, with no rebuild or revalidation schedule required
// to keep them true. Do not reintroduce a "how long ago" string without a
// live, client-only, post-mount computation (server and client would
// otherwise render different text and hydration would mismatch).
