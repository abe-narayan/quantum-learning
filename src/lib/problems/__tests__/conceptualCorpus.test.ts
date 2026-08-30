import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { conceptualContextFor, validateConceptual } from "../validators/conceptual";
import {
  formatViolations,
  lintConceptualCorpus,
  lintConceptualProblem,
  type ConceptLintRule,
} from "../validators/conceptualLint";
import { conceptGroupPhrases, type ConceptualProblem } from "../types";

/**
 * The guarantees that hold across every authored conceptual problem, rather
 * than across a fixture someone wrote to make a matcher look good.
 *
 * The defect these exist for: `validateConceptual` matches keywords, and a
 * problem's own teaching text is written in the same vocabulary as its answer.
 * Measured on an earlier state of this corpus, pasting a problem's
 * `incorrectFeedback` back into the box graded FULLY CORRECT on 73 of 174
 * problems, and pasting its hints on 87. A student who got it wrong was being
 * handed a passing answer by the text meant to teach them.
 *
 * The fix is not a cleverer matcher. It is this file: the invariants are
 * stated once, checked against all 175+ real problems, and the remedy for a
 * violation is almost always to rewrite the feedback so that it names the
 * *shape* of the missing idea rather than the idea itself. See the contract at
 * the top of `validators/conceptual.ts` for what an author may write.
 */

const conceptualProblems = PROBLEMS.filter(
  (problem): problem is ConceptualProblem => problem.answer.type === "conceptual"
);

/** Grade through the matcher alone: no echo guard, no problem context. */
const gradeByMatcher = (problem: ConceptualProblem, text: string) =>
  validateConceptual(problem.answer, text).status;

/** Grade the way the site does, via the context `validateAnswer` supplies. */
const gradeAtRuntime = (problem: ConceptualProblem, text: string) =>
  validateConceptual(problem.answer, text, conceptualContextFor(problem)).status;

/** Everything the student can read before they have answered. */
function teachingTexts(problem: ConceptualProblem): { label: string; text: string }[] {
  const texts: { label: string; text: string }[] = [
    { label: "incorrectFeedback", text: problem.answer.incorrectFeedback },
  ];
  if (problem.answer.partialFeedback) {
    texts.push({ label: "partialFeedback", text: problem.answer.partialFeedback });
  }
  problem.answer.requiredConceptGroups.forEach((group, index) => {
    if (!Array.isArray(group) && group.missingFeedback) {
      texts.push({ label: `group ${index} missingFeedback`, text: group.missingFeedback });
    }
  });
  problem.hints.forEach((hint, index) => texts.push({ label: `hint ${index}`, text: hint.text }));
  if (problem.hints.length > 1) {
    texts.push({ label: "all hints concatenated", text: problem.hints.map((hint) => hint.text).join(" ") });
    texts.push({ label: "last hint alone", text: problem.hints[problem.hints.length - 1].text });
  }
  return texts;
}

/** The problem's own answer, in each form the author wrote it. */
function modelAnswers(problem: ConceptualProblem): { label: string; text: string }[] {
  const candidates: { label: string; text: string }[] = [
    { label: "solution.finalAnswer", text: problem.solution.finalAnswer },
  ];
  if (problem.explanation?.correctIdea) {
    candidates.push({ label: "explanation.correctIdea", text: problem.explanation.correctIdea });
  }
  const steps = problem.solution.steps.map((step) => step.description).join(" ");
  if (steps.trim()) candidates.push({ label: "solution.steps", text: steps });
  return candidates;
}

