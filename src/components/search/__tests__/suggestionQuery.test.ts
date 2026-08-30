import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MAX_SUGGESTION_TOKENS, suggestionTokensFor } from "../suggestionQuery";
import { prepareSearchEntries, tokenizeQuery } from "@/lib/search/match";
import { suggestCorrection } from "@/lib/search/didYouMean";
import type { SearchEntry } from "@/lib/search/types";

/**
 * The gate in front of the search overlay's spelling-recovery pass.
 *
 * `suggestCorrection` is the only work on the overlay's keystroke path whose
 * cost scales with the query rather than with the index: tokens × entries for
 * the "which words failed" scan, then the whole title vocabulary per failing
 * word. A 10,000-character paste of near-miss words blocked the main thread
 * for 1,076 ms in headless Chrome against the real committed index, on every
 * keystroke.
 *
 * The two things worth pinning are the two halves of the trade, and neither is
 * a stopwatch — a wall-clock threshold on a machine running other work is a
 * flake generator, and it would not catch the failure that matters anyway
 * (a cap set so low that ordinary queries stop being corrected):
 *
 *  - the cap engages on a paste, and the work it gates is bounded by a
 *    constant multiple of the index size rather than by the query;
 *  - it does not engage on anything a reader types, re-derived from the real
 *    `public/search-index.json` rather than asserted from memory.
 */

const INDEX_PATH = path.join(process.cwd(), "public/search-index.json");
const ENTRIES = JSON.parse(readFileSync(INDEX_PATH, "utf8")) as SearchEntry[];
const INDEX = prepareSearchEntries(ENTRIES);

describe("the index is the real one (guards the tables below)", () => {
  it("is the committed artifact", () => {
    expect(ENTRIES.length).toBeGreaterThan(1000);
  });
});

describe("suggestionTokensFor — what reaches the recovery pass", () => {
  it("passes an ordinary misspelled query through unchanged", () => {
    expect(suggestionTokensFor("entanglment")).toEqual(["entanglment"]);
    expect(suggestionTokensFor("bell staet")).toEqual(["bell", "staet"]);
  });

  it("gates out a paste, so the work is bounded by the cap and not by the query", () => {
    const paste = Array.from({ length: 1400 }, () => "quantm").join(" ");
    expect(paste.length).toBeGreaterThan(9000);
    expect(tokenizeQuery(paste).length).toBeGreaterThan(MAX_SUGGESTION_TOKENS);
    expect(suggestionTokensFor(paste)).toBeNull();
  });

  it("does not gate on characters, only on words", () => {
    // One 10,000-character token is a single comparison against each
    // vocabulary word, and `boundedEditDistance` rejects it on length before
    // doing any work at all. Gating it would be a cap with no cost behind it.
    const oneLongWord = "a".repeat(10_000);
    expect(suggestionTokensFor(oneLongWord)).toEqual([oneLongWord]);
  });

  it("gates the empty query rather than handing the pass nothing to do", () => {
    expect(suggestionTokensFor("")).toBeNull();
    expect(suggestionTokensFor("   ")).toBeNull();
  });

  it("bounds the tokens handed on, whatever the query", () => {
    for (const query of ["q", "bell state", "a".repeat(5000), "x ".repeat(500), "what is a qubit"]) {
      const tokens = suggestionTokensFor(query);
      if (tokens !== null) expect(tokens.length).toBeLessThanOrEqual(MAX_SUGGESTION_TOKENS);
    }
  });
});

describe("the cap clears every query the corpus can answer", () => {
  it("is above the longest title in the real index", () => {
    let longest = { title: "", words: 0 };
    for (const entry of ENTRIES) {
      const words = tokenizeQuery(entry.title).length;
      if (words > longest.words) longest = { title: entry.title, words };
    }
    // Re-derived rather than typed, so shrinking the cap below what the
    // corpus's own names need fails here rather than silently making the
    // longest entries uncorrectable. This assertion has already earned its
    // keep once: the cap was first written as 12 and this caught it, because
    // the longest title in the index is 14 words.
    expect(longest.words).toBeGreaterThan(0);
    expect(MAX_SUGGESTION_TOKENS).toBeGreaterThan(longest.words);
  });

  it("clears the longest title in the index with a reader's own words around it", () => {
    const longest = ENTRIES.map((entry) => entry.title).sort(
      (a, b) => tokenizeQuery(b).length - tokenizeQuery(a).length
    )[0];
    expect(suggestionTokensFor(longest)).not.toBeNull();
    // A reader rarely pastes a title alone; they type it with a word or two of
    // their own. The cap has to survive that, not just the bare title.
    expect(suggestionTokensFor(`what is ${longest} about`)).not.toBeNull();
  });

  it("still corrects the typos the recovery pass exists for", () => {
    // Each of these is a real misspelling that the strict matcher answers with
    // zero results; the gate must not be what stops them being corrected.
    for (const typo of ["entanglment", "entanglemnt", "supperposition", "measurment"]) {
      const tokens = suggestionTokensFor(typo);
      expect(tokens, `${typo} was gated out`).not.toBeNull();
      expect(suggestCorrection(tokens!, INDEX), `${typo} lost its suggestion`).not.toBeNull();
    }
  });
});
