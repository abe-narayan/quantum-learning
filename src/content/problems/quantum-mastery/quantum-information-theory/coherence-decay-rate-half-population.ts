import type { ConceptualProblem } from "@/lib/problems/types";

export const coherenceDecayRateHalfPopulation: ConceptualProblem = {
  meta: {
    slug: "coherence-decay-rate-half-population",
    title: "Why Amplitude Damping's Coherence Decays at Half the Population Rate",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/the-lindblad-master-equation",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["lindblad", "amplitude-damping"],
    prerequisites: ["quantum-mastery/quantum-information-theory/the-lindblad-master-equation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The Lindblad equation for pure amplitude damping gives rho_11(t) decaying at rate Gamma but rho_01(t) decaying at rate Gamma/2. Using the explicit anticommutator term -1/2{sigma_minus^dagger sigma_minus, rho}, explain algebraically where the factor of 1/2 in the coherence's decay rate comes from.",
    placeholder: "Look at what the anticommutator term contributes specifically to the off-diagonal entry...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["half", "prefactor", "one of the two terms", "only one term", "only one of the two", "just one of them contributes"],
        missingFeedback:
          "You have located the quantity in the right matrix entry. The numeric factor still needs its source. Two products land in that slot; work out how many of them actually survive there, and then combine that count with the numeric factor the Lindblad equation already carries.",
      },
      {
        phrases: ["off-diagonal", "rho_01", "coherence"],
        missingFeedback:
          "Say which matrix entry you are tracking. The factor only shows up for one of them, so the answer has to name it.",
      },
    ],
    incorrectFeedback:
      "Do the algebra instead of quoting the result. Write {|1><1|, rho} out as a two-by-two array and read off its (0,1) entry. Two products are being added there; check how many of them survive. Then fold in the numeric factor the Lindblad equation already carries, and check separately what the jump term contributes to the same slot.",
    modelAnswers: [
      "Look at what the anticommutator contributes to the off-diagonal entry. Only one of its two terms lands on rho_01, whereas both land on the population, so the coherence picks up half as much. Combined with the Lindblad equation's own -1/2 prefactor that gives Gamma/2 for the coherence against Gamma for the population.",
      "The -1/2 prefactor multiplies the anticommutator, and for this L only one of the two terms in the anticommutator contributes to rho_01. Half the terms with the same prefactor gives half the rate.",
    ],
  },
  hints: [
    { text: "Write {|1><1|,rho} = |1><1|rho + rho|1><1| out as a two-by-two array." },
    { text: "Look at the (0,1) slot of that array. Both products land somewhere; do both of them land there?" },
    { text: "Now check the jump term sigma_minus rho sigma_minus^dagger in the same slot before combining anything." },
  ],
  solution: {
    steps: [
      { description: "$|1\\rangle\\langle1|\\rho = \\begin{pmatrix}0&0\\\\\\rho_{10}&\\rho_{11}\\end{pmatrix}$, contributing 0 to the (0,1) entry." },
      { description: "$\\rho|1\\rangle\\langle1| = \\begin{pmatrix}0&\\rho_{01}\\\\0&\\rho_{11}\\end{pmatrix}$, contributing $\\rho_{01}$ to the (0,1) entry." },
      { description: "So $\\{\\sigma_-^\\dagger\\sigma_-,\\rho\\}$ has (0,1) entry exactly $\\rho_{01}$ (not $2\\rho_{01}$), and the jump term contributes nothing there, giving $\\dot\\rho_{01}=-\\tfrac\\Gamma2\\rho_{01}$." },
    ],
    finalAnswer: "The factor of 1/2 comes from the anticommutator's off-diagonal entry being rho_01 (only one of the two terms contributes there), combined with the Lindblad equation's own -1/2 prefactor. That is an exact algebraic origin, not a rounding or an approximation.",
  },
  explanation: {
    correctIdea: "The anticommutator {L^dagger L, rho} does not contribute symmetrically to every matrix entry. For this L its off-diagonal contribution is exactly half its diagonal contribution.",
    whyCorrect: "Carrying the same algebra through gives rho_01(t)=rho_01(0)e^{-Gamma t/2}: coherence decays at half the population rate, and that factor of two is the origin of T2=2*T1 for pure amplitude damping.",
  },
};
