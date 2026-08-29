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
    incorrectFeedback: "Two checks. The sine's argument is the odd multiple of θ that k iterations produce, not kθ itself. And the probability is the squared sine, not the sine. An answer far below certainty usually means the odd multiple went missing.",
    nearMisses: [
      {
        value: Math.sin(4 * Math.asin(1 / Math.sqrt(32))) ** 2,
        tolerance: 0.01,
        feedback: "That uses kθ as the rotation angle. Each iteration turns the state by 2θ starting from θ, so after k iterations the angle is (2k+1)θ.",
      },
      { value: 1 / 32, tolerance: 0.005, feedback: "1/32 is the success probability with no iterations at all. Four iterations are what amplify it to near certainty." },
    ],
  },
  hints: [
    { text: "Two ingredients go into the closed form: the per-iteration rotation angle θ, set by the database size, and the odd multiple of θ that k iterations build up. Find both before touching the sine." },
    { text: "θ = arcsin(N^(-1/2)) with N = 32, which is about 0.1777 radians." },
    { text: "With k = 4, the sine's argument is 9θ ≈ 1.599 radians, just past a right angle. Take the sine and square it." },
  ],
  solution: {
    steps: [
      { description: "θ = arcsin(1/√32) ≈ 0.1777 rad." },
      { description: "P = sin²(9θ) ≈ sin²(1.599) ≈ 0.9992." },
    ],
    finalAnswer: `P ≈ ${value.toFixed(4)}`,
  },
  explanation: {
    correctIdea: "The closed-form rotation formula predicts success probability exactly, without running the circuit step by step.",
    whyCorrect: "This matches runGrover's actual output for the same N and iteration count, cross-checked to high precision.",
    whyWrong: ["Using k directly as the rotation angle (instead of (2k+1)θ) skips both the θ-per-N scaling and the odd-multiple structure the derivation established."],
  },
};
