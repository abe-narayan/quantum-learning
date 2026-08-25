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
      { id: "a", text: "The leading-order term vanishes exactly, and in fact the product formula is exact at every order (since e^{-iAδ}e^{-iBδ}=e^{-i(A+B)δ} exactly whenever A and B commute)" },
      { id: "b", text: "The leading O(δ²) term vanishes, but an O(δ³) error still remains regardless of commutativity" },
      { id: "c", text: "The error becomes larger, since [A,B]=0 makes the denominator in the bound blow up" },
      { id: "d", text: "The formula no longer applies at all when A and B commute" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The O(δ³) remainder in the derivation comes entirely from higher-order commutator terms in the full Taylor expansion, which also vanish identically when A and B commute — the product formula is exact, not just leading-order-exact.",
      c: "There is no such denominator in the derived formula — [A,B]=0 makes the error term vanish, not blow up.",
      d: "The derivation places no restriction that would make it inapplicable when A and B commute; it simply predicts zero error in that case.",
    },
    defaultIncorrectFeedback: "Recall that when operators commute, exponentials of their sum factor exactly, a standard fact from ordinary (commuting) exponent algebra.",
  },
  hints: [
    { text: "When A and B commute, e^{A+B}=e^A e^B exactly — an ordinary scalar-exponent fact that extends to commuting operators." },
    { text: "The derived error formula's only source of error is the commutator [A,B]." },
    { text: "If [A,B]=0, every term in the formula that depends on it vanishes, not just the leading one." },
  ],
  solution: {
    steps: [
      { description: "The single-step error is exactly −(δ²/2)[A,B] + O(δ³), where the O(δ³) remainder is itself built from higher commutators of A and B." },
      { description: "If [A,B]=0, both the leading term and every higher-order remainder term vanish identically." },
      { description: "So the product formula e^{-iAδ}e^{-iBδ}=e^{-i(A+B)δ} holds exactly, with zero Trotter error at any step size." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "Noncommutativity is the entire source of Trotter error — commuting operators need no splitting approximation at all.",
    whyCorrect: "This matches ordinary scalar exponent rules extending cleanly to commuting operators, and is exactly what the derivation's structure implies.",
    whyWrong: ["Options b, c, and d each misread what the commutator term in the derivation actually controls."],
  },
};
