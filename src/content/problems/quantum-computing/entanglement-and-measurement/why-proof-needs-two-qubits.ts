import type { ConceptualProblem } from "@/lib/problems/types";

export const whyProofNeedsTwoQubits: ConceptualProblem = {
  meta: {
    slug: "why-proof-needs-two-qubits",
    title: "Why the Purity Identity Doesn't Extend to Three Qubits",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["entanglement", "scope", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Why does this lesson's proof (1-Tr(ρ_A²)=2|ad-bc|²) break down immediately for a 3-qubit pure state, even before reaching the question of a general eigensolver?",
    placeholder: "Think about the dimension of ρ_A once 'the rest of the system' is two qubits...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["four amplitudes", "4 amplitudes", "four-amplitude", "a,b,c,d", "only four", "exactly four", "four coefficients", "just four numbers"],
        missingFeedback:
          "Say how many numbers the two-qubit pure state the proof starts from actually has. The whole identity is built around that count.",
      },
      {
        phrases: ["eight amplitude", "8 amplitude", "eight coefficients", "different formula", "different derivation", "more terms", "bigger sum", "larger sum", "more than four", "no longer four", "four is not enough"],
        missingFeedback:
          "You have the two-qubit count. Now say what that count becomes with a third qubit, and what that does to the expression the proof is built around.",
      },
    ],
    incorrectFeedback: "Count the ingredients this lesson's derivation starts from, then count what the larger state would supply. Compare the two counts.",
    partialFeedback: "State how many variables the proof's algebra was built around, and why the larger system breaks that count.",
    modelAnswers: [
      "The whole derivation is built on exactly four amplitudes a, b, c, d. A three-qubit pure state has eight amplitudes, so there is no |ad - bc| to write down and you would need a different derivation, not an extension of this one.",
      "1 - Tr(rho_A^2) = 2|ad-bc|^2 only makes sense with four coefficients. With three qubits there are eight coefficients and more terms in the sum, so the formula has to be rederived from scratch.",
    ],
  },
  hints: [
    { text: "Count the variables the proof's algebra manipulates from its first line to its last. Where did that count come from?" },
    { text: "Now count what a state of one more qubit would hand you. Do the counts agree?" },
    { text: "Even keeping subsystem A as one qubit, the partner system grows. What does that do to the partial-trace bookkeeping?" },
  ],
  solution: {
    steps: [
      { description: "The entire derivation (p, q, z, and the final identity) was built using exactly the four amplitudes a, b, c, d of a 2-qubit state." },
      { description: "A 3-qubit state has 8 amplitudes, so ρ_A (tracing out 2 of the 3 qubits) would need a completely different, more involved derivation with more terms." },
    ],
    finalAnswer: "The proof's algebra is built around exactly four amplitudes. A three-qubit pure state carries eight amplitudes, so |ad-bc| has no counterpart at all and the identity has to be rederived rather than extended.",
  },
  explanation: {
    correctIdea: "The identity's derivation is not a general argument dressed up in small numbers. It used the specific 2-qubit, 4-amplitude structure at every step.",
    whyCorrect: "A 3-qubit state's reduced single-qubit density matrix would need summing over the other two qubits' 4 basis combinations, a structurally different calculation.",
    whyWrong: ["Saying only 'because there's no general eigensolver' skips the more basic issue: even setting up the same style of proof needs a different amplitude count from the start."],
  },
};
