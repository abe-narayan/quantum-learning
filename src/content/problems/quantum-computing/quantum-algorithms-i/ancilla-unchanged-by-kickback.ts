import type { ConceptualProblem } from "@/lib/problems/types";

export const ancillaUnchangedByKickback: ConceptualProblem = {
  meta: {
    slug: "ancilla-unchanged-by-kickback",
    title: "Why the Ancilla Stays in |−⟩ Throughout Phase Kickback",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/phase-kickback",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["phase-kickback"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/phase-kickback"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why the ancilla qubit's own state is exactly |−⟩ both before and after U_f is applied, using the eigenstate structure of the derivation.",
    placeholder: "Think about what X does to |−⟩...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["eigenstate", "eigenvalue", "-1 eigenstate"],
      [
        "unchanged",
        "same state",
        "only phase",
        "only a phase",
        "just a phase",
        "up to a phase",
        "phase factor",
        "not the ancilla",
        "leaves it",
        "leaves the ancilla",
        "left alone",
        "never changes",
        "doesn't change",
        "does not change",
        "remains",
        "still |-",
        "stays in",
        "multiplied by",
        "scalar multiple",
      ],
    ],
    incorrectFeedback: "Recall that |−⟩ is an eigenstate of X specifically — what does an operator do to its own eigenstate?",
    partialFeedback: "Good — now connect this directly to why applying an operator to its eigenstate never changes the state itself.",
  },
  hints: [
    { text: "|−⟩ is the −1 eigenstate of the X gate: X|−⟩=−|−⟩." },
    { text: "U_f conditionally applies X to the ancilla depending on f(x)." },
    { text: "Applying an operator to one of its own eigenstates only ever multiplies by the eigenvalue, never changes the state." },
  ],
  solution: {
    steps: [
      { description: "|−⟩ is X's −1 eigenstate: X|−⟩=−|−⟩." },
      { description: "U_f conditionally applies X to the ancilla; since |−⟩ is an eigenstate, this can only multiply by a phase, never change the state itself." },
      { description: "The phase (−1)^f(x) that would appear on the ancilla is therefore mathematically identical to a phase on the whole joint state — attributable to |x⟩ instead." },
    ],
    finalAnswer: "|−⟩ is an eigenstate of the operation U_f conditionally performs, so it can only pick up a phase, never actually change — that phase surfaces on |x⟩ instead.",
  },
  explanation: {
    correctIdea: "Eigenstates are exactly the states an operator can act on without changing them (only rescaling by the eigenvalue).",
    whyCorrect: "This is the precise reason phase kickback works for |−⟩ specifically and not an arbitrary ancilla state.",
    whyWrong: ["Saying 'the ancilla is just ignored' skips the actual mechanism — it's not ignored, it's structurally incapable of changing because it's an eigenstate."],
  },
};
