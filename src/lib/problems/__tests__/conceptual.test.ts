import { describe, expect, it } from "vitest";
import {
  analyzeSubmission,
  conceptualContextFor,
  groupsSatisfiedBy,
  validateConceptual,
} from "../validators/conceptual";
import type { ConceptualAnswer, ConceptualProblem } from "../types";

const answer: ConceptualAnswer = {
  type: "conceptual",
  requiredConceptGroups: [
    ["cannot", "can't", "impossible"],
    ["product state", "separable", "factor"],
  ],
  incorrectFeedback: "Missing the key idea.",
  partialFeedback: "Partly there.",
};

const withGroups = (groups: ConceptualAnswer["requiredConceptGroups"]): ConceptualAnswer => ({
  type: "conceptual",
  requiredConceptGroups: groups,
  incorrectFeedback: "no",
});

const grade = (groups: ConceptualAnswer["requiredConceptGroups"], submission: string) =>
  validateConceptual(withGroups(groups), submission).status;

/**
 * Does the submission satisfy every group *at the matcher level* — ignoring
 * §4's predication floor, which is a separate question with its own block
 * below.
 *
 * The distinction is load-bearing for the boundary, negation, inflection and
 * punctuation cases in this file. Each of them is a claim about which strings
 * a phrase does and does not find, and each is written as a four- or five-word
 * fixture in which the phrase list supplies every content word there is. That
 * shape cannot clear the predication floor (nothing in it came from the
 * student) and it does not need to: no authored problem looks like that,
 * because the lint forbids the single-phrase groups these fixtures use. Going
 * through `grade` for those cases would make them fail for a reason that has
 * nothing to do with what they are testing, so they ask the matcher directly.
 * Cases whose subject IS the verdict still go through `grade`.
 */
const satisfies = (groups: ConceptualAnswer["requiredConceptGroups"], submission: string) =>
  groupsSatisfiedBy(groups, analyzeSubmission(submission)).every(Boolean);

describe("validateConceptual", () => {
  it("marks correct when a phrase from every concept group is present", () => {
    const result = validateConceptual(answer, "It cannot be written as a product state.");
    expect(result.status).toBe("correct");
  });

  it("is case-insensitive", () => {
    const result = validateConceptual(answer, "IT IS IMPOSSIBLE to write it as a PRODUCT STATE.");
    expect(result.status).toBe("correct");
  });

  it("accepts any synonym within a group, not just the first", () => {
    const result = validateConceptual(answer, "This can't be separable, because the two qubits stay correlated.");
    expect(result.status).toBe("correct");
  });

  it("marks partial when only some concept groups are matched", () => {
    const result = validateConceptual(answer, "It cannot happen this way.");
    expect(result.status).toBe("partial");
    expect(result.message).toBe("Partly there.");
  });

  it("marks incorrect when no concept groups are matched", () => {
    const result = validateConceptual(answer, "The qubits are just correlated like coins.");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Missing the key idea.");
  });

  it("never executes the submission — plausible-looking code is treated as inert text", () => {
    const result = validateConceptual(answer, "console.log('cannot') // product state");
    // Matches on keywords present as plain text, same as any other string — no execution occurs.
    expect(result.status).toBe("correct");
  });
});

/**
 * This block used to assert a strict superset: that the matcher accepted
 * everything the original case-insensitive substring matcher accepted, by
 * construction. That promise is deliberately no longer true, and breaking it
 * was the point — under it, "not a product state at all" satisfied a phrase
 * requiring the state *to be* a product state, which is the defect this
 * validator exists to fix.
 *
 * What is still true, and what this block now pins, is the useful half:
 * everything the legacy matcher accepted is still accepted UNLESS a negator
 * immediately before the match inverts the claim. The exception is asserted
 * separately below so that nobody can quietly widen it back.
 */
