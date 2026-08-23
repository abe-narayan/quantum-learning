import { amplitudeDampingChannel } from "@/lib/quantum/openSystems";
import type { NumericProblem } from "@/lib/problems/types";

const gamma = 0.4;
const [K0, K1] = amplitudeDampingChannel(gamma);
const sum = K0.dagger().mul(K0).add(K1.dagger().mul(K1));
const value = sum.get(1, 1).re;

export const amplitudeDampingTraceCheck: NumericProblem = {
  meta: {
    slug: "amplitude-damping-trace-check",
    title: "Checking K₀†K₀+K₁†K₁'s (1,1) Entry for γ=0.4",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["open-systems", "kraus-operators"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"],
  },
  question: {
    type: "numeric",
    prompt: "For the amplitude damping channel with γ=0.4, K₀†K₀ has (1,1) entry (1-γ) and K₁†K₁ has (1,1) entry γ. What is their sum?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "(1-γ)+γ always equals 1, for any γ.",
  },
  hints: [
    { text: "K₀†K₀'s (1,1) entry is (1-γ) = 1-0.4 = 0.6." },
    { text: "K₁†K₁'s (1,1) entry is γ = 0.4." },
    { text: "0.6+0.4=1.0." },
  ],
  solution: {
    steps: [{ description: "(1-0.4)+0.4 = 0.6+0.4 = 1.0, confirming the (1,1) entry of the trace-preservation identity." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This is one entry of the full trace-preservation check isTracePreserving performs across the whole matrix, computed here by hand for a specific entry.",
    whyCorrect: "(1-γ)+γ=1 algebraically for any γ, confirmed here for γ=0.4 specifically.",
    whyWrong: ["A result other than 1.0 would indicate the channel is not trace-preserving at this entry, contradicting the lesson's worked example."],
  },
};
