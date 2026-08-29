/**
 * Reduces one lesson's `.mdx` source to a small, bounded set of the terms it
 * actually teaches — the fourth matchable surface behind title, description
 * and (for glossary rows) definition.
 *
 * ## Why the index needed this at all
 *
 * `public/search-index.json` carried `title`, `description`, `href`, `pillar`
 * and `course` per entry, and nothing else. That is enough to find a page you
 * can already name, and useless to the reader search exists for: someone who
 * has just hit a word mid-lesson and does not know what it is. Measured
 * against the real corpus before this file existed:
 *
 *   power series          0 results   (taught in complex-numbers-for-physics)
 *   factorial             0 results   (the same lesson's three expansions)
 *   half angle            0 useful    (the-bloch-sphere, single-qubit-rotations)
 *   theta/2               0 results   (the same two)
 *   matrix multiplication 2 results   — and only because that exact phrase
 *                                       happens to sit in one description
 *
 * Every one of those is taught somewhere. The matcher was never the problem;
 * the corpus it was given to match against was four lines long per lesson.
 *
 * ## Why a term set rather than the body
 *
 * The obvious fix — append the lesson body — was measured and rejected. The
 * deduplicated *vocabulary* of all 219 lessons (not the prose: the distinct
 * words) is 861KB, which takes the index from 403KB raw / 100.7KB gzip to
 * 1.27MB / 316KB. That is a 3.1× first-open cost for the search overlay, paid
 * by every reader who opens search, to answer a query most of them will never
 * type. The overlay fetches this file whole (`lib/search/fetchIndex.ts`), so
 * there is no "only the part you need" in the fetch.
 *
 * A separate second index, fetched only on a zero-result query, was the other
 * candidate and is genuinely attractive — the common path would pay nothing.
 * It fails on the case that motivated the work: `matrix multiplication` returns
 * two (wrong-ish) results today, so it is *not* a zero-result query, and a
 * recovery index that only loads on zero results would never load for it. The
 * reader whose query returns two bad answers is no better off than the one who
 * gets none, and is invisible to that design.
 *
 * So: a bounded term set, in the one index, matched in a band strictly below
 * description (see `matchScore` in ./match.ts). Nothing here is prose. What
 * survives is what the lesson *names* — its section headings, the terms it
 * bolds on first use, its `<Term>` links, its learning objectives, the
 * hyphenated compounds physics writes ("half-angle", "two-level", "bra-ket"),
 * and a handful of words for notation a beginner can see but cannot spell.
 *
 * ## The bound, and why it is per-lesson
 *
 * `LESSON_KEYWORD_BUDGET` caps each lesson at 600 characters of terms, and the
 * candidate list below is ordered most-valuable-first precisely so that the
 * cap drops the tail rather than something load-bearing. The consequence worth
 * stating: **the index grows with the number of lessons, never with the length
 * of one.** Doubling a lesson's word count adds nothing. Adding a lesson adds
 * at most ~0.6KB raw / ~0.16KB gzip. That is the property that makes this safe
 * to leave in a build whose memory profile has already killed Vercel once
 * (docs/DEPLOYMENT.md); the total is pinned by a test in
 * `src/lib/design/__tests__/clientBoundary.test.ts` and by a hard failure in
 * `scripts/generate-search-index.mjs` itself.
 *
 * ## Constraints on this module
 *
 * Pure, synchronous, and with **no imports at all** — it is loaded directly by
 * `scripts/generate-search-index.mjs` under plain Node, which strips types but
 * resolves neither `@/...` aliases nor extension-less specifiers. It also
 * never executes a lesson: it is handed the raw `.mdx` text, exactly like the
 * `lessonMeta` brace-scanner in `scripts/lib/extract.mjs`, because importing
 * 219 compiled MDX modules is the thing that produced the 2026-08 build OOM.
 *
 * Problems are deliberately *not* given a keyword field. Their bodies are the
 * one corpus on this site that must not be published: a problem module carries
 * `answer`, `nearMisses`, `hints` and a worked `solution`, and
 * `search-index.json` is a public static file any student can open. Their
 * titles and tags are already indexed; that is where the line stays.
 */

/**
 * How many characters of terms one lesson may contribute. See the header for
 * why this is the real growth control rather than the total-size test.
 *
 * 600 is ~75 terms, measured against the corpus as covering a lesson's
 * headings, its objectives, its `<Term>` links and most of its bolded terms
 * before the hyphenated-compound tail starts being cut.
 */
export const LESSON_KEYWORD_BUDGET = 600;

/**
 * Greek letters and the two physics glyphs that behave like them, mapped onto
 * the names people type. The corpus writes `θ`, `\theta` and `\varphi`; a
 * reader types "theta". Folded in place, with no space inserted, so `θ/2`
 * becomes the single token `theta/2` and stays findable by the query
 * `theta/2` — which is, verbatim, what someone who has just met the Bloch
 * half-angle types.
 *
 * `foldForSearch` in ./match.ts deliberately does NOT do this: it folds only
 * what is the *same string* spelled two ways (diacritics, the Unicode angle
 * brackets of Dirac notation). "θ" and "theta" are different strings that mean
 * the same thing, which is a corpus-side substitution, not a fold.
 */
