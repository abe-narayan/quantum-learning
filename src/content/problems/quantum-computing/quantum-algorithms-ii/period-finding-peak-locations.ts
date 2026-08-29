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
    incorrectFeedback: "Two places to slip here. Either the order is off (list successive powers of 4 mod 15 by hand until one of them returns to 1; it happens sooner than you might expect), or you counted something other than the peaks, such as the peak spacing 64/r.",
    nearMisses: [
      { value: 32, feedback: "32 is the spacing between peaks, 2^t/r. The question asks how many peaks there are, which is r itself here." },
      { value: 4, feedback: "4 is the base a, not the order. The order is the first exponent with 4^r ≡ 1 mod 15, and 4² = 16 ≡ 1 already." },
      { value: 64, feedback: "64 is the number of possible outcomes with t=6 counting qubits. Only a handful of them carry probability." },
    ],
  },
  hints: [
    { text: "This problem stacks two questions. What does the order r of a mod N mean, and what rule connects r to the number of peaks in the measurement distribution?" },
    { text: "Find r by listing successive powers of 4 mod 15 until you reach 1. Then recall the clean-division rule: when the total number of outcomes is a multiple of r, the distribution puts one sharp peak at every multiple of (outcomes)/r." },
    { text: "With t=6 counting qubits there are 64 outcomes. Check whether 64 is divisible by the r you found. If it is, the peak count equals the order itself." },
  ],
  solution: {
    steps: [
      { description: "r = 2 (since 4² ≡ 1 mod 15)." },
      { description: "64/2 = 32 is an integer, so this is a clean case: exactly r = 2 peaks, at outcomes 0 and 32." },
    ],
    finalAnswer: "2 peaks",
  },
  explanation: {
    correctIdea: "The 'exactly r peaks' rule holds cleanly only when 2^t is evenly divisible by r. This example was chosen specifically because it is.",
    whyCorrect: "Directly confirmed by the engine: exactly two outcomes (0 and 32) carry nonzero probability, each 0.5.",
    whyWrong: ["Using an order that doesn't evenly divide 2^t (try a=2, N=21, r=6, with t=6) gives a smeared distribution across roughly 2r nearby outcomes instead of r sharp peaks. That subtlety is real, just not this problem's chosen case."],
  },
};
