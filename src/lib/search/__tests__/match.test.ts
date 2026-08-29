import { describe, expect, it } from "vitest";
import type { SearchEntry } from "../types";
import {
  acronymOf,
  foldForSearch,
  matchScore,
  matchesAllTokens,
  prepareSearchEntries,
  tokenizeQuery,
  type SearchableEntry,
} from "../match";

function makeEntry(title: string, description: string): SearchEntry {
  return { type: "term", title, description, href: "/glossary#x" };
}

function prepare(title: string, description: string): SearchableEntry {
  return prepareSearchEntries([makeEntry(title, description)])[0];
}

/** True when every token of `query` matches `candidate` — the overlay's filter. */
function matches(candidate: SearchableEntry, query: string): boolean {
  return matchesAllTokens(candidate, tokenizeQuery(query));
}

function score(candidate: SearchableEntry, query: string): number {
  return matchScore(candidate, tokenizeQuery(query));
}

describe("foldForSearch", () => {
  it("strips diacritics and lowercases", () => {
    expect(foldForSearch("Schrödinger")).toBe("schrodinger");
    expect(foldForSearch("Poincaré RÉSUMÉ")).toBe("poincare resume");
  });

  it("leaves plain ASCII untouched apart from case", () => {
    expect(foldForSearch("Bell State")).toBe("bell state");
  });

  it("folds Dirac angle brackets onto the ASCII ones a keyboard can produce", () => {
    // 118 index entries carry a ket. Nobody types U+27E9, so both spellings
    // have to fold to the same string or the whole set is unreachable.
    expect(foldForSearch("|0⟩")).toBe("|0>");
    expect(foldForSearch("⟨X⟩")).toBe("<x>");
    expect(foldForSearch("|0>")).toBe("|0>");
  });

  it("folds the true minus sign onto a hyphen", () => {
    // "A 50/50 Mixture of |+⟩ and |−⟩" is authored with U+2212.
    expect(foldForSearch("|−⟩")).toBe("|->");
  });
});

describe("acronymOf", () => {
  it("reduces a spelled-out title to the initialism people actually type", () => {
    expect(acronymOf("quantum error correction")).toBe("qec");
    expect(acronymOf("quantum fourier transform")).toBe("qft");
    expect(acronymOf("quantum phase estimation")).toBe("qpe");
  });

  it("skips joining words, so no title reduces to an unrelated English word", () => {
    // Without the skip list "Measurement and Probability" reduces to "map",
    // and the query "map" would return a lesson about neither.
    expect(acronymOf("measurement and probability")).toBe("mp");
    expect(acronymOf("quantum error correction & fault tolerance")).toBe("qecft");
  });

  it("gives a one-word title no initialism at all", () => {
    expect(acronymOf("entanglement")).toBe("");
    expect(acronymOf("qubit")).toBe("");
  });
});

describe("tokenizeQuery", () => {
  it("returns no tokens for an empty or all-whitespace query", () => {
    expect(tokenizeQuery("")).toEqual([]);
    expect(tokenizeQuery("   \t ")).toEqual([]);
  });

  it("folds and splits on any whitespace run", () => {
    expect(tokenizeQuery("  Schrödinger   Equation ")).toEqual(["schrodinger", "equation"]);
  });
});

