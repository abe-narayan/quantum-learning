/**
 * The other recovery pass: what to search for when the reader typed a
 * *question* instead of a term.
 *
 * `didYouMean.ts` handles the reader who typed the right word wrongly. This
 * handles the reader who typed the right word inside a sentence — "what is a
 * bra", "how does decoherence work", "why do qubits need error correction" —
 * which is what someone who has never used a documentation search box types,
 * and is exactly the reader search exists for.
 *
 * The failure it fixes is not a corpus gap. `bra` is in a lesson title ("Bra-
 * Ket Formalism"), in a lesson description, and in the glossary. The query
 * `what is a bra` failed anyway, because `matchesAllTokens` is an AND over
 * every token and "what" is a token: the answer had to also contain the word
 * "what" somewhere, and the corpus has no reason to. Measured against the real
 * index it returned eleven entries, none of them about bras — the entries that
 * happened to contain "what" *and* the letters "bra" (inside "algebra") — and
 * the lesson the reader wanted was not among them.
 *
 * The fix is deliberately *not* to teach the index the word "what". Function
 * words are excluded from the lesson keyword sets on purpose
 * (`lessonKeywords.ts`), because putting them in would spend budget to make
 * every multi-word query scan the whole corpus, and would not have helped
 * here anyway: with "what" matchable everywhere, the right lesson sits in a
 * pool of two hundred equally-scored ones. The stem is noise in the *query*,
 * so it is removed from the query.
 *
 * ## Why this only fires when the literal query names nothing
 *
 * Stripping unconditionally would break the query it most resembles.
 * `what is a qubit` is answered by a real lesson called "What Is a Qubit?" —
 * a title-prefix match, the strongest kind — and the stripped query `qubit`
 * leads with the glossary's one-paragraph definition instead. Both are
 * defensible answers; silently swapping one for the other is not, and the
 * whole-question form is the one the reader typed.
 *
 * So the rule is: try the query exactly as typed, and only strip the stem when
 * nothing in the index is *named* by it — when no entry scored better than
 * description-only (`matchScore` band > 2). That is a precise statement of
 * "the words you typed match nothing that calls itself that", and it is the
 * only situation in which second-guessing the reader is an improvement.
 *
 * Pure and dependency-free, like `match.ts` and `didYouMean.ts`, so it cannot
 * pull a content corpus into the client bundle
 * (`src/lib/design/__tests__/clientBoundary.test.ts`).
 */

/**
 * Leading words that make a query a question rather than a term.
 *
 * Ordered longest-first so the longest stem wins: "what is a" must be tried
 * before "what is", or "what is a bra" strips to "a bra" and the leading "a"
 * still matches every entry in the index.
 *
 * Deliberately a short, closed list of *stems*, not a general stopword filter.
 * Removing "of" from the middle of "speed of light" would change what the
 * reader asked; removing "what is a" from the front of "what is a bra" removes
 * only the fact that they asked it as a sentence. Nothing here is stripped
 * from anywhere but position zero.
 */
const QUESTION_STEMS: string[][] = [
  ["what", "is", "the"],
  ["what", "is", "an"],
  ["what", "is", "a"],
  ["what", "are", "the"],
  ["what", "does", "a"],
  ["what", "do", "the"],
  ["what", "is"],
  ["what", "are"],
  ["what", "does"],
  ["what", "do"],
  ["how", "does", "a"],
  ["how", "does", "the"],
  ["how", "do", "the"],
  ["how", "does"],
  ["how", "do"],
  ["how", "is"],
  ["how", "are"],
  ["why", "does", "a"],
  ["why", "does", "the"],
  ["why", "does"],
  ["why", "do"],
  ["why", "is"],
  ["why", "are"],
  ["when", "does"],
  ["when", "do"],
  ["when", "is"],
  ["tell", "me", "about"],
  ["explain"],
  ["define"],
];

/**
 * Trailing words that carry no meaning once the stem is gone. "how does
 * entanglement work" is about entanglement, not about work — and "work" is a
 * real word in the corpus (thermodynamic work), so leaving it in turns a
 * question about entanglement into an AND with a different subject.
 */
const QUESTION_TAILS = new Set(["work", "works", "mean", "means", "do", "does", "for"]);

/** Articles left at the front once a shorter stem matched first — "what is" on
 *  "what is a bra" leaves "a bra", and a bare "a" is a substring of nearly
 *  every entry in the index, so the query would be no better off. Stripping
 *  them here rather than relying on the stem table having every article
 *  variant means a stem that is added later cannot reintroduce the bug. */
const LEADING_ARTICLES = new Set(["a", "an", "the"]);

/**
 * `tokens` with a leading question stem (and any trailing filler) removed, or
 * `null` when there is no stem to remove or removing it would leave nothing.
 *
 * Returns `null` rather than the original array so a caller cannot accidentally
 * re-run an identical search: a non-null result is always a genuinely different,
 * shorter query. Callers must still run it through the matcher — a stripped
 * query that finds nothing is worse than none, exactly as in `didYouMean.ts`,
 * and this module does not have the index to check.
 */
export function stripQuestionStem(tokens: string[]): string[] | null {
  for (const stem of QUESTION_STEMS) {
    if (stem.length >= tokens.length) continue;
    if (!stem.every((word, index) => tokens[index] === word)) continue;

    let rest = tokens.slice(stem.length);
    while (rest.length > 0 && LEADING_ARTICLES.has(rest[0])) {
      rest = rest.slice(1);
    }
    while (rest.length > 1 && QUESTION_TAILS.has(rest[rest.length - 1])) {
      rest = rest.slice(0, -1);
    }
    return rest.length > 0 ? rest : null;
  }
  return null;
}
