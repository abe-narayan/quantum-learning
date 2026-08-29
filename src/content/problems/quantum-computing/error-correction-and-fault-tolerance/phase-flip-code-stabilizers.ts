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
      ["x0x1", "x₀x₁", "x_0x_1", "x_0 x_1", "x0 x1", "x⊗x⊗i", "xxi"],
      ["x1x2", "x₁x₂", "x_1x_2", "x_1 x_2", "x1 x2", "i⊗x⊗x", "ixx"],
    ],
    incorrectFeedback: "Conjugating Z₀Z₁ by H on every qubit replaces each Z with HZH. What does HZH equal?",
    partialFeedback: "Good. Now give the second stabilizer generator as well.",
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
    finalAnswer: "The phase-flip code's stabilizers are X₀X₁ and X₁X₂.",
  },
  explanation: {
    correctIdea: "This is exactly the same conjugation argument the phase-flip code's entire construction relies on, applied specifically to the stabilizer generators.",
    whyCorrect: "Consistent with the phase-flip code correcting Z errors: X-type stabilizers are exactly what detects Z errors, by the same anticommutation logic as the bit-flip code.",
    whyWrong: ["Keeping the stabilizers as Z₀Z₁, Z₁Z₂ unchanged ignores that the entire code, including its stabilizers, is conjugated by H."],
  },
};
