import { Complex } from "@/lib/quantum/complex";
import { antisymmetrize, exchangeParticles } from "@/lib/quantum/identicalParticles";
import type { NumericProblem } from "@/lib/problems/types";

const e0 = [new Complex(1), new Complex(0), new Complex(0)];
const e1 = [new Complex(0), new Complex(1), new Complex(0)];
const anti = antisymmetrize(e0, e1);
const swapped = exchangeParticles(anti, 3, 3);
const value = Math.sqrt(anti.reduce((sum, c, i) => sum + c.add(swapped[i]).magnitudeSquared(), 0));

export const antisymmetricEigenvalueCheck: NumericProblem = {
  meta: {
    slug: "antisymmetric-eigenvalue-check",
    title: "Confirming the -1 Eigenvalue Numerically",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/bosons-and-fermions",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["fermions", "exchange-operator"],
    prerequisites: ["quantum-mechanics/identical-particles/bosons-and-fermions"],
  },
  question: {
    type: "numeric",
    prompt: "For ψ=antisymmetrize(e0,e1), compute ‖ψ + P₁₂ψ‖. If ψ is a genuine -1 eigenstate, what should this equal?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    nearMisses: [
      { value: 2, tolerance: 0.01, feedback: "2 is what ‖ψ − P₁₂ψ‖ gives: on an antisymmetric state, subtracting the swapped copy reinforces rather than cancels. The prompt adds it." },
      { value: 1, tolerance: 0.01, feedback: "1 is the norm of ψ on its own. The quantity asked for combines ψ with its swapped copy first, and only then takes a norm." },
      { value: 1.4142135623730951, tolerance: 0.01, feedback: "√2 is what you get by adding the two norms in quadrature, as though the terms were orthogonal. They are not: they are exact negatives, so they cancel outright rather than combining." },
    ],
    incorrectFeedback: "If ψ is genuinely antisymmetric, the exchange flips its sign, so adding the swapped copy cancels it term by term. A nonzero result signals an arithmetic slip or a subtly non-antisymmetric ψ, not new physics.",
  },
  hints: [
    { text: "A -1 eigenstate satisfies P₁₂ψ=−ψ." },
    { text: "So ψ+P₁₂ψ = ψ + (−ψ), which cancels exactly." },
    { text: "The vector inside the norm is therefore the zero vector. State its norm." },
  ],
  solution: {
    steps: [{ description: "Since antisymmetrize(e0,e1) is a genuine -1 eigenstate, ψ+P₁₂ψ=ψ−ψ=0 exactly." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "Checking ψ+P₁₂ψ=0 (rather than just ψ−P₁₂ψ) is the correct way to numerically confirm a −1 eigenvalue specifically, distinct from the +1 check used for symmetrize.",
    whyCorrect: "Matches the test suite's verification of antisymmetrize's exchange eigenvalue.",
    whyWrong: ["A nonzero result would mean ψ is not a −1 eigenstate, contradicting the antisymmetric construction; it would indicate a real implementation bug."],
  },
};
