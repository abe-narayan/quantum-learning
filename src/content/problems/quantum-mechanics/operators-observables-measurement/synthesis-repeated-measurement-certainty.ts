import type { NumericProblem } from "@/lib/problems/types";

export const synthesisRepeatedMeasurementCertainty: NumericProblem = {
  meta: {
    slug: "synthesis-repeated-measurement-certainty",
    title: "Synthesis: Repeating the Same Measurement",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["synthesis", "measurement", "idempotence"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"],
  },
  question: {
    type: "numeric",
    prompt: "An observable A (with a possibly-degenerate eigenvalue a_i) is measured on a state, giving outcome a_i. It is then measured again immediately. What is the probability of getting a_i again?",
    inputHint: "a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.001,
    incorrectFeedback: "The post-measurement state already lies entirely within the a_i eigenspace. Use idempotence (P_i^2 = P_i) to see what a second measurement of P_i must give.",
    nearMisses: [
      { value: 0.5, feedback: "A half would describe a measurement of an incompatible observable. Repeating the same measurement projects a state that is already inside the eigenspace, so nothing changes." },
    ],
  },
  hints: [
    { text: "The state after the first measurement is P_i|psi>/||P_i|psi>|| — already entirely inside the a_i eigenspace." },
    { text: "Apply P_i to this already-projected state and use P_i^2 = P_i." },
  ],
  solution: {
    steps: [
      { description: "The post-measurement state $|\\psi'\\rangle$ satisfies $P_i|\\psi'\\rangle=|\\psi'\\rangle$ (it's already entirely within the eigenspace)." },
      { description: "$P(a_i\\text{ again}) = \\langle\\psi'|P_i|\\psi'\\rangle = \\langle\\psi'|\\psi'\\rangle = 1$." },
    ],
    finalAnswer: "$1$ (certainty)",
  },
  explanation: {
    correctIdea: "Repeated immediate measurement of the same observable never disturbs its own outcome, degenerate or not.",
    whyCorrect: "A direct consequence of projector idempotence, established in the first lesson of this course.",
    whyWrong: ["Assuming degeneracy somehow makes the second measurement's outcome uncertain confuses degeneracy (multiple states sharing an eigenvalue) with incompatibility (a different observable disturbing this one) — repeating the *same* measurement is always certain."],
  },
};
