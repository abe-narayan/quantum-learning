import type { NumericProblem } from "@/lib/problems/types";

export const averageTeleportationFidelity: NumericProblem = {
  meta: {
    slug: "average-teleportation-fidelity",
    title: "Average Teleportation Fidelity from Singlet Fraction",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["teleportation", "fidelity"],
    prerequisites: ["quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the standard (Haar-averaged) formula F_avg = (2*F_e + 1) / 3, compute the average teleportation fidelity for a Bell-diagonal resource state with singlet fraction F_e=0.85.",
    inputHint: "to 2 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.9,
    tolerance: 0.005,
    incorrectFeedback: "(2*0.85+1)/3 = 2.7/3.",
  },
  hints: [
    { text: "2*0.85 = 1.7" },
    { text: "(1.7+1)/3 = 2.7/3." },
  ],
  solution: {
    steps: [
      { description: "$F_{\\text{avg}}=(2\\times0.85+1)/3 = 2.7/3$" },
    ],
    finalAnswer: "F_avg = 0.9.",
  },
  explanation: {
    correctIdea: "This averaged formula answers a different question than a specific-state fidelity computation -- it's the mean fidelity over every possible message state, weighted by the Haar measure.",
    whyCorrect: "The lesson's own worked example computed a genuinely different number, F≈0.9528, for one specific message state under a resource with F_e=0.9 -- both are correct, but they answer different questions.",
  },
};
