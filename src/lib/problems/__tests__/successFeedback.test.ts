import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { validateAnswer } from "../validators";
import { validateNumeric } from "../validators/numeric";
import type { NumericAnswer, Problem } from "../types";

/**
 * ============================================================
 * Getting it right must not be the worse experience
 * ============================================================
 * On `/problems/biased-qubit-p1`, submitting `0.96` — the classic forget-to-
 * square error — produced a sentence naming that exact mistake ("0.96 is |β|,
 * the amplitude's magnitude. The Born rule squares it.") and a "Next step"
 * block with three onward links. Submitting the correct `0.92` produced, in
 * full:
 *
 *     Correct
 *     Correct.
 *
 * The same word twice: once as `Feedback`'s status heading and once as
 * `validateNumeric`'s message. And the "Next step" block was gated on
 * `status !== "correct"`, so it vanished. A reader who did the algebra right
 * got strictly less to read and nowhere to go than one who got it wrong.
 *
 * The fix has no new authoring behind it: every problem in the corpus already
 * carries `explanation.correctIdea`, written as a plain statement of the idea
 * (this site does not do praise), and `validateAnswer` now answers a correct
 * submission with it. What this file pins is that the success path stays
 * substantive — measured over the whole corpus, because "Correct." was in
 * exactly two lines of code and would come back the same way.
 */

const numeric = PROBLEMS.filter((p) => p.answer.type === "numeric");
const multipleChoice = PROBLEMS.filter((p) => p.answer.type === "multiple-choice");

/** A submission this problem grades `correct`, where one can be derived
 *  mechanically. Conceptual problems are graded by phrase matching and their
 *  model answers do not all reach `correct` (159 of 175 do, pinned in
 *  `conceptualEcho.test.ts`), so they enter through their own filter below. */
function correctSubmissionFor(problem: Problem): string | undefined {
  if (problem.answer.type === "numeric") return String(problem.answer.value);
  if (problem.answer.type === "multiple-choice") return problem.answer.correctOptionId;
  return problem.solution.finalAnswer;
}

/** Every problem paired with a submission that actually grades `correct`. */
const SOLVED = PROBLEMS.flatMap((problem) => {
  const submission = correctSubmissionFor(problem);
  if (submission === undefined) return [];
  const result = validateAnswer(problem, submission);
  return result.status === "correct" ? [{ problem, result }] : [];
});

/**
 * The status heading `Feedback` prints above the message. Duplicated here
 * from `components/problems/Feedback.tsx` deliberately: a test that imported
 * it would pass if both moved to the same new word together, and the defect
 * being guarded is precisely the message and the heading being the same
 * string.
 */
const STATUS_HEADING = "Correct";

