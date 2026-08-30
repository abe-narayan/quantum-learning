import type { NumericProblem } from "@/lib/problems/types";

export const averageTeleportationFidelity: NumericProblem = {
  meta: {
    slug: "average-teleportation-fidelity",
    title: "Average Teleportation Fidelity from Singlet Fraction",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    difficulty: "master",
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
    nearMisses: [
      { value: 0.85, feedback: "0.85 is the singlet fraction F_e itself. The Haar average maps it through (2F_e + 1)/3, which lifts it." },
      { value: (2 * 0.85) / 3, tolerance: 0.005, feedback: "The +1 in the numerator is missing. It is what pins F_avg at 1/2 for a resource with no entanglement at all." },
      { value: 0.5, feedback: "0.5 is the classical guessing fidelity, what F_e = 1/4 would give. This resource is far better than that." },
    ],
  },
  hints: [
    { text: "The formula is already given, so this is substitution: double the singlet fraction, add one, then divide by three." },
    { text: "Sanity check the range before you compute: F_e = 1/4 (a useless separable resource) must map to 1/2, the classical guessing fidelity, and F_e = 1 must map to 1. Your answer should sit close to the top of that range." },
  ],
  solution: {
    steps: [
      { description: "$F_{\\text{avg}}=(2\\times0.85+1)/3 = 2.7/3$" },
    ],
    finalAnswer: "F_avg = 0.9.",
  },
  explanation: {
    correctIdea: "This averaged formula answers a different question than a specific-state fidelity computation. It is the mean fidelity over every possible message state, weighted by the Haar measure.",
    whyCorrect: "The lesson's worked example computed a different number, F≈0.9528, for one specific message state under a resource with F_e=0.9. Both are correct; they answer different questions.",
  },
};
