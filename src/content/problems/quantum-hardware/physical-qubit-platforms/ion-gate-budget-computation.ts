import type { NumericProblem } from "@/lib/problems/types";

const coherenceTime = 2; // seconds
const gateTime = 20e-6; // 20 microseconds
const value = coherenceTime / gateTime;

export const ionGateBudgetComputation: NumericProblem = {
  meta: {
    slug: "ion-gate-budget-computation",
    title: "Gate Budget for a 2s Coherence, 20μs Gate Device",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/trapped-ions",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["trapped-ions"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
  },
  question: {
    type: "numeric",
    prompt: "A trapped-ion device has a 2-second coherence time and a 20-microsecond gate time. Using the same ratio method as the lesson's worked example, how many gates fit within the coherence time?",
    inputHint: "as a number (can be large)",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1000,
    incorrectFeedback: "Divide 2 seconds by 20 microseconds (20×10⁻⁶ seconds).",
    nearMisses: [
      { value: 0.1, tolerance: 0.001, feedback: "0.1 divides the bare numbers 2 and 20 with the units ignored. Seconds and microseconds differ by a factor of a million." },
      { value: 10000, tolerance: 100, feedback: "10,000 is off by a factor of ten in the unit conversion: 2 s is 2,000,000 μs, not 200,000." },
    ],
  },
  hints: [
    { text: "The two times are quoted in different units, so convert before dividing. Microseconds work well here." },
    { text: "2 s = 2,000,000 μs; the gate time is already in microseconds." },
    { text: "Divide the coherence time by the gate time. The answer should come out far larger than a superconducting device's budget, which is the platform contrast the lesson is drawing." },
  ],
  solution: {
    steps: [{ description: "2s / 20μs = 2×10⁶μs / 20μs = 10⁵ = 100,000 gates." }],
    finalAnswer: "100,000 (10⁵) gates",
  },
  explanation: {
    correctIdea: "This applies the lesson's ratio method to a new set of numbers, confirming the technique generalizes beyond the specific worked example.",
    whyCorrect: "Direct unit-consistent division, matching the lesson's own worked-example methodology.",
    whyWrong: ["Forgetting to convert units consistently (mixing seconds and microseconds without conversion) would give an answer off by a large, incorrect factor."],
  },
};
