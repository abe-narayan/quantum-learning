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
      ["four amplitudes", "4 amplitudes", "four-amplitude", "a,b,c,d", "only four", "2-qubit", "two-qubit", "two qubit"],
      ["3-qubit", "three qubit", "three-qubit", "eight amplitude", "8 amplitude", "2^3", "different formula", "different derivation", "more terms", "bigger sum", "larger sum"],
    ],
    incorrectFeedback: "Count the ingredients this lesson's derivation starts from, then count what the larger state would supply. Compare the two counts.",
    partialFeedback: "Good direction. Be explicit about the exact number of variables the proof's algebra was built around, and why the bigger system breaks that count.",
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
    finalAnswer: "The proof's algebra is built entirely around exactly four amplitudes, which only exist for a 2-qubit state.",
  },
  explanation: {
    correctIdea: "The identity's derivation is not a general argument dressed up in small numbers. It genuinely used the specific 2-qubit, 4-amplitude structure at every step.",
    whyCorrect: "A 3-qubit state's reduced single-qubit density matrix would need summing over the other two qubits' 4 basis combinations, a structurally different calculation.",
    whyWrong: ["Saying only 'because there's no general eigensolver' skips the more basic issue: even setting up the same style of proof needs a different amplitude count from the start."],
  },
};
