import { describe, expect, it } from "vitest";
import { validateNumeric } from "../validators/numeric";
import type { NumericAnswer } from "../types";

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
