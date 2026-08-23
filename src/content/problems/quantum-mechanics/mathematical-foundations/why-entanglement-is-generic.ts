import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whyEntanglementIsGeneric: MultipleChoiceProblem = {
  meta: {
    slug: "why-entanglement-is-generic",
    title: "Why Not Every Tensor-Product-Space Vector Factors",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["tensor-products", "entanglement"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Which best explains why not every vector in a tensor product space $V\\otimes W$ can be written as a simple product $|v\\rangle\\otimes|w\\rangle$?",
    options: [
      { id: "a", text: "$V\\otimes W$ generally has more dimensions than there are free parameters in a single simple product" },
      { id: "b", text: "Tensor products are only defined for equal-dimensional spaces" },
      { id: "c", text: "Vectors in $V\\otimes W$ must always be normalized" },
      { id: "d", text: "$V\\otimes W$ is not actually a vector space" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The tensor product is defined for spaces of any dimensions, not just equal ones — see the worked example with a 2-dimensional and a 3-dimensional space.",
      c: "Normalization is a separate condition (relevant to physical states) and has nothing to do with whether a vector factors as a simple product.",
      d: "V⊗W is a genuine vector space — it has a basis, supports linear combinations, and everything else from the Vector Spaces lesson.",
    },
    defaultIncorrectFeedback: "Think about counting free parameters: how many are needed to specify a simple product, versus a general vector in V⊗W?",
  },
  hints: [
    { text: "A simple product |v⟩⊗|w⟩ is specified by roughly dim(V)+dim(W)-1 free parameters." },
    { text: "V⊗W itself has dimension dim(V)·dim(W) — compare the two counts for dim≥2 spaces." },
  ],
  solution: {
    steps: [
      { description: "A simple tensor is determined by a direction in V and a direction in W, plus an overall scale — roughly dim(V)+dim(W)-1 parameters." },
      { description: "V⊗W has dimension dim(V)·dim(W), which grows much faster than dim(V)+dim(W)-1 once both dimensions are at least 2." },
    ],
    finalAnswer: "Simple products form only a small slice of $V\\otimes W$ — most vectors there don't factor, which is exactly what entanglement is.",
  },
  explanation: {
    correctIdea: "Entanglement is a dimension-counting inevitability, not a special quirk of particular states.",
    whyCorrect: "For two qubits, nm=4 against n+m-1=3 — already a gap, which widens fast for larger systems.",
    whyWrong: ["The tensor product's definition doesn't restrict to equal dimensions or impose normalization — those aren't the reason simple products are a minority."],
  },
};
