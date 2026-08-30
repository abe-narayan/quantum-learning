import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { conceptualContextFor, validateConceptual } from "../validators/conceptual";
import type { ConceptualProblem } from "../types";

/**
 * ============================================================
 * Handing the problem its own words back
 * ============================================================
 * `conceptualAdversarial.test.ts` covers the two attacks the grader was built
 * against: a framing negation ("it is not true that <model answer>") and a
 * salad of the answer key's own phrases. This file covers the third, which is
 * the one a real stuck student actually performs, because it costs nothing and
 * the material is on screen: **copy the prompt into the box and press Submit**.
 * Then the hints. Then the placeholder. Then the feedback from the last wrong
 * attempt.
 *
 * That shape is dangerous for a phrase matcher in a way the other two are not.
 * A prompt is written in the problem's own vocabulary, so it is dense in
 * exactly the tokens the answer key lists; and unlike a salad it is fluent
 * prose, so §4's predication rule (free content tokens outside every authored
 * match) is trivially satisfied. `isEcho` is the only thing standing between
 * those two facts and a `correct`.
 *
 * Every row below is a whole-corpus measurement, not a fixture: for each of
 * the 175 conceptual problems it grades that problem's own text against that
 * problem's own answer key. The ceilings are `0` because that is what was
 * measured, and a ceiling rather than an equality so that a legitimately
 * self-answering prompt could be admitted deliberately rather than by a test
 * quietly going green.
 *
 * The last two blocks are the control. A test that only proves the grader
 * rejects things proves nothing: `MODEL_ANSWER_FLOOR` pins that the same
 * grader still accepts the corpus's own worked answers, so a future change
 * cannot buy an empty echo table by refusing everybody.
 */

const conceptual = PROBLEMS.filter((p): p is ConceptualProblem => p.question.type === "conceptual");

/** Grades `submission` against every conceptual problem and counts the verdicts. */
function gradeCorpus(submissionFor: (problem: ConceptualProblem) => string) {
  const counts = { correct: 0, partial: 0, incorrect: 0 };
  const accepted: string[] = [];
  for (const problem of conceptual) {
    const submission = submissionFor(problem);
    if (submission.trim() === "") continue;
    const result = validateConceptual(problem.answer, submission, conceptualContextFor(problem));
    counts[result.status] += 1;
    if (result.status === "correct") accepted.push(problem.meta.slug);
  }
  return { counts, accepted };
}

/**
 * Measured over the whole corpus, 2026-08-30. Zero, for every one of them.
 * Kept as a named constant so raising it is a visible decision.
 */
const ECHO_CEILING = 0;

/**
 * Measured on the same run: 159 of 175 model answers grade `correct`, 13
 * `partial`, 3 `incorrect`. The floor is the number that matters — the echo
 * table above is only meaningful while the grader still accepts real answers.
 */
const MODEL_ANSWER_FLOOR = 155;

describe("conceptual corpus — the material on screen is not an answer to it", () => {
  it("has a corpus worth attacking", () => {
    expect(conceptual.length).toBeGreaterThan(150);
    // Every attack below needs the problem's own teaching text to exist.
    expect(conceptual.every((p) => p.question.prompt.trim().length > 0)).toBe(true);
    expect(conceptual.filter((p) => p.hints.length > 0).length).toBeGreaterThan(150);
  });

  const ECHOES: [string, (problem: ConceptualProblem) => string][] = [
    ["the prompt, pasted back verbatim", (p) => p.question.prompt],
    ["every hint, joined", (p) => p.hints.map((hint) => hint.text).join(" ")],
    ["the prompt followed by every hint", (p) => `${p.question.prompt} ${p.hints.map((h) => h.text).join(" ")}`],
    ["the answer box's own placeholder", (p) => p.question.placeholder ?? ""],
    ["the feedback from the last wrong attempt", (p) => p.answer.incorrectFeedback],
    [
      // The one that worries a predication rule: a verbatim prompt already
      // supplies fluent grammar, and two more content words on the end supply
      // the free tokens §4 asks for. It must still not be an answer.
      "the prompt with a plausible-sounding tail",
      (p) => `${p.question.prompt} because that is what the physics requires`,
    ],
  ];

  for (const [label, submissionFor] of ECHOES) {
    it(`does not accept ${label}`, () => {
      const { counts, accepted } = gradeCorpus(submissionFor);
      expect(counts.correct + counts.partial + counts.incorrect).toBeGreaterThan(150);
      expect(accepted, `accepted on: ${accepted.join(", ")}`).toHaveLength(ECHO_CEILING);
    });
  }

  it("does not accept a bare non-answer", () => {
    for (const nonAnswer of ["yes", "no", "I do not know", "idk", "not sure", "?"]) {
      const { accepted } = gradeCorpus(() => nonAnswer);
      expect(accepted, `"${nonAnswer}" accepted on: ${accepted.join(", ")}`).toHaveLength(0);
    }
  });
});

describe("conceptual corpus — the control on the table above", () => {
  it("still accepts the corpus's own worked answers", () => {
    const { counts } = gradeCorpus((p) => p.solution.finalAnswer ?? "");
    expect(counts.correct).toBeGreaterThanOrEqual(MODEL_ANSWER_FLOOR);
  });

  it("never tells a reader who pasted the prompt back that they are simply wrong on a problem it half-recognises", () => {
    // An echo that satisfies more than one idea grades `partial` with the
    // "say it in your own words" message, never `incorrect` — the student who
    // does this is stuck, not wrong, and a flat rejection tells them nothing.
    const { counts } = gradeCorpus((p) => p.question.prompt);
    expect(counts.partial).toBeGreaterThan(0);
  });
});