describe("validateConceptual — relationship to the legacy substring matcher", () => {
  const legacyMatch = (groups: string[][], submission: string) => {
    const normalized = submission.trim().toLowerCase();
    return groups.every((group) => group.some((phrase) => normalized.includes(phrase.toLowerCase())));
  };

  const corpus: { groups: string[][]; submission: string }[] = [
    { groups: [["cannot", "can't"]], submission: "It simply can't be done." },
    { groups: [["product state"]], submission: "it is a product state after all" },
    { groups: [["1/sqrt(2)"]], submission: "the amplitude is 1/sqrt(2) here" },
    { groups: [["|0>"], ["collapse"]], submission: "measuring |0> makes the state collapse" },
    { groups: [["non-zero"]], submission: "the overlap stays non-zero" },
    { groups: [["preserv"]], submission: "inner products are preserved" },
    { groups: [["e.g."]], submission: "many cases, e.g. the Bell state" },
    { groups: [["50%"]], submission: "each outcome occurs 50% of the time" },
  ];

  it("accepts every un-negated submission the legacy matcher accepted", () => {
    // Asserted at the matcher level, which is the level the legacy matcher
    // worked at: it answered "does every group contain a substring of this
    // submission?", never "is this an answer?". Several entries below are
    // four-word fixtures made entirely of the phrase plus articles, so the
    // predication floor (§4) grades them `partial` — a verdict about their
    // shape, not about whether the phrases were found. See `satisfies`.
    for (const { groups, submission } of corpus) {
      expect(legacyMatch(groups, submission), `legacy corpus entry should match: "${submission}"`).toBe(true);
      expect(satisfies(groups, submission), `"${submission}" must still match every group`).toBe(true);
      expect(grade(groups, submission), `"${submission}" must never be called wrong`).not.toBe("incorrect");
    }
  });

  it("DELIBERATELY no longer accepts a negated claim the legacy matcher accepted", () => {
    const groups = [["product state"]];
    const submission = "not a product state at all";
    expect(legacyMatch(groups, submission)).toBe(true);
    expect(grade(groups, submission)).toBe("incorrect");
  });

  it("keeps accepting the negated wording when the problem asked for the negation", () => {
    // Here "cannot" is a required concept in its own right, so the negator is
    // expected and does not suppress the second group.
    expect(satisfies([["cannot", "can't"], ["product state"]], "it can't be a product state at all")).toBe(true);
    expect(
      grade([["cannot", "can't"], ["product state"]], "it can't be a product state, the amplitudes do not factor")
    ).toBe("correct");
  });
});

describe("validateConceptual — degenerate submissions", () => {
  it("rejects the empty string", () => {
    expect(validateConceptual(answer, "").status).toBe("incorrect");
  });

  it("rejects whitespace only, including tabs and newlines", () => {
    for (const blank of ["   ", "\t", "\n\n", " \t \n ", " "]) {
      expect(validateConceptual(answer, blank).status, JSON.stringify(blank)).toBe("incorrect");
    }
  });

  it("rejects punctuation only", () => {
    for (const punctuation of ["...", "???", "-", "!!!", "?!", "—", "***"]) {
      expect(validateConceptual(answer, punctuation).status, punctuation).toBe("incorrect");
    }
  });

  it("rejects a submission that normalizes to nothing", () => {
    // Every character is stripped by normalization, so there is no token to
    // match against — this must not fall through to a vacuous "correct".
    expect(validateConceptual(withGroups([["ρ"]]), "…").status).toBe("incorrect");
  });
});