describe("conceptual corpus — the grader is not satisfied by its own teaching text", () => {
  /**
   * Every assertion in this file is "the following list is empty", which is
   * exactly what an empty corpus produces. Without this, a `PROBLEMS` that
   * stopped loading — a generator that wrote an empty registry, a filter whose
   * discriminant was renamed — would turn the whole file green while checking
   * nothing at all. A floor rather than the count, so authoring more problems
   * never breaks it; see `CLAUDE.md` on why the exact total is derived and
   * never typed.
   */
  it("has a corpus worth measuring", () => {
    expect(conceptualProblems.length).toBeGreaterThanOrEqual(150);
  });

  it("no feedback string and no hint grades correct", () => {
    const leaks = conceptualProblems.flatMap((problem) =>
      teachingTexts(problem)
        .filter(({ text }) => gradeByMatcher(problem, text) === "correct")
        .map(({ label }) => `${problem.meta.slug}: its own ${label} grades CORRECT`)
    );
    expect(leaks).toEqual([]);
  });

  it("neither the prompt nor the placeholder grades correct at runtime", () => {
    const leaks = conceptualProblems.flatMap((problem) => {
      const texts = [{ label: "question.prompt", text: problem.question.prompt }];
      if (problem.question.placeholder) {
        texts.push({ label: "question.placeholder", text: problem.question.placeholder });
      }
      return texts
        .filter(({ text }) => gradeAtRuntime(problem, text) === "correct")
        .map(({ label }) => `${problem.meta.slug}: its own ${label} grades CORRECT`);
    });
    expect(leaks).toEqual([]);
  });

  it("no teaching text grades correct through the full runtime path either", () => {
    // Same invariant as the first test, but with the echo guard in play — this
    // is what a student actually meets, and it must hold even if a future
    // matcher change makes the matcher-only check pass by luck.
    const leaks = conceptualProblems.flatMap((problem) =>
      teachingTexts(problem)
        .filter(({ text }) => gradeAtRuntime(problem, text) === "correct")
        .map(({ label }) => `${problem.meta.slug}: its own ${label} grades CORRECT at runtime`)
    );
    expect(leaks).toEqual([]);
  });

  it("no content-free non-answer grades correct", () => {
    // Ordinary English with no domain content. If any of these passes, some
    // group is vacuous — usually a phrase that normalization reduced to a
    // stray digit or a bare common word.
    const nonAnswers = [
      "I do not know the answer to this question at all.",
      "Well, it is not really something I can say; nothing here is obvious to me.",
      "Please could you tell me, since my lecture notes are simply unhelpful today.",
      "The answer is 0 and it involves the state, the product, both, two, and it is identical.",
      "yes it is true and correct, exactly, that is the definition, the sum, the probability",
      "because of quantum",
      "idk",
    ];
    const accepted = conceptualProblems.flatMap((problem) =>
      nonAnswers
        .filter((nonAnswer) => gradeByMatcher(problem, nonAnswer) === "correct")
        .map((nonAnswer) => `${problem.meta.slug} marked correct: "${nonAnswer}"`)
    );
    expect(accepted).toEqual([]);
  });

  it("grades nothing correct for a blank, whitespace-only, or punctuation-only submission", () => {
    const accepted = conceptualProblems.flatMap((problem) =>
      ["", "   ", "\n\t ", "...", "?", "—"]
        .filter((blank) => gradeByMatcher(problem, blank) !== "incorrect")
        .map((blank) => `${problem.meta.slug} did not reject ${JSON.stringify(blank)}`)
    );
    expect(accepted).toEqual([]);
  });
});

describe("conceptual corpus — every authored correct answer still grades correct", () => {
  /**
   * The constraint that makes the rest of this file honest. A matcher can be
   * made unfoolable by rejecting everything; this is what stops that. If a
   * problem's own model answer does not pass its own concept groups, the
   * groups are wrong — either a phrase list is missing the wording the author
   * used, or the answer does not actually say what the problem asks for.
   */
  it("accepts at least one of finalAnswer / correctIdea / the solution steps", () => {
    const rejected = conceptualProblems
      .filter((problem) => !modelAnswers(problem).some(({ text }) => gradeByMatcher(problem, text) === "correct"))
      .map((problem) => {
        const detail = modelAnswers(problem)
          .map(({ label, text }) => `${label}=${gradeByMatcher(problem, text)}`)
          .join(", ");
        return `${problem.meta.slug}: none of its own answers pass (${detail})`;
      });
    expect(rejected).toEqual([]);
  });

  it("accepts every phrasing pinned in answer.modelAnswers", () => {
    const rejected = conceptualProblems.flatMap((problem) =>
      (problem.answer.modelAnswers ?? [])
        .filter((modelAnswer) => gradeAtRuntime(problem, modelAnswer) !== "correct")
        .map(
          (modelAnswer) =>
            `${problem.meta.slug}: pinned model answer does not grade correct — ${JSON.stringify(modelAnswer)}`
        )
    );
    expect(rejected).toEqual([]);
  });

  it("does not let the echo guard reject a genuine answer", () => {
    // The guard fires on a submission that is substantially a verbatim run
    // lifted from the problem's own text. A model answer must never trip it.
    const tripped = conceptualProblems.flatMap((problem) =>
      modelAnswers(problem)
        .filter(
          ({ text }) => gradeByMatcher(problem, text) === "correct" && gradeAtRuntime(problem, text) !== "correct"
        )
        .map(({ label }) => `${problem.meta.slug}: the echo guard rejected its own ${label}`)
    );
    expect(tripped).toEqual([]);
  });
});

describe("conceptual corpus — phrase quality lint", () => {
  const violations = lintConceptualCorpus(PROBLEMS);
  const forRule = (rule: ConceptLintRule) => formatViolations(violations.filter((v) => v.rule === rule));

  it("declares every raw-notation anchor", () => {
    expect(forRule("undeclared-anchor")).toEqual([]);
  });

  it("has no phrase that normalization reduces to a one- or two-character stub", () => {
    expect(forRule("stub-phrase")).toEqual([]);
  });

  it("has no group standing on a bare high-frequency English word", () => {
    expect(forRule("bare-common-word")).toEqual([]);
  });

  it("has no phrase that also satisfies a different group of the same problem", () => {
    expect(forRule("cross-group-collision")).toEqual([]);
  });

  it("has no phrase repeated across two groups of the same problem", () => {
    expect(forRule("duplicate-phrase")).toEqual([]);
  });

  it("declares anchors only for phrases that exist", () => {
    expect(forRule("anchor-not-a-phrase")).toEqual([]);
  });

  it("asks for at least two distinct ideas per problem", () => {
    expect(forRule("single-concept-group")).toEqual([]);
  });

  it("never lets the question contain its own answer", () => {
    expect(forRule("prompt-satisfies-every-group")).toEqual([]);
  });
});

