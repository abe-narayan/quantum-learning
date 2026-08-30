import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const pennylaneVqeFit: MultipleChoiceProblem = {
  meta: {
    slug: "pennylane-vqe-fit",
    title: "Why PennyLane Fits VQE Well",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["sdks"],
    prerequisites: ["quantum-software/programming-quantum-computers/quantum-sdks-overview"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does this lesson highlight PennyLane specifically for VQE-style algorithms?",
    options: [
      { id: "a", text: "It is built around differentiable programming, so circuit gradients come out of its evaluation machinery" },
      { id: "b", text: "It is the only SDK whose circuit gradients are exact rather than finite-difference approximations" },
      { id: "c", text: "It runs the whole optimization loop on the device, avoiding a round trip after every parameter update" },
      { id: "d", text: "It ships the chemistry Hamiltonians a VQE run needs, which the other SDKs leave to the user to assemble" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The parameter-shift rule gives analytic circuit gradients, and it is available in every major SDK. What differs is how much of it you write yourself, not whether the gradients are exact.",
      c: "The optimizer runs classically, off the device, in every SDK including this one. Each parameter update still costs a round trip.",
      d: "Chemistry Hamiltonian tooling exists in several SDKs, Qiskit Nature among them. It is not the design property the lesson points at.",
    },
    defaultIncorrectFeedback: "The lesson's claim is about how easily gradients come out of the framework's design, not about a capability the other SDKs lack.",
  },
  hints: [
    { text: "VQE's classical optimizer needs the gradient of the circuit's output with respect to its parameters." },
    { text: "Ask which design property makes that derivative fall out of the framework rather than being assembled by hand." },
    { text: "The lesson frames this as a difference in how much the framework does for you, not in what is possible." },
  ],
  solution: {
    steps: [{ description: "VQE's inner loop needs gradients with respect to circuit parameters. PennyLane treats a circuit as a differentiable function, so the gradient comes from the same machinery that evaluates it, and it composes with the surrounding autodiff framework. The other SDKs reach the same results with more assembly by hand." }],
    finalAnswer: "Its differentiable-programming design makes circuit gradients fall out of the same machinery that evaluates the circuit.",
  },
  explanation: {
    correctIdea: "The lesson's claim is about ergonomics: the same VQE is expressible in any of these SDKs, and PennyLane's design happens to put the gradient step where the algorithm wants it.",
    whyCorrect: "VQE's inner loop is an optimisation, and optimisation wants gradients. Treating the circuit as a differentiable object lets the gradient compose with the surrounding autodiff framework instead of being assembled by hand. That is a workflow claim, not a claim about what the other SDKs can compute.",
    whyWrong: [
      { optionId: "b", text: "Turns an ergonomics claim into an exclusivity claim. The parameter-shift rule is available everywhere." },
      { optionId: "c", text: "Moves the optimizer onto the device. It stays classical, and the round trip stays." },
      { optionId: "d", text: "Points at library content rather than framework design, and other SDKs ship comparable chemistry tooling." },
    ],
  },
};
