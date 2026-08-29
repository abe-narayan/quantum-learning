/**
 * Deterministic, seeded display order for multiple-choice options.
 *
 * WHY: the authored option order put the correct answer first in the large
 * majority of problems — an exploit a student notices after two or three
 * problems. Shuffling at render time fixes that, but the order must be a
 * pure function of the problem (no Math.random, no per-visit state) so
 * that (a) server render and client hydration agree byte-for-byte, and
 * (b) a student sees the same order every visit, which keeps the problem
 * feeling stable rather than slot-machine-like.
 *
 * Validation is unaffected: submissions carry the option *id*, and
 * `correctOptionId`/`optionFeedback` are keyed by id, never by position.
 * Display letters (A, B, C, ...) are assigned from the shuffled order, by
 * `displayLetters` below — the *only* function allowed to turn a position into
 * a letter, so that everything a reader sees a letter in (the answer list, and
 * the solution's "common mistakes" cross-references) is reading the same map.
 */

/** FNV-1a 32-bit hash — small, well-distributed, dependency-free. */
function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 PRNG — deterministic 32-bit generator seeded from the slug hash. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A new array with `items` in a shuffled order derived entirely from
 * `seedKey` (Fisher-Yates over a seeded PRNG). Same key, same order — on
 * the server, on the client, on every visit. The input array is not
 * mutated.
 */
export function seededShuffle<T>(items: readonly T[], seedKey: string): T[] {
  const shuffled = [...items];
  const random = mulberry32(fnv1a(seedKey));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * The label for slot `index` of a displayed option list: A, B, C, ... Z, then
 * AA, AB, ... — spreadsheet-style rather than a bare `String.fromCharCode(65 +
 * index)`, which silently starts emitting "[", "\", "]" at the 27th option.
 * No authored problem is anywhere near that today (the widest is five
 * options), but this is the one function that turns a position into something
 * a reader sees, and a numbering scheme that degrades into punctuation past a
 * threshold nobody is checking is not worth the three lines it saves.
 */
function letterForIndex(index: number): string {
  let label = "";
  for (let n = index; n >= 0; n = Math.floor(n / 26) - 1) {
    label = String.fromCharCode(65 + (n % 26)) + label;
  }
  return label;
}

/**
 * Option id → the letter that option carries in its *displayed* position for
 * `seedKey`.
 *
 * This is the single owner of the position-to-letter step. It exists because
 * two components need the same answer and used to derive it separately:
 * `AnswerInput` assigns letters while it maps over the shuffled options, and
 * `SolutionPanel` has to name an option ("Option B confuses...") in prose
 * written long before the reader's display order was known. Two copies of
 * `65 + index` are two copies that can disagree — and the way they disagree is
 * invisible in review and silent at runtime: the student reads an explanation
 * about a letter that sat beside a different answer. Routing both through here
 * makes the disagreement unrepresentable.
 *
 * Pure in `options` and `seedKey` (it is `seededShuffle` plus a numbering), so
 * it carries the same guarantees: identical on the server and on the client,
 * identical on every visit, and unaffected by anything the reader does.
 */
export function displayLetters<T extends { id: string }>(
  options: readonly T[],
  seedKey: string
): Map<string, string> {
  const letters = new Map<string, string>();
  seededShuffle(options, seedKey).forEach((option, index) => {
    letters.set(option.id, letterForIndex(index));
  });
  return letters;
}
