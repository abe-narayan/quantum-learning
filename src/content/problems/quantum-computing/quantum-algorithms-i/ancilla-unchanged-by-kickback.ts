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
      {
        phrases: ["eigenstate", "eigenvalue", "-1 eigenstate"],
        missingFeedback:
          "You have said the ancilla comes through unaltered. Now say why: name the relationship between |-> and the operation that gets conditionally applied to it.",
      },
      {
        phrases: ["unchanged", "same state", "only phase", "only a phase", "just a phase", "up to a phase", "phase factor", "not the ancilla", "leaves it", "leaves the ancilla", "left alone", "never changes", "doesn't change", "does not change", "remains", "still |-", "stays in", "multiplied by", "scalar multiple"],
        missingFeedback:
          "You have named the relationship. Now say what that lets the operation do to the ancilla and, crucially, what it does not let it do.",
      },
    ],
    incorrectFeedback: "You said the ancilla 'is not measured', which is true and irrelevant: leaving something unmeasured does not stop the state evolving. Ask instead what X does to |−⟩ specifically, and what that leaves U_f able to do to the second register.",
    partialFeedback: "You have the special relationship between |−⟩ and X. Now say what applying an operator to a state in that relationship can and cannot do to it.",
    modelAnswers: [
      "|-> is an eigenstate of X, which is what U_f conditionally applies, so the most it can do is multiply the ancilla by its eigenvalue. That is only a phase, so the ancilla's state is unchanged and the minus sign shows up on |x> instead.",
      "The ancilla sits in an eigenstate of the operation, so it just picks up a phase factor and stays in |->. It never changes which state it is; the phase gets attached to the other register.",
    ],
  },
  hints: [
    { text: "X and |−⟩ have a special relationship. Write down X|−⟩ and see what comes out." },
    { text: "U_f applies X to the second register conditionally on f(x). So on every branch, the second register meets either X or nothing at all." },
    { text: "Whichever branch you look at, the second register comes back proportional to what it was. Say what the constant of proportionality is in each case, and what that means for the register itself." },
  ],
  solution: {
    steps: [
      { description: "|−⟩ is X's −1 eigenstate: X|−⟩=−|−⟩." },
      { description: "U_f conditionally applies X to the ancilla; since |−⟩ is an eigenstate, this can only multiply by a phase, never change the state itself." },
      { description: "The phase (−1)^f(x) that would appear on the ancilla is therefore identical to a phase on the whole joint state, which can be attributed to |x⟩ instead." },
    ],
    finalAnswer: "|−⟩ is an eigenstate of the operation U_f conditionally performs, so it can only pick up a phase, never change which state it is. That phase surfaces on |x⟩ instead.",
  },
  explanation: {
    correctIdea: "Eigenstates are exactly the states an operator can act on without changing them (only rescaling by the eigenvalue).",
    whyCorrect: "This is the precise reason phase kickback works for |−⟩ specifically and not an arbitrary ancilla state.",
    whyWrong: ["Saying 'the ancilla is just ignored' skips the mechanism. It is not ignored; being an eigenstate, it cannot change."],
  },
};
