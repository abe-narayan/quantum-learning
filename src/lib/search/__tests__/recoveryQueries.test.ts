import { readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { prepareSearchEntries, tokenizeQuery, matchScore, matchesAllTokens } from "../match";
import { rankResults } from "../rank";
import type { SearchEntry } from "../types";

/**
 * ============================================================
 * What the search box actually answers
 * ============================================================
 * Every other suite in this directory tests the matcher against hand-written
 * fixtures, which is the right way to pin *rules* and no way at all to notice
 * that the rules are being applied to a corpus that cannot answer anything. It
 * is how search shipped for months with `power series`, `factorial`,
 * `half angle` and `theta/2` all returning nothing while the site taught all
 * four: no fixture in the repo had a lesson body in it, because no lesson body
 * was in the index.
 *
 * So this file runs the real pipeline (`rankResults`) over the real committed
 * `public/search-index.json` and asserts on the result a reader sees. Two
 * tables:
 *
 *  - RECOVERY_QUERIES — what a *stuck* reader types. Each of these returned
 *    nothing, or nothing useful, before lesson keyword sets existed.
 *  - PINNED_QUERIES — the queries the search work before this pinned as
 *    working. Adding a matchable surface roughly the size of the rest of the
 *    index is exactly the kind of change that silently reorders results, and
 *    the argument that it cannot (`SCORE_KEYWORD_ONLY`, and the fourth
 *    `leadBand`) is only an argument until something checks it.
 */

const INDEX_PATH = path.join(process.cwd(), "public/search-index.json");
const RAW = readFileSync(INDEX_PATH);
const ENTRIES = JSON.parse(RAW.toString("utf8")) as SearchEntry[];
const INDEX = prepareSearchEntries(ENTRIES);

/** The first result the overlay would render — group order, then row order. */
function topResult(query: string): SearchEntry | undefined {
  return rankResults(INDEX, query).groups[0]?.matches[0]?.entry;
}

/** The best *lesson*, which is what a "take me to where this is taught" query
 *  is really asking for even when a glossary definition legitimately leads. */
function topLesson(query: string): string | undefined {
  const groups = rankResults(INDEX, query).groups;
  return groups.find((group) => group.type === "lesson")?.matches[0]?.entry.href;
}

function totalResults(query: string): number {
  return rankResults(INDEX, query).groups.reduce((sum, group) => sum + group.matches.length, 0);
}

describe("the index is the real one (guards every table below)", () => {
  it("is the committed artifact, with lesson keyword sets in it", () => {
    expect(ENTRIES.length).toBeGreaterThan(1000);
    const lessons = ENTRIES.filter((entry) => entry.type === "lesson");
    expect(lessons.length).toBeGreaterThan(200);
    expect(
      lessons.filter((entry) => (entry.keywords ?? "").length > 0).length,
      "some lessons have no keyword set — re-run `npm run generate:search-index`",
    ).toBe(lessons.length);
  });
});

/**
 * The six queries an independent reader, walking the site as a lost beginner,
 * found search could not answer. Each names the lesson that teaches the thing;
 * where two lessons teach it, either is a correct landing.
 */
const RECOVERY_QUERIES: Array<{ query: string; lessons: string[] }> = [
  {
    query: "power series",
    lessons: ["/lessons/quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  {
    // Spelled nowhere in the corpus — the lessons write `n!`. Reached through
    // the NOTATION_WORDS table in lessonKeywords.ts, which exists because a
    // reader who does not know that `n!` is *called* a factorial is exactly
    // the reader who searches for one.
    query: "factorial",
    lessons: ["/lessons/quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  {
    query: "half angle",
    lessons: [
      "/lessons/quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      "/lessons/quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    ],
  },
  {
    // One token, with the slash inside it. Only answerable because the keyword
    // extractor transliterates `θ` in place rather than padding it with
    // spaces — see GREEK_NAMES.
    query: "theta/2",
    lessons: [
      "/lessons/quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      "/lessons/quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    ],
  },
  {
    // Not a corpus gap at all: "bra" is in a lesson title. The AND over tokens
    // required the answer to also contain "what". Fixed on the query side, by
    // stripQuestionStem.
    query: "what is a bra",
    lessons: [
      "/lessons/quantum-mechanics/mathematical-foundations/bra-ket-formalism",
      "/lessons/quantum-computing/qubits-and-quantum-states/dirac-notation",
    ],
  },
  {
    // Worked before this change, but only by luck — that exact phrase happens
    // to sit in one lesson's description. Pinned so the luck becomes a
    // guarantee.
    query: "matrix multiplication",
    lessons: ["/lessons/quantum-mechanics/mathematical-foundations/linear-operators"],
  },
];

describe("queries a stuck reader types", () => {
  it.each(RECOVERY_QUERIES)("$query reaches the lesson that teaches it", ({ query, lessons }) => {
    expect(totalResults(query), `"${query}" returns nothing`).toBeGreaterThan(0);
    expect(
      lessons,
      `"${query}" leads with ${topLesson(query)}, none of the lessons that teach it`,
    ).toContain(topLesson(query));
  });
});

/**
 * The 21 queries pinned as working before lesson bodies became matchable,
 * each with the first result the overlay rendered for it then. Recorded as
 * `type: title` because that pair is what a reader sees; an href would pin the
 * same thing while hiding which *kind* of answer leads, which is the half of
 * the ranking a new match surface is most likely to disturb.
 */
const PINNED_QUERIES: Array<[query: string, firstResult: string]> = [
  ["entanglement", "term: Entanglement"],
  ["qubit", "term: Qubit"],
  ["Bell", "term: Bell States"],
  ["bell state", "term: Bell States"],
  ["CHSH", "term: CHSH Inequality"],
  ["VQE", "lesson: VQE: A Worked Toy Example"],
  ["Shor", "term: Shor's Algorithm"],
  ["Grover", "term: Grover's Algorithm"],
  ["superposition", "term: Superposition"],
  ["decoherence", "term: Decoherence"],
  ["Schrodinger", "term: Schrödinger Equation"],
  ["measurement", "term: Measurement"],
  ["hardware", "lesson: Simulators vs. Real Hardware"],
  ["what is a qubit", "lesson: What Is a Qubit?"],
  ["bra-ket", "term: Dirac Notation (Bra-Ket)"],
  ["Dirac", "term: Dirac Notation (Bra-Ket)"],
  ["teleportation", "term: Quantum Teleportation"],
  ["error correction", "term: Quantum Error Correction"],
  ["QEC", "term: Quantum Error Correction"],
  ["QFT", "term: Quantum Fourier Transform"],
  ["|0>", "problem: What Kind of Object Is |0⟩⟨1|?"],
];

describe("the queries that already worked still work", () => {
  it.each(PINNED_QUERIES)("%s still leads with %s", (query, expected) => {
    const first = topResult(query);
    expect(first ? `${first.type}: ${first.title}` : "—").toBe(expected);
  });

  it("returns nothing for empty and all-whitespace input", () => {
    for (const query of ["", "   ", "\t\n "]) {
      const ranked = rankResults(INDEX, query);
      expect(ranked.groups).toEqual([]);
      expect(ranked.interpretedAs).toBeNull();
    }
  });

  it("leaves the question-stem rewrite off for every query that names something", () => {
    // The rewrite is a recovery path, and a recovery path that fires on the
    // common path is a bug that looks like a feature. `what is a qubit` is the
    // one that matters: it is answered by a real lesson called "What Is a
    // Qubit?", and stripping the stem would hand the reader the glossary's
    // one-paragraph definition instead — a different, defensible answer to a
    // question they did not ask.
    for (const [query] of PINNED_QUERIES) {
      expect(rankResults(INDEX, query).interpretedAs, `"${query}" was rewritten`).toBeNull();
    }
  });
});

describe("a body match never outranks a match on what an entry calls itself", () => {
  it("scores every keyword-only hit below every title and description hit", () => {
    // The invariant the whole design rests on, asserted over the real corpus
    // rather than a fixture: for each recovery query, no entry that matched
    // only through its keyword set may score at or above one that matched
    // through its title or description.
    for (const { query } of RECOVERY_QUERIES) {
      const tokens = tokenizeQuery(query);
      const phrase = tokens.join(" ");
      let bestKeywordOnly = -1;
      let worstTextMatch = 5;
      for (const candidate of INDEX) {
        if (!matchesAllTokens(candidate, tokens)) continue;
        const score = matchScore(candidate, tokens, phrase);
        const viaText = tokens.every(
          (token) => candidate.foldedText.includes(token) || candidate.foldedAcronym === token,
        );
        if (viaText) worstTextMatch = Math.min(worstTextMatch, score);
        else bestKeywordOnly = Math.max(bestKeywordOnly, score);
      }
      if (bestKeywordOnly >= 0 && worstTextMatch < 5) {
        expect(bestKeywordOnly, `"${query}": a keyword-only match tied a text match`).toBeGreaterThan(
          worstTextMatch,
        );
      }
    }
  });

  it("keeps a lesson found only by its body below the lesson the query names", () => {
    // The concrete case, so a failure reads as a mistake rather than a number.
    // "Complex Numbers for Physics" holds "power series" in a heading and a
    // bolded term; nothing in the index has it in a title. The moment some
    // lesson *is* titled that, it must come first.
    const tokens = tokenizeQuery("power series");
    const body = INDEX.find(
      (candidate) =>
        candidate.entry.href ===
        "/lessons/quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
    );
    expect(body).toBeDefined();
    expect(matchesAllTokens(body!, tokens)).toBe(true);
    expect(matchScore(body!, tokens)).toBe(4);

    const titled = prepareSearchEntries([
      { type: "lesson", title: "Power Series", description: "Unrelated.", href: "/lessons/x" },
    ])[0];
    expect(matchScore(titled, tokens)).toBeLessThan(matchScore(body!, tokens));
  });
});

/**
 * The ceiling. Stated here as well as in the generator (which refuses to write
 * an over-budget file) and in `src/lib/design/__tests__/clientBoundary.test.ts`
 * (which measures the gzip a reader actually downloads), because this is the
 * suite that would be looked at first by whoever next wonders whether more of
 * the body could go in. The answer is: only if these numbers move on purpose.
 */
const MAX_INDEX_RAW_KB = 560;

describe("the index stays inside its size ceiling", () => {
  it("is under the raw ceiling the generator enforces", () => {
    const rawKb = RAW.byteLength / 1024;
    expect(
      rawKb,
      `search-index.json is ${rawKb.toFixed(1)}KB raw; the whole file is downloaded on first search`,
    ).toBeLessThanOrEqual(MAX_INDEX_RAW_KB);
  });

  it("keeps each lesson's keyword set inside the per-lesson budget", () => {
    // The per-lesson cap is the actual growth control: it makes the index a
    // function of how many lessons exist, not how long they are. A lesson that
    // doubles in length adds nothing here.
    const over = ENTRIES.filter((entry) => (entry.keywords?.length ?? 0) > 600).map(
      (entry) => `${entry.href} (${entry.keywords?.length})`,
    );
    expect(
      over,
      "LESSON_KEYWORD_BUDGET is not being applied — see extractLessonKeywords",
    ).toEqual([]);
  });

  it("spends most of the file on entries, not on keywords (guards the shape)", () => {
    // If keywords ever grow past the entries they annotate, the thing being
    // shipped has stopped being a search index and started being the corpus.
    const keywordBytes = ENTRIES.reduce((sum, entry) => sum + (entry.keywords?.length ?? 0), 0);
    expect(keywordBytes).toBeLessThan(RAW.byteLength / 2);
    // Guards the guard: a build that dropped keywords entirely would pass the
    // line above trivially.
    expect(keywordBytes).toBeGreaterThan(50_000);
    // Reported rather than asserted twice: the gzip figure is budgeted in
    // clientBoundary.test.ts, which is where this project keeps payload
    // discipline.
    expect(gzipSync(RAW).length).toBeGreaterThan(0);
  });
});
