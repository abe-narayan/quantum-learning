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
    incorrectFeedback: "Check whether this phase is exactly representable with two precision bits: a quarter in binary needs only two places. When a phase is exactly representable, the derivation promises no spread at all in the measurement outcome. If your answer has spread in it, revisit that guarantee.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is 1/2^t, the probability of any one outcome from a uniform precision register. Interference is what collapses that spread onto the single correct value here." },
      { value: 0.5, feedback: "Half would mean the outcome is split between two values. That happens when φ·2^t falls between integers; here it lands on one, so there is no spread at all." },
      { value: 0.405, tolerance: 0.02, feedback: "About 0.405 is the familiar 4/π² worst-case bound for a phase that is not exactly representable. This φ is exactly representable, so the bound is not the binding constraint." },
    ],
  },
  hints: [
    { text: "First ask whether this phase is one the precision register can represent exactly. That single question decides whether the answer is a certainty or something smaller." },
    { text: "The derivation's rule: whenever φ·2^t lands on an integer, the precision register measures that integer with certainty." },
    { text: "Here 2^t = 4 outcomes and φ is a quarter, so φ·2^t is an integer. Apply the rule and read off the probability of the correct outcome." },
  ],
  solution: {
    steps: [{ description: "φ=1/4 is exactly representable in 2 bits, so the precision register measures |01⟩ (=1) with certainty: P=1." }],
    finalAnswer: "P = 1.0",
  },
  explanation: {
    correctIdea: "Whenever φN is an integer, phase estimation recovers it exactly, with no approximation involved.",
    whyCorrect: "1/4 with 2 precision bits is exactly such a case, verified directly against the engine.",
    whyWrong: ["Expecting anything less than certainty here misses that this specific phase is exactly representable, unlike a generic irrational phase."],
  },
};
