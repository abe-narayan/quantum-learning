import { StateVector } from "@/lib/quantum/state";
import { PAULI_X, rotationAboutAxis, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const initial = StateVector.zero(2);
const ideal = applySingleQubitGate(initial, PAULI_X, 0);
const epsilon = 0.1;
let actual = applySingleQubitGate(initial, PAULI_X, 0);
actual = applySingleQubitGate(actual, rotationAboutAxis({ x: 1, y: 0, z: 0 }, epsilon), 1);
/** Per-gate spectator fidelity, cos^2(eps/2), measured against the platform's own state engine. */
const perGate = ideal.innerProduct(actual).magnitudeSquared();
/** Largest gate count whose compounded fidelity is still at or above one half. */
const value = Math.floor(Math.log(0.5) / Math.log(perGate));

export const crosstalkFidelityAt01: NumericProblem = {
  meta: {
    slug: "crosstalk-fidelity-at-0.1",
    title: "How Long a Spectator Survives ε=0.1 Crosstalk",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["crosstalk", "scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/crosstalk"],
  },
  question: {
    type: "numeric",
    prompt:
      "Every gate on the active qubit leaks a spectator rotation of ε=0.1 radians onto its neighbour, costing that neighbour a fidelity factor of cos²(ε/2). The gates are independent and the leak repeats identically each time. What is the largest number of gates that can run before the spectator's fidelity falls below 0.5?",
    inputHint: "a whole number of gates",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback:
      "Two things have to be right. The per-gate factor takes the cosine of half the leaked angle, not of the angle itself, and the factors from successive gates multiply rather than add. Compound the first into the second, then solve for the gate count.",
    nearMisses: [
      {
        value: value + 1,
        feedback:
          "One gate too many. The exact solution of the compounding equation is not an integer, and at this count the running product has already dipped under one half, so the largest gate count still meeting the requirement is the one below.",
      },
      {
        value: Math.floor(Math.log(0.5) / Math.log(Math.cos(epsilon) ** 2)),
        feedback:
          "The half-angle has been dropped. Using cos²(ε) instead of cos²(ε/2) makes each gate look roughly four times as damaging, and shortens the answer by about the same factor.",
      },
      {
        value: Math.round(0.5 / (1 - perGate)),
        tolerance: 2,
        feedback:
          "This is an additive error budget: per-gate loss multiplied out until the losses sum to one half. Fidelity compounds multiplicatively, and the product decays more slowly than the sum accumulates, so the true depth is longer than this.",
      },
      {
        value: 1,
        feedback:
          "A single gate costs only about 0.25% of the spectator's fidelity. The question is how far that small per-gate cost can be repeated before it adds up to half the state.",
      },
    ],
  },
  hints: [
    {
      text: "The leak is identical on every gate and the gates do not interfere with one another. Ask what a chain of independent fidelity factors does to the running total: do they add, or something else?",
    },
    {
      text: "Write the fidelity after N gates as the per-gate factor raised to the Nth power, and set that expression equal to one half. A logarithm turns the exponent into an ordinary multiplier and makes N solvable.",
    },
    {
      text: "Solve for N, then decide the rounding deliberately. The question asks for the largest count still at or above one half, which is not the same as the first count that falls below it.",
    },
  ],
  solution: {
    steps: [
      {
        description: "A spectator rotated by ε keeps an overlap cos(ε/2) with its intended state, and fidelity squares that overlap.",
        latex: "F_{\\text{gate}} = \\cos^2(\\varepsilon/2) = \\cos^2(0.05) \\approx 0.997502",
      },
      {
        description: "Independent gates multiply their factors, so the requirement becomes an exponential inequality solved with logarithms.",
        latex: "F_{\\text{gate}}^{\\,N} \\ge \\tfrac12 \\;\\Longleftrightarrow\\; N \\le \\frac{\\ln 0.5}{\\ln F_{\\text{gate}}} \\approx 277.1",
      },
      {
        description:
          "N must be a whole number of gates and the inequality points downward, so the answer is 277. A single gate costs a quarter of one percent, which sounds negligible; two hundred and seventy-seven of them cost half the state.",
      },
    ],
    finalAnswer: "277 gates",
  },
  explanation: {
    correctIdea:
      "Crosstalk is a per-gate cost that looks trivial in isolation and sets a hard depth limit once compounded. Turning the per-gate figure into a depth is the step that makes a fidelity number mean something operationally.",
    whyCorrect:
      "The half-angle gives F ≈ 0.9975 per gate, and independent gates multiply, so the depth is ln(0.5)/ln(F) ≈ 277.1. Rounding down, because the requirement is a floor rather than a ceiling, gives 277: an idle neighbour is half-destroyed inside a circuit far shorter than any useful algorithm.",
    whyWrong: [
      "Using cos²(ε) rather than cos²(ε/2) quadruples the apparent per-gate damage and cuts the depth to about a quarter of the truth.",
      "Adding per-gate losses instead of multiplying fidelities understates the surviving depth, because a product of factors just under one decays more slowly than the same losses accumulated linearly.",
    ],
  },
};