describe("validateConceptual — word boundaries", () => {
  it("does not find a phrase inside a longer word", () => {
    // The exact bug: a boson group asking for "symmetrize" was satisfied by an
    // answer that only ever named the fermion case.
    expect(grade([["symmetrize"]], "you have to antisymmetrize the two-electron state")).toBe("incorrect");
    expect(grade([["symmetrize"]], "you symmetrize the two-boson state")).toBe("correct");
  });

  it("does not let the opposite verdict satisfy a verdict phrase", () => {
    expect(grade([["correct"]], "that statement is incorrect")).toBe("incorrect");
    expect(satisfies([["correct"]], "that statement is correct")).toBe(true);
  });

  it("requires short phrases to land on a whole token", () => {
    // "tr" used to be found inside "matrices"; "p" inside "preserves".
    expect(grade([["tr"]], "the matrices are unitary")).toBe("incorrect");
    expect(grade([["tr"]], "take tr of the density matrix")).toBe("correct");
    expect(grade([["p"]], "the map preserves the inner product")).toBe("incorrect");
    expect(grade([["p"]], "the operator p is momentum")).toBe("correct");
  });

  it("keeps prefix tolerance for phrases long enough to carry meaning", () => {
    expect(grade([["preserv"]], "inner products are preserved")).toBe("correct");
    expect(grade([["unitar"]], "the evolution is unitary")).toBe("correct");
  });

  /**
   * The stemmer normalizes inflection; it must never widen a prefix. `stem`
   * strips a trailing "e" from any word over four letters, so comparing STEM
   * PREFIXES (rather than stems for equality) quietly turned "prove" into
   * "prov" and "state" into "stat" — and then found them inside "provided",
   * "stationary" and "statistics". A group asking whether the student proved
   * something was satisfied by one who said a value was provided.
   */
  it("does not let the stemmer turn a word into a prefix of an unrelated one", () => {
    expect(satisfies([["prove"]], "the value was provided in the table")).toBe(false);
    expect(satisfies([["state"]], "the beam is stationary")).toBe(false);
    expect(satisfies([["state"]], "the statistics are identical")).toBe(false);
    expect(satisfies([["measure"]], "the measurement is repeatable")).toBe(true);
    // ...while every inflection the stemmer exists for still lands, because
    // those collapse to the same stem rather than to a prefix of one.
    expect(satisfies([["commute"]], "the two commuting observables")).toBe(true);
    expect(satisfies([["preserve"]], "the norm is preserved")).toBe(true);
    expect(satisfies([["eigenvalue"]], "the eigenvalues are real")).toBe(true);
  });

  /**
   * The residual, pinned so it is a decision rather than an oversight. A raw
   * prefix match is still unbounded, so a four-letter phrase reaches any word
   * that starts with it. Capping the tail was measured and rejected: the cap
   * that stops "state" reaching "statement" is the same cap that stops
   * "measure" reaching "measurement", and authors write short stems precisely
   * to catch the second.
   */
  it("still reaches a longer word that begins with the phrase", () => {
    expect(satisfies([["spin"]], "the spinor picks up a sign")).toBe(true);
    expect(satisfies([["state"]], "that statement is wrong")).toBe(true);
  });
});

describe("validateConceptual — negation", () => {
  it("discards a match that a negator immediately precedes", () => {
    expect(grade([["true"]], "that claim is not true")).toBe("incorrect");
    expect(satisfies([["true"]], "that claim is true")).toBe(true);
    expect(grade([["conserves probability"]], "this map does not conserve probability")).toBe("incorrect");
    expect(grade([["entangled"]], "the state is never entangled")).toBe("incorrect");
  });

  it("steps over articles, so 'not a proof' does not satisfy 'proof'", () => {
    expect(grade([["proof"]], "a threshold estimate is not a proof")).toBe("incorrect");
    expect(grade([["proof"]], "the threshold estimate is a proof")).toBe("correct");
  });

  it("leaves a 'not' elsewhere in the sentence alone", () => {
    // The negation window is one meaningful token wide, so an unrelated
    // negation somewhere else in the answer costs nothing.
    expect(grade([["product state"]], "this is a product state, not a superposition")).toBe("correct");
    expect(grade([["unitary"]], "measurement is not reversible, whereas a gate is unitary")).toBe("correct");
    expect(
      grade([["cannot", "impossible"], ["product state"]], "It cannot be written as a product state.")
    ).toBe("correct");
  });

  /**
   * Notation phrases are found as raw text, on a path that used to consult the
   * framing check and nothing else — so the one place a group can be spelled
   * as a formula was the one place local negation did not reach. Measured over
   * the corpus, negating every group phrase in turn ("there is no <phrase>")
   * still graded `correct` on 18 of 175 problems, six of them for exactly this
   * reason. It is now 2, and both of those are the intended §3a exemption: a
   * phrase that carries its own negator.
   */
  it("applies local negation to a phrase written as notation", () => {
    expect(grade([["1/sqrt(2)"]], "the amplitude is not 1/sqrt(2) but 1/2")).toBe("incorrect");
    expect(grade([["|+⟩"]], "there is no |+⟩ component in the register")).toBe("incorrect");
    expect(grade([["U†U=I"]], "it is not U†U=I that makes this work")).toBe("incorrect");
    // ...and the unnegated occurrence still counts, including when a negated
    // one appears earlier in the same answer.
    expect(grade([["1/sqrt(2)"]], "each amplitude comes out as 1/sqrt(2) after the Hadamard")).toBe("correct");
    expect(grade([["1/sqrt(2)"]], "it is not 1/2, the amplitude is 1/sqrt(2) for each branch")).toBe("correct");
  });

  it("honours a phrase that carries its own negator", () => {
    // The author's escape hatch: writing the negative wording as a phrase.
    expect(grade([["not a proof"]], "a threshold estimate is not a proof")).toBe("correct");
    expect(grade([["no proof", "not proven"]], "there is no proof that factoring is hard")).toBe("correct");
  });

  it("does not suppress a match a negator merely follows", () => {
    expect(grade([["hermitian"]], "the operator is hermitian, not anti-hermitian")).toBe("correct");
  });
});

