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
      "Without doing any matrix multiplication, explain why applying T eight times in a row to |1⟩ returns the qubit to exactly |1⟩: not merely the same Bloch point, but the same amplitude, with no leftover phase.",
    placeholder: "Think about T's rotation angle and how many times it's applied.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Bare "π/4" strips to the token "4" and bare "8" to the token "8", so
      // each group used to match any answer that merely contained that digit.
      // Every phrase below keeps at least one word alongside the number.
      {
        phrases: ["pi/4", "pi / 4", "pi over 4", "π/4 about", "π/4 rotation", "rotates by π/4", "eighth turn", "one eighth", "an eighth", "45 degree"],
        missingFeedback:
          "Start with a single T. Say what geometric operation it is and by how much it turns the state.",
      },
      {
        phrases: ["8 times", "8 applications", "8 × π/4", "8 x π/4", "eight times", "eight applications", "full 2π", "2π rotation", "total of 2π", "full rotation", "full turn", "complete turn", "complete revolution", "full circle"],
        missingFeedback:
          "You have one T's angle. Now multiply up: say what eight of them come to in total, and what that total means geometrically.",
      },
    ],
    incorrectFeedback: "You argued from the Bloch picture alone, which settles the point but not the leftover factor. Start from the angle T turns the state through about the z-axis, then multiply by the number of applications and compare with one complete circuit.",
    partialFeedback: "Now connect the accumulated angle to one whole circuit of the z-axis, and say what that leaves of the state's overall factor.",
    modelAnswers: [
      "T is a rotation by pi/4 about the z-axis, an eighth of a turn. Eight applications give 8 x pi/4 = 2pi, a full rotation, so the qubit comes back to exactly where it started with no phase left over.",
      "Each T is a 45 degree rotation about z. Eight times that is a complete revolution, so T applied eight times is a full 2pi turn and returns the amplitude exactly.",
    ],
  },
  hints: [
    { text: "Look up the angle T turns the Bloch vector through, and about which axis." },
    { text: "Multiply that angle by the number of times T is applied here." },
    { text: "Compare the total against one whole circuit of the axis, and then check what happens to the state's overall factor over that circuit." },
  ],
  solution: {
    steps: [
      { description: "T leaves the $|0\\rangle$ coefficient alone and multiplies the $|1\\rangle$ coefficient by $e^{i\\pi/4}$, which is what the lesson calls an eighth of a turn about the $z$-axis." },
      { description: "Acting on $|1\\rangle$, then, each T contributes one factor of $e^{i\\pi/4}$ and nothing else. Eight applications multiply the amplitude by $e^{i8\\pi/4}=e^{i2\\pi}$, one full turn's worth of phase." },
      { description: "$e^{i2\\pi}=1$ on the nose, so the amplitude is the number it started as. That is stronger than landing on the same Bloch point, which any accumulated phase would also do." },
    ],
    finalAnswer:
      "Each T multiplies the |1⟩ amplitude by e^{iπ/4}, an eighth of a turn, so eight applications multiply it by e^{i2π}, a full turn's worth of phase. e^{i2π} is exactly 1, so the amplitude comes back unchanged rather than merely landing on the same Bloch point.",
  },
  explanation: {
    correctIdea: "T's phase angle (π/4) divides evenly into a full turn (2π) exactly 8 times, so the phases accumulated by eight applications multiply out to e^{i2π}, which is 1.",
    whyCorrect: "This matches the earlier fact that S² = Z and S⁴ = I: S's angle (π/2) needs only 4 applications to accumulate a full turn, while T's smaller angle (π/4) needs twice as many.",
    whyWrong: [
      "Assuming T never returns to the start on the grounds that it is not self-inverse the way X, Y, Z and H are. Not being self-inverse means it takes more than two applications, not that it never returns.",
      "Confusing T's angle with S's. T needs 8 applications where S needs 4, because T's angle is half of S's.",
      "Arguing only that a complete revolution brings every Bloch point home. That settles the point on the sphere and says nothing about the factor in front, which is the whole of what this question asks. The factor has to be tracked on its own, and here it multiplies out to exactly 1.",
    ],
  },
};
