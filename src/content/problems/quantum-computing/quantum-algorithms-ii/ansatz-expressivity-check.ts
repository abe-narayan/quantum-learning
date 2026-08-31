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
      { id: "a", text: "θ and φ sweep out every point on the Bloch sphere, and every pure qubit state is such a point" },
      { id: "b", text: "Ry and Rz commute, so the order they are applied in cannot restrict what the ansatz reaches" },
      { id: "c", text: "Every single-qubit Hamiltonian shares the same ground state, so one fixed target suffices" },
      { id: "d", text: "The ansatz is only approximately expressive, and the residual error is simply tolerated" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Ry and Rz do not commute in general, so the order (Ry then Rz) still determines which state a given (θ, φ) produces.",
      c: "Different Hamiltonians generally have different ground states. The ansatz's job is to reach whichever one is needed.",
      d: "The expressivity here is exact, not approximate: θ and φ are the Bloch sphere's own polar and azimuthal angles.",
    },
    defaultIncorrectFeedback: "Recall that any pure single-qubit state corresponds to exactly one point on the Bloch sphere, parameterized by two angles.",
  },
  hints: [
    { text: "Every pure single-qubit state is a specific point on the Bloch sphere." },
    { text: "Specifying a point on a sphere takes two angles, polar and azimuthal." },
    { text: "Count the free angles in Rz(φ)Ry(θ) and compare that count with the two the sphere needs." },
  ],
  solution: {
    steps: [{ description: "θ,φ parameterize the Bloch sphere directly, and every pure single-qubit state is some point on it, so the ansatz can reach any of them." }],
    finalAnswer: "θ and φ parameterize the whole Bloch sphere, and every pure single-qubit state is a point on it.",
  },
  explanation: {
    correctIdea: "Expressivity of an ansatz asks whether it can reach the state you need. For one qubit, two real parameters are enough.",
    whyCorrect: "This is why the lesson's VQE tests can guarantee convergence to the true E₀, not merely an approximation.",
    whyWrong: [
      { optionId: "b", text: "Ry and Rz do not commute in general, so the order still matters for which state a given (θ, φ) produces." },
      { optionId: "c", text: "Different Hamiltonians generally have different ground states. The ansatz's job is to reach whichever one is needed." },
      { optionId: "d", text: "The expressivity here is exact, not approximate: θ and φ are the Bloch sphere's own polar and azimuthal angles." },
    ],
  },
};
