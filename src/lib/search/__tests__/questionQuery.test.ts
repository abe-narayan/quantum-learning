import { describe, expect, it } from "vitest";
import { stripQuestionStem } from "../questionQuery";

describe("stripQuestionStem", () => {
  it("removes the stem a newcomer opens with", () => {
    expect(stripQuestionStem(["what", "is", "a", "bra"])).toEqual(["bra"]);
    expect(stripQuestionStem(["what", "is", "the", "bloch", "sphere"])).toEqual(["bloch", "sphere"]);
    expect(stripQuestionStem(["how", "does", "grover"])).toEqual(["grover"]);
    expect(stripQuestionStem(["explain", "decoherence"])).toEqual(["decoherence"]);
  });

  it("takes the longest matching stem, not the first plausible one", () => {
    // "what is" before "what is a" leaves a leading "a", which is a substring
    // of very nearly every entry in the index and reinstates the problem.
    expect(stripQuestionStem(["what", "is", "a", "qubit"])).toEqual(["qubit"]);
    expect(stripQuestionStem(["what", "are", "the", "bell", "states"])).toEqual(["bell", "states"]);
  });

  it("drops trailing filler that would AND in a different subject", () => {
    // "work" is a real word in this corpus — thermodynamic work — so leaving
    // it in turns a question about entanglement into a query about both.
    expect(stripQuestionStem(["how", "does", "entanglement", "work"])).toEqual(["entanglement"]);
    expect(stripQuestionStem(["what", "does", "unitary", "mean"])).toEqual(["unitary"]);
  });

  it("leaves a query that is not a question alone", () => {
    expect(stripQuestionStem(["bell", "state"])).toBeNull();
    expect(stripQuestionStem(["what"])).toBeNull();
    expect(stripQuestionStem([])).toBeNull();
  });

  it("refuses to strip a stem down to nothing", () => {
    // "what is a" is the whole query: there is no subject to search for, and
    // an empty token list matches nothing by design.
    expect(stripQuestionStem(["what", "is", "a"])).toBeNull();
    expect(stripQuestionStem(["explain"])).toBeNull();
  });

  it("only ever strips from the front", () => {
    // "speed of light" must not lose its "of": a stem is a way of asking, and
    // these words carry meaning anywhere but position zero.
    expect(stripQuestionStem(["speed", "of", "light"])).toBeNull();
    expect(stripQuestionStem(["entropy", "explain"])).toBeNull();
  });
});
