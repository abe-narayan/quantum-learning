import type { NumericProblem } from "@/lib/problems/types";

export const qspD2DegreeCollapseImaginaryPart: NumericProblem = {
  meta: {
    slug: "qsp-d2-degree-collapse-imaginary-part",
    title: "When a Degree-2 QSP Sequence Collapses to a Constant",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/quantum-signal-processing",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["quantum-signal-processing", "phase-sequence", "degree-bound"],
    prerequisites: ["apex/algorithmic-frontiers/quantum-signal-processing"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson's general degree-2 closed form is P(x) = e^{i(phi0+phi1+phi2)} x^2 - e^{i(phi0-phi1+phi2)} (1-x^2). For phi0=0, phi1=pi/2, phi2=0, this polynomial degenerates to a single constant (degree 0, even though d=2). What is Im(P(x)), the same for every x, in this case?",
    inputHint: "a real number",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.001,
    incorrectFeedback:
      "Track the two exponents separately: with these phases they come out opposite, so the two coefficients are negatives of one another and the x² pieces cancel when you expand. If your answer depends on x, recheck that cancellation. If your imaginary part came out negative, a sign slipped in the second term of the closed form.",
    nearMisses: [
      {
        value: -1,
        feedback:
          "A sign slipped. The closed form subtracts the second term, and that term's coefficient is already -i, so the two minus signs combine to give +i(1-x²), not -i(1-x²).",
      },
      {
        value: 0,
        feedback:
          "The x² terms cancel, but the constant does not. After the cancellation P(x) = i(x² + 1 - x²) = i, so a nonzero imaginary part survives.",
      },
    ],
  },
  hints: [
    { text: "Substitute the given phases into the two exponents of the closed form: the plain sum of the three phases, and the alternating combination with the middle phase negated. Compare what the two exponents come out to." },
    { text: "The two exponents are pi/2 and -pi/2, so the coefficients e^{i pi/2}=i and e^{-i pi/2}=-i are exact negatives of one another." },
    { text: "When the two coefficients are negatives, expand P(x) and watch the x² terms cancel. What remains is a purely imaginary constant, and its imaginary part is your answer." },
  ],
  solution: {
    steps: [
      { description: "The lesson's general degree-2 closed form is $P(x) = e^{i(\\phi_0+\\phi_1+\\phi_2)}x^2 - e^{i(\\phi_0-\\phi_1+\\phi_2)}(1-x^2)$." },
      { description: "With $\\phi_0=\\phi_2=0,\\ \\phi_1=\\pi/2$: the exponents are $\\pi/2$ and $-\\pi/2$, giving coefficients $i$ and $-i$." },
      { description: "$P(x) = i\\,x^2 - (-i)(1-x^2) = i x^2 + i(1-x^2) = i\\big(x^2+1-x^2\\big) = i$, a constant for every $x$, so $\\mathrm{Im}(P(x))=1$." },
    ],
    finalAnswer: "Im(P(x)) = 1 for every x (P(x) is identically i, a degree-0 constant despite d=2).",
  },
  explanation: {
    correctIdea: "The achievability theorem's degree bound is 'at most d', not 'exactly d': special phase choices can make the leading coefficient's two unit-modulus terms cancel, collapsing the achieved polynomial to a strictly lower degree.",
    whyCorrect: "This is exactly the lesson's degree-collapse worked example, verified directly on the platform's own Matrix/Complex classes: the x^2 coefficient (e^{i(phi0+phi1+phi2)}+e^{i(phi0-phi1+phi2)}) vanishes precisely when the two phases differ by pi, which phi1=pi/2 (with phi0=phi2=0) achieves.",
    whyWrong: ["Assuming the answer must depend on x (since d=2 'should' give a genuine quadratic) misses that the degree bound from the achievability theorem is only an upper bound."],
  },
};
