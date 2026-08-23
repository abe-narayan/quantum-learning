import type { ConceptualProblem } from "@/lib/problems/types";

export const whyDifferentFactorObservablesCommute: ConceptualProblem = {
  meta: {
    slug: "why-different-factor-observables-commute",
    title: "Why X_0 and Z_1 Commute",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["csco", "tensor-products", "commutators"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why X_0 = X (x) I and Z_1 = I (x) Z commute, even though X and Z individually (acting on the same qubit) do not.",
    placeholder: "Explain why operators on different qubits commute...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["different qubits", "different tensor factors", "independent subsystems"],
      ["(AC)⊗(BD)", "act independently", "order doesn't matter across factors"],
    ],
    incorrectFeedback: "Name both pieces: that X_0 and Z_1 act on different qubits (different tensor factors), and that the tensor-product multiplication rule (AC)⊗(BD) makes operators on independent factors commute regardless of what they individually do.",
  },
  hints: [{ text: "Use the tensor product rule (A⊗B)(C⊗D) = (AC)⊗(BD) to multiply X_0 and Z_1 in both orders." }],
  solution: {
    steps: [
      { description: "$X_0Z_1 = (X\\otimes I)(I\\otimes Z) = (XI)\\otimes(IZ) = X\\otimes Z$." },
      { description: "$Z_1X_0 = (I\\otimes Z)(X\\otimes I) = (IX)\\otimes(ZI) = X\\otimes Z$ as well — equal, so $[X_0,Z_1]=0$." },
    ],
    finalAnswer: "X_0 and Z_1 act on independent tensor factors (different qubits), so the tensor-product multiplication rule makes them commute regardless of whether X and Z themselves commute on a single qubit.",
  },
  explanation: {
    correctIdea: "Compatibility between multi-qubit observables often comes from acting on different qubits entirely, independent of any single-qubit incompatibility.",
    whyCorrect: "This is a general fact (A⊗I and I⊗B always commute for any A,B), not specific to X and Z.",
    whyWrong: ["Claiming X_0 and Z_1 are 'basically the same as X and Z' conflates single-qubit operators with their multi-qubit tensor-product extensions — the tensor structure is exactly what makes them compatible."],
  },
};