describe("matchesAllTokens", () => {
  const schrodinger = prepare(
    "Schrödinger equation",
    "The fundamental equation governing how a quantum state evolves in time."
  );
  const bellState = prepare(
    "Bell state",
    "One of four maximally entangled two-qubit states."
  );

  it("matches a diacritic-free query against an accented title (schrodinger → Schrödinger)", () => {
    expect(matches(schrodinger, "schrodinger")).toBe(true);
    expect(matches(schrodinger, "schrödinger")).toBe(true);
  });

  it("AND-matches tokens in any order: 'state bell' finds 'Bell state'", () => {
    expect(matches(bellState, "state bell")).toBe(true);
    expect(matches(bellState, "bell state")).toBe(true);
  });

  it("matches tokens split across title and description", () => {
    expect(matches(bellState, "bell entangled")).toBe(true);
  });

  it("requires every token: one stray token rejects the entry", () => {
    expect(matches(bellState, "bell hamiltonian")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(matches(bellState, "BELL State")).toBe(true);
  });

  it("matches nothing on an empty query", () => {
    expect(matchesAllTokens(bellState, tokenizeQuery(""))).toBe(false);
    expect(matchesAllTokens(bellState, tokenizeQuery("   "))).toBe(false);
  });
});

describe("matchScore", () => {
  const bellState = prepare("Bell state", "One of four maximally entangled two-qubit states.");
  const chshTest = prepare("CHSH Bell Test", "Pick four measurement angles on an entangled pair.");
  const descriptionOnly = prepare(
    "Entanglement",
    "The correlation behind every Bell state experiment."
  );

  it("preserves the single-token hierarchy: exact < prefix < title-contains < description-only", () => {
    expect(score(prepare("Qubit", "The basic unit."), "qubit")).toBe(0);
    expect(score(prepare("Qubit dynamics", "Driving."), "qubit")).toBe(1);
    expect(score(prepare("Logical qubit", "Encoded."), "qubit")).toBe(2);
    expect(score(prepare("Bloch sphere", "Visualizes a qubit."), "qubit")).toBe(3);
  });

  it("ranks an exact title match of a multi-token query at 0", () => {
    expect(score(bellState, "bell state")).toBe(0);
    expect(score(bellState, "Bell   State")).toBe(0);
  });

  it("ranks a title covering all tokens above a description-only match", () => {
    expect(score(chshTest, "bell test")).toBeLessThan(score(descriptionOnly, "bell state"));
  });

  it("scores 3 whenever any token is absent from the title, so the overlay's glossary re-rank keeps its meaning", () => {
    expect(score(descriptionOnly, "bell state")).toBe(3);
    expect(score(bellState, "bell entangled")).toBe(3);
  });

  it("scores an accented title against a folded query as if unaccented", () => {
    const schrodinger = prepare("Schrödinger equation", "Evolution of the state.");
    expect(score(schrodinger, "schrodinger equation")).toBe(0);
    expect(score(schrodinger, "schrodinger")).toBe(1);
  });
});

describe("acronym queries", () => {
  const qec = prepare(
    "Quantum Error Correction",
    "Encoding logical qubits across many physical ones so errors can be detected and undone."
  );
  const qecCourse = prepare(
    "Quantum Error Correction & Fault Tolerance",
    "Codes, thresholds, and what it takes to compute reliably on unreliable hardware."
  );
  const qft = prepare("Quantum Fourier Transform", "The basis change at the heart of phase estimation.");
  const mentionsQft = prepare(
    "Phase Estimation Precision & Approximate QFT",
    "How far the QFT can be truncated before precision suffers."
  );

  it("finds an entry by an initialism that appears nowhere in its text", () => {
    // The corpus spells every concept out: "QEC" is in no title and no
    // description in the whole index, so before this it produced the
    // zero-result screen for a term, a course and a simulator that exist.
    expect(qec.foldedText).not.toContain("qec");
    expect(matches(qec, "QEC")).toBe(true);
    expect(matches(qec, "qec")).toBe(true);
  });

  it("ranks the entry the initialism names above one that merely spells the letters out", () => {
    // "QFT" used to put "Phase Estimation Precision & Approximate QFT" first,
    // because it holds the corpus's only literal "QFT", and buried Quantum
    // Fourier Transform in the description-only band.
    expect(score(qft, "QFT")).toBeLessThan(score(mentionsQft, "QFT"));
    expect(score(qft, "QFT")).toBe(1);
  });

  it("ranks an exact initialism above a longer one it only prefixes", () => {
    expect(score(qec, "qec")).toBe(1);
    expect(score(qecCourse, "qec")).toBe(2);
  });

  it("will not prefix-match an initialism from a two-letter token", () => {
    // A two-letter token matches only an exact initialism; allowing prefixes
    // that short would make "qe" pull in every Quantum-E* title in the index.
    expect(matches(qecCourse, "qe")).toBe(false);
    expect(matches(prepare("Quantum Entanglement", "Two systems, one state."), "qe")).toBe(true);
  });

  it("leaves a plain word query scoring exactly as it did before", () => {
    // The acronym channel only ever runs on a token the title does not
    // contain, so no entry that already had a band can be moved by it.
    expect(score(prepare("Qubit", "The basic unit."), "qubit")).toBe(0);
    expect(score(prepare("Bloch sphere", "Visualizes a qubit."), "qubit")).toBe(3);
  });
});

describe("Dirac-notation queries", () => {
  const ketZero = prepare("The Density Matrix of |0⟩", "Worked from the outer product.");

  it("finds a ket title from the ASCII spelling of the bracket", () => {
    expect(matches(ketZero, "|0>")).toBe(true);
    expect(matches(ketZero, "|0⟩")).toBe(true);
  });

  it("scores both spellings identically, so ranking cannot depend on the keyboard", () => {
    expect(score(ketZero, "|0>")).toBe(score(ketZero, "|0⟩"));
  });
});

describe("end-to-end ranking over a small index", () => {
  // Mirrors the overlay's per-keystroke pipeline: prepare once, tokenize the
  // query, filter by matchesAllTokens, sort by score.
  const entries = prepareSearchEntries([
    makeEntry("Decoherence", "Why superpositions decay: the qubit leaks information."),
    makeEntry("Qubit", "The basic unit of quantum information."),
    makeEntry("Qubit dynamics", "Driving a two-level system."),
  ]);

  it("still ranks an exact title prefix above a description-only match", () => {
    const tokens = tokenizeQuery("qubit");
    const ranked = entries
      .filter((candidate) => matchesAllTokens(candidate, tokens))
      .map((candidate) => ({ title: candidate.entry.title, score: matchScore(candidate, tokens) }))
      .sort((a, b) => a.score - b.score);
    expect(ranked.map((r) => r.title)).toEqual(["Qubit", "Qubit dynamics", "Decoherence"]);
  });
});