const GREEK_NAMES: Record<string, string> = {
  "α": "alpha", "β": "beta", "γ": "gamma", "δ": "delta", "ε": "epsilon",
  "ζ": "zeta", "η": "eta", "θ": "theta", "ι": "iota", "κ": "kappa",
  "λ": "lambda", "μ": "mu", "ν": "nu", "ξ": "xi", "π": "pi", "ρ": "rho",
  "σ": "sigma", "τ": "tau", "υ": "upsilon", "φ": "phi", "χ": "chi",
  "ψ": "psi", "ω": "omega",
  "Γ": "gamma", "Δ": "delta", "Θ": "theta", "Λ": "lambda", "Ξ": "xi",
  "Π": "pi", "Σ": "sigma", "Υ": "upsilon", "Φ": "phi", "Ψ": "psi", "Ω": "omega",
  "ħ": "hbar",
};
const GREEK_PATTERN = new RegExp(`[${Object.keys(GREEK_NAMES).join("")}]`, "gu");

/**
 * Notation a reader can see on the page and has no way to type, paired with
 * the word they would search for instead.
 *
 * This is the smallest table that answers the `factorial` case, and it is
 * built on the same observation the Dirac-bracket fold in ./match.ts is built
 * on: the corpus writes mathematics, and a query is typed on a keyboard.
 * "factorial" appears in the prose of exactly zero lessons; `n!` appears in
 * many, including the three power-series expansions that Euler's formula is
 * derived from in `complex-numbers-for-physics`. A reader who does not yet
 * know that `n!` is *called* a factorial is precisely the reader who searches
 * for one.
 *
 * Applied only to the lesson's math (`$…$` / `$$…$$`), not its prose, and only
 * as presence/absence — one word per lesson per row, never per occurrence. Ten
 * rows, ~120 characters of budget worst case. Greek letters are not here
 * because `GREEK_NAMES` already handles them everywhere, including prose.
 */
const NOTATION_WORDS: Array<[RegExp, string]> = [
  // A postfix `!` after a symbol, digit or closing bracket — `n!`, `2!`,
  // `(n+1)!`. Anchored on the preceding character so it cannot fire on the
  // `!` of `\neq`-style prose or a `!==` in an embedded expression.
  [/[A-Za-z0-9})\]]!/, "factorial"],
  [/\\dagger|†/, "dagger adjoint"],
  [/\\otimes|⊗/, "tensor product"],
  [/\\sqrt|√/, "square root"],
  [/\\sum/, "summation"],
  [/\\int\b/, "integral"],
  [/\\partial|∂/, "partial derivative"],
  [/\\nabla|∇/, "gradient"],
  [/\\hbar|ħ/, "planck constant"],
  [/\\infty|∞/, "infinity"],
];

/**
 * Function words, dropped before anything is measured against the budget.
 *
 * Not an English-stopword list for its own sake: these are the words that a
 * *term set* has no use for. Every one of them already appears in some
 * entry's title or description, so keeping them would spend budget to make
 * "the", "with" and "using" match 219 more entries apiece — which is not a
 * search improvement, it is a way to turn every multi-word query into a
 * whole-corpus scan.
 *
 * The natural-language queries that need these words ("what is a bra") are
 * answered by `stripQuestionStem` in ./questionQuery.ts, on the query side,
 * where the fix costs no bytes at all.
 */
const FUNCTION_WORDS = new Set(
  (
    "a about above after again all also am an and another any are as at be because been before being " +
    "below between both but by can cannot come could did do does doing done down during each either else " +
    "enough even ever every few for from further get gets give given go had has have having he her here " +
    "hers him his how however if in into is it its itself just keep kept let like made make many may me " +
    "might more most much must my need needs never new next no nor not now of off on once one only onto or " +
    "other others our out over own per put rather really same say see seen several shall she should since " +
    "so some still such take taken than that the their them then there these they thing things think this " +
    "those though three through thus to too two under until up upon us use used uses using very via was way " +
    "we well were what when where whether which while who whom why will with within without would yet you " +
    "your yours"
  ).split(" ")
);

/** JSX tags and inline/display math, replaced by a space. Used on the
 *  *structural* captures (headings, bold runs, `<Term>` bodies, `title=`
 *  attributes) so that `**<Term id="modulus">modulus</Term>**` contributes
 *  "modulus" rather than `id="modulus">modulus</term>`, and a bolded equation
 *  contributes nothing rather than `|z_1+z_2|`. The math channel is
 *  `NOTATION_WORDS`, which is deliberate about what it takes from math. */
function stripMarkup(value: string): string {
  return value.replace(/<\/?[A-Za-z][^>]*>/g, " ").replace(/\$\$?[^$]*\$\$?/g, " ");
}

/** Greek glyphs to their names (in place), and `\macro` to `macro` (with a
 *  space in front, so `\cos\theta` yields two tokens and not "costheta"). */
function transliterate(value: string): string {
  return value.replace(/\\([a-zA-Z]+)/g, " $1").replace(GREEK_PATTERN, (glyph) => GREEK_NAMES[glyph]);
}