/**
 * The other scope of negation, and the one that used to be invisible: a
 * negator at the head of the clause, or in a clause of its own, that denies
 * the whole assertion rather than one phrase inside it.
 *
 * Both halves matter and they pull opposite ways. "The state is not separable"
 * is a student answering correctly about non-separability; "It is not true that
 * the state is entangled" is a student asserting nothing at all, and used to
 * grade identically to asserting it. Every test here that ends in `correct`
 * exists to stop the fix for the second from eating the first.
 */
describe("validateConceptual — framing negation (§3b)", () => {
  it("does not let a sentence-initial denial assert the thing it denies", () => {
    const groups = [["entangled"], ["cannot factor", "not separable", "does not factor"]];
    const asserted = "The state is entangled because it does not factor into single qubit states.";
    expect(grade(groups, asserted)).toBe("correct");
    for (const framed of [
      `It is not true that ${asserted}`,
      `It is NOT the case that ${asserted}`,
      `The common myth is that ${asserted}`,
      `A common misconception is that ${asserted}`,
      `It is false that ${asserted}`,
      `People think that ${asserted}`,
      `Many students believe that ${asserted}`,
      `I used to think ${asserted}`,
      `I was once taught that ${asserted}`,
    ]) {
      expect(grade(groups, framed), framed).not.toBe("correct");
    }
  });

  it("does not let a bare repudiation clause afterwards assert what it erases", () => {
    const groups = [["entangled"], ["not separable"]];
    const asserted = "The state is entangled and it is not separable.";
    expect(grade(groups, asserted)).toBe("correct");
    for (const repudiated of [
      `${asserted} All of that is wrong.`,
      `${asserted} That is not true.`,
      `${asserted} Well, this whole answer is nonsense.`,
      `${asserted} None of that is correct.`,
    ]) {
      expect(grade(groups, repudiated), repudiated).not.toBe("correct");
    }
  });

  it("leaves a local negation inside the answer completely alone", () => {
    // The benign case §3 always documented, and the one the fix must not cost.
    expect(grade([["not separable"], ["entangled"]], "the state is not separable, so it is entangled")).toBe(
      "correct"
    );
    expect(grade([["does not commute"]], "H does not commute with the number operator")).toBe("correct");
    expect(grade([["product state"]], "this is a product state, not a superposition")).toBe("correct");
    expect(grade([["no signalling", "cannot signal"]], "you cannot signal faster than light this way")).toBe(
      "correct"
    );
  });

  it("treats a bare hedge as an answer, and only a distanced one as a frame", () => {
    // "I think X" is an honest student asserting X. Only somebody else's mouth,
    // or the student's own past, turns a report into a disowned claim.
    expect(grade([["entangled"]], "I think the state is entangled")).toBe("correct");
    expect(grade([["entangled"]], "I would say the state is entangled")).toBe("correct");
    expect(grade([["entangled"]], "One can think of the state as entangled")).toBe("correct");
    expect(grade([["entangled"]], "People think the state is entangled")).not.toBe("correct");
    expect(grade([["entangled"]], "I used to think the state is entangled")).not.toBe("correct");
  });

  it("reopens on a contrast marker, so refuting then answering still counts", () => {
    const groups = [["entangled"], ["amplitudes do not factor", "does not factor"]];
    for (const submission of [
      "It is not true that the state is separable. In fact the state is entangled and the amplitudes do not factor.",
      "People say the state is separable, but it is entangled and the amplitudes do not factor.",
      "The myth is that this is a product state. Actually the state is entangled and the amplitudes do not factor.",
    ]) {
      expect(grade(groups, submission), submission).toBe("correct");
    }
  });

  it("does not take a hyphen or a decimal point for a clause boundary", () => {
    // "rigorous-but-pessimistic" is one word, not a contrast reset, and a
    // corpus model answer containing it was being reopened to framing negation
    // through that fake boundary.
    const groups = [["rigorous"], ["numerical"]];
    expect(grade(groups, "the rigorous-but-pessimistic bound and the numerical estimate differ")).toBe("correct");
    expect(
      grade(groups, "It is not true that the rigorous-but-pessimistic bound and the numerical estimate differ")
    ).not.toBe("correct");
  });

  it("suppresses a framed notation phrase, including one spelled with a contraction", () => {
    expect(grade([["aren't functions of"]], "spin states aren't functions of angle")).toBe("correct");
    expect(grade([["aren't functions of"]], "It is not true that spin states aren't functions of angle")).not.toBe(
      "correct"
    );
    expect(grade([["|+⟩"], ["eigenstate"]], "the state |+⟩ is an eigenstate of X")).toBe("correct");
    expect(grade([["|+⟩"], ["eigenstate"]], "It is not true that |+⟩ is an eigenstate of X")).not.toBe("correct");
  });

  it("does not find a raw-notation phrase in the middle of a longer word", () => {
    // "local hidden-variable" was being found inside "NONlocal hidden-variable",
    // which handed a group the opposite of the claim it was testing.
    expect(grade([["local hidden-variable"]], "it says nothing about nonlocal hidden-variable models")).toBe(
      "incorrect"
    );
    expect(grade([["local hidden-variable"]], "it rules out every local hidden-variable model")).toBe("correct");
  });

  it("says what it saw rather than calling the student wrong", () => {
    const framedAnswer: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["entangled"], ["not separable"]],
      incorrectFeedback: "no",
    };
    const result = validateConceptual(framedAnswer, "It is not true that the state is entangled and not separable");
    expect(result.status).toBe("partial");
    expect(result.message).toMatch(/say plainly what is true/i);
  });
});

