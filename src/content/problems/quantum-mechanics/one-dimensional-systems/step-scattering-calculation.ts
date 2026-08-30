import type { NumericProblem } from "@/lib/problems/types";

export const stepScatteringCalculation: NumericProblem = {
  meta: {
    slug: "step-scattering-calculation",
    title: "Reflection and Transmission at a Step",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["scattering", "step-potential"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"],
  },
  question: {
    type: "numeric",
    prompt: "For E = 8 and step height V0 = 2 (natural units), find the reflection probability R.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.005155,
    tolerance: 0.0005,
    incorrectFeedback: "Compute k1=sqrt(2E), k2=sqrt(2(E-V0)), then R=((k1-k2)/(k1+k2))^2.",
    nearMisses: [
      { value: 0.0718, tolerance: 0.001, feedback: "That is the amplitude ratio (k₁−k₂)/(k₁+k₂). The reflection probability squares it." },
      { value: 0.994845, tolerance: 0.001, feedback: "That is the transmission probability T = 1 − R. The question asks for the reflected share." },
      { value: 0, feedback: "A step still reflects even when E exceeds V₀: the wavenumber changes discontinuously, and that mismatch alone produces reflection. Only k₁ = k₂ would give zero." },
    ],
  },
  hints: [
    { text: "With $E$ above the step, nothing is trapped anywhere. The reflection comes purely from the mismatch between the wavenumbers on the two sides." },
    { text: "Compute the wavenumber on each side from the local kinetic energy, then form their difference over their sum." },
    { text: "That ratio is a reflected amplitude, not a probability. One further operation stands between it and $R$." },
  ],
  solution: {
    steps: [
      { description: "$k_1=\\sqrt{16}=4$, $k_2=\\sqrt{12}\\approx3.4641$." },
      { description: "$R = \\left(\\dfrac{4-3.4641}{4+3.4641}\\right)^{\\!2} \\approx (0.0718)^2 \\approx 0.00515$." },
    ],
    finalAnswer: "$R \\approx 0.00515$",
  },
  explanation: {
    correctIdea: "Even a modest step (V0 a quarter of E) still produces measurable reflection.",
    whyCorrect: "Direct substitution into the derived closed-form formula, matching this platform's stepPotentialScattering function.",
    whyWrong: ["Forgetting to square the ratio (using (k1-k2)/(k1+k2) directly as R) gives a much larger, wrong number, since R is defined via the squared amplitude ratio."],
  },
};
