import { periodFindingMeasurementDistribution, classicalOrder } from "@/lib/quantum/shor";
import type { NumericProblem } from "@/lib/problems/types";

const r = classicalOrder(4, 15);
const dist = periodFindingMeasurementDistribution(4, 15, 6);
const value = dist.filter((p) => p > 0.01).length;
if (value !== r) throw new Error(`periodFindingPeakLocations: expected exactly r=${r} peaks, got ${value}.`);

export const periodFindingPeakLocations: NumericProblem = {
  meta: {
    slug: "period-finding-peak-locations",
    title: "Number of Peaks for a=4, N=15",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["shors-algorithm", "period-finding"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"],
  },
  question: {
    type: "numeric",
    prompt: `First find r, the order of 4 mod 15 (a=4, N=15). Then, using t=6 counting qubits, how many distinct peaks does periodFindingMeasurementDistribution produce?`,
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "First compute r (4^1, 4^2, ... mod 15 until you return to 1), then note the peak count equals r exactly — but only because 2^t is here evenly divisible by r.",
  },
  hints: [
    { text: "4¹=4, 4²=16 mod 15=1 — so r=2." },
    { text: "With r=2 and 2^t=64, 64/r=32 is an exact integer — a clean case." },
    { text: "The number of peaks equals r exactly whenever 2^t/r is a whole number." },
  ],
  solution: {
    steps: [
      { description: "r = 2 (since 4² ≡ 1 mod 15)." },
      { description: "64/2 = 32 is an integer, so this is a clean case: exactly r = 2 peaks, at outcomes 0 and 32." },
    ],
    finalAnswer: "2 peaks",
  },
  explanation: {
    correctIdea: "The 'exactly r peaks' rule holds cleanly only when 2^t is evenly divisible by r — this example was chosen specifically because it is.",
    whyCorrect: "Directly confirmed by the engine: exactly two outcomes (0 and 32) carry nonzero probability, each exactly 0.5.",
    whyWrong: ["Using an order that doesn't evenly divide 2^t (try a=2, N=21, r=6, with t=6) gives a smeared distribution across roughly 2r nearby outcomes instead of r sharp peaks — a real subtlety, not this problem's chosen case."],
  },
};