/**
 * §4: an answer has to be an answer. One phrase lifted from every group and
 * joined with spaces used to score full marks on all 175 conceptual problems.
 */
describe("validateConceptual — predication floor (§4)", () => {
  const groups = [["cannot", "impossible"], ["product state", "separable"]];

  it("does not accept a submission made only of the answer key's own phrases", () => {
    expect(grade(groups, "impossible separable")).toBe("partial");
    expect(grade(groups, "cannot product state")).toBe("partial");
    expect(grade([["rigorous"], ["numerical"]], "rigorous numerical")).toBe("partial");
  });

  it("accepts as soon as one token of the answer is the student's own", () => {
    expect(grade(groups, "it is impossible to write it as a product state")).toBe("correct");
    expect(grade(groups, "separable is impossible for this pair")).toBe("correct");
  });

  it("still accepts a terse but genuine answer", () => {
    expect(grade([["⊗", "tensor product"]], "you take the tensor product of the two spaces")).toBe("correct");
    expect(grade([["preserv"]], "inner products are preserved")).toBe("correct");
  });

  /**
   * The free token has to mean something. `MIN_FREE_TOKENS` alone was six
   * characters from useless: a salad plus " so yes" graded `correct` on 175 of
   * 175 conceptual problems, and so did a salad with "well " or "the answer
   * is " in front of it. Requiring one free token outside the closed-class
   * vocabulary is what closes that, measured at no cost to any of the 532
   * authored model answers in the corpus.
   *
   * The bound this does NOT claim: filler containing a real verb ("because
   * that is what happens") still gets through, and no phrase matcher can tell
   * that from prose. See §4 of the validator.
   */
  it("does not count grammar as the student's own contribution", () => {
    for (const filler of ["impossible separable so yes", "well impossible separable", "the answer is impossible separable"]) {
      expect(grade(groups, filler), filler).toBe("partial");
    }
  });

  /**
   * The measured cost, pinned so it stays visible. A group that supplies every
   * content word of a terse answer leaves nothing free but grammar, and the
   * answer is graded `partial` with the "put it in a sentence" nudge rather
   * than `correct`. No problem in the corpus is in this shape — the lint
   * forbids the single-group form these fixtures use — and the second disjunct
   * (`FREE_FUNCTION_SENTENCE`) is what keeps the one long corpus answer with
   * no free content token passing.
   */
  it("charges a terse answer whose every content word came from the phrase list", () => {
    expect(satisfies([["inner product preserv"]], "inner products are preserved")).toBe(true);
    expect(grade([["inner product preserv"]], "inner products are preserved")).toBe("partial");
  });

  it("asks for a sentence rather than calling the student wrong", () => {
    const result = validateConceptual(withGroups(groups), "impossible separable");
    expect(result.status).toBe("partial");
    expect(result.message).toMatch(/list of key words/i);
  });
});

