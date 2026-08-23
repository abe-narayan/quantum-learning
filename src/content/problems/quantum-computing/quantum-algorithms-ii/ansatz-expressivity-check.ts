import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const ansatzExpressivityCheck: MultipleChoiceProblem = {
  meta: {
    slug: "ansatz-expressivity-check",
    title: "Why Rz(φ)Ry(θ)|0⟩ Reaches Every Point on the Bloch Sphere",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["vqe", "ansatz"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does this platform's single-qubit ansatz Rz(φ)Ry(θ)|0⟩ suffice to reach the exact ground state of any single-qubit Hamiltonian?",
    options: [
      { id: "a", text: "θ and φ together parameterize every point on the Bloch sphere, and every pure single-qubit state is some point on it" },
      { id: "b", text: "Ry and Rz happen to commute, so their order doesn't matter" },
      { id: "c", text: "Every single-qubit Hamiltonian has the same ground state" },
      { id: "d", text: "The ansatz is only approximately expressive, not exactly" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Ry and Rz do not commute in general — the specific order (Ry then Rz) still matters for which state is produced at given parameter values.",
      c: "Different Hamiltonians generally have different ground states — the ansatz's job is to be able to reach whichever one is needed.",
      d: "It's exactly expressive for single-qubit states — θ,φ are literally the Bloch sphere's own polar and azimuthal angles.",
    },
    defaultIncorrectFeedback: "Recall that any pure single-qubit state corresponds to exactly one point on the Bloch sphere, parameterized by two angles.",
  },
  hints: [
    { text: "Every pure single-qubit state is a specific point on the Bloch sphere." },
    { text: "Points on a sphere need exactly two angles (polar, azimuthal) to specify." },
    { text: "θ and φ play exactly this role for the ansatz." },
  ],
  solution: {
    steps: [{ description: "θ,φ parameterize the Bloch sphere directly, and every pure single-qubit state is some point on it — so the ansatz can reach any of them." }],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "Expressivity of an ansatz means 'can it reach the state you need' — for one qubit, two real parameters are exactly enough.",
    whyCorrect: "This is exactly why the lesson's VQE tests can guarantee convergence to the true E₀, not merely an approximation.",
    whyWrong: ["Options b, c, and d each misstate either the actual gate algebra or the actual claim being made about expressivity."],
  },
};
