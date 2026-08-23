import { Complex } from "@/lib/quantum/complex";
import { phaseGate } from "@/lib/quantum/gates";
import { phaseEstimation } from "@/lib/quantum/qft";
import type { NumericProblem } from "@/lib/problems/types";

const u = phaseGate((2 * Math.PI * 1) / 4); // phase 1/4
const result = phaseEstimation(u, [Complex.ZERO, Complex.ONE], 2);
// precision=01 (1), eigen qubit=1 -> full index 0b011 = 3
const value = result.probabilities()[0b011];

export const phaseEstimationQuarterPhase: NumericProblem = {
  meta: {
    slug: "phase-estimation-quarter-phase",
    title: "Phase Estimation for φ=1/4 with 2 Precision Qubits",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["phase-estimation"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-phase-estimation"],
  },
  question: {
    type: "numeric",
    prompt: "Using 2 precision qubits to estimate φ=1/4 (a phase gate with θ=2π/4), what is the probability of measuring the correct outcome (precision register = 01, eigen qubit = 1)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "φ=1/4 is exactly representable with 2 bits (1/4 = 0.01 in binary) — the derivation guarantees certainty in this case.",
  },
  hints: [
    { text: "φ·N = (1/4)(4) = 1, an integer." },
    { text: "The derivation shows the precision register measures φ·N with certainty whenever it's an integer." },
    { text: "So P = 1." },
  ],
  solution: {
    steps: [{ description: "φ=1/4 is exactly representable in 2 bits, so the precision register measures |01⟩ (=1) with certainty: P=1." }],
    finalAnswer: "P = 1.0",
  },
  explanation: {
    correctIdea: "Whenever φN is an integer, phase estimation recovers it exactly — no approximation involved.",
    whyCorrect: "1/4 with 2 precision bits is exactly such a case, verified directly against the engine.",
    whyWrong: ["Expecting anything less than certainty here misses that this specific phase is exactly representable, unlike a generic irrational phase."],
  },
};
