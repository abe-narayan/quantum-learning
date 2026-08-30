import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const zeroPointEnergy: MultipleChoiceProblem = {
  meta: {
    slug: "zero-point-energy",
    title: "Why the Ground State Cannot Sit at the Bottom",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["harmonic-oscillator", "zero-point-energy", "uncertainty"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A classical oscillator can sit motionless at the bottom of its well, with exactly zero energy. The quantum ground state cannot, and instead costs $\\hbar\\omega/2$. Which statement identifies what rules the classical picture out?",
    options: [
      {
        id: "a",
        text: "Sitting still at the minimum pins position and momentum at once, which the uncertainty bound forbids.",
      },
      {
        id: "b",
        text: "The energy levels are quantized, and a quantized spectrum cannot include a level at exactly zero energy.",
      },
      {
        id: "c",
        text: "The ground-state wavefunction has one node, and a state carrying a node cannot have zero kinetic energy.",
      },
      {
        id: "d",
        text: "Zero-point energy is the oscillator's residual thermal energy, and it goes to zero only at absolute zero temperature.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Quantization on its own permits a zero level: $L_z$ has a perfectly good eigenvalue of 0, and so does a free particle's momentum. What excludes zero here is not the discreteness of the spectrum but where the bottom of it sits, and the uncertainty bound is what puts a floor under it.",
      c: "The ground state has no nodes at all; it is a single Gaussian bump. Nodes start at the first excited state, and counting them is how the levels above the ground state are told apart.",
      d: "Zero-point energy is not thermal. It survives at absolute zero, which is precisely what makes it observable: liquid helium stays liquid under its own vapour pressure all the way down because this energy never leaves.",
    },
    defaultIncorrectFeedback:
      "Ask what the classical picture asserts about position and momentum simultaneously, and whether quantum mechanics lets both assertions stand.",
  },
  hints: [
    {
      text: "Write down what the classical resting state claims: a definite position, and a definite momentum, both at the same instant. Then ask whether quantum mechanics permits that pair of claims.",
    },
    {
      text: "Give the particle a spread $\\Delta x$ about the minimum. The potential term costs energy that grows with $\\Delta x$, and the uncertainty bound forces a momentum spread that costs energy growing as $\\Delta x$ shrinks.",
    },
    {
      text: "Two competing costs, one rising and one falling, have a minimum somewhere in between rather than at either end. The ground-state energy is the value at that minimum, not at zero width.",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "The classical resting state asserts $x=0$ and $p=0$ exactly, so $\\Delta x=\\Delta p=0$ and their product is zero. The uncertainty relation forbids it.",
        latex: "\\Delta x\\,\\Delta p \\ge \\frac{\\hbar}{2}",
      },
      {
        description:
          "Estimate the energy of a state of width $\\Delta x$: the potential contributes about $\\tfrac12 m\\omega^2(\\Delta x)^2$ and the kinetic term about $(\\Delta p)^2/2m \\ge \\hbar^2/(8m(\\Delta x)^2)$.",
      },
      {
        description:
          "Minimizing that sum over $\\Delta x$ gives the balance point, and the value there is the zero-point energy the exact solution returns.",
        latex: "E_0 = \\frac{\\hbar\\omega}{2}",
      },
    ],
    finalAnswer:
      "Localizing the particle at the minimum would fix position and momentum together; the best compromise the uncertainty bound allows costs $\\hbar\\omega/2$.",
  },
  explanation: {
    correctIdea:
      "The zero-point energy is not an arbitrary offset bolted onto the spectrum. It is the price of the trade-off between two energies that pull in opposite directions as the particle is localized.",
    whyCorrect:
      "Squeezing the wavefunction narrows the potential energy but widens the momentum distribution, and vice versa. Neither extreme is available, so the ground state settles at the width where the two costs balance, and the $+\\tfrac12$ in $E_n=\\hbar\\omega(n+\\tfrac12)$ is the arithmetic of that balance. The same argument, run on a Coulomb potential instead, is what stops the hydrogen electron from falling into the nucleus.",
    whyWrong: [
      {
        optionId: "b",
        text: "Treats discreteness as the obstruction. A quantized spectrum is perfectly free to contain zero; what is at issue is where its lowest rung sits.",
      },
      { optionId: "c", text: "Attributes a node to the ground state. It has none, which is exactly what makes it the ground state." },
      {
        optionId: "d",
        text: "Reads zero-point energy as thermal. It persists at absolute zero, and that persistence is what makes it measurable.",
      },
    ],
  },
};