describe("validateConceptual — notation and unicode", () => {
  it("matches notation phrases as raw text", () => {
    expect(grade([["|+⟩"]], "the state |+⟩ is an eigenstate of X")).toBe("correct");
    expect(grade([["1/sqrt(2)"]], "the amplitude is 1/sqrt(2) here")).toBe("correct");
    expect(grade([["non-zero"]], "the overlap stays non-zero")).toBe("correct");
    expect(grade([["50%"]], "each outcome occurs 50% of the time")).toBe("correct");
    expect(grade([["e.g."]], "many cases, e.g. the Bell state")).toBe("correct");
  });

  it("accepts the ASCII spelling of a unicode idea when the author lists both", () => {
    const groups = [["⟨ψ|", "<psi|", "bra psi"]];
    expect(grade(groups, "start from ⟨ψ| and act to the right")).toBe("correct");
    expect(grade(groups, "start from <psi| and act to the right")).toBe("correct");
    expect(grade(groups, "start from the bra psi and act to the right")).toBe("correct");
  });

  it("does not silently accept the ASCII spelling of a phrase authored only in unicode", () => {
    // ħ, θ, √ and ⊗ vanish under normalization, so they can only ever be
    // matched literally. An author who wants "hbar" to count has to say so —
    // which is what the `anchors` declaration and the lint are for.
    expect(grade([["ħ"]], "the answer is hbar over two")).toBe("incorrect");
    expect(grade([["ħ"]], "the answer is ħ/2")).toBe("correct");
    expect(grade([["⊗"]], "take the tensor product")).toBe("incorrect");
    expect(satisfies([["⊗", "tensor product"]], "take the tensor product")).toBe(true);
  });

  it("does not let a stub left by normalization match a fragment of another token", () => {
    // "−1" normalizes to the single token "1", which used to be found anywhere
    // a 1 appeared — inside "0.15", inside "1000", inside "10 qubits". It now
    // has to land on a whole token. (It still matches a bare "1", which is why
    // `conceptualLint` makes the author declare a phrase in this state.)
    expect(grade([["−1"]], "the probability is 0.15")).toBe("incorrect");
    expect(grade([["−1"]], "the register holds 1024 states")).toBe("incorrect");
    expect(grade([["−1"]], "the eigenvalue is −1")).toBe("correct");
    // "p²" normalizes to "p", which used to be a prefix of "preserves",
    // "potential" and "piece".
    expect(grade([["p²"]], "the operator preserves the norm")).toBe("incorrect");
    expect(grade([["p²"]], "expand p² in the Hamiltonian")).toBe("correct");
    // "tr(" normalizes to "tr", which used to be found inside "matrices".
    expect(grade([["tr("]], "the matrices are traced over")).toBe("incorrect");
  });
});

