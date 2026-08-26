import type { NumericProblem } from "@/lib/problems/types";

export const stinespringKrausNonuniquenessEntry: NumericProblem = {
  meta: {
    slug: "stinespring-kraus-nonuniqueness-entry",
    title: "A Rotated Kraus Operator from Environment-Basis Freedom",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["stinespring-dilation", "kraus-nonuniqueness", "amplitude-damping"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"],
  },
  question: {
    type: "numeric",
    prompt:
      "Amplitude damping with gamma=0.4 has K0=diag(1, sqrt(0.6)) and K1=[[0, sqrt(0.4)],[0,0]]. Rotating the environment readout basis by the Hadamard-like unitary W=(1/sqrt2)[[1,1],[1,-1]] gives K0' = (K0+K1)/sqrt2. What is the (row 0, column 1) entry of K0'?",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.447,
    tolerance: 0.002,
    incorrectFeedback:
      "K0 has a (0,1) entry of 0 (it's diagonal), and K1 has a (0,1) entry of sqrt(0.4). Adding and dividing by sqrt(2): (0 + sqrt(0.4))/sqrt(2) = sqrt(0.2).",
  },
  hints: [
    { text: "K0 = diag(1, sqrt(0.6)) is diagonal, so its (0,1) entry is exactly 0." },
    { text: "K1's (0,1) entry is sqrt(0.4) (approx 0.6325)." },
    { text: "K0' = (K0+K1)/sqrt(2), so its (0,1) entry is (0 + sqrt(0.4))/sqrt(2) = sqrt(0.4/2) = sqrt(0.2)." },
  ],
  solution: {
    steps: [
      { description: "$K_0$'s $(0,1)$ entry is $0$ (K0 is diagonal); $K_1$'s $(0,1)$ entry is $\\sqrt{0.4}\\approx0.632456$." },
      { description: "$K_0' = (K_0+K_1)/\\sqrt2$, so its $(0,1)$ entry is $(0+\\sqrt{0.4})/\\sqrt2 = \\sqrt{0.2}$." },
      { description: "$\\sqrt{0.2}\\approx0.447214$." },
    ],
    finalAnswer: "The (0,1) entry of K0' is approximately 0.447.",
  },
  explanation: {
    correctIdea:
      "Rotating the environment's readout basis by a unitary W mixes the original Kraus operators linearly, K_i' = sum_j W_ij K_j -- a genuinely different-looking matrix that nonetheless describes the identical physical channel, since it comes from the same joint unitary U and the same fixed environment state, just read out in a different basis.",
    whyCorrect:
      "This is a direct entry-by-entry computation of K0' = (K0+K1)/sqrt(2) from the lesson's stated non-uniqueness relation K_i' = sum_j W_ij K_j with W the given Hadamard-like matrix.",
    whyWrong: [
      "Using K0 alone (ignoring K1's contribution) misses that the (0,1) entry comes entirely from K1, since K0 is diagonal and contributes 0 there.",
      "Forgetting the 1/sqrt(2) normalization from W's rows gives sqrt(0.4) instead of sqrt(0.2), off by a factor of sqrt(2).",
    ],
  },
};
