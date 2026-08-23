import { runGrover } from "@/lib/quantum/grover";
import type { NumericProblem } from "@/lib/problems/types";

const n = 5;
const marked = 7;
const k = 4;
const value = runGrover(n, [marked], k).probabilities()[marked];

export const groverSuccessProbabilityClosedForm: NumericProblem = {
  meta: {
    slug: "grover-success-probability-closed-form",
    title: "Grover Success Probability via the Closed Form",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["grovers-algorithm", "amplitude-amplification"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"],
  },
  question: {
    type: "numeric",
    prompt: "For N=32 (n=5), one marked item, use P(k)=sin²((2k+1)θ), θ=arcsin(1/√32), to compute the success probability after k=4 iterations.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "First find θ=arcsin(1/√32)≈0.1781 rad, then evaluate sin²(9θ).",
  },
  hints: [
    { text: "θ = arcsin(1/√32) ≈ 0.1781 radians." },
    { text: "(2k+1) = 2(4)+1 = 9, so compute sin²(9 × 0.1781)." },
    { text: "9θ ≈ 1.603 radians ≈ 91.9°." },
  ],
  solution: {
    steps: [
      { description: "θ = arcsin(1/√32) ≈ 0.1781 rad." },
      { description: "P = sin²(9θ) ≈ sin²(1.603) ≈ 0.9992." },
    ],
    finalAnswer: `P ≈ ${value.toFixed(4)}`,
  },
  explanation: {
    correctIdea: "The closed-form rotation formula predicts success probability exactly, without running the circuit step by step.",
    whyCorrect: "This matches runGrover's actual output for the same N and iteration count, cross-checked to high precision.",
    whyWrong: ["Using k directly as the rotation angle (instead of (2k+1)θ) skips both the θ-per-N scaling and the odd-multiple structure the derivation established."],
  },
};