describe("validateConceptual — student phrasing", () => {
  it("tolerates contractions in either direction", () => {
    expect(grade([["does not commute"]], "it doesn't commute with H")).toBe("correct");
    expect(grade([["doesn't commute"]], "it does not commute with H")).toBe("correct");
    expect(grade([["cannot be cloned"]], "an unknown state can't be cloned")).toBe("correct");
  });

  it("tolerates inflection: plurals, -ing and -ed", () => {
    expect(grade([["eigenvalues"]], "each eigenvalue is real")).toBe("correct");
    expect(grade([["eigenvalue"]], "the eigenvalues are real")).toBe("correct");
    expect(grade([["commute"]], "the two commuting observables share eigenvectors")).toBe("correct");
    expect(satisfies([["preserve the norm"]], "it preserves the norm")).toBe(true);
  });

  it("tolerates interposed words up to a limit", () => {
    expect(satisfies([["inner product preserv"]], "inner products are preserved")).toBe(true);
    expect(grade([["measurement collapses"]], "a measurement of the observable collapses the state")).toBe(
      "correct"
    );
  });

  it("ignores stray punctuation on either side", () => {
    // Punctuation on the submission, on the phrase, and on both.
    expect(grade([["observed"]], "the outcome was observed.")).toBe("correct");
    expect(satisfies([["observed."]], "it was observed")).toBe(true);
    expect(satisfies([["observed."]], "it was observed!")).toBe(true);
    // The bare one-word submission "observed." used to stand here. It is now
    // deliberately below `correct`: with the phrase list supplying the only
    // word in it, there is nothing left that the student contributed. See the
    // predication floor in §4 of the validator, and the adversarial suite.
    expect(grade([["observed"]], "observed.")).toBe("partial");
  });

  it("accepts several equally valid formulations of the same idea", () => {
    const groups = [["superposition", "linear combination", "sum of both", "both at once"]];
    for (const submission of [
      "the qubit is in a superposition of the two basis states",
      "it is a linear combination of |0> and |1>",
      "it is the sum of both basis states with equal weight",
    ]) {
      expect(grade(groups, submission), submission).toBe("correct");
    }
  });

  it("still rejects an unrelated answer that happens to contain a target keyword", () => {
    expect(
      grade(
        [["entangled"], ["measurement"]],
        "I got entangled in the algebra and had to start over, so I guessed."
      )
    ).toBe("partial");
    expect(grade([["entangled"], ["measurement"]], "the qubits are just correlated like coins")).toBe(
      "incorrect"
    );
  });

  it("does not let token order reverse", () => {
    expect(grade([["collapse follows measurement"]], "measurement follows collapse... wait no")).toBe(
      "incorrect"
    );
  });
});

describe("validateConceptual — per-group missingFeedback", () => {
  const answerWithMissingFeedback: ConceptualAnswer = {
    type: "conceptual",
    requiredConceptGroups: [
      ["cannot", "impossible"],
      { phrases: ["product state", "separable"], missingFeedback: "Say what kind of state it cannot be written as." },
    ],
    incorrectFeedback: "Missing the key idea.",
    partialFeedback: "Partly there.",
  };

  it("surfaces the missing group's feedback when that group alone blocks correctness", () => {
    const result = validateConceptual(answerWithMissingFeedback, "It cannot happen this way.");
    expect(result.status).toBe("partial");
    expect(result.message).toBe("Say what kind of state it cannot be written as.");
  });

  it("falls back to partialFeedback when the sole missing group has no missingFeedback", () => {
    const result = validateConceptual(answerWithMissingFeedback, "It is a product state, I think.");
    expect(result.status).toBe("partial");
    expect(result.message).toBe("Partly there.");
  });

  it("does not single out a group when several are missing", () => {
    const twoTargeted: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [
        { phrases: ["cannot"], missingFeedback: "Name the impossibility." },
        { phrases: ["product state"], missingFeedback: "Name the state form." },
      ],
      incorrectFeedback: "Missing the key idea.",
    };
    const result = validateConceptual(twoTargeted, "the qubits are correlated");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Missing the key idea.");
  });

  it("surfaces missingFeedback with incorrect status when the only group is unmatched", () => {
    const single: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [{ phrases: ["superposition"], missingFeedback: "Mention superposition." }],
      incorrectFeedback: "Missing the key idea.",
    };
    const result = validateConceptual(single, "the state is fuzzy");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Mention superposition.");
  });

  it("accepts object-form groups the same as array-form groups when matched", () => {
    const result = validateConceptual(answerWithMissingFeedback, "It cannot be written as a product state.");
    expect(result.status).toBe("correct");
  });
});

