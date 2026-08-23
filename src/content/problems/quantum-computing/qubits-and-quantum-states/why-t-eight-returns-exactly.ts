import type { ConceptualProblem } from "@/lib/problems/types";

export const whyTEightReturnsExactly: ConceptualProblem = {
  meta: {
    slug: "why-t-eight-returns-exactly",
    title: "Why T⁸ Returns a Qubit Exactly",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-gates",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["gates", "t-gate", "phase"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-gates"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Without doing any matrix multiplication, explain why applying T eight times in a row to |1⟩ returns the qubit to exactly |1⟩ — not just the same Bloch point, but the exact same amplitude, with no leftover phase at all.",
    placeholder: "Think about T's rotation angle and how many times it's applied.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["π/4", "pi/4", "eighth turn", "one eighth"],
      ["8", "eight times", "full 2π", "full rotation", "2π rotation", "complete turn"],
    ],
    incorrectFeedback: "Start from T's rotation angle about the z-axis, then think about what happens after applying it eight times.",
    partialFeedback: "You have part of the picture — now connect the total rotation angle after 8 applications to a full turn.",
  },
  hints: [
    { text: "T rotates the Bloch vector by π/4 about the z-axis." },
    { text: "Applying it 8 times in a row rotates by 8 × π/4 total." },
    { text: "8 × π/4 = 2π — a complete revolution about the z-axis." },
  ],
  solution: {
    steps: [
      { description: "T is a rotation by $\\pi/4$ about the $z$-axis." },
      { description: "Applying T eight times rotates by a total angle of $8\\times\\pi/4=2\\pi$." },
      { description: "A $2\\pi$ rotation about any axis is a complete revolution, returning every point to its exact starting position with no net rotation left over." },
    ],
    finalAnswer: "T applied eight times rotates by a full 2π about the z-axis, a complete revolution, so the qubit returns to exactly its starting state.",
  },
  explanation: {
    correctIdea: "T's rotation angle (π/4) divides evenly into a full turn (2π) exactly 8 times, so T⁸ is a complete revolution.",
    whyCorrect: "This matches the earlier fact that S² = Z and S⁴ = I: S's angle (π/2) needs only 4 applications for a full turn, while T's smaller angle (π/4) needs twice as many.",
    whyWrong: [
      "Assuming T never returns to the start since it's 'not its own inverse' like X, Y, Z, H — not being self-inverse just means it takes more than 2 applications, not that it never returns.",
      "Confusing T's rotation angle with S's — T needs 8 applications for a full turn specifically because its angle is half of S's.",
    ],
  },
};