describe("a correct answer is told something worth reading", () => {
  it("has a corpus of solvable problems to check (guards the guard)", () => {
    expect(PROBLEMS.length).toBeGreaterThan(500);
    // Every numeric and multiple-choice problem is mechanically solvable, so
    // an empty or thin set here means the derivation broke, not that the
    // corpus changed.
    expect(SOLVED.length).toBeGreaterThan(numeric.length + multipleChoice.length - 1);
  });

  it("never answers a correct submission with the heading word again", () => {
    const echoes = SOLVED.filter(({ result }) => {
      const message = result.message.trim().replace(/\.$/, "");
      return message.toLowerCase() === STATUS_HEADING.toLowerCase();
    }).map(({ problem }) => problem.meta.slug);

    expect(
      echoes,
      `these problems answer a correct submission with "${STATUS_HEADING}" a second time, which is the whole of what the reader sees`,
    ).toEqual([]);
  });

  it("says something about the problem, not something about the verdict", () => {
    // A floor, not a style rule: "Correct." is 8 characters and the shortest
    // authored `correctIdea` in the corpus is an order of magnitude longer.
    // Anything under this is a verdict wearing a sentence's clothes.
    const thin = SOLVED.filter(({ result }) => result.message.trim().length < 30).map(
      ({ problem, result }) => `${problem.meta.slug}: "${result.message}"`,
    );
    expect(thin).toEqual([]);
  });

  it("uses the problem's own authored correct idea", () => {
    const wrong = SOLVED.filter(
      ({ problem, result }) => result.message !== problem.explanation?.correctIdea?.trim(),
    ).map(({ problem }) => problem.meta.slug);
    expect(wrong).toEqual([]);
  });

  it("reads as a statement about the physics, not as a verdict", () => {
    // Deliberately NOT a ratio against `incorrectFeedback`. That was the first
    // version of this test and it failed on ten problems that are all fine:
    // wrong-answer feedback on a conceptual problem is a coaching instruction
    // ("Assume the opposite instead: suppose it does split into two
    // independent single-qubit pieces, work out what each of the four basis
    // amplitudes would then have to be, ...") and is long because of its
    // genre, while "The Bell state's amplitudes can't be matched by any choice
    // of two single-qubit states' coefficients." says its whole idea in a
    // line. Measuring one against the other measures prose genre, not whether
    // the reader was told anything. So the shape is asserted instead.
    const notSentences = SOLVED.filter(({ result }) => {
      const message = result.message.trim();
      // The terminator may sit inside a closing quote or bracket: one
      // `correctIdea` legitimately ends `...behind 'more shots = more
      // precision.'` and a stricter pattern flagged it as a fragment.
      return !/\s/.test(message) || !/[.!?]["'”’)\]]?$/.test(message);
    }).map(({ problem, result }) => `${problem.meta.slug}: "${result.message}"`);
    expect(notSentences).toEqual([]);
  });

  it("keeps the whole corpus's success messages substantial, not just the minimum", () => {
    // A distribution check, because a single short message is a content
    // question and a *collapse* is the regression this file exists for: the
    // defect being guarded replaced every one of these with an 8-character
    // stub at once, which a per-problem floor alone would catch only after
    // someone argued about where the floor belongs.
    const lengths = SOLVED.map(({ result }) => result.message.trim().length).sort((a, b) => a - b);
    const median = lengths[Math.floor(lengths.length / 2)];
    expect(median).toBeGreaterThan(100);
    expect(lengths[0]).toBeGreaterThan(40);
  });

  it("does not hand back the same sentence for right and wrong", () => {
    const same = SOLVED.filter(({ problem, result }) => {
      const answer = problem.answer;
      const incorrect =
        answer.type === "multiple-choice" ? answer.defaultIncorrectFeedback : answer.incorrectFeedback;
      return result.message === incorrect;
    }).map(({ problem }) => problem.meta.slug);
    expect(same).toEqual([]);
  });
});

/**
 * The grader's own line: the one fact about *this submission* that no authored
 * sentence can carry, because it depends on what the reader typed.
 */
describe("the exact-value note on a numeric answer", () => {
  const answer: NumericAnswer = {
    type: "numeric",
    value: 0.9216,
    tolerance: 0.01,
    incorrectFeedback: "no",
  };

  it("tells a reader accepted by tolerance what the exact value was", () => {
    const result = validateNumeric(answer, "0.92");
    expect(result.status).toBe("correct");
    expect(result.note).toBe("The exact value is 0.9216.");
  });

  it("stays silent when the reader typed the value exactly", () => {
    expect(validateNumeric(answer, "0.9216").note).toBeUndefined();
  });

  it("stays silent rather than 'correcting' a value that prints the same", () => {
    // An answer whose stored value is a float with trailing noise must not
    // tell a reader who typed the clean form that the exact value is the
    // clean form.
    const noisy: NumericAnswer = { ...answer, value: 0.30000000000000004 };
    expect(validateNumeric(noisy, "0.3").note).toBeUndefined();
  });

  it("never prints float noise at a reader who just got it right", () => {
    // 0.1 + 0.2 is 0.30000000000000004. A reader accepted at 0.295 must be
    // told "0.3", not the float. (0.29 would be 0.0100000000000000045 away
    // from it and graded wrong, which is its own small lesson in why the
    // exact value is worth printing.)
    const noisy: NumericAnswer = { ...answer, value: 0.1 + 0.2, tolerance: 0.01 };
    const result = validateNumeric(noisy, "0.295");
    expect(result.status).toBe("correct");
    expect(result.note).toBe("The exact value is 0.3.");
  });

  it("is absent on every wrong answer, where the exact value would be the solution", () => {
    for (const wrong of ["0.5", "0.96", "not a number", ""]) {
      const result = validateNumeric(answer, wrong);
      expect(result.status, wrong).toBe("incorrect");
      expect(result.note, wrong).toBeUndefined();
    }
  });

  it("never leaks the answer across the whole numeric corpus on a wrong submission", () => {
    const leaks: string[] = [];
    for (const problem of numeric) {
      if (problem.answer.type !== "numeric") continue;
      // A value far outside any authored tolerance or near miss.
      const result = validateAnswer(problem, String(problem.answer.value + 1e6 + 7));
      if (result.status === "correct") continue;
      if (result.note !== undefined) leaks.push(problem.meta.slug);
    }
    expect(leaks).toEqual([]);
  });

  it("is plain text, so it never needs an entry in the prerendered math map", () => {
    const withNotes = numeric
      .map((problem) =>
        problem.answer.type === "numeric"
          ? validateAnswer(problem, String(problem.answer.value + problem.answer.tolerance / 2))
          : null,
      )
      .filter((result) => result?.note);
    expect(withNotes.length).toBeGreaterThan(50);
    for (const result of withNotes) {
      expect(result!.note).not.toMatch(/\$[^$]+\$/);
    }
  });
});
