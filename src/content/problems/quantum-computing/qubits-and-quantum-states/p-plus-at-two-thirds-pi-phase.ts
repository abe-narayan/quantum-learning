import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const delta = (2 * Math.PI) / 3;
const psi = new StateVector([new Complex(Math.SQRT1_2), Complex.fromPolar(Math.SQRT1_2, delta)]);
const pPlus = applySingleQubitGate(psi, HADAMARD, 0).probabilities()[0];

export const pPlusAtTwoThirdsPiPhase: NumericProblem = {
  meta: {
    slug: "p-plus-at-two-thirds-pi-phase",
    title: "P(+) at a Relative Phase of 2π/3",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["relative-phase", "interference", "x-basis"],
    prerequisites: [
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "$|\\psi\\rangle = \\frac{1}{\\sqrt2}|0\\rangle + e^{i\\delta}\\frac{1}{\\sqrt2}|1\\rangle$ with $\\delta=\\frac{2\\pi}{3}$. What is $P(+)$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: pPlus,
    tolerance: 0.01,
    incorrectFeedback: "Use $P(+)=\\frac{1+2\\operatorname{Re}(\\alpha^*\\beta)}{2}$ from the Measurement lesson, with $\\alpha=\\frac{1}{\\sqrt2}$ and $\\beta=e^{i\\delta}\\frac{1}{\\sqrt2}$.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is P(0), the computational-basis probability. It is deliberately blind to δ, which is exactly why the X basis is the one that reveals a relative phase." },
      { value: 0.75, feedback: "0.75 is P(−), the other X-basis outcome. The two sum to 1, so check which sign the formula carries on the interference term." },
      { value: -0.5, feedback: "−0.5 is cos δ itself. It still has to be folded into P(+) = (1 + 2Re(α*β))/2, where Re(α*β) = cos(δ)/2." },
    ],
  },
  hints: [
    { text: "This is the same P(+) formula from the Measurement lesson, applied to a state with an explicit relative phase δ between α and β." },
    { text: "α*β = (1/√2)·e^{iδ}·(1/√2) = e^{iδ}/2, so Re(α*β) = cos(δ)/2." },
    { text: "At δ=2π/3, cos(δ) = −1/2." },
  ],
  solution: {
    steps: [
      { description: "$\\alpha^*\\beta = \\frac{1}{\\sqrt2}\\cdot e^{i\\delta}\\cdot\\frac{1}{\\sqrt2} = \\frac{e^{i\\delta}}{2}$, so $\\operatorname{Re}(\\alpha^*\\beta) = \\frac{\\cos\\delta}{2}$." },
      { description: "At $\\delta=2\\pi/3$: $\\cos(2\\pi/3)=-\\frac12$, so $\\operatorname{Re}(\\alpha^*\\beta) = -\\frac14$." },
      { description: "$P(+) = \\frac{1+2(-1/4)}{2} = \\frac{1-1/2}{2} = \\frac14$.", latex: `P(+) = \\frac{1+2\\cos(2\\pi/3)/2}{2} \\approx ${pPlus.toFixed(4)}` },
    ],
    finalAnswer: `$P(+) \\approx ${pPlus.toFixed(3)}$`,
  },
  explanation: {
    correctIdea: "P(+) is a continuous function of the relative phase δ, sweeping from 1 (constructive, δ=0) down to 0 (destructive, δ=π) and back.",
    whyCorrect: "At δ=2π/3, cos(δ) is negative but not at its most negative, giving a P(+) below 1/2 but above 0 — a genuinely partial-interference case, distinct from the lesson's own δ=π/2 worked example.",
    whyWrong: [
      "Using P(0)=|α|²=0.5 instead — that's the computational-basis probability, which by design doesn't depend on δ at all.",
      "Forgetting the factor of 1/2 out front and reporting cos(δ) itself as the answer.",
    ],
  },
};
