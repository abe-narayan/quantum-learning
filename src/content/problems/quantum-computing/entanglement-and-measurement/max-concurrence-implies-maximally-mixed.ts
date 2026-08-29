import type { ConceptualProblem } from "@/lib/problems/types";

export const maxConcurrenceImpliesMaximallyMixed: ConceptualProblem = {
  meta: {
    slug: "max-concurrence-implies-maximally-mixed",
    title: "Why C=1 Forces the Reduced State to Be Maximally Mixed",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["concurrence", "purity", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the identity C=√(2(1−Tr(ρ_A²))), explain why C=1 necessarily forces Tr(ρ_A²)=0.5 exactly — not just 'very mixed,' but exactly the maximally mixed value.",
    placeholder: "Plug C=1 into the identity and solve...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["solv", "plug in", "plug c=1", "substitut", "insert", "set c=1", "c=1", "1=√", "1 = √", "square both sides", "squaring"],
      ["0.5", "1/2", "one half", "a half", "exactly", "forces", "forced", "only solution", "unique", "single value", "one value", "no other value", "pinned down", "pins down"],
    ],
    incorrectFeedback: "Treat the identity as an equation to be rearranged. What does setting C to its given value leave you with?",
    partialFeedback: "Good start. Finish by showing the algebra leaves no other possibility for Tr(ρ_A²).",
  },
  hints: [
    { text: "Set C=1 in C=√(2(1-Tr(ρ_A²)))." },
    { text: "Square both sides: 1 = 2(1-Tr(ρ_A²))." },
    { text: "Rearrange for Tr(ρ_A²). How many answers does the equation permit?" },
  ],
  solution: {
    steps: [
      { description: "$1 = \\sqrt{2(1-\\text{Tr}(\\rho_A^2))}$" },
      { description: "Squaring: $1 = 2(1-\\text{Tr}(\\rho_A^2))$, so $1-\\text{Tr}(\\rho_A^2)=0.5$." },
      { description: "$\\text{Tr}(\\rho_A^2) = 0.5$ exactly, with no other value possible." },
    ],
    finalAnswer: "Tr(ρ_A²)=0.5 exactly, since the identity is an equation, not an inequality. It pins down a single value.",
  },
  explanation: {
    correctIdea: "The identity relating C and Tr(ρ_A²) is an exact algebraic equation, so any specific C value forces exactly one Tr(ρ_A²) value.",
    whyCorrect: "This shows maximal entanglement (C=1) and maximal reduced mixedness (Tr(ρ_A²)=0.5, the minimum possible for a qubit) are not just correlated but mathematically equivalent.",
    whyWrong: ["Saying Tr(ρ_A²) is merely 'close to 0.5' misunderstands that the identity is an exact equation, not an approximation."],
  },
};
