import type { NumericProblem } from "@/lib/problems/types";

export const characteristicTimescaleCalculation: NumericProblem = {
  meta: {
    slug: "characteristic-timescale-calculation",
    title: "Computing a Characteristic Evolution Timescale",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["energy-time-uncertainty"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"],
  },
  question: {
    type: "numeric",
    prompt: "An observable A has Delta A = 2 and |d<A>/dt| = 3. Find its characteristic evolution timescale Delta t_A.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.666667,
    tolerance: 0.001,
    incorrectFeedback: "Delta t_A = Delta A / |d<A>/dt| directly.",
    nearMisses: [
      { value: 1.5, tolerance: 0.002, feedback: "That is the ratio the other way up. The timescale is the spread divided by the rate: how long the rate needs to move ⟨A⟩ by one spread." },
      { value: 6, feedback: "6 multiplies the two. A time comes from dividing a spread by a rate of change." },
    ],
  },
  hints: [
    { text: "The timescale answers how long the observable needs before it has moved by about its own spread, so the spread and the rate play different roles in it." },
    { text: "Track units. $\\Delta A$ carries $A$'s units; $|d\\langle A\\rangle/dt|$ carries $A$ per unit time. Arrange the two so only a time survives." },
    { text: "Only one of the two orderings leaves a time. Decide which before you evaluate anything." },
  ],
  solution: {
    steps: [{ description: "$\\Delta t_A = \\dfrac{\\Delta A}{|d\\langle A\\rangle/dt|} = \\dfrac{2}{3} \\approx 0.6667$." }],
    finalAnswer: "$\\Delta t_A \\approx 0.6667$",
  },
  explanation: {
    correctIdea: "The characteristic timescale is the observable's spread divided by its rate of change.",
    whyCorrect: "Direct substitution into the definition.",
    whyWrong: ["Multiplying instead of dividing (getting 6 instead of 0.667) inverts the relationship between spread, rate, and timescale."],
  },
};
