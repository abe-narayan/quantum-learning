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
      { id: "a", text: "$V\\otimes W$ has more dimensions than a simple product has free parameters" },
      { id: "b", text: "Tensor products are only defined when $V$ and $W$ have equal dimension" },
      { id: "c", text: "Vectors in $V\\otimes W$ must be normalized, and products rarely are" },
      { id: "d", text: "$V\\otimes W$ is not actually a vector space, so it has no basis" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The tensor product is defined for spaces of any dimensions, not just equal ones. See the worked example with a 2-dimensional and a 3-dimensional space.",
      c: "Normalization is a separate condition (relevant to physical states) and has nothing to do with whether a vector factors as a simple product.",
      d: "V⊗W is a vector space: it has a basis, supports linear combinations, and everything else from the Vector Spaces lesson.",
    },
    defaultIncorrectFeedback: "Think about counting free parameters: how many are needed to specify a simple product, versus a general vector in V⊗W?",
  },
  hints: [
    { text: "Try counting. How many numbers do you need to pin down a general vector in V⊗W?" },
    { text: "Now count how many you need to pin down a simple product: a direction in V, a direction in W, and one overall scale." },
    { text: "Compare dim(V)·dim(W) against dim(V)+dim(W)−1 once both spaces have dimension at least 2." },
  ],
  solution: {
    steps: [
      { description: "A simple tensor is determined by a direction in V and a direction in W, plus an overall scale, which is roughly dim(V)+dim(W)-1 parameters." },
      { description: "V⊗W has dimension dim(V)·dim(W), which grows much faster than dim(V)+dim(W)-1 once both dimensions are at least 2." },
    ],
    finalAnswer: "Simple products form only a small slice of $V\\otimes W$: most vectors there do not factor, and that is what entanglement is.",
  },
  explanation: {
    correctIdea: "Entanglement is a dimension-counting inevitability, not a special quirk of particular states.",
    whyCorrect: "For two qubits, nm=4 against n+m-1=3 is already a gap, and it widens fast for larger systems.",
    whyWrong: [
      { optionId: "b", text: "Adds a restriction the definition does not have. The lesson's worked example tensors a 2-dimensional space with a 3-dimensional one." },
      { optionId: "c", text: "Brings in a physical condition on states. Normalization is orthogonal to whether a vector factors; scaling a simple product leaves it simple." },
      { optionId: "d", text: "Denies the structure the question is about. V⊗W has a basis and supports linear combinations like any other vector space." },
    ],
  },
};
