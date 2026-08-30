import { describe, expect, it } from "vitest";
import { validateMultipleChoice } from "../validators/multipleChoice";
import { displayLetters, seededShuffle } from "@/components/problems/optionOrder";
import { PROBLEMS } from "../registry.generated";
import { validateAnswer } from "../validators";
import type { MultipleChoiceAnswer, MultipleChoiceQuestion, MultipleChoiceProblem } from "../types";

const question: MultipleChoiceQuestion = {
  type: "multiple-choice",
  prompt: "Which is |0⟩⊗|1⟩?",
  options: [
    { id: "00", text: "$|00\\rangle$" },
    { id: "01", text: "$|01\\rangle$" },
    { id: "10", text: "$|10\\rangle$" },
  ],
};

const answer: MultipleChoiceAnswer = {
  type: "multiple-choice",
  correctOptionId: "01",
  optionFeedback: { "10": "Order matters." },
  defaultIncorrectFeedback: "Try again.",
};

describe("validateMultipleChoice", () => {
  it("marks the correct option as correct", () => {
    expect(validateMultipleChoice(question, answer, "01").status).toBe("correct");
  });

  it("marks a wrong option as incorrect with option-specific feedback", () => {
    const result = validateMultipleChoice(question, answer, "10");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Order matters.");
  });

  it("falls back to default feedback when no option-specific message exists", () => {
    const result = validateMultipleChoice(question, answer, "00");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Try again.");
  });

  it("rejects an empty submission without crashing", () => {
    expect(validateMultipleChoice(question, answer, "").status).toBe("incorrect");
  });

  it("rejects an option id that doesn't exist on the question", () => {
    const result = validateMultipleChoice(question, answer, "not-a-real-option");
    expect(result.status).toBe("incorrect");
  });

  /**
   * The property that makes the seeded display shuffle safe at all. Options
   * are rendered in a per-slug order (see `components/problems/optionOrder.ts`)
   * and the submitted value is the option's `id`, never its position — so
   * reordering the authored array must change nothing about grading or about
   * which targeted feedback comes back. If this ever failed, shuffling the
   * display would be silently re-grading the problem.
   */
  it("grades identically no matter what order the options are in", () => {
    for (const seed of ["slug-one", "slug-two", "slug-three", "slug-four", "slug-five"]) {
      const reordered: MultipleChoiceQuestion = {
        ...question,
        options: seededShuffle(question.options, seed),
      };
      for (const option of question.options) {
        expect(validateMultipleChoice(reordered, answer, option.id)).toEqual(
          validateMultipleChoice(question, answer, option.id)
        );
      }
    }
  });

  it("looks feedback up by id, not by the option's index", () => {
    // "10" is the third authored option and the only one with targeted
    // feedback. Moving it to the front must not move its message onto
    // whatever now sits third.
    const reordered: MultipleChoiceQuestion = {
      ...question,
      options: [question.options[2], question.options[0], question.options[1]],
    };
    expect(validateMultipleChoice(reordered, answer, "10").message).toBe("Order matters.");
    expect(validateMultipleChoice(reordered, answer, "00").message).toBe("Try again.");
    expect(validateMultipleChoice(reordered, answer, "01").status).toBe("correct");
  });
});

/**
 * The shuffle is only safe if nothing downstream of it resolves an option by
 * position. `registry.test.ts` already checks that every `correctOptionId`,
 * `optionFeedback` key and `whyWrong.optionId` names a real option; this
 * checks the other half — that the display order those ids are rendered in
 * cannot change what any of them means, for every real problem, under its own
 * slug seed rather than a seed chosen to make the test pass.
 */
