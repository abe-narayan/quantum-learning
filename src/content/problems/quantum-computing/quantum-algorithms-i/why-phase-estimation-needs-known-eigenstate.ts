import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPhaseEstimationNeedsKnownEigenstate: ConceptualProblem = {
  meta: {
    slug: "why-phase-estimation-needs-known-eigenstate",
    title: "Why This Platform's phaseEstimation Requires a Known Eigenstate",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["phase-estimation", "scope"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-phase-estimation"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why phaseEstimation's derivation specifically requires the input state to already be an eigenstate of U, and what would go wrong if you fed it an arbitrary (non-eigenstate) input.",
    placeholder: "Think about the derivation step where U^power is applied to the eigenstate register...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["eigenvalue", "e^{2\\pi i", "single phase", "phase to pull out"],
      ["superposition of eigenstates", "mixture of phases", "not a single phase", "multiple eigenvalues"],
    ],
    incorrectFeedback: "Think about what U^power does to a state that is a superposition of several different eigenstates, each with its own eigenphase.",
    partialFeedback: "Good — now be explicit about what happens to the derivation's key step (a single phase factoring out) once multiple eigenphases are involved.",
  },
  hints: [
    { text: "The derivation's key step was: applying U^power to an eigenstate multiplies by a single number, e^{2πiφ·power}." },
    { text: "A general (non-eigenstate) input is a superposition of several eigenstates, each with a different eigenphase." },
    { text: "U^power would multiply each component by its own phase — no single φ to read out." },
  ],
  solution: {
    steps: [
      { description: "The derivation relies on U^power|ψ⟩=e^{2πiφ·power}|ψ⟩ — a single number factoring out, unchanged in direction." },
      { description: "For a general input (a superposition of eigenstates with different eigenphases), each component would pick up its own distinct phase." },
      { description: "The precision register would then end up in a superposition over several different phase estimates, not a single well-defined answer." },
    ],
    finalAnswer: "A non-eigenstate input has no single eigenphase to read out — the circuit would produce a mixture of estimates instead of one clean answer.",
  },
  explanation: {
    correctIdea: "Phase estimation fundamentally estimates the phase of one eigenstate at a time; a superposition of eigenstates just runs several phase estimations in superposition simultaneously.",
    whyCorrect: "This is precisely why every worked example in this course supplies a known, exact eigenstate rather than an arbitrary input.",
    whyWrong: ["Saying 'it would just fail' without explaining the mechanism misses that it doesn't error — it produces a physically meaningful but different (mixed) result."],
  },
};
