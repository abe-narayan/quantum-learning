import { describe, expect, it } from "vitest";
import { validateNumeric } from "../validators/numeric";
import type { NumericAnswer } from "../types";
import { PROBLEMS } from "../registry.generated";

const absoluteAnswer: NumericAnswer = {
  type: "numeric",
  value: 0.5,
  tolerance: 0.01,
  incorrectFeedback: "Not quite.",
};

describe("validateNumeric — absolute tolerance", () => {
  it("accepts an exact match", () => {
    expect(validateNumeric(absoluteAnswer, "0.5").status).toBe("correct");
  });

  it("accepts a value within tolerance", () => {
    expect(validateNumeric(absoluteAnswer, "0.505").status).toBe("correct");
  });

  it("rejects a value just outside tolerance", () => {
    const result = validateNumeric(absoluteAnswer, "0.52");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Not quite.");
  });

  it("rejects a wildly incorrect numeric answer", () => {
    expect(validateNumeric(absoluteAnswer, "5").status).toBe("incorrect");
  });

  it("rejects an empty submission", () => {
    expect(validateNumeric(absoluteAnswer, "").status).toBe("incorrect");
  });

  it("rejects a non-numeric submission without throwing", () => {
    const result = validateNumeric(absoluteAnswer, "one half");
    expect(result.status).toBe("incorrect");
    expect(result.message).toMatch(/number/i);
  });

  it("never executes the submission as code, even if it looks like an expression", () => {
    // "1+1" is not a plain numeric literal — Number("1+1") is NaN, so this
    // must be rejected as unparseable, not evaluated to 2.
    const result = validateNumeric(absoluteAnswer, "1+1");
    expect(result.status).toBe("incorrect");
  });
});

describe("validateNumeric — nearMisses", () => {
  const answerWithNearMisses: NumericAnswer = {
    type: "numeric",
    value: 0.5,
    tolerance: 0.01,
    incorrectFeedback: "Not quite.",
    nearMisses: [
      { value: -0.5, feedback: "Check your sign." },
      { value: 0.25, tolerance: 0.02, feedback: "That is the probability, not the amplitude squared root." },
    ],
  };

  it("surfaces the near-miss feedback instead of the generic incorrectFeedback", () => {
    const result = validateNumeric(answerWithNearMisses, "-0.5");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Check your sign.");
  });

  it("uses the near miss's own tolerance when given", () => {
    const inside = validateNumeric(answerWithNearMisses, "0.265");
    expect(inside.status).toBe("incorrect");
    expect(inside.message).toBe("That is the probability, not the amplitude squared root.");

    const outside = validateNumeric(answerWithNearMisses, "0.28");
    expect(outside.status).toBe("incorrect");
    expect(outside.message).toBe("Not quite.");
  });

  it("defaults a near miss's tolerance to the answer's tolerance", () => {
    // Main tolerance is 0.01, so -0.505 is inside the sign-flip window.
    expect(validateNumeric(answerWithNearMisses, "-0.505").message).toBe("Check your sign.");
    // ...and -0.52 is outside it.
    expect(validateNumeric(answerWithNearMisses, "-0.52").message).toBe("Not quite.");
  });

  it("never shadows the correct answer, even with overlapping windows", () => {
    const overlapping: NumericAnswer = {
      type: "numeric",
      value: 0.5,
      tolerance: 0.01,
      incorrectFeedback: "Not quite.",
      nearMisses: [{ value: 0.5, tolerance: 10, feedback: "Should never be shown for a correct submission." }],
    };
    expect(validateNumeric(overlapping, "0.5").status).toBe("correct");
    expect(validateNumeric(overlapping, "0.505").status).toBe("correct");
  });

  it("leaves problems without nearMisses exactly as before", () => {
    const result = validateNumeric(absoluteAnswer, "-0.5");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Not quite.");
  });

  it("scales near-miss windows by the near-miss value under relative tolerance", () => {
    const relative: NumericAnswer = {
      type: "numeric",
      value: 100,
      tolerance: 0.05,
      toleranceType: "relative",
      incorrectFeedback: "Not quite.",
      nearMisses: [{ value: 200, feedback: "You doubled it." }],
    };
    // 5% of 200 is 10, so 195 lands in the near-miss window.
    expect(validateNumeric(relative, "195").message).toBe("You doubled it.");
    expect(validateNumeric(relative, "185").message).toBe("Not quite.");
  });
});

