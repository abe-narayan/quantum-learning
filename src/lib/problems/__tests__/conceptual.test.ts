import { describe, expect, it } from "vitest";
import { validateConceptual } from "../validators/conceptual";
import type { ConceptualAnswer } from "../types";
import { PROBLEMS } from "../registry.generated";

const answer: ConceptualAnswer = {
  type: "conceptual",
  requiredConceptGroups: [
    ["cannot", "can't", "impossible"],
    ["product state", "separable", "factor"],
  ],
  incorrectFeedback: "Missing the key idea.",
  partialFeedback: "Partly there.",
};

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
    const result = validateConceptual(answer, "This can't be separable in this way.");
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

  it("rejects an empty submission", () => {
    expect(validateConceptual(answer, "   ").status).toBe("incorrect");
  });

  it("never executes the submission — plausible-looking code is treated as inert text", () => {
    const result = validateConceptual(answer, "console.log('cannot') // product state");
    // Matches on keywords present as plain text, same as any other string — no execution occurs.
    expect(result.status).toBe("correct");
  });
});

describe("validateConceptual — normalization is strictly more lenient than raw substring matching", () => {
  // Property: for any (answer, submission) pair, the new matcher accepts at
  // least everything the original case-insensitive substring matcher
  // accepted. Exercised over a corpus of pairs including punctuation-heavy
  // phrases, where the legacy raw-substring path is the only one that can
  // fire.
  const legacyMatch = (groups: string[][], submission: string) => {
    const normalized = submission.trim().toLowerCase();
    return groups.every((group) => group.some((phrase) => normalized.includes(phrase.toLowerCase())));
  };

  const corpus: { groups: string[][]; submission: string }[] = [
    { groups: [["cannot", "can't"]], submission: "It simply can't be done." },
    { groups: [["product state"]], submission: "not a product state at all" },
    { groups: [["1/sqrt(2)"]], submission: "the amplitude is 1/sqrt(2) here" },
    { groups: [["|0>"], ["collapse"]], submission: "measuring |0> makes the state collapse" },
    { groups: [["non-zero"]], submission: "the overlap stays non-zero" },
    { groups: [["preserv"]], submission: "inner products are preserved" },
    { groups: [["e.g."]], submission: "many cases, e.g. the Bell state" },
    { groups: [["50%"]], submission: "each outcome occurs 50% of the time" },
  ];

  it("accepts every submission the legacy matcher accepted", () => {
    for (const { groups, submission } of corpus) {
      expect(legacyMatch(groups, submission), `legacy corpus entry should match: "${submission}"`).toBe(true);
      const result = validateConceptual(
        { type: "conceptual", requiredConceptGroups: groups, incorrectFeedback: "no" },
        submission
      );
      expect(result.status, `"${submission}" must still be accepted`).toBe("correct");
    }
  });

  it("ignores trailing punctuation: 'observed.' matches the phrase 'observed'", () => {
    const observed: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["observed"]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(observed, "observed.").status).toBe("correct");
    // ...and the reverse: an authored phrase carrying punctuation still
    // matches a clean submission.
    const authoredWithPunctuation: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["observed."]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(authoredWithPunctuation, "it was observed").status).toBe("correct");
  });

  it("tolerates inflection and interposed words: 'inner products are preserved' matches 'inner product preserv'", () => {
    const preserved: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["inner product preserv"]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(preserved, "inner products are preserved").status).toBe("correct");
  });

  it("tolerates simple plurals both ways", () => {
    const plural: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["eigenvalues"]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(plural, "each eigenvalue is real").status).toBe("correct");

    const singular: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["eigenvalue"]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(singular, "the eigenvalues are real").status).toBe("correct");
  });

  it("still rejects answers with none of the ideas", () => {
    const strict: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["entangled"], ["measurement"]],
      incorrectFeedback: "Missing.",
    };
    expect(validateConceptual(strict, "the qubits are just correlated like coins").status).toBe("incorrect");
  });

  it("does not let token order reverse: a multi-word phrase's tokens must appear in order", () => {
    const ordered: ConceptualAnswer = {
      type: "conceptual",
      requiredConceptGroups: [["collapse follows measurement"]],
      incorrectFeedback: "no",
    };
    expect(validateConceptual(ordered, "measurement follows collapse... wait no").status).toBe("incorrect");
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
 * Corpus-wide guard against concept groups that have stopped grading.
 *
 * `phraseMatches` is deliberately lenient: beyond the raw-substring check it
 * matches on the normalized text (punctuation stripped to spaces) and on an
 * in-order token subsequence with prefix/stem tolerance. That leniency is
 * what lets "inner products are preserved" satisfy "inner product preserv" —
 * but it also means a phrase written in maths notation can collapse to
 * almost nothing once normalized. ">= 0" becomes "0", which is a substring
 * of any answer mentioning a zero; "a≠b" becomes the two tokens "a b", which
 * almost any English sentence contains in order. A group holding such a
 * phrase is satisfied by every submission, so it grades nothing, and a
 * problem whose groups are all like that marks a blank non-answer correct.
 *
 * Rather than banning short phrases (some, like "psd", are legitimate), this
 * asserts the property that actually matters: a content-free answer must
 * never come back "correct". When this fails, look for a phrase whose
 * normalized form — lowercase, `[^a-z0-9 ]` replaced by spaces — is one or
 * two very common tokens, and replace it with a spelled-out equivalent.
 */
describe("requiredConceptGroups — corpus invariant", () => {
  // Ordinary English with no domain content: every one of these should be
  // graded "incorrect" or "partial" by every problem in the corpus.
  const nonAnswers = [
    "I do not know the answer to this question at all.",
    "Well, it is not really something I can say; nothing here is obvious to me.",
    "Please could you tell me, since my lecture notes are simply unhelpful today.",
    "The answer is 0 and it involves the state, the product, both, two, and it is identical.",
  ];

  it("no conceptual problem accepts a content-free answer as correct", () => {
    const accepted = PROBLEMS.flatMap((problem) =>
      problem.answer.type !== "conceptual"
        ? []
        : nonAnswers
            .filter((nonAnswer) => validateConceptual(problem.answer as ConceptualAnswer, nonAnswer).status === "correct")
            .map((nonAnswer) => `${problem.meta.slug} marked correct: "${nonAnswer}"`)
    );
    expect(accepted).toEqual([]);
  });
});
