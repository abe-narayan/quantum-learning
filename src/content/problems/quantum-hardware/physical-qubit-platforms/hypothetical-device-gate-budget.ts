import type { NumericProblem } from "@/lib/problems/types";

const coherenceTime = 500e-6; // 500 microseconds
const gateTime = 50e-9; // 50 nanoseconds
const value = coherenceTime / gateTime;

export const hypotheticalDeviceGateBudget: NumericProblem = {
  meta: {
    slug: "hypothetical-device-gate-budget",
    title: "Gate Budget for a 500μs Coherence, 50ns Gate Device",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["capstone"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"],
  },
  question: {
    type: "numeric",
    prompt: "A hypothetical improved superconducting device reaches a 500-microsecond coherence time with 50-nanosecond gates. What is its gate budget (coherence time ÷ gate time)?",
    inputHint: "as a number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 100,
    incorrectFeedback: "Convert both to the same units (e.g. nanoseconds) and divide.",
  },
  hints: [
    { text: "500μs = 500,000 ns." },
    { text: "500,000 ns ÷ 50 ns." },
    { text: "= 10,000." },
  ],
  solution: {
    steps: [{ description: "500,000 ns / 50 ns = 10,000." }],
    finalAnswer: "10,000",
  },
  explanation: {
    correctIdea: "This lets the reader compare against the trapped-ion lesson's own 100,000-gate budget, directly testing the capstone's 'is the no-free-lunch pattern permanent?' discussion question.",
    whyCorrect: "Direct unit-consistent division, matching the established methodology from earlier lessons.",
    whyWrong: ["Even with this improvement, the resulting budget (10,000) is still an order of magnitude below trapped ions' 100,000 — illustrating that a single-axis improvement doesn't automatically overturn the overall tradeoff pattern."],
  },
};
