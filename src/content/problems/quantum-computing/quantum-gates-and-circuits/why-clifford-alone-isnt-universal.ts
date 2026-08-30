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
      {
        phrases: ["classically simulated", "classically simulable", "polynomial time", "efficiently simulated", "classical computer"],
        missingFeedback:
          "State what Gottesman-Knill actually says about a circuit built only from these gates, and at what cost such a circuit can be reproduced elsewhere.",
      },
      {
        phrases: ["quantum advantage", "more powerful", "believed not", "not efficiently simulable", "exponential"],
        missingFeedback:
          "You have the theorem. Now say why that is fatal for universality: what must a universal set be able to reach that this property rules out?",
      },
    ],
    incorrectFeedback:
      "You said the set is 'missing the T gate', which is the fix rather than the reason. Two halves are wanted: what Gottesman-Knill establishes about the cost of running any Clifford circuit on a laptop, and why a set with that property cannot also reach everything.",
    partialFeedback:
      "Now connect that fact to universality: what must a universal set be able to build, and what would follow about those circuits if they were all reachable from this one?",
    modelAnswers: [
      "Gottesman-Knill says any Clifford circuit can be simulated on a classical computer in polynomial time. A universal gate set has to be able to build circuits that are believed not to be classically simulable, so a set that is always classically easy cannot be universal.",
      "If H, S and CNOT were universal you could reach every quantum computation, including the ones thought to give a real quantum advantage. But Gottesman-Knill makes them all efficiently simulated classically, so they cannot reach anything more powerful than a classical machine.",
    ],
  },
  hints: [
    { text: "State what Gottesman-Knill promises about any circuit built only from H, S and CNOT." },
    { text: "A universal set has to reach every circuit there is. Name one circuit whose cost nobody expects a laptop to bear." },
    { text: "Put the two together. If that circuit were reachable from H, S and CNOT alone, what would the theorem then say about it, and what would that do to the whole case for quantum computing?" },
  ],
  solution: {
    steps: [
      { description: "Gottesman-Knill: any circuit built entirely from Clifford gates (state prep in the computational basis, Clifford gates like H, S, CNOT, and Pauli measurements) can be simulated by a classical computer in polynomial time." },
      { description: "A universal gate set must by definition reach every unitary circuit, including circuits such as Shor's algorithm that are believed to require exponential classical resources to simulate." },
      { description: "If {H, S, CNOT} were secretly universal, every circuit built from it (i.e. every circuit, since it's universal) would be a Clifford circuit, and Gottesman-Knill would make all of them classically efficient, erasing the basis for believing quantum computers are more powerful than classical ones. Since some circuits are believed not to be classically efficient, {H, S, CNOT} cannot be universal." },
    ],
    finalAnswer:
      "Gottesman-Knill makes every Clifford circuit classically simulable in polynomial time; a universal set must reach circuits believed NOT to be classically simulable, so a gate set that's always classically easy (Clifford alone) cannot be universal.",
  },
  explanation: {
    correctIdea:
      "Universality and 'always classically simulable' are mutually exclusive properties for the same gate set. Gottesman-Knill proves Clifford has the second, so it cannot have the first.",
    whyCorrect:
      "This is exactly the lesson's own reasoning: Clifford circuits are always classically efficient (Gottesman-Knill), so a set that's only Clifford gates can never reach the circuits (like Shor's) believed to give quantum computers an advantage.",
    whyWrong: [
      "Pointing only to {H, S, CNOT} being discrete or entangling does not explain the failure. {H, T, CNOT} is also discrete and entangling and is universal, because T breaks the Clifford property.",
    ],
  },
};
