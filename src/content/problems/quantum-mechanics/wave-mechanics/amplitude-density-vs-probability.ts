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
      {
        phrases: ["density", "per unit length", "amplitude density", "not a probability itself"],
        missingFeedback:
          "Say what kind of object psi(x) is, if it is not a probability. Its units are the clue.",
      },
      {
        phrases: ["dx", "interval", "|psi|^2 dx", "requires multiplying by dx", "needs a width", "times a width", "over a range", "multiplied by a length"],
        missingFeedback:
          "You have named the kind of object. Now say what has to be supplied alongside it before you get an actual probability, and point to where the scaling puts that in.",
        anchors: {
          "dx": "The differential is the whole point of the distinction, and it normalizes to a two-character token that is matched whole rather than as a prefix. The raw token is what is being tested.",
        },
      },
    ],
    incorrectFeedback: "You treated |psi(x)|^2 as if it were already a probability. Ask what it would be the probability *of*: at a single mathematical point there is no answer, and the value itself can exceed 1 without anything being wrong.",
    partialFeedback: "One half is there. The other half is why a probability at a mathematical point is meaningless: you have to say over what stretch of the line, and the answer shrinks in proportion as that stretch shrinks.",
    modelAnswers: [
      "psi(x) is an amplitude density, not a probability itself. In the continuum limit the discrete coefficient is psi(x_i) times sqrt(dx), so its square is |psi|^2 dx: the probability only appears once you multiply by an interval width. psi alone carries probability per unit length.",
      "It is a density, so it needs a width before it means anything. Only |psi|^2 dx over a range is a probability; the square root of dx in the scaling is exactly what supplies that factor.",
    ],
  },
  hints: [
    { text: "Go back to the discrete chain of sites: each site carried a probability, and those probabilities summed to 1. Ask what that sum becomes when the sites merge into a continuous line." },
    { text: "The sum becomes an integral, and an integral needs something to integrate against. Look at what sits beside |psi|^2 under the integral sign." },
    { text: "Now check units. If the whole integral is a pure number, what units must psi(x) itself carry, and can a quantity carrying those units be a probability on its own?" },
  ],
  solution: {
    steps: [
      { description: "The scaling $c_i=\\psi(x_i)\\sqrt{\\Delta x}$ gives $|c_i|^2=|\\psi(x_i)|^2\\Delta x$. Probability is proportional to $|\\psi|^2$ times an interval width." },
      { description: "So $|\\psi(x)|^2$ alone is a probability *density* (probability per unit length); only $|\\psi(x)|^2\\,dx$ is an actual probability." },
    ],
    finalAnswer: "psi(x) is an amplitude density; only |psi(x)|^2 dx (not |psi(x)|^2 alone) is ever a probability.",
  },
  explanation: {
    correctIdea: "The continuum limit forces psi(x) to carry units of (probability)^(1/2) per unit length, not probability itself.",
    whyCorrect: "This is the lesson's derivation: c_i = psi(x_i)*sqrt(dx) is the unique scaling keeping the sum-to-integral normalization finite.",
    whyWrong: ["Saying 'psi(x) is always between 0 and 1' is wrong on two counts: psi can be negative or complex, and even |psi(x)|^2 alone can exceed 1 for a tightly localized wavefunction."],
  },
};
