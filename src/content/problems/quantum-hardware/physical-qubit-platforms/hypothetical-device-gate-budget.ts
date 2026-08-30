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
    nearMisses: [
      { value: 10, tolerance: 0.5, feedback: "10 is the ratio of the two bare numbers, 500 and 50, with the unit prefixes ignored. Microseconds and nanoseconds differ by a factor of a thousand." },
      { value: 100000, tolerance: 100, feedback: "100,000 is the trapped-ion budget from the earlier lesson. This device is an order of magnitude short of it, which is the comparison the capstone wants." },
    ],
  },
  hints: [
    { text: "The two times are quoted in different units, so convert before dividing. Nanoseconds are the convenient common unit here." },
    { text: "500 μs = 500,000 ns; the gate time is already in nanoseconds." },
    { text: "Divide the coherence time by the gate time. Sanity check the comparison the capstone is after: the result should still fall short of trapped ions' 100,000-gate budget." },
  ],
  solution: {
    steps: [{ description: "500,000 ns / 50 ns = 10,000." }],
    finalAnswer: "10,000",
  },
  explanation: {
    correctIdea: "This lets the reader compare against the trapped-ion lesson's own 100,000-gate budget, directly testing the capstone's 'is the no-free-lunch pattern permanent?' discussion question.",
    whyCorrect: "Dividing a coherence time by a gate time leaves a pure number, which is the count of gate-length intervals that fit inside the coherence window. The units are themselves the check that the division was set up the right way round.",
    whyWrong: ["Even with this improvement, the resulting budget of 10,000 is still an order of magnitude below trapped ions' 100,000, which shows that a single-axis improvement does not automatically overturn the overall tradeoff pattern."],
  },
};
