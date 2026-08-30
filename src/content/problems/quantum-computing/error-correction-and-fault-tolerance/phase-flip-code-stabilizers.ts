import type { ConceptualProblem } from "@/lib/problems/types";

export const phaseFlipCodeStabilizers: ConceptualProblem = {
  meta: {
    slug: "phase-flip-code-stabilizers",
    title: "The Phase-Flip Code's Stabilizer Generators",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["stabilizer-formalism", "phase-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the HZH=X conjugation, state the phase-flip code's stabilizer generators (in terms of X instead of Z), starting from the bit-flip code's Z₀Z₁, Z₁Z₂.",
    placeholder: "Apply the H-conjugation to each stabilizer generator...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Subscript forms ("x₀x₁") are deliberately absent: normalization strips
      // them to the two-token phrase "x x", which the *other* generator's
      // subscript form collapses to as well, so either one would satisfy both
      // groups. The ASCII and Pauli-string forms below stay distinct, so a
      // one-generator answer scores partial and only a two-generator answer is
      // correct.
      {
        phrases: ["x0x1", "x_0x_1", "x_0 x_1", "x0 x1", "x⊗x⊗i", "xxi"],
        missingFeedback:
          "Conjugate the generators one at a time. Write out the first one after the H's have been applied to every qubit.",
      },
      {
        phrases: ["x1x2", "x_1x_2", "x_1 x_2", "x1 x2", "i⊗x⊗x", "ixx"],
        missingFeedback:
          "You have the first generator. Do the same to the other one and write it out, on the same three qubits.",
      },
    ],
    incorrectFeedback: "Conjugating Z₀Z₁ by H on every qubit replaces each Z with HZH. What does HZH equal?",
    partialFeedback: "One generator down. Give the second one as well, and write both in the same notation so it is clear which qubits each acts on.",
    modelAnswers: [
      "Conjugating Z0Z1 by H on every qubit turns each Z into an X, so the first generator becomes X0X1, and Z1Z2 becomes X1X2. As Pauli strings that is XXI and IXX.",
      "HZH = X, so applying H to each qubit maps Z0Z1 to X0X1 and Z1Z2 to X1X2. The stabilizer generators are XXI and IXX.",
    ],
  },
  hints: [
    { text: "HZH = X (derived in an earlier practice question)." },
    { text: "Conjugating a product Z₀Z₁ by H on every qubit conjugates each factor separately. Apply the rule from the first hint to each factor." },
    { text: "Do the same for the second generator." },
  ],
  solution: {
    steps: [
      { description: "Z₀Z₁ conjugated by H^⊗3 becomes X₀X₁ (each Z replaced by HZH=X)." },
      { description: "Z₁Z₂ similarly becomes X₁X₂." },
    ],
    finalAnswer: "The phase-flip code's stabilizer generators are X0X1 and X1X2, that is, the Pauli strings XXI and IXX.",
  },
  explanation: {
    correctIdea: "This is exactly the same conjugation argument the phase-flip code's entire construction relies on, applied specifically to the stabilizer generators.",
    whyCorrect: "Consistent with the phase-flip code correcting Z errors: X-type stabilizers are exactly what detects Z errors, by the same anticommutation logic as the bit-flip code.",
    whyWrong: ["Keeping the stabilizers as Z₀Z₁, Z₁Z₂ unchanged ignores that the entire code, including its stabilizers, is conjugated by H."],
  },
};
