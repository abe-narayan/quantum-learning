import { exactTwoLevelTransitionProbability } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const omega = 2 * Math.PI * 20e6;
const theta = Math.PI / 2;
const t = theta / (2 * omega);
const value = t * 1e9; // nanoseconds

const p1 = exactTwoLevelTransitionProbability(0, 0, omega, t, 2000);
if (Math.abs(p1 - Math.sin(theta / 2) ** 2) > 1e-6) {
  throw new Error(`pulse-duration-for-pi-over-2: mismatch, got P1=${p1}`);
}

export const pulseDurationForPiOver2: NumericProblem = {
  meta: {
    slug: "pulse-duration-for-pi-over-2",
    title: "Pulse Duration for a θ=π/2 Rotation",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/control-electronics",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["control-electronics", "rabi"],
    prerequisites: ["quantum-hardware/control-and-readout/control-electronics"],
  },
  question: {
    type: "numeric",
    prompt: "Using t=θ/(2Ω), what pulse duration (in ns) implements a θ=π/2 rotation at Ω=2π×20 MHz?",
    inputHint: "in nanoseconds",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.05,
    incorrectFeedback: "Compute (π/2)/(2×2π×20×10⁶) in seconds, then convert to nanoseconds.",
  },
  hints: [
    { text: "t = θ/(2Ω) = (π/2)/(2×2π×20×10⁶)." },
    { text: "Simplify: t = π/(8π×20×10⁶) = 1/(160×10⁶)." },
    { text: "≈6.25 ns." },
  ],
  solution: {
    steps: [{ description: "t = (π/2)/(2×2π×20×10⁶) = 1/(160×10⁶) ≈ 6.25 ns." }],
    finalAnswer: "≈6.25 ns",
  },
  explanation: {
    correctIdea: "This is exactly half the duration of a full π rotation at the same Ω — a direct application of the linear relationship between θ and t.",
    whyCorrect: "Verified against exactTwoLevelTransitionProbability at this duration, giving P₁=sin²(π/4)=0.5 exactly, matching the expected half-population-transfer for a π/2 rotation.",
    whyWrong: ["Using t=θ/Ω instead of t=θ/(2Ω) (forgetting the factor of 2) would double the correct answer to ≈12.5 ns."],
  },
};
