import type { ConceptualProblem } from "@/lib/problems/types";

export const amplitudeDensityVsProbability: ConceptualProblem = {
  meta: {
    slug: "amplitude-density-vs-probability",
    title: "Why psi(x) Isn't a Probability",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["wavefunction", "born-rule"],
    prerequisites: ["quantum-mechanics/wave-mechanics/what-is-a-wavefunction"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain why psi(x) itself cannot be interpreted as a probability, and what role the continuum-limit scaling c_i = psi(x_i)*sqrt(dx) plays in forcing this.",
    placeholder: "Explain why psi(x) is a density, not a probability...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["density", "per unit length", "amplitude density", "not a probability itself"],
      ["dx", "interval", "|psi|^2 dx", "requires multiplying by dx", "needs a width"],
    ],
    incorrectFeedback: "Name both pieces: what kind of quantity psi(x) actually is (a density, not a probability), and why an interval width dx must be multiplied in to get an actual probability.",
    partialFeedback: "You're partway there — connect the sqrt(dx) scaling explicitly to why psi(x) alone can't be a probability.",
  },
  hints: [
    { text: "What did the continuum-limit scaling c_i = psi(x_i)*sqrt(dx) do to the probability |c_i|^2?" },
    { text: "What extra factor turns |psi(x)|^2 into an actual probability?" },
  ],
  solution: {
    steps: [
      { description: "The scaling $c_i=\\psi(x_i)\\sqrt{\\Delta x}$ gives $|c_i|^2=|\\psi(x_i)|^2\\Delta x$ — probability is proportional to $|\\psi|^2$ times an interval width." },
      { description: "So $|\\psi(x)|^2$ alone is a probability *density* (probability per unit length); only $|\\psi(x)|^2\\,dx$ is an actual probability." },
    ],
    finalAnswer: "psi(x) is an amplitude density; only |psi(x)|^2 dx (not |psi(x)|^2 alone) is ever a probability.",
  },
  explanation: {
    correctIdea: "The continuum limit forces psi(x) to carry units of (probability)^(1/2) per unit length, not probability itself.",
    whyCorrect: "This is exactly the lesson's derivation: c_i = psi(x_i)*sqrt(dx) is the unique scaling keeping the sum-to-integral normalization finite.",
    whyWrong: ["Saying 'psi(x) is always between 0 and 1' is wrong on two counts: psi can be negative or complex, and even |psi(x)|^2 alone can exceed 1 for a tightly localized wavefunction."],
  },
};
