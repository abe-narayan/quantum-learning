import type { NumericProblem } from "@/lib/problems/types";

export const typicalSubspaceProbabilityMass: NumericProblem = {
  meta: {
    slug: "typical-subspace-probability-mass",
    title: "How Much Probability Sits in the Typical Set?",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["typical-subspace", "binomial-distribution", "entanglement-distillation"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"],
  },
  question: {
    type: "numeric",
    prompt:
      "Take n=4 copies of |psi> = sqrt(0.9)|00> + sqrt(0.1)|11>. Writing k for the number of copies landing in the |00> branch, the joint Schmidt coefficients are binomially weighted: P(k) = C(4,k) * 0.9^k * 0.1^(4-k). Define the typical set as the k values within one standard deviation of the mean np. Compute the total probability mass in that typical set.",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.9477,
    tolerance: 0.002,
    incorrectFeedback:
      "First find the mean np=4(0.9)=3.6 and standard deviation sqrt(np(1-p))=sqrt(4*0.9*0.1)=0.6, giving the typical range [3.0, 4.2], i.e. k=3 and k=4. Then sum P(3)+P(4) using the binomial formula.",
  },
  hints: [
    { text: "Mean type: np = 4 * 0.9 = 3.6." },
    { text: "Standard deviation: sqrt(np(1-p)) = sqrt(4 * 0.9 * 0.1) = sqrt(0.36) = 0.6, so the typical range is [3.0, 4.2] -- exactly k=3 and k=4." },
    { text: "P(3) = C(4,3) * 0.9^3 * 0.1^1 = 4 * 0.729 * 0.1 = 0.2916. P(4) = C(4,4) * 0.9^4 = 0.6561. Sum them." },
  ],
  solution: {
    steps: [
      { description: "Mean type $np = 4\\times0.9 = 3.6$; standard deviation $\\sigma=\\sqrt{np(1-p)}=\\sqrt{4\\times0.9\\times0.1}=\\sqrt{0.36}=0.6$." },
      { description: "Typical range: $[3.6-0.6,\\,3.6+0.6]=[3.0,4.2]$, which contains exactly the integers $k=3$ and $k=4$." },
      { description: "$P(3)=\\binom{4}{3}(0.9)^3(0.1)^1=4\\times0.729\\times0.1=0.2916$, and $P(4)=\\binom{4}{4}(0.9)^4=0.6561$." },
      { description: "Total typical mass: $0.2916+0.6561=0.9477$." },
    ],
    finalAnswer: "P(typical set) = 0.9477 (about 94.77% of the total probability).",
  },
  explanation: {
    correctIdea:
      "Even at the very small n=4, defining the typical set as types within one standard deviation of the mean already captures the overwhelming majority of the joint Schmidt weight -- the same concentration phenomenon the lesson's own n=6 worked example demonstrates numerically.",
    whyCorrect:
      "The joint Schmidt coefficients of |psi>^{\\otimes n} are exactly binomially distributed by type k (number of copies in the |00> branch), so this is a direct application of the binomial distribution's own concentration around its mean np, the same law of large numbers argument behind the general 2^(nH(p)) asymptotic formula.",
    whyWrong: [
      "Including all five types k=0..4 in the sum gives 1 (the whole distribution), which misses the point of restricting to the typical set specifically.",
      "Using the wrong standard deviation formula (e.g. sqrt(n) alone, ignoring p(1-p)) gives a typical range that doesn't match the one the lesson's own n=6 example uses.",
    ],
  },
};
