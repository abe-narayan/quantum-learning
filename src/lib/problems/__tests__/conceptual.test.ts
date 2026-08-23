import { describe, expect, it } from "vitest";
import { validateConceptual } from "../validators/conceptual";
import type { ConceptualAnswer } from "../types";

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
