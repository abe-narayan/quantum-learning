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
      {
        phrases: ["different qubits", "different tensor factors", "independent subsystems"],
        missingFeedback:
          "Say where each of the two operators actually acts. That is the whole reason the single-qubit failure of commutation does not carry over.",
      },
      {
        phrases: ["(AC)⊗(BD)", "act independently", "order doesn't matter across factors", "tensor product rule", "multiplication rule", "same product either way", "both orders give", "factor by factor"],
        missingFeedback:
          "You have identified that the two act on separate slots. Now settle it with algebra: multiply them in both orders using the way a tensor product of operators composes, and show the two expressions coincide whatever the single-qubit pieces are.",
      },
    ],
    incorrectFeedback: "You cited the fact that X and Z anticommute and stopped, which is a statement about one qubit and not about these two operators. Write both products out in full, using the way a product of two tensor factors multiplies, and compare the two results symbol by symbol.",
    modelAnswers: [
      "They act on different qubits, so they live in different tensor factors. Multiplying tensor products goes factor by factor, and here each factor only ever meets the identity, so both orders give the same product. Whether X and Z commute on a single qubit is irrelevant.",
      "The two act on independent subsystems. The tensor product rule means the order doesn't matter across factors, so they commute regardless of the single-qubit story.",
    ],
  },
  hints: [
    { text: "Neither operator touches the qubit the other one changes. Write each as a two-slot object and mark which slot is non-trivial in each." },
    { text: "Composing two such two-slot objects happens slot by slot: the first slots multiply together and the second slots multiply together, independently." },
    { text: "Do the multiplication in both orders. In each slot one of the two entries is the identity, so nothing has to be commuted past anything." },
  ],
  solution: {
    steps: [
      { description: "$X_0Z_1 = (X\\otimes I)(I\\otimes Z) = (XI)\\otimes(IZ) = X\\otimes Z$." },
      { description: "$Z_1X_0 = (I\\otimes Z)(X\\otimes I) = (IX)\\otimes(ZI) = X\\otimes Z$ as well, so $[X_0,Z_1]=0$." },
    ],
    finalAnswer: "X_0 and Z_1 act on independent tensor factors (different qubits), so the tensor-product multiplication rule makes them commute regardless of whether X and Z themselves commute on a single qubit.",
  },
  explanation: {
    correctIdea: "Compatibility between multi-qubit observables often comes from acting on different qubits entirely, independent of any single-qubit incompatibility.",
    whyCorrect: "This is a general fact (A⊗I and I⊗B always commute for any A,B), not specific to X and Z.",
    whyWrong: ["Claiming X_0 and Z_1 are 'basically the same as X and Z' conflates single-qubit operators with their multi-qubit tensor-product extensions. The tensor structure is what makes them compatible."],
  },
};
