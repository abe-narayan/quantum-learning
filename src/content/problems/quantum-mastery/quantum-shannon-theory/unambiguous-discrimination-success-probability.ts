import type { NumericProblem } from "@/lib/problems/types";

export const unambiguousDiscriminationSuccessProbability: NumericProblem = {
  meta: {
    slug: "unambiguous-discrimination-success-probability",
    title: "Success Probability of Optimal Unambiguous Discrimination",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["povm", "unambiguous-state-discrimination", "naimark"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  question: {
    type: "numeric",
    prompt:
      "Two non-orthogonal qubit states |psi1> = |0> and |psi2> = 0.8|0> + 0.6|1> have overlap s = <psi1|psi2> = 0.8. Using this lesson's optimal 3-outcome unambiguous-discrimination POVM (E1, E2, E?), if the system is actually prepared in |psi1>, what is the probability of correctly and unambiguously identifying it as |psi1> (i.e. P(E1))?",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.2,
    tolerance: 0.001,
    incorrectFeedback:
      "The lesson derived P(correct) = 1 - s and P(inconclusive) = s for the optimal POVM. A common slip is reporting the inconclusive probability s itself instead of its complement. With s = 0.8, take the complement.",
    nearMisses: [
      { value: 0.8, feedback: "0.8 is the inconclusive probability, which equals the overlap s. The success probability is its complement." },
      { value: 0.36, tolerance: 0.002, feedback: "That is 1 − s², using the squared overlap. The unambiguous-discrimination result is linear in the overlap, not in its square." },
    ],
  },
  hints: [
    { text: "The lesson proved kappa = 1/(1+s) for E1 = kappa|psi2-perp><psi2-perp|, and that P(E1 | true state psi1) = kappa * sin^2(theta) simplifies to exactly 1 - s." },
    { text: "Here s = 0.8, so compute 1 - s directly." },
    { text: "Double check you are not reporting P(E?) = s = 0.8, the inconclusive probability, instead of the success probability." },
  ],
  solution: {
    steps: [
      { description: "The optimal unambiguous-discrimination POVM derived in the lesson gives, for the true state psi1: $P(E_1)=1-s$, $P(E_2)=0$, $P(E_?)=s$." },
      { description: "Substituting $s=0.8$: $P(E_1)=1-0.8$." },
    ],
    finalAnswer: "P(E1 | true state psi1) = 0.2.",
  },
  explanation: {
    correctIdea: "The optimal unambiguous discrimination POVM trades a nonzero inconclusive rate (probability s) for a zero misidentification rate; the remaining probability 1-s goes to correctly identifying the true state.",
    whyCorrect: "This is a direct instance of the lesson's general result P(success) = 1 - |<psi1|psi2>|, re-derived from E1 = (1/(1+s))|psi2-perp><psi2-perp| and Tr(E1 rho1) for the specific overlap s = 0.8.",
    whyWrong: [
      "Reporting s = 0.8 itself confuses the inconclusive probability with the success probability. The two are complementary, summing to 1 since P(E2)=0 exactly for this input state, not equal.",
      "Using the Helstrom minimum-error formula instead of the unambiguous-discrimination formula answers a different question: minimum-error discrimination is a forced 2-outcome decision with no inconclusive option, not the same setup as this problem.",
    ],
  },
};
