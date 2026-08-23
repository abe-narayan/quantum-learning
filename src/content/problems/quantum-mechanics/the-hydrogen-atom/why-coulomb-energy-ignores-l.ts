import type { ConceptualProblem } from "@/lib/problems/types";

export const whyCoulombEnergyIgnoresL: ConceptualProblem = {
  meta: {
    slug: "why-coulomb-energy-ignores-l",
    title: "Why Hydrogen's Energy Doesn't Depend on l",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["energy-levels", "degeneracy", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
  },
  question: {
    type: "conceptual",
    prompt: "The Radial Equation lesson showed l enters the effective potential explicitly, as a centrifugal term. Yet Eₙ doesn't depend on l at all. Is this a contradiction? Explain what's actually going on.",
    placeholder: "It is not a contradiction because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["not a contradiction", "no contradiction", "consistent"],
      ["specific to", "1/r", "Coulomb", "exact form", "special"],
    ],
    incorrectFeedback: "Address directly whether this is a contradiction, then explain what makes the exact 1/r Coulomb potential special compared to a generic central potential.",
    partialFeedback: "Good — make sure you explicitly note this l-independence is NOT a general feature of central potentials, only of the exact Coulomb form.",
  },
  hints: [
    { text: "l does change the shape of V_eff(r) and hence the radial wavefunction R_nl(r) itself." },
    { text: "But solving the ODE for the resulting energy eigenvalue happens to give the same E_n regardless of which l was used, only for the exact 1/r potential." },
    { text: "This is not true for other central potentials, like a finite spherical well — there, E does depend on l." },
  ],
  solution: {
    steps: [
      { description: "No contradiction: l genuinely changes V_eff(r), and correspondingly changes the shape of the radial wavefunction R_nl(r) — this is why 2s and 2p look different." },
      { description: "What's special is that solving the full radial ODE for the exact 1/r Coulomb potential happens to produce the same energy eigenvalue E_n regardless of which l was used to define V_eff." },
      { description: "This is a specific, 'accidental' degeneracy of the 1/r potential — for a different central potential (e.g. a finite spherical well), the energy genuinely would depend on l." },
    ],
    finalAnswer: "Not a contradiction — l changes the wavefunction's shape via V_eff, but only the exact Coulomb potential's eigenvalue happens to come out l-independent; this doesn't hold for central potentials in general.",
  },
  explanation: {
    correctIdea: "This distinguishes a general structural fact (energy eigenstates can be labeled by l, from Central Potentials) from a specific numerical coincidence of the Coulomb potential (the eigenvalue not actually depending on that label).",
    whyCorrect: "Matches the lesson's explicit framing of l-independence as special to the exact Coulomb form, not a general central-potential rule.",
    whyWrong: ["Claiming l has no physical effect at all ignores that it fully determines the radial wavefunction's shape, degeneracy count, and centrifugal barrier — only the energy eigenvalue is unaffected."],
  },
};
