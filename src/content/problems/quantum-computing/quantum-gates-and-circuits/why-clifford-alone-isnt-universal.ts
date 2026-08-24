import type { ConceptualProblem } from "@/lib/problems/types";

export const whyCliffordAloneIsntUniversal: ConceptualProblem = {
  meta: {
    slug: "why-clifford-alone-isnt-universal",
    title: "Why {H, S, CNOT} Can't Be Universal",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["universal-quantum-computation", "clifford-group", "gottesman-knill"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "{H, S, CNOT} is discrete and includes a genuinely entangling gate, yet it is NOT a universal gate set. Explain why, using the Gottesman-Knill theorem.",
    placeholder: "Gottesman-Knill says Clifford circuits can be simulated classically because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["classically simulated", "classically simulable", "polynomial time", "efficiently simulated", "classical computer"],
      ["quantum advantage", "more powerful", "believed not", "not efficiently simulable", "exponential"],
    ],
    incorrectFeedback:
      "Address both halves: what Gottesman-Knill says every Clifford circuit's classical cost is, and why a gate set with that property can't also be universal.",
    partialFeedback:
      "You have part of it — now connect the classical-simulability fact to why it rules out universality (a universal set must reach circuits believed NOT to be classically simulable).",
  },
  hints: [
    { text: "Gottesman-Knill says any circuit built entirely from Clifford gates (H, S, CNOT among them) can be simulated by a classical computer in polynomial time." },
    { text: "A universal gate set has to be able to reach every circuit, including ones like Shor's algorithm that are believed to need exponential classical resources." },
    { text: "If {H, S, CNOT} were universal, every quantum circuit would reduce to a Clifford circuit, and Gottesman-Knill would make everything classically easy — collapsing the whole basis for believing quantum computers are more powerful." },
  ],
  solution: {
    steps: [
      { description: "Gottesman-Knill: any circuit built entirely from Clifford gates (state prep in the computational basis, Clifford gates like H, S, CNOT, and Pauli measurements) can be simulated by a classical computer in polynomial time." },
      { description: "A universal gate set must, by definition, be able to reach every unitary circuit — including circuits (like Shor's algorithm) that are believed to require exponential classical resources to simulate." },
      { description: "If {H, S, CNOT} were secretly universal, every circuit built from it (i.e. every circuit, since it's universal) would be a Clifford circuit, and Gottesman-Knill would make ALL of them classically efficient — erasing the basis for believing quantum computers are more powerful than classical ones. Since some circuits are believed not to be classically efficient, {H, S, CNOT} cannot be universal." },
    ],
    finalAnswer:
      "Gottesman-Knill makes every Clifford circuit classically simulable in polynomial time; a universal set must reach circuits believed NOT to be classically simulable, so a gate set that's always classically easy (Clifford alone) cannot be universal.",
  },
  explanation: {
    correctIdea:
      "Universality and 'always classically simulable' are mutually exclusive properties for the same gate set — Gottesman-Knill proves Clifford has the second property, so it cannot have the first.",
    whyCorrect:
      "This is exactly the lesson's own reasoning: Clifford circuits are always classically efficient (Gottesman-Knill), so a set that's only Clifford gates can never reach the circuits (like Shor's) believed to give quantum computers an advantage.",
    whyWrong: [
      "Pointing only to {H, S, CNOT} being discrete or entangling doesn't explain the failure — {H, T, CNOT} is also discrete and entangling, but IS universal, because T specifically breaks the Clifford property.",
    ],
  },
};
