import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const commutingTermsZeroError: MultipleChoiceProblem = {
  meta: {
    slug: "commuting-terms-zero-error",
    title: "Trotter Error When [A,B]=0",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["trotterization", "commutators"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"],
  },
  question: {
    type: "multiple-choice",
    prompt: "If [A,B]=0 exactly, what does this lesson's derived single-step error formula e^{-iAδ}e^{-iBδ} − e^{-i(A+B)δ} = −(δ²/2)[A,B] + O(δ³) predict?",
    options: [
      { id: "a", text: "The leading term vanishes and so does every higher one, so the product formula is exact when A and B commute" },
      { id: "b", text: "The leading O(δ²) term vanishes, but an O(δ³) error still remains regardless of commutativity of A and B" },
      { id: "c", text: "The formula predicts zero leading error, but only for δ small enough that the O(δ³) remainder stays negligible" },
      { id: "d", text: "The formula predicts zero error for one step, though error still accumulates over the r steps of a simulation" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The O(δ³) remainder in the derivation comes entirely from higher-order commutator terms in the full Taylor expansion, which also vanish identically when A and B commute. The product formula is exact, not just leading-order-exact.",
      c: "There is no remainder left to bound. Every term in the expansion is built from commutators of A and B, so once those vanish the two sides agree for any δ, small or large.",
      d: "Nothing accumulates from nothing. Each step is exact, and a product of r exact steps is exact too; Trotter error over r steps is a sum of per-step errors, every one of which is zero here.",
    },
    defaultIncorrectFeedback: "Recall that when operators commute, exponentials of their sum factor exactly, a standard fact from ordinary (commuting) exponent algebra.",
  },
  hints: [
    { text: "When A and B commute, e^{A+B}=e^A e^B exactly, an ordinary scalar-exponent fact that extends to commuting operators." },
    { text: "The derived error formula's only source of error is the commutator [A,B]." },
    { text: "If [A,B]=0, every term in the formula that depends on it vanishes, not just the leading one." },
  ],
  solution: {
    steps: [
      { description: "The single-step error is exactly −(δ²/2)[A,B] + O(δ³), where the O(δ³) remainder is itself built from higher commutators of A and B." },
      { description: "If [A,B]=0, both the leading term and every higher-order remainder term vanish identically." },
      { description: "So the product formula e^{-iAδ}e^{-iBδ}=e^{-i(A+B)δ} holds exactly, with zero Trotter error at any step size." },
    ],
    finalAnswer: "Every order vanishes, so the product formula is exact whenever A and B commute.",
  },
  explanation: {
    correctIdea: "Noncommutativity is the entire source of Trotter error. Commuting operators need no splitting approximation at all.",
    whyCorrect: "When the terms commute, the exponentials factor exactly as scalar exponents do, so the splitting introduces no error at all. Trotter error is a consequence of non-commutation, not of splitting as such.",
    whyWrong: [
      { optionId: "b", text: "Leaves an O(δ³) error behind. That remainder is built from higher-order commutators, which vanish too when A and B commute." },
      { optionId: "c", text: "Keeps a remainder that is not there. The higher-order terms are commutators too, so shrinking δ is not required for exactness." },
      { optionId: "d", text: "Lets exact steps compound into inexactness. A product of exact steps is exact, however many of them there are." },
    ],
  },
};