/**
 * The lesson's body, i.e. everything after the MDX module's JavaScript
 * preamble (`import` lines, `export const lessonMeta = {…}`, and the
 * occasional `export const` helper a visualization is fed from).
 *
 * Found by scanning for the first line that starts a Markdown heading or a
 * capitalised JSX element, which every one of the 219 lessons has and none
 * has before its exports — asserted in `__tests__/lessonKeywords.test.ts`
 * against the real corpus, so a lesson that ever breaks the convention fails
 * loudly instead of silently indexing its own import list.
 */
function bodyOf(source: string): string {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => /^#{2,6}\s/.test(line) || /^<[A-Z]/.test(line));
  const body = start < 0 ? "" : lines.slice(start).join("\n");
  // Fenced code is a lesson's Qiskit/OpenQASM listings — identifiers and
  // punctuation, not terms anyone searches for in prose.
  return body.replace(/```[\s\S]*?```/g, " ");
}

/**
 * Candidate term strings, **in descending order of value**, because the budget
 * truncates the tail.
 *
 * The order is the argument: a lesson's objectives and headings are the
 * author's own summary of what it teaches, its `<Term>` links are the concepts
 * it explicitly hands to the glossary, and the notation words are one word
 * apiece for symbols with no spelling. Bold runs and `title=` attributes come
 * next (valuable but noisier — a bold run is often a whole sentence), and the
 * hyphenated compounds last, as the cheapest way to reach terms the author
 * never marked up at all ("half-angle" is neither a heading nor bolded in
 * either lesson that teaches it).
 */
function candidateStrings(source: string, objectives: readonly string[]): string[] {
  const body = bodyOf(source);
  const parts: string[] = [];

  for (const objective of objectives) parts.push(stripMarkup(objective));
  for (const match of body.matchAll(/^#{2,6}\s+(.+)$/gm)) parts.push(stripMarkup(match[1]));
  for (const match of body.matchAll(/<Term\s+id="([^"]+)"\s*>([^<]{0,160})<\/Term>/g)) {
    parts.push(`${match[1].replace(/-/g, " ")} ${stripMarkup(match[2])}`);
  }

  const math = [
    ...body.matchAll(/\$\$([\s\S]*?)\$\$/g),
    ...body.matchAll(/\$([^$\n]*)\$/g),
  ]
    .map((match) => match[1])
    .join(" ");
  for (const [pattern, word] of NOTATION_WORDS) {
    if (pattern.test(math)) parts.push(word);
  }

  for (const match of body.matchAll(/\*\*([^*]{2,160})\*\*/g)) parts.push(stripMarkup(match[1]));
  for (const match of body.matchAll(/\stitle="([^"]{2,160})"/g)) parts.push(stripMarkup(match[1]));

  // Hyphenated compounds, from prose with math, JSX, link targets and bare
  // URLs removed. The link-target strip matters: without it every
  // `[…](/lessons/quantum-computing/qubits-and-quantum-states/…)` donates its
  // own route as three "compounds", and the busiest lessons filled a third of
  // their budget with slugs of other lessons.
  const prose = body
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    .replace(/https?:\/\/\S+/g, " ");
  for (const match of prose.matchAll(/\b[a-z]{2,}(?:-[a-z]{2,})+\b/g)) parts.push(match[0]);

  return parts;
}

/**
 * One space-separated, deduplicated, alphabetically sorted term string for a
 * lesson, at most `LESSON_KEYWORD_BUDGET` characters.
 *
 * Sorted last, after truncation, so the stored order says nothing about which
 * terms were kept — the file is a build artifact that lands in a diff, and a
 * stable alphabetical form makes a real content change visible in it.
 *
 * Tokens keep the punctuation *inside* them (`theta/2`, `half-angle`,
 * `cos(theta/2)|0>`) and lose it at the edges. That is not cosmetic: the
 * matcher splits a query on whitespace only and then asks for a substring, so
 * `theta/2` is answerable exactly when some stored token contains those seven
 * characters — which is why the transliteration above must not insert a space
 * around `θ`.
 */
export function extractLessonKeywords(source: string, objectives: readonly string[] = []): string {
  const seen = new Set<string>();
  const kept: string[] = [];
  let remaining = LESSON_KEYWORD_BUDGET;

  for (const raw of transliterate(candidateStrings(source, objectives).join(" ")).split(/\s+/)) {
    const token = raw
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      // Leading punctuation goes, except the `|` of a ket; trailing goes,
      // except the `>` that closes one and the `+` of `|+>`.
      .replace(/^[^\p{L}\p{N}|]+/gu, "")
      .replace(/[^\p{L}\p{N}|>+]+$/gu, "");
    if (token.length < 3 || token.length > 32) continue;
    if (!/\p{L}/u.test(token)) continue;
    if (FUNCTION_WORDS.has(token) || seen.has(token)) continue;
    seen.add(token);
    if (remaining < token.length + 1) break;
    remaining -= token.length + 1;
    kept.push(token);
  }

  return kept.sort().join(" ");
}
