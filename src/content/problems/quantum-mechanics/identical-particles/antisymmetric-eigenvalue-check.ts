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
    incorrectFeedback: "If P₁₂ψ=−ψ exactly, then ψ+P₁₂ψ=ψ−ψ=0.",
  },
  hints: [
    { text: "A -1 eigenstate satisfies P₁₂ψ=−ψ." },
    { text: "So ψ+P₁₂ψ = ψ + (−ψ) = 0." },
    { text: "The norm of the zero vector is 0." },
  ],
  solution: {
    steps: [{ description: "Since antisymmetrize(e0,e1) is a genuine -1 eigenstate, ψ+P₁₂ψ=ψ−ψ=0 exactly." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "Checking ψ+P₁₂ψ=0 (rather than just ψ−P₁₂ψ) is the correct way to numerically confirm a −1 eigenvalue specifically, distinct from the +1 check used for symmetrize.",
    whyCorrect: "Matches this platform's own test suite verification of antisymmetrize's exchange eigenvalue.",
    whyWrong: ["A nonzero result would mean ψ is NOT a −1 eigenstate, contradicting the antisymmetric construction — it would indicate a real implementation bug."],
  },
};
