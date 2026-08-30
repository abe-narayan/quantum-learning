import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { getProblem } from "../registry";
import { validateAnswer } from "../validators";
import { conceptGroupPhrases, type ConceptualProblem } from "../types";

/**
 * The false-negative regression suite.
 *
 * `conceptualCorpus.test.ts` proves the grader cannot be fooled by its own
 * teaching text. This file proves the opposite direction, which is the failure
 * an educational reviewer actually met: good-faith correct answers, written the
 * way a student writes them, being graded `partial` or `incorrect`.
 *
 * The measured state before this suite existed, running the real
 * `validateAnswer` over the real registry:
 *
 *   - 8 of 13 good-faith correct answers graded below `correct`.
 *   - 3 of 3 keyword stubs graded `correct`.
 *   - 173 of 175 conceptual problems left `answer.modelAnswers` empty, so
 *     nothing in the corpus pinned any student wording at all.
 *
 * The fix was authoring, not matcher surgery: `modelAnswers` now carries two or
 * three genuinely different student wordings per problem (including the
 * symbolic form wherever the prompt says prove/derive/show), and the concept
 * groups were widened until those wordings pass. The tests below are what stops
 * that from silently regressing.
 *
 * Everything here grades through `validateAnswer`, the same entry point the
 * page uses, so the echo guard and the problem context are in play exactly as
 * they are for a real submission.
 */

const conceptualProblems = PROBLEMS.filter(
  (problem): problem is ConceptualProblem => problem.answer.type === "conceptual"
);

/** Grade the way the site does. */
const grade = (problem: ConceptualProblem, text: string) => validateAnswer(problem, text).status;

function conceptual(slug: string): ConceptualProblem {
  const problem = getProblem(slug);
  if (!problem || problem.answer.type !== "conceptual") {
    throw new Error(`${slug} is not a conceptual problem in the registry`);
  }
  return problem as ConceptualProblem;
}

/**
 * The reviewer's own probes, verbatim. The `G` entries are the answers a
 * student who understood the material would type; every one of them graded
 * below `correct` before this work. The `B` entries are keyword stubs that
 * graded `correct`: each was three or four words lifted straight out of the
 * phrase lists, with no claim built around them.
 */
const REVIEWER_ANSWERS: { slug: string; kind: "good" | "stub"; text: string }[] = [
  {
    slug: "superposition-vs-classical-uncertainty",
    kind: "good",
    text: "The qubit is genuinely in both states at once; measurement forces it to pick one.",
  },
  {
    slug: "superposition-vs-classical-uncertainty",
    kind: "good",
    text: "Nothing hidden inside the qubit decides the outcome ahead of time; the outcome is created when you look.",
  },
  {
    slug: "superposition-vs-classical-uncertainty",
    kind: "good",
    text: "A classical bit already is 0 or 1 and we are just ignorant. A qubit isn't secretly anything - it only becomes 0 or 1 when you measure it.",
  },
  { slug: "superposition-vs-classical-uncertainty", kind: "stub", text: "no definite value until measured" },
  {
    slug: "maximally-mixed-invariance-proof",
    kind: "good",
    text: "U(I/2)U^dagger = (1/2) U I U^dagger = (1/2) U U^dagger = (1/2) I = I/2.",
  },
  {
    slug: "maximally-mixed-invariance-proof",
    kind: "good",
    text: "Scalars commute with matrices so the half comes out front, and what is left is UU-dagger which is the identity by unitarity.",
  },
  {
    slug: "ghz-correlation-without-signaling",
    kind: "good",
    text: "Whatever Alice gets, Bob's own results still look like a fair coin to him. He can only see the correlation once someone phones him with their outcome.",
  },
  {
    slug: "ghz-correlation-without-signaling",
    kind: "good",
    text: "The reduced density matrix of each qubit is maximally mixed, so the marginal statistics are identical no matter what the others do.",
  },
  { slug: "ghz-correlation-without-signaling", kind: "stub", text: "random local compare" },
  {
    slug: "hzh-equals-x-derivation",
    kind: "good",
    text: "HXH=Z. Apply H on the left and H on the right of both sides: H(HXH)H = HZH. The left side is (HH)X(HH) = IXI = X. So X = HZH.",
  },
  { slug: "hzh-equals-x-derivation", kind: "stub", text: "Sandwich it. H squared is the identity." },
];

describe("conceptual regression: the reviewer's probes", () => {
  it("accepts every good-faith correct answer", () => {
    const rejected = REVIEWER_ANSWERS.filter((probe) => probe.kind === "good")
      .map((probe) => ({ ...probe, status: grade(conceptual(probe.slug), probe.text) }))
      .filter((probe) => probe.status !== "correct")
      .map((probe) => `${probe.slug}: ${probe.status} for ${JSON.stringify(probe.text)}`);
    expect(rejected).toEqual([]);
  });

  it("no longer accepts the keyword stubs", () => {
    const accepted = REVIEWER_ANSWERS.filter((probe) => probe.kind === "stub")
      .filter((probe) => grade(conceptual(probe.slug), probe.text) === "correct")
      .map((probe) => `${probe.slug}: still correct for ${JSON.stringify(probe.text)}`);
    expect(accepted).toEqual([]);
  });
});

