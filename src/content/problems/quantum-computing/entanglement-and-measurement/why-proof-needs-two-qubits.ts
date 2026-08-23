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
      ["four amplitudes", "a,b,c,d", "only four", "2-qubit", "two-qubit"],
      ["3-qubit", "three qubit", "eight amplitude", "different formula", "more terms"],
    ],
    incorrectFeedback: "Think about how many amplitudes a 3-qubit state has, and whether the four-variable a,b,c,d setup from this lesson still applies.",
    partialFeedback: "Good direction — be explicit that the proof's algebra was built entirely around exactly four amplitudes.",
  },
  hints: [
    { text: "The proof's every step used exactly four amplitudes: a, b, c, d." },
    { text: "A 3-qubit state has 8 amplitudes, not 4." },
    { text: "Even splitting 'qubit 0' from 'qubits 1 and 2' would need a different (and more involved) index-sum derivation." },
  ],
  solution: {
    steps: [
      { description: "The entire derivation (p, q, z, and the final identity) was built using exactly the four amplitudes a, b, c, d of a 2-qubit state." },
      { description: "A 3-qubit state has 8 amplitudes, so ρ_A (tracing out 2 of the 3 qubits) would need a completely different, more involved derivation with more terms." },
    ],
    finalAnswer: "The proof's algebra is built entirely around exactly four amplitudes, which only exist for a 2-qubit state.",
  },
  explanation: {
    correctIdea: "The identity's derivation is not a general argument dressed up in small numbers — it genuinely used the specific 2-qubit, 4-amplitude structure at every step.",
    whyCorrect: "A 3-qubit state's reduced single-qubit density matrix would need summing over the other two qubits' 4 basis combinations, a structurally different calculation.",
    whyWrong: ["Saying only 'because there's no general eigensolver' skips the more basic issue — even setting up the same style of proof needs a different amplitude count from the start."],
  },
};
