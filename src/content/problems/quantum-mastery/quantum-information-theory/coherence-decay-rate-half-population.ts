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
        phrases: ["anticommutator", "1/2", "half", "sigma_minus dagger sigma_minus", "prefactor", "one of the two terms", "only one term"],
        missingFeedback:
          "You have located the coherence in the off-diagonal entry. The factor of 1/2 still needs its source: of the two terms in the anticommutator, only ρ|1⟩⟨1| reaches the (0,1) slot, so the entry picks up ρ₀₁ rather than 2ρ₀₁, and the Lindblad equation's own −1/2 prefactor is then what survives.",
      },
      ["off-diagonal", "rho_01", "coherence"],
    ],
    incorrectFeedback:
      "Compute {|1><1|, rho} explicitly: it contributes rho_01 (not 2*rho_01) to the (0,1) entry, so the -1/2 prefactor gives a net -rho_01/2 coefficient there, while the jump term sigma_minus*rho*sigma_minus^dagger contributes nothing to the off-diagonal at all.",
  },
  hints: [
    { text: "Compute {|1><1|,rho} = |1><1|rho + rho|1><1| explicitly as a 2x2 matrix." },
    { text: "Its (0,1) entry comes from only ONE of the two anticommutator terms, contributing exactly rho_01 (not 2 rho_01)." },
    { text: "The jump term sigma_minus rho sigma_minus^dagger has zero (0,1) entry entirely." },
  ],
  solution: {
    steps: [
      { description: "$|1\\rangle\\langle1|\\rho = \\begin{pmatrix}0&0\\\\\\rho_{10}&\\rho_{11}\\end{pmatrix}$, contributing 0 to the (0,1) entry." },
      { description: "$\\rho|1\\rangle\\langle1| = \\begin{pmatrix}0&\\rho_{01}\\\\0&\\rho_{11}\\end{pmatrix}$, contributing $\\rho_{01}$ to the (0,1) entry." },
      { description: "So $\\{\\sigma_-^\\dagger\\sigma_-,\\rho\\}$ has (0,1) entry exactly $\\rho_{01}$ (not $2\\rho_{01}$), and the jump term contributes nothing there, giving $\\dot\\rho_{01}=-\\tfrac\\Gamma2\\rho_{01}$." },
    ],
    finalAnswer: "The factor of 1/2 comes directly from the anticommutator's off-diagonal entry being rho_01 (only one of the two terms contributes there), combined with the Lindblad equation's own -1/2 prefactor -- an exact algebraic origin, not a rounding or approximation.",
  },
  explanation: {
    correctIdea: "The anticommutator {L^dagger L, rho} does not contribute symmetrically to every matrix entry -- its off-diagonal contribution is exactly half its diagonal contribution for this specific L.",
    whyCorrect: "This is precisely the calculation the lesson performs to get rho_01(t)=rho_01(0)e^{-Gamma t/2}, the origin of T2=2*T1 for pure amplitude damping.",
  },
};
