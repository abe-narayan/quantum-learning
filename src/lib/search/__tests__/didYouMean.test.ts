import { describe, expect, it } from "vitest";
import type { SearchEntry } from "../types";
import { prepareSearchEntries } from "../match";
import { boundedEditDistance, buildSuggestionVocabulary, suggestCorrection } from "../didYouMean";

function entry(title: string, description = "A description with no unusual words in it."): SearchEntry {
  return { type: "term", title, description, href: "/glossary#x" };
}

/** A miniature stand-in for the real index: the words below are the ones the
 *  corpus actually leads with, so a typo test here fails the same way it would
 *  against `public/search-index.json`. */
const CORPUS = prepareSearchEntries([
  entry("Entanglement"),
  entry("Bell State"),
  entry("Decoherence"),
  entry("Measurement and Probability"),
  entry("Quantum Error Correction"),
  entry("Superposition"),
  entry("The Bloch Sphere"),
  entry("Teleportation"),
]);

function suggest(query: string): string | null {
  return suggestCorrection(query.toLowerCase().split(/\s+/).filter(Boolean), CORPUS);
}

describe("boundedEditDistance", () => {
  it("is zero for identical strings", () => {
    expect(boundedEditDistance("qubit", "qubit", 2)).toBe(0);
  });

  it("counts a single substitution, insertion or deletion as one edit", () => {
    expect(boundedEditDistance("qubit", "qubot", 2)).toBe(1);
    expect(boundedEditDistance("qubit", "qubits", 2)).toBe(1);
    expect(boundedEditDistance("qubits", "qubit", 2)).toBe(1);
  });

  it("counts an adjacent transposition as one edit, not two", () => {
    // The most common real typo. Plain Levenshtein charges two here, which
    // pushes exactly the mistakes people make past a distance-1 threshold.
    expect(boundedEditDistance("qubti", "qubit", 2)).toBe(1);
    expect(boundedEditDistance("entanglemnet", "entanglement", 2)).toBe(1);
  });

  it("bails out at the cutoff rather than reporting a true large distance", () => {
    expect(boundedEditDistance("bell", "decoherence", 2)).toBe(3);
    expect(boundedEditDistance("aaaa", "bbbb", 1)).toBe(2);
  });
});

describe("buildSuggestionVocabulary", () => {
  it("collects title words only, skipping words too short to correct", () => {
    const words = buildSuggestionVocabulary(CORPUS).map((item) => item.word);
    expect(words).toContain("entanglement");
    expect(words).toContain("measurement");
    // "and", "the" are below MIN_CORRECTABLE_LENGTH, and description prose is
    // deliberately not a source of suggestions.
    expect(words).not.toContain("and");
    expect(words).not.toContain("the");
    expect(words).not.toContain("description");
  });

  it("counts how many titles each word appears in", () => {
    const corpus = prepareSearchEntries([entry("Quantum Gates"), entry("Quantum Circuits"), entry("Ancilla")]);
    const counts = new Map(buildSuggestionVocabulary(corpus).map((item) => [item.word, item.count]));
    expect(counts.get("quantum")).toBe(2);
    expect(counts.get("ancilla")).toBe(1);
  });
});

describe("suggestCorrection", () => {
  it("corrects a single mistyped word", () => {
    expect(suggest("entanglment")).toBe("entanglement");
    expect(suggest("decohrence")).toBe("decoherence");
    expect(suggest("teleporation")).toBe("teleportation");
  });

  it("corrects a transposition", () => {
    expect(suggest("entanglemnet")).toBe("entanglement");
  });

  it("leaves the words the reader got right exactly as typed", () => {
    // "bell" matches on its own; only "stat" is wrong, and rewriting a good
    // token would answer a question nobody asked.
    expect(suggest("bell stpte")).toBe("bell state");
  });

  it("says nothing when every token is individually answerable", () => {
    // "bell superposition" is zero results because the two never co-occur,
    // not because anything is misspelled. There is nothing to correct.
    expect(suggest("bell superposition")).toBeNull();
  });

  it("says nothing for a token too short to correct safely", () => {
    // At three characters, distance 1 reaches a third of the alphabet.
    expect(suggest("qed")).toBeNull();
  });

  it("says nothing when the nearest word is not near", () => {
    expect(suggest("photosynthesis")).toBeNull();
  });

  it("never offers a suggestion that leads to a second empty screen", () => {
    // Both words exist in the vocabulary, but no single entry carries both,
    // so the corrected query would itself return nothing.
    expect(suggest("entanglment decohrence")).toBeNull();
  });

  it("returns null for an empty or whitespace-only query", () => {
    expect(suggestCorrection([], CORPUS)).toBeNull();
    expect(suggest("   ")).toBeNull();
  });

  it("returns null against an empty index", () => {
    expect(suggestCorrection(["entanglment"], [])).toBeNull();
  });
});
