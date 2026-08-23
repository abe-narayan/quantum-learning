import type { ConceptualProblem } from "@/lib/problems/types";

export const diagnosingTheI4Counterexample: ConceptualProblem = {
  meta: {
    slug: "diagnosing-the-i4-counterexample",
    title: "Diagnosing the I/4 Counterexample",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["entanglement-entropy", "scope", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "ρ_AB=I/4 is a product of two independent maximally mixed qubits (zero entanglement), yet its reduced state has entropy 1 bit — the same as a Bell state. Explain precisely what step of the pure-state proof (from Why Entangled Subsystems Are Mixed) fails to apply here.",
    placeholder: "Think about what the proof assumed about the global state...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["pure", "mixed global", "not pure", "global state"],
      ["assumed", "required", "depends on", "amplitudes a,b,c,d", "four amplitudes"],
    ],
    incorrectFeedback: "Focus on what kind of global state (pure vs. mixed) the earlier proof's four-amplitude setup (a,b,c,d) assumed from the start.",
    partialFeedback: "You're close — be specific that the earlier proof's entire algebra assumed a pure global state describable by four amplitudes, which I/4 is not.",
  },
  hints: [
    { text: "The earlier proof wrote the global state as a|00⟩+b|01⟩+c|10⟩+d|11⟩ — a pure state." },
    { text: "I/4 is not of this form at all — it has no state vector, since it's genuinely mixed." },
    { text: "Every step of that proof (computing p, q, z from a,b,c,d) requires those four amplitudes to exist." },
  ],
  solution: {
    steps: [
      { description: "The earlier proof's entire derivation started from a pure global state a|00⟩+b|01⟩+c|10⟩+d|11⟩." },
      { description: "I/4 has no such representation — it is genuinely mixed, with no state vector at all." },
      { description: "Every subsequent step of that proof (computing p, q, z, and the final identity) is undefined without those four amplitudes to work from." },
    ],
    finalAnswer: "The proof assumed a pure global state with four amplitudes a,b,c,d; I/4 has no such amplitudes to plug in, so the proof simply doesn't apply.",
  },
  explanation: {
    correctIdea: "The purity identity's derivation is amplitude-based and requires a pure global state from its very first line.",
    whyCorrect: "I/4 fails this precondition entirely, which is exactly why applying the entropy-as-entanglement idea to it gives a wrong answer.",
    whyWrong: ["Saying 'the eigenvalues are wrong' misses the deeper point — the proof's setup itself doesn't apply, not just its numeric conclusion."],
  },
};