describe("conceptual regression: every problem pins student wordings", () => {
  it("has a corpus worth measuring", () => {
    // The coverage rules below assert empty lists, which an empty corpus
    // satisfies. A floor, not the count: see `CLAUDE.md`.
    expect(conceptualProblems.length).toBeGreaterThanOrEqual(150);
  });

  /**
   * The coverage rule. One wording is a spot check; two or three genuinely
   * different ones are what catch a group that only recognises the textbook
   * sentence. Every problem in the corpus carries at least two.
   */
  it("gives every conceptual problem at least two modelAnswers", () => {
    const thin = conceptualProblems
      .filter((problem) => (problem.answer.modelAnswers ?? []).length < 2)
      .map((problem) => `${problem.meta.slug}: ${(problem.answer.modelAnswers ?? []).length} modelAnswers`);
    expect(thin).toEqual([]);
  });

  it("grades every pinned wording correct through the real validateAnswer", () => {
    const rejected = conceptualProblems.flatMap((problem) =>
      (problem.answer.modelAnswers ?? [])
        .map((modelAnswer) => ({ modelAnswer, status: grade(problem, modelAnswer) }))
        .filter(({ status }) => status !== "correct")
        .map(({ modelAnswer, status }) => `${problem.meta.slug}: ${status} for ${JSON.stringify(modelAnswer)}`)
    );
    expect(rejected).toEqual([]);
  });

  it("pins no duplicate wordings within a problem", () => {
    const duplicated = conceptualProblems.flatMap((problem) => {
      const seen = new Set<string>();
      return (problem.answer.modelAnswers ?? [])
        .filter((modelAnswer) => {
          const key = modelAnswer.trim().toLowerCase();
          if (seen.has(key)) return true;
          seen.add(key);
          return false;
        })
        .map((modelAnswer) => `${problem.meta.slug}: repeated ${JSON.stringify(modelAnswer)}`);
    });
    expect(duplicated).toEqual([]);
  });
});

describe("conceptual regression: a partial answer is told which idea is missing", () => {
  /**
   * Before this work, 137 of 175 problems had no `missingFeedback` on any
   * group, so a student who had one of two ideas was handed the generic
   * partial text ("answer the question directly") no matter which idea they
   * were short of. Every group now names its own.
   */
  it("gives every concept group a missingFeedback", () => {
    const bare = conceptualProblems.flatMap((problem) =>
      problem.answer.requiredConceptGroups
        .map((group, index) => ({ group, index }))
        .filter(({ group }) => Array.isArray(group) || !group.missingFeedback)
        .map(({ index }) => `${problem.meta.slug}: group ${index} has no missingFeedback`)
    );
    expect(bare).toEqual([]);
  });

  it("gives each group of a problem a distinct missingFeedback", () => {
    const collisions = conceptualProblems.flatMap((problem) => {
      const seen = new Map<string, number>();
      return problem.answer.requiredConceptGroups.flatMap((group, index) => {
        if (Array.isArray(group) || !group.missingFeedback) return [];
        const key = group.missingFeedback.trim().toLowerCase();
        const previous = seen.get(key);
        if (previous !== undefined) {
          return [`${problem.meta.slug}: groups ${previous} and ${index} share one missingFeedback`];
        }
        seen.set(key, index);
        return [];
      });
    });
    expect(collisions).toEqual([]);
  });
});

describe("conceptual regression: adversarial stubs stay below correct", () => {
  /**
   * The shape all three measured false positives had: one phrase lifted from
   * each group, strung together, with nothing asserted around them. Run for
   * three different phrase choices per group so a fix that only hardens the
   * first phrase of each list does not pass.
   */
  it("rejects a phrase salad assembled from a problem's own concept groups", () => {
    const accepted = conceptualProblems.flatMap((problem) =>
      [0, 1, 2].flatMap((pick) => {
        const salad = problem.answer.requiredConceptGroups
          .map((group) => {
            const phrases = conceptGroupPhrases(group);
            return phrases[Math.min(pick, phrases.length - 1)];
          })
          .join(" ");
        return grade(problem, salad) === "correct" ? [`${problem.meta.slug}: ${JSON.stringify(salad)}`] : [];
      })
    );
    expect(accepted).toEqual([]);
  });

  /**
   * A paragraph of real quantum vocabulary that answers nothing in particular.
   * It graded `correct` on 3 of 175 problems before this work, always because
   * some group stood on a single bare domain word ("amplitude", "interference",
   * "identical") that any such paragraph contains by accident.
   */
  it("rejects a generic quantum-buzzword paragraph everywhere", () => {
    const buzzwords =
      "Quantum mechanics means the state is in a superposition of both possibilities at the same time, " +
      "and because of entanglement and interference the amplitudes and phases of the wavefunction combine, " +
      "so when you measure it the state collapses and you get a probability for each outcome, which is why " +
      "quantum computers are more powerful than classical ones.";
    const accepted = conceptualProblems
      .filter((problem) => grade(problem, buzzwords) === "correct")
      .map((problem) => `${problem.meta.slug} marked correct for the buzzword paragraph`);
    expect(accepted).toEqual([]);
  });

  /** Short gestures at a method, with the method itself never carried out. */
  it("rejects a bare gesture at the technique", () => {
    const gestures = [
      "just do the algebra",
      "use the formula",
      "it follows from the definition",
      "by symmetry",
      "same as the lesson said",
      "trivial",
    ];
    const accepted = conceptualProblems.flatMap((problem) =>
      gestures
        .filter((gesture) => grade(problem, gesture) === "correct")
        .map((gesture) => `${problem.meta.slug} marked correct for ${JSON.stringify(gesture)}`)
    );
    expect(accepted).toEqual([]);
  });
});
