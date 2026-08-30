import type { NumericProblem } from "@/lib/problems/types";

/** The lesson's measured variance at n=4, the one datum the reader is handed. */
const measuredAtFour = 2.707e-2;
/** Two more qubits under the O(2^-n) law: one factor of 1/2 per added qubit. */
const value = measuredAtFour / 4;

export const gradientVarianceAtN4Recall: NumericProblem = {
  meta: {
    slug: "gradient-variance-at-n4-recall",
    title: "Extrapolating Gradient Variance from n=4 to n=6",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["barren-plateaus", "vqe"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson's barren-plateau result says the gradient variance of a deep hardware-efficient ansatz with a global cost falls as O(2⁻ⁿ) in the qubit count n. Its own seeded measurement (4n layers, 300 random parameter draws) found Var ≈ 2.707×10⁻² at n=4. Taking the scaling law at face value, what variance does it predict at n=6?",
    inputHint: "as a decimal, to about three significant figures",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.02,
    toleranceType: "relative",
    incorrectFeedback:
      "The law fixes a ratio, not a value: each added qubit multiplies the variance by the same constant factor, so going from n=4 to n=6 applies that factor twice. Write the ratio Var(6)/Var(4) that 2⁻ⁿ implies, then multiply the measured number by it.",
    nearMisses: [
      {
        value: measuredAtFour,
        tolerance: 0.02,
        feedback:
          "That is the n=4 number carried across unchanged. The scaling law is the whole content of the question: two more qubits cannot leave the variance where it was, or there would be no plateau to worry about.",
      },
      {
        value: value * 2,
        tolerance: 0.02,
        feedback:
          "One factor of 1/2 has been applied where two are needed. 2⁻ⁿ halves per qubit, and n moved by two, so the measured value is divided by 2² rather than by 2.",
      },
      {
        value: value / 2,
        tolerance: 0.02,
        feedback:
          "One factor of 1/2 too many. Count the qubits added rather than the rows crossed in the lesson's table: n goes 4 to 6, which is two steps, not three.",
      },
    ],
  },
  hints: [
    {
      text: "A statement that something is O(2⁻ⁿ) is a statement about the ratio between neighbouring values of n, not about any one of them. Ask what that ratio is.",
    },
    {
      text: "Write Var(n) = C·2⁻ⁿ with C unknown. Form Var(6)/Var(4) and notice that C leaves the expression entirely, which is why one measured point is enough.",
    },
    {
      text: "You now have a ratio and one measured variance. Apply the ratio to it, and keep three significant figures so the result can be compared against the lesson's own n=6 row.",
    },
  ],
  solution: {
    steps: [
      {
        description: "Write the law with an unknown constant, so that the constant can be divided away.",
        latex: "\\mathrm{Var}(n) = C\\,2^{-n}",
      },
      {
        description: "The ratio between the two qubit counts depends only on how far apart they are; C cancels.",
        latex: "\\frac{\\mathrm{Var}(6)}{\\mathrm{Var}(4)} = 2^{-(6-4)} = \\tfrac14",
      },
      {
        description:
          "Apply that quarter to the one measured point: 2.707×10⁻² ÷ 4 ≈ 6.77×10⁻³. The lesson's own seeded run at n=6 came out at ≈7.6×10⁻³, about 12% above the prediction, which is what a leading-order scaling law with an unfixed constant is expected to do at small n.",
      },
    ],
    finalAnswer: "≈6.77×10⁻³",
  },
  explanation: {
    correctIdea:
      "A scaling law is usable without knowing its prefactor, because the prefactor cancels in a ratio. That is what lets one measured point at a size you can simulate say something about a size you cannot.",
    whyCorrect:
      "Two added qubits apply the halving twice, so the measured 2.707×10⁻² falls to about a quarter of itself. The measured n=6 value sits ≈12% higher, which is the useful part of the exercise: the law fixes the trend, and the residual gap is the sub-leading behaviour a big-O statement deliberately drops.",
    whyWrong: [
      "Reporting the n=4 value unchanged treats a scaling law as a constant, which is the reading that makes barren plateaus sound harmless.",
      "Halving once instead of twice counts the qubits added as one rather than two, and understates how fast the gradient signal disappears.",
    ],
  },
};
