import type { SearchEntryType } from "./types";

/**
 * How the search overlay's *groups* are ordered relative to each other.
 *
 * `match.ts` decides how well one entry answers a query; this decides which
 * kind of answer a reader sees first. Kept here, pure and free of React, for
 * the same reason the matcher is — so it can be unit-tested directly
 * (`__tests__/groupRanking.test.ts`) rather than through a rendered dialog.
 */

/**
 * The curated order, used as the tie-break inside a relevance band.
 *
 * Glossary first: the most common query from someone new to the subject is a
 * word they just hit and didn't recognise, and for that query a one-paragraph
 * definition is a better landing than a 20-minute lesson — especially since a
 * glossary entry links straight on to the lessons that cover it, so it costs a
 * reader who wanted the lesson exactly one extra click while saving the reader
 * who wanted the definition a dead-end detour.
 *
 * `track` last: six entries a reader almost always reaches through the nav
 * instead. They earn their place in the index because typing a subject name
 * ("hardware", "mechanics") previously returned lessons *about* it and never
 * the section itself — but they should not outrank a lesson.
 */
export const TYPE_ORDER: SearchEntryType[] = [
  "term",
  "lesson",
  "problem",
  "simulator",
  "course",
  "track",
];

const TYPE_RANK = new Map(TYPE_ORDER.map((type, index) => [type, index]));

/** `relevanceBand` values, named where they are reasoned about rather than
 *  left as bare numerals. 0 = exact title, 1 = title prefix or whole
 *  initialism, 2 = every token somewhere in the title, 3 = the description
 *  contains the query as a term, 4 = the entry's body teaches that term,
 *  5 and 6 = the description / the body contain the query's words but not the
 *  term. Anything past 3 is "weaker than a description hit", which is all a
 *  group ordering needs to know. */
const SCORE_NAMED = 1;
const SCORE_TITLE = 2;
const SCORE_DESCRIPTION = 3;

/**
 * How strongly a group's *best* result is named by the query, coarsened from
 * `matchScore`'s four bands into three. This is the primary sort key across
 * groups; `TYPE_ORDER` only breaks ties within a band.
 *
 * The type order alone used to decide group order outright, and that buries
 * the best answer whenever it lives in a lower-priority kind. `|0>` is the
 * clearest case: five Problems carry a ket in their *title* (band 2) and they
 * rendered below six Lessons and twenty-two Glossary terms that merely mention
 * one somewhere in a paragraph (band 3). Twelve description-only matches ahead
 * of five literal title matches is not a ranking, it is the type order
 * pretending to be one.
 *
 * Three bands rather than the raw score, because the score's finer
 * distinctions are more than a *group* ordering can carry: an exact title hit
 * and a title-prefix hit ("bell" vs "bell state") both mean "the query names
 * this thing", and letting them separate whole kinds would make the group
 * order rearrange itself as a reader types the next letter of a word.
 *
 * The fourth band, added with the lesson keyword sets, is not a finer
 * distinction of the same kind — it is a different *source*. Bands 0–2 come
 * from what an entry calls itself and band 2 from what its one-line summary
 * says; band 3 here comes only from a term buried in a lesson body. A group
 * that can offer nothing better than that is the last thing a reader should
 * be shown, and keeping it in its own band is what guarantees that adding
 * keywords cannot reorder the groups of any query that already had a real
 * answer: the new matches can only appear in a band that did not exist before
 * and sorts after every band that did.
 */
export function leadBand(bestScore: number): number {
  if (bestScore <= SCORE_NAMED) return 0;
  if (bestScore <= SCORE_TITLE) return 1;
  if (bestScore <= SCORE_DESCRIPTION) return 2;
  return 3;
}

/**
 * The `TYPE_ORDER` tie-break, with the glossary's one standing exception
 * folded in rather than applied afterwards as a re-splice of the sorted list.
 *
 * Glossary leads its band only when it actually matched a *term*. Definitions
 * are full paragraphs, so a common word ("state", "system", "phase") matches
 * dozens of them on description text alone, and letting that push the lessons
 * below the fold would be the opposite of helpful. When the glossary's best
 * hit is description-only it sits just under Lessons instead — the same
 * outcome the previous explicit re-ranking produced.
 *
 * `leadBand` does not subsume this on its own: when Glossary and Lessons are
 * both description-only they share a band, and the raw type order would put
 * Glossary back on top. That is precisely the case the exception exists for,
 * so it survives the generalisation rather than being replaced by it.
 */
export function groupRank(type: SearchEntryType, bestScore: number): number {
  if (type === "term" && bestScore > SCORE_TITLE) {
    return (TYPE_RANK.get("lesson") ?? 0) + 0.5;
  }
  return TYPE_RANK.get(type) ?? TYPE_ORDER.length;
}

/** Comparator for `Array.prototype.sort`: relevance band first, curated kind
 *  order second. Total, so the sort is deterministic for any input. */
export function compareGroups(
  a: { type: SearchEntryType; bestScore: number },
  b: { type: SearchEntryType; bestScore: number }
): number {
  return (
    leadBand(a.bestScore) - leadBand(b.bestScore) ||
    groupRank(a.type, a.bestScore) - groupRank(b.type, b.bestScore)
  );
}