describe("validateNumeric — relative tolerance", () => {
  const relativeAnswer: NumericAnswer = {
    type: "numeric",
    value: 100,
    tolerance: 0.05,
    toleranceType: "relative",
    incorrectFeedback: "Not quite.",
  };

  it("scales the allowed error by the answer's magnitude", () => {
    expect(validateNumeric(relativeAnswer, "104").status).toBe("correct");
    expect(validateNumeric(relativeAnswer, "96").status).toBe("correct");
  });

  it("rejects a value outside the scaled tolerance", () => {
    expect(validateNumeric(relativeAnswer, "110").status).toBe("incorrect");
  });
});

/**
 * Corpus-wide structural guard on authored `nearMisses`.
 *
 * A near miss is a confident diagnosis fired at a student, so an entry that
 * can never fire is dead weight and an entry that swallows another entry's
 * value delivers the *wrong* diagnosis with full confidence. Two invariants
 * catch both cases, and both are cheap to check against the real corpus:
 *
 *  1. A near miss must sit strictly outside the answer's own tolerance
 *     window. Inside it, the submission is graded "correct" before the near
 *     miss is ever consulted (see `validateNumeric`), so the feedback is
 *     unreachable — and, worse, the value it calls a mistake is being marked
 *     right. Practically this means you cannot diagnose a slip finer than the
 *     tolerance: either tighten the tolerance or drop the entry.
 *  2. Near misses are checked in order, first match wins, so an earlier
 *     entry's window must not contain a later entry's value. Note that a
 *     near miss inherits the answer's `tolerance` when it doesn't set its
 *     own, which is what makes this easy to get wrong: a window sized for an
 *     answer in the millions will happily swallow a near miss at 40.
 */
describe("nearMisses — corpus invariants", () => {
  const numericProblems = PROBLEMS.filter(
    (problem): problem is Extract<typeof problem, { answer: { type: "numeric" } }> =>
      problem.answer.type === "numeric" && (problem.answer.nearMisses ?? []).length > 0
  );

  /** The half-width `validateNumeric` will compare against for a given value. */
  const allowedError = (answer: NumericAnswer, value: number) =>
    (answer.toleranceType ?? "absolute") === "relative" ? Math.abs(value) * answer.tolerance : answer.tolerance;

  it("every near miss lies outside the correct answer's tolerance window", () => {
    const dead = numericProblems.flatMap((problem) => {
      const answer = problem.answer;
      const window = allowedError(answer, answer.value);
      return (answer.nearMisses ?? [])
        .filter((nearMiss) => Math.abs(nearMiss.value - answer.value) <= window)
        .map((nearMiss) => `${problem.meta.slug}: near miss ${nearMiss.value} is graded correct (answer ${answer.value} ± ${window})`);
    });
    expect(dead).toEqual([]);
  });

  it("no near miss window swallows a later near miss's value", () => {
    const shadowed = numericProblems.flatMap((problem) => {
      const answer = problem.answer;
      const nearMisses = answer.nearMisses ?? [];
      return nearMisses.flatMap((earlier, i) => {
        const window = allowedError({ ...answer, tolerance: earlier.tolerance ?? answer.tolerance }, earlier.value);
        return nearMisses
          .slice(i + 1)
          .filter((later) => Math.abs(later.value - earlier.value) <= window)
          .map((later) => `${problem.meta.slug}: near miss ${earlier.value} (± ${window}) fires first and hides ${later.value}`);
      });
    });
    expect(shadowed).toEqual([]);
  });
});
