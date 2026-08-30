import type { ConceptualProblem } from "@/lib/problems/types";

export const crosstalkVsT1T2Distinction: ConceptualProblem = {
  meta: {
    slug: "crosstalk-vs-t1t2-distinction",
    title: "Crosstalk vs. T1/T2: A Structural Difference",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["crosstalk", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/crosstalk"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why crosstalk is structurally different from T1/T2 decoherence, specifically in terms of how many qubits each error type fundamentally involves.",
    placeholder: "T1/T2 are properties of... while crosstalk fundamentally requires...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["single qubit", "one qubit", "own environment"],
        missingFeedback:
          "Start with T1 and T2. Say how many qubits you need in order to define and measure them at all.",
      },
      {
        phrases: ["multi-qubit", "two qubits", "neighboring", "spectator"],
        missingFeedback:
          "You have T1 and T2 pinned down. Now say what crosstalk needs before it can even be defined, and name the second party involved.",
      },
    ],
    incorrectFeedback: "Address both error types explicitly: what T1/T2 are properties of, and what crosstalk fundamentally requires that T1/T2 does not.",
    partialFeedback: "Good. Now make the structural point explicit: one of the two is still defined and measurable on a chip with nothing else on it, and the other has no meaning there at all.",
    modelAnswers: [
      "T1 and T2 are properties of one qubit and its own environment; you can measure them on a single qubit sitting completely alone. Crosstalk cannot even be defined that way: it needs at least two qubits, a target and a spectator, so the difference is structural.",
      "Decoherence is a one qubit phenomenon. Crosstalk is fundamentally multi-qubit, involving a neighboring qubit that gets disturbed when you drive another one.",
    ],
  },
  hints: [
    { text: "T1/T2 describe how a qubit couples to its surroundings, and they stay defined even when nothing else sits on the chip." },
    { text: "Crosstalk needs a driven qubit and at least one bystander for the drive to leak into." },
    { text: "Ask whether the difference is one of size (how big the numbers come out) or one of kind (whether the quantity exists at all)." },
  ],
  solution: {
    steps: [
      { description: "T1 and T2 are properties of a single qubit's coupling to its own environment, well-defined and measurable even for one isolated qubit with no other qubits nearby." },
      { description: "Crosstalk requires at least two qubits: a target qubit being intentionally driven, and a spectator qubit unintentionally disturbed." },
      { description: "A hypothetical single-qubit device would still have meaningful T1/T2 values, but the concept of crosstalk would not apply to it at all. That is the structural difference." },
    ],
    finalAnswer: "T1/T2 are single-qubit properties, measurable even in isolation; crosstalk requires at least two qubits, a target and a spectator. The difference is structural, not just quantitative.",
  },
  explanation: {
    correctIdea: "This makes precise the lesson's opening claim ('crosstalk is different in kind') using a concrete, checkable criterion (how many qubits are fundamentally needed to even define the effect).",
    whyCorrect: "T1 and T2 are defined by a qubit's coupling to its surroundings, which needs no second qubit. Crosstalk is defined by one qubit's drive reaching another, which cannot even be stated for a lone qubit. The difference is in what each quantity is a property of, not in how large it is.",
    whyWrong: ["Describing crosstalk as 'just a stronger form of decoherence' misses that it isn't reducible to any single-qubit environmental coupling at all."],
  },
};