describe("seeded display order — corpus invariants", () => {
  const multipleChoiceProblems = PROBLEMS.filter(
    (problem): problem is MultipleChoiceProblem => problem.answer.type === "multiple-choice"
  );

  it("has a corpus worth measuring", () => {
    // The invariants below all assert an empty list, which is what an empty
    // corpus produces. A floor, not the count: see `CLAUDE.md`.
    expect(multipleChoiceProblems.length).toBeGreaterThanOrEqual(100);
  });

  /**
   * Targeted feedback is a *diagnosis of a wrong turn*: `optionFeedback[id]` is
   * reached only when `id` was chosen and was not the answer, and a `whyWrong`
   * entry is rendered under the heading "Common mistakes". Attaching either to
   * the correct option produces a page that contradicts itself — the solution
   * explaining why the right answer is a mistake — and neither the validator
   * nor the renderer can notice, because both look the id up and find it.
   * Currently zero across the corpus; this is what keeps it there.
   */
  it("never aims a wrong-answer explanation at the correct option", () => {
    const misaimed = multipleChoiceProblems.flatMap((problem) => {
      const correct = problem.answer.correctOptionId;
      const found: string[] = [];
      if (Object.prototype.hasOwnProperty.call(problem.answer.optionFeedback ?? {}, correct)) {
        found.push(`${problem.meta.slug}: optionFeedback is keyed on the correct option "${correct}"`);
      }
      for (const entry of problem.explanation?.whyWrong ?? []) {
        if (typeof entry !== "string" && entry.optionId === correct) {
          found.push(`${problem.meta.slug}: a "common mistakes" entry points at the correct option "${correct}"`);
        }
      }
      return found;
    });
    expect(misaimed).toEqual([]);
  });

  it("shuffles every problem's options into a permutation of themselves", () => {
    const broken = multipleChoiceProblems.flatMap((problem) => {
      const shuffled = seededShuffle(problem.question.options, problem.meta.slug);
      const before = problem.question.options.map((option) => option.id).sort();
      const after = shuffled.map((option) => option.id).sort();
      return JSON.stringify(before) === JSON.stringify(after)
        ? []
        : [`${problem.meta.slug}: the shuffle lost or duplicated an option`];
    });
    expect(broken).toEqual([]);
  });

  it("is a pure function of the slug — same order every call", () => {
    for (const problem of multipleChoiceProblems) {
      const first = seededShuffle(problem.question.options, problem.meta.slug).map((option) => option.id);
      const second = seededShuffle(problem.question.options, problem.meta.slug).map((option) => option.id);
      expect(second, problem.meta.slug).toEqual(first);
    }
  });

  it("gives every option a distinct display letter", () => {
    const broken = multipleChoiceProblems.flatMap((problem) => {
      const letters = displayLetters(problem.question.options, problem.meta.slug);
      const distinct = new Set(letters.values());
      if (letters.size !== problem.question.options.length || distinct.size !== letters.size) {
        return [`${problem.meta.slug}: display letters are not a bijection over its options`];
      }
      return [];
    });
    expect(broken).toEqual([]);
  });

  it("grades every real problem the same before and after its own shuffle", () => {
    const drifted = multipleChoiceProblems.flatMap((problem) => {
      const shuffled: MultipleChoiceProblem = {
        ...problem,
        question: { ...problem.question, options: seededShuffle(problem.question.options, problem.meta.slug) },
      };
      return problem.question.options.flatMap((option) => {
        const before = validateAnswer(problem, option.id);
        const after = validateAnswer(shuffled, option.id);
        return before.status === after.status && before.message === after.message
          ? []
          : [`${problem.meta.slug}: option "${option.id}" grades differently once the options are reordered`];
      });
    });
    expect(drifted).toEqual([]);
  });

  it("does not shuffle the correct answer into a fixed slot across the corpus", () => {
    // The defect the shuffle exists for: the authored order put the correct
    // option first in the large majority of problems. If the shuffled order
    // did the same thing, nothing would have been fixed.
    const firstSlotHits = multipleChoiceProblems.filter(
      (problem) =>
        seededShuffle(problem.question.options, problem.meta.slug)[0].id === problem.answer.correctOptionId
    ).length;
    const share = firstSlotHits / multipleChoiceProblems.length;
    expect(share).toBeLessThan(0.45);
  });
});
