import type { NumericProblem } from "@/lib/problems/types";

export const qspD1PhaseSumRealPart: NumericProblem = {
  meta: {
    slug: "qsp-d1-phase-sum-real-part",
    title: "QSP Degree-1 Closed Form: Real Part of P(x)",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/quantum-signal-processing",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["quantum-signal-processing", "phase-sequence"],
    prerequisites: ["apex/algorithmic-frontiers/quantum-signal-processing"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson derives that a degree-1 QSP phase sequence (phi0, phi1) sandwiching the signal rotation W(x) produces the exact closed form P(x) = e^{i(phi0+phi1)} x for the (0,0) entry of U. For phi0 = pi/6 and phi1 = pi/6, compute Re(P(0.4)).",
    inputHint: "decimal, 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.2,
    tolerance: 0.001,
    incorrectFeedback:
      "phi0+phi1 = pi/3, so e^{i(phi0+phi1)} = cos(pi/3) + i sin(pi/3) = 0.5 + i(root 3 / 2). Multiplying by x = 0.4 and taking the real part gives 0.4 x 0.5.",
  },
  hints: [
    { text: "Start from the lesson's derived closed form P(x) = e^{i(phi0+phi1)} x, valid for any phase choice at d=1." },
    { text: "phi0 + phi1 = pi/6 + pi/6 = pi/3." },
    { text: "Re(e^{i pi/3}) = cos(pi/3) = 0.5, so Re(P(0.4)) = 0.5 x 0.4." },
  ],
  solution: {
    steps: [
      { description: "The lesson's degree-1 closed form is $P(x) = e^{i(\\phi_0+\\phi_1)}x$, derived by direct 2x2 matrix multiplication of $e^{i\\phi_0 Z}W(x)e^{i\\phi_1 Z}$." },
      { description: "With $\\phi_0=\\phi_1=\\pi/6$: $\\phi_0+\\phi_1=\\pi/3$, so $e^{i(\\phi_0+\\phi_1)}=\\cos(\\pi/3)+i\\sin(\\pi/3)=0.5+i(\\sqrt3/2)$." },
      { description: "$\\mathrm{Re}(P(0.4)) = 0.4\\times\\mathrm{Re}(e^{i\\pi/3}) = 0.4\\times0.5$" },
    ],
    finalAnswer: "Re(P(0.4)) = 0.200",
  },
  explanation: {
    correctIdea: "For d=1, tuning the phases only ever multiplies the underlying shape x by an overall unit-modulus complex phase e^{i(phi0+phi1)} -- it never changes x into a different real shape.",
    whyCorrect: "This is the direct payoff of the lesson's fully symbolic derivation: the (0,0) entry factors exactly as a phase times x, so its real part is just x times the cosine of the phase sum.",
    whyWrong: ["Forgetting to take only the real part (reporting the full complex magnitude, |P(0.4)|=0.4, instead) misses that phi0+phi1=pi/3 is not a multiple of pi, so P(0.4) is genuinely complex, not real."],
  },
};
