import { Complex } from "@/lib/quantum/complex";
import { tensorProduct } from "@/lib/quantum/identicalParticles";
import type { NumericProblem } from "@/lib/problems/types";

const e0 = [new Complex(1), new Complex(0), new Complex(0)];
const product = tensorProduct(e0, e0);
const difference = product.map((c) => c.sub(c));
const value = Math.sqrt(difference.reduce((sum, c) => sum + c.magnitudeSquared(), 0));

export const zeroVectorIsExact: NumericProblem = {
  meta: {
    slug: "zero-vector-is-exact",
    title: "The Vanishing Is Exact, Not Approximate",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["pauli-exclusion"],
    prerequisites: ["quantum-mechanics/identical-particles/the-pauli-exclusion-principle"],
  },
  question: {
    type: "numeric",
    prompt: "Compute ‖|a⟩⊗|a⟩ − |a⟩⊗|a⟩‖ for any normalized single-particle state |a⟩ (this is exactly what antisymmetrize(a,a) computes before normalizing).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.0001,
    nearMisses: [
      { value: 1, tolerance: 0.01, feedback: "1 is the norm of |a⟩⊗|a⟩ itself. The expression subtracts that vector from an identical copy before any norm is taken." },
      { value: 1.4142135623730951, tolerance: 0.01, feedback: "√2 adds the two norms in quadrature, as though the terms were orthogonal. They are the same vector, so they cancel component by component instead." },
      { value: 2, tolerance: 0.01, feedback: "2 is what the two copies would give if they were added. The expression subtracts, which is what makes antisymmetrizing a state with itself return nothing." },
    ],
    incorrectFeedback: "Subtracting any vector from itself gives the zero vector, term by term, and the zero vector's norm carries no floating-point ambiguity. If you got something tiny but nonzero, you computed a difference of two different vectors.",
  },
  hints: [
    { text: "|a⟩⊗|a⟩ minus itself is the zero vector, term by term." },
    { text: "The norm of the zero vector is exact, with no floating-point ambiguity." },
    { text: "This is why antisymmetrize(a,a) reliably throws: the norm check catches an exact zero, not an approximate one." },
  ],
  solution: {
    steps: [{ description: "|a⟩⊗|a⟩ − |a⟩⊗|a⟩ = 0 exactly (subtracting a vector from itself), so its norm is exactly 0." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This underscores that the Pauli exclusion principle isn't a numerically fragile edge case: it's an exact algebraic identity, robust to any choice of |a⟩.",
    whyCorrect: "Subtracting any vector from itself is always exactly the zero vector, term by term, with no rounding involved.",
    whyWrong: ["A nonzero answer would only occur from floating-point error in a different (non-exact) subtraction, which is not the case here, since it's the same vector both times."],
  },
};
