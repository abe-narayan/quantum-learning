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
      ["eigenvalue", "eigenphase", "single phase", "one phase", "single number", "phase to pull out", "factors out", "factor out", "e^{2", "e^(2"],
      ["superposition of eigenstates", "superposition of several", "several eigenstates", "multiple eigenstates", "combination of eigenstates", "mixture of phases", "not a single phase", "no single phase", "multiple eigenvalues", "different phases", "different eigenphases", "own phase", "many phases"],
    ],
    incorrectFeedback: "Split the arbitrary input into pieces that U treats simply, then ask what the algorithm tries to read out and whether that readout is still well defined.",
    partialFeedback: "Good. Now spell out which step of the derivation silently assumed the input was special, and what replaces the clean readout when it is not.",
  },
  hints: [
    { text: "Find the step in the derivation where applying U^power leaves the input register essentially untouched. What special property of the input makes that possible?" },
    { text: "Now expand an arbitrary input in the eigenbasis of U. How does U^power act on each term?" },
    { text: "Ask what the precision register is correlated with at the end. Is there one well-defined quantity for it to record?" },
  ],
  solution: {
    steps: [
      { description: "The derivation relies on U^power|ψ⟩=e^{2πiφ·power}|ψ⟩: a single number factoring out, with the state's direction unchanged." },
      { description: "For a general input (a superposition of eigenstates with different eigenphases), each component would pick up its own distinct phase." },
      { description: "The precision register would then end up in a superposition over several different phase estimates, not a single well-defined answer." },
    ],
    finalAnswer: "A non-eigenstate input has no single eigenphase to read out. The circuit would produce a mixture of estimates instead of one clean answer.",
  },
  explanation: {
    correctIdea: "Phase estimation fundamentally estimates the phase of one eigenstate at a time; a superposition of eigenstates just runs several phase estimations in superposition simultaneously.",
    whyCorrect: "This is precisely why every worked example in this course supplies a known, exact eigenstate rather than an arbitrary input.",
    whyWrong: ["Saying 'it would just fail' without explaining the mechanism misses that it doesn't error. It produces a physically meaningful but different (mixed) result."],
  },
};
