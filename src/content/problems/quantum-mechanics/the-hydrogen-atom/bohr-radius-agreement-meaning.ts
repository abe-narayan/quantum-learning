import type { ConceptualProblem } from "@/lib/problems/types";

export const bohrRadiusAgreementMeaning: ConceptualProblem = {
  meta: {
    slug: "bohr-radius-agreement-meaning",
    title: "What the Bohr-Radius Agreement Does and Doesn't Mean",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["orbitals", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"],
  },
  question: {
    type: "conceptual",
    prompt: "mostProbableRadius1s() gives exactly r=1 (the Bohr radius). Does this mean the electron orbits at a fixed radius, as in the Bohr model? Explain what the result actually establishes.",
    placeholder: "The result establishes that... but it does NOT mean...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["most probable", "single most likely", "peak", "maximum"],
      ["not", "does not mean", "no fixed orbit", "distribution", "any radius", "nonzero probability"],
    ],
    incorrectFeedback: "Address both sides explicitly: what the r=1 result IS (a statement about the peak of a probability distribution) and what it is NOT (a claim about a fixed orbital radius).",
    partialFeedback: "Good — make sure you also state that the electron has nonzero probability of being found at other radii too.",
  },
  hints: [
    { text: "mostProbableRadius1s() maximizes the probability DENSITY, r²|R(r)|² — it finds the single most likely value from a continuous distribution." },
    { text: "A continuous distribution having a most-likely value doesn't mean every measurement gives that value." },
    { text: "The Bohr model claims a definite fixed orbit; quantum mechanics gives a probability distribution over all r>0." },
  ],
  solution: {
    steps: [
      { description: "The result establishes that r=1 is the single most likely radius to measure — the peak of the continuous probability distribution r²|R₁₀(r)|²." },
      { description: "It does NOT mean the electron is confined to r=1, or orbits there in any classical sense — the wavefunction has nonzero probability density at every r>0." },
      { description: "The numerical agreement with the Bohr model's fixed-orbit radius is a genuine, interesting coincidence for the ground state specifically, not evidence the Bohr model's classical-orbit picture is correct." },
    ],
    finalAnswer: "r=1 is the peak of a continuous probability distribution over all r, not a fixed orbit — the Bohr-model agreement is a numerical coincidence for the ground state, not a vindication of classical orbits.",
  },
  explanation: {
    correctIdea: "This distinguishes a genuine, checkable numerical fact (the location of a distribution's peak) from an interpretive overreach (concluding the electron 'orbits' there).",
    whyCorrect: "Matches the lesson's explicit Common Mistakes framing of this exact point.",
    whyWrong: ["Concluding the Bohr model was 'basically right' ignores that quantum mechanics gives a full probability distribution, with the Bohr radius being only its single most likely value, not its only possible value."],
  },
};