/**
 * The grader's own defence against being satisfied by the text it hands a
 * student who got the problem wrong. The corpus test in
 * `conceptualCorpus.test.ts` is the primary guarantee — the fix for a leak is
 * almost always to rewrite the feedback — but this is what stops a verbatim
 * paste from scoring full marks even when the feedback has drifted.
 */
describe("validateConceptual — echo guard", () => {
  const problem: ConceptualProblem = {
    meta: {
      slug: "echo-fixture",
      title: "Echo fixture",
      course: "quantum-computing",
      difficulty: "beginner",
      estimatedMinutes: 3,
      problemType: "conceptual",
      tags: [],
    },
    question: {
      type: "conceptual",
      prompt:
        "Explain why the Bell state cannot be written as a product state of two single qubit states, using the amplitudes.",
      placeholder: "Think about what the four amplitudes would have to satisfy at the same time.",
    },
    answer: {
      type: "conceptual",
      requiredConceptGroups: [
        ["cannot", "impossible"],
        ["product state", "separable"],
      ],
      incorrectFeedback:
        "You have not said why it cannot be written as a product state; write out the four amplitudes and see which pair of equations cannot hold at once.",
      partialFeedback: "One half of the argument is there but the product state condition is still missing.",
    },
    hints: [
      { text: "Write the most general product state of two qubits and expand the tensor product in full." },
      {
        text: "Compare the expansion term by term against the Bell state and see that it cannot be a product state at all.",
      },
    ],
    solution: {
      steps: [{ description: "Expand and compare." }],
      finalAnswer:
        "No choice of single qubit amplitudes reproduces both cross terms at once, so it is impossible to write it as a product state.",
    },
  };
  const context = conceptualContextFor(problem);

  it("refuses to grade a pasted hint as correct", () => {
    const pasted = problem.hints[1].text;
    expect(validateConceptual(problem.answer, pasted).status).toBe("correct");
    expect(validateConceptual(problem.answer, pasted, context).status).not.toBe("correct");
  });

  it("refuses to grade the pasted incorrectFeedback as correct", () => {
    const result = validateConceptual(problem.answer, problem.answer.incorrectFeedback, context);
    expect(result.status).not.toBe("correct");
    expect(result.message).toMatch(/your own words/i);
  });

  it("refuses to grade the pasted prompt as correct", () => {
    expect(validateConceptual(problem.answer, problem.question.prompt, context).status).not.toBe("correct");
  });

  it("still accepts an answer that quotes a little and then reasons", () => {
    const answered =
      "Write the most general product state of two qubits, and you find the cross terms force ad and bc to " +
      "vanish and to be equal at the same time, which is impossible, so the Bell state is not a product state " +
      "under any choice of the four amplitudes.";
    expect(validateConceptual(problem.answer, answered, context).status).toBe("correct");
  });

  it("accepts the model answer unchanged", () => {
    expect(validateConceptual(problem.answer, problem.solution.finalAnswer, context).status).toBe("correct");
  });

  it("does nothing at all when no context is supplied", () => {
    expect(validateConceptual(problem.answer, problem.hints[1].text).status).toBe("correct");
  });
});
