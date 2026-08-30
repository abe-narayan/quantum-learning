import type { NumericProblem } from "@/lib/problems/types";

const digitsOfPrecision = 6;
const epsilon = Math.pow(10, -digitsOfPrecision);
const bits = Math.log2(1 / epsilon);
const midCoefficient = 3.5;
const value = midCoefficient * bits;

export const cliffordTRossSelingerTCountForEpsilon: NumericProblem = {
  meta: {
    slug: "clifford-t-ross-selinger-tcount-for-epsilon",
    title: "Ross-Selinger-Style T-Count for ε = 10⁻⁶",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["clifford-t", "t-count", "ross-selinger", "resource-estimation"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the lesson's Ross-Selinger-style near-optimal T-count scaling for compiling a single Rz(θ) rotation, T-count ≈ 3.5 × log2(1/ε) (the midpoint of the lesson's 3-to-4 coefficient range), estimate the T-count needed to reach precision ε = 10⁻⁶.",
    inputHint: "T gates, to the nearest whole number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1,
    incorrectFeedback:
      "First compute log2(1/ε) for ε=10⁻⁶ (that's 6×log2(10) ≈ 19.93 bits), then multiply by the midpoint coefficient 3.5.",
    nearMisses: [
      {
        value: midCoefficient * digitsOfPrecision,
        tolerance: 0.4,
        feedback:
          "You used the 6 decimal digits directly as the bit count. Precision in bits is log2(1/ε) ≈ 19.93, about 3.32 times the digit count.",
      },
      {
        value: bits,
        tolerance: 0.4,
        feedback: "That is log2(1/ε) on its own. The scaling still has to be multiplied by the coefficient 3.5.",
      },
      {
        value: 3 * bits,
        tolerance: 0.6,
        feedback: "That uses the low end of the 3-to-4 coefficient range. The prompt asks for the midpoint, 3.5.",
      },
      {
        value: 4 * bits,
        tolerance: 0.6,
        feedback: "That uses the high end of the 3-to-4 coefficient range. The prompt asks for the midpoint, 3.5.",
      },
    ],
  },
  hints: [
    { text: "log2(1/ε) = log2(10⁶) = 6 × log2(10)." },
    { text: "log2(10) ≈ 3.3219, so log2(1/ε) ≈ 19.93 bits." },
    { text: "Multiply that bit count by the coefficient 3.5 to get the T-count estimate." },
  ],
  solution: {
    steps: [
      { description: "log₂(1/ε) = log₂(10⁶) = 6 × log₂(10) ≈ 6 × 3.3219 ≈ 19.93 bits." },
      { description: "T-count ≈ 3.5 × 19.93 ≈ 69.76, so about 70 T gates." },
    ],
    finalAnswer: `≈ ${value.toFixed(1)}, so about ${Math.round(value)} T gates`,
  },
  explanation: {
    correctIdea:
      "The Ross-Selinger-style near-optimal scaling is linear in log2(1/ε), with a small constant coefficient (3 to 4), so tightening precision by a fixed number of bits costs only a proportional handful more T gates.",
    whyCorrect:
      "This is dramatically cheaper than the illustrative generic Solovay-Kitaev-style estimate at the same precision, which raises the same bit count to the ~3.97 power instead of multiplying it by a small constant.",
    whyWrong: [
      "Using log10 instead of log2 for 'bits of precision' gives the wrong input to the formula, since the formula is specifically stated in log2.",
      "Forgetting to convert ε=10⁻⁶ to log2(1/ε) first (e.g. plugging in 6 directly) skips the actual bit-count computation the formula requires.",
    ],
  },
};