/**
 * The lint's own guard rail.
 *
 * Every assertion in the block above is "this rule reported nothing", which is
 * also what a lint that has quietly stopped working reports. The rules lean on
 * `phraseShape` (`isAnchor`, `isDegenerate`) and on `groupsSatisfiedBy`, both
 * of which live in the matcher and are changed for matcher reasons — so a
 * refactor that made `isAnchor` never true, or made `groupsSatisfiedBy`
 * strict enough that no phrase satisfies a sibling group, would turn the whole
 * corpus green while checking nothing. This feeds the lint one deliberately
 * broken problem per rule and requires it to complain.
 */
describe("conceptual phrase lint — the rules actually fire", () => {
  const brokenProblem = (
    groups: ConceptualProblem["answer"]["requiredConceptGroups"],
    prompt = "Say why the two operators fail to share an eigenbasis."
  ): ConceptualProblem =>
    ({
      meta: {
        slug: "fixture",
        title: "Fixture",
        course: "fixture",
        difficulty: "beginner",
        estimatedMinutes: 1,
        problemType: "conceptual",
        tags: [],
      },
      question: { type: "conceptual", prompt },
      answer: { type: "conceptual", requiredConceptGroups: groups, incorrectFeedback: "no" },
      hints: [],
      solution: { steps: [], finalAnswer: "" },
    }) as ConceptualProblem;

  const rulesFor = (problem: ConceptualProblem) =>
    lintConceptualProblem(problem).map((violation) => violation.rule);

  it("catches a phrase that normalizes to nothing unless it is declared", () => {
    expect(rulesFor(brokenProblem([["ρ", "density matrix"], ["basis"]]))).toContain("undeclared-anchor");
    expect(
      rulesFor(
        brokenProblem([
          { phrases: ["ρ", "density matrix"], anchors: { "ρ": "the glyph itself is the test" } },
          ["basis"],
        ])
      )
    ).not.toContain("undeclared-anchor");
  });

  it("catches a phrase that normalization reduces to a stub", () => {
    expect(rulesFor(brokenProblem([["p²", "momentum"], ["basis"]]))).toContain("stub-phrase");
  });

  it("catches a group standing on a bare high-frequency word", () => {
    expect(rulesFor(brokenProblem([["probability"], ["basis"]]))).toContain("bare-common-word");
  });

  it("catches two groups one phrase can satisfy at once", () => {
    expect(rulesFor(brokenProblem([["shared eigenbasis"], ["eigenbasis"]]))).toContain("cross-group-collision");
  });

  it("catches the same phrase listed in two groups", () => {
    expect(rulesFor(brokenProblem([["commute", "eigenbasis"], ["commute", "simultaneous"]]))).toContain(
      "duplicate-phrase"
    );
  });

  it("catches an anchor declared for a phrase that is not in the group", () => {
    expect(
      rulesFor(
        brokenProblem([{ phrases: ["density matrix"], anchors: { "ρ": "typo" } }, ["basis"]])
      )
    ).toContain("anchor-not-a-phrase");
  });

  it("catches a problem that asks for only one idea", () => {
    expect(rulesFor(brokenProblem([["shared eigenbasis"]]))).toContain("single-concept-group");
  });

  it("catches a prompt that contains its own answer", () => {
    expect(
      rulesFor(
        brokenProblem(
          [["do not commute"], ["shared eigenbasis"]],
          "Explain how two operators that do not commute lose the shared eigenbasis they would otherwise have."
        )
      )
    ).toContain("prompt-satisfies-every-group");
  });

  it("reports nothing for a problem that breaks none of the rules", () => {
    expect(rulesFor(brokenProblem([["do not commute"], ["uncertainty relation"]]))).toEqual([]);
  });
});

describe("conceptual corpus — structural sanity", () => {
  it("has no empty concept group and no empty phrase", () => {
    const broken = conceptualProblems.flatMap((problem) =>
      problem.answer.requiredConceptGroups.flatMap((group, index) => {
        const phrases = conceptGroupPhrases(group);
        if (phrases.length === 0) return [`${problem.meta.slug}: group ${index} has no phrases`];
        return phrases
          .filter((phrase) => phrase.trim() === "")
          .map(() => `${problem.meta.slug}: group ${index} has an empty phrase`);
      })
    );
    expect(broken).toEqual([]);
  });

  it("grades deterministically — the same submission twice gives the same verdict", () => {
    for (const problem of conceptualProblems) {
      const text = problem.solution.finalAnswer;
      expect(gradeAtRuntime(problem, text)).toBe(gradeAtRuntime(problem, text));
    }
  });

  it("is insensitive to capitalization across the whole corpus", () => {
    const differing = conceptualProblems
      .filter((problem) => {
        const text = problem.solution.finalAnswer;
        return gradeByMatcher(problem, text) !== gradeByMatcher(problem, text.toUpperCase());
      })
      .map((problem) => `${problem.meta.slug}: grades differently when shouted`);
    expect(differing).toEqual([]);
  });
});
