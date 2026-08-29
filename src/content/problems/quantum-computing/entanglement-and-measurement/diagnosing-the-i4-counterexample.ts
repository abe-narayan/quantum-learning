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
      "ρ_AB=I/4 is a product of two independent maximally mixed qubits (zero entanglement), yet its reduced state has entropy 1 bit, the same as a Bell state. Explain precisely what step of the pure-state proof (from Why Entangled Subsystems Are Mixed) fails to apply here.",
    placeholder: "Think about what the proof assumed about the global state...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["pure state", "purity", "was pure", "is pure", "be pure", "not pure", "isn't pure", "pure global", "mixed global", "globally mixed", "global state", "no state vector", "not a state vector", "genuinely mixed", "mixed, not pure"],
      ["assum", "requir", "presuppos", "relied on", "relies on", "rely on", "depends on", "depended on", "starts from", "started from", "amplitudes a,b,c,d", "four amplitudes", "no amplitudes"],
    ],
    incorrectFeedback: "Ask what kind of object the earlier proof wrote down in its first line, and whether ρ_AB=I/4 can be written as one.",
    partialFeedback: "You're close. Name the kind of state the proof's first line writes down, and say why I/4 cannot be put in that form.",
  },
  hints: [
    { text: "What form did the earlier proof write the two-qubit state in, on its very first line?" },
    { text: "Can ρ=I/4 be written in that form? What would have to exist for that to work?" },
    { text: "Trace where the quantities p, q, z came from in that proof. What inputs do they need?" },
  ],
  solution: {
    steps: [
      { description: "The earlier proof's entire derivation started from a pure global state a|00⟩+b|01⟩+c|10⟩+d|11⟩." },
      { description: "I/4 has no such representation. It is genuinely mixed, with no state vector at all." },
      { description: "Every subsequent step of that proof (computing p, q, z, and the final identity) is undefined without those four amplitudes to work from." },
    ],
    finalAnswer: "The proof assumed a pure global state with four amplitudes a,b,c,d; I/4 has no such amplitudes to plug in, so the proof simply doesn't apply.",
  },
  explanation: {
    correctIdea: "The purity identity's derivation is amplitude-based and requires a pure global state from its very first line.",
    whyCorrect: "I/4 fails this precondition entirely, which is exactly why applying the entropy-as-entanglement idea to it gives a wrong answer.",
    whyWrong: ["Saying 'the eigenvalues are wrong' misses the deeper point: the proof's setup itself doesn't apply, not just its numeric conclusion."],
  },
};
