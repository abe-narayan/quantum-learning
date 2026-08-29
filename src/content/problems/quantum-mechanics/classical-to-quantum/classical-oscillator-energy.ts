import type { NumericProblem } from "@/lib/problems/types";

export const classicalOscillatorEnergy: NumericProblem = {
  meta: {
    slug: "classical-oscillator-energy",
    title: "A Classical Observable Calculation",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["classical-mechanics", "phase-space"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/classical-states-and-observables"],
  },
  question: {
    type: "numeric",
    prompt:
      "A classical particle of mass $m=2$ has state $x=3, p=4$, moving under potential $V(x)=x^2$. Find its total energy $E(x,p) = \\frac{p^2}{2m} + V(x)$.",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 13,
    tolerance: 0.01,
    incorrectFeedback: "Compute p²/(2m) and V(x) = x² separately, then add them.",
    nearMisses: [
      { value: 25, feedback: "25 is p² + x², with the kinetic term never divided by 2m. With m = 2 the kinetic energy is 16/4 = 4." },
      { value: 17, feedback: "17 divides p² by m but not by 2m. The kinetic term is p²/(2m)." },
      { value: 4, feedback: "4 is the kinetic energy alone. The total also includes V(x) = x²." },
    ],
  },
  hints: [
    { text: "Kinetic energy is p²/(2m); here p=4, m=2." },
    { text: "Potential energy is V(x)=x²; here x=3." },
    { text: "Add the two contributions." },
  ],
  solution: {
    steps: [
      { description: "Kinetic energy.", latex: "\\frac{p^2}{2m} = \\frac{16}{4} = 4" },
      { description: "Potential energy.", latex: "V(x) = 3^2 = 9" },
      { description: "Total energy.", latex: "E = 4 + 9 = 13" },
    ],
    finalAnswer: "$E = 13$",
  },
  explanation: {
    correctIdea: "A classical observable is just a function evaluated at the known state — no probability involved.",
    whyCorrect: "Both terms are exact given exact x, p — there's no ambiguity in a classical observable's value.",
    whyWrong: ["Forgetting to divide p² by 2m, or squaring x incorrectly, are the most common arithmetic slips here."],
  },
};
