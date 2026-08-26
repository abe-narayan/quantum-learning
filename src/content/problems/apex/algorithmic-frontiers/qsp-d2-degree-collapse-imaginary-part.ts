import type { NumericProblem } from "@/lib/problems/types";

export const qspD2DegreeCollapseImaginaryPart: NumericProblem = {
  meta: {
    slug: "qsp-d2-degree-collapse-imaginary-part",
    title: "When a Degree-2 QSP Sequence Collapses to a Constant",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/quantum-signal-processing",
    difficulty: "advanced",
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
      "With phi0=phi2=0, phi1=pi/2, the two exponents in the general formula are phi0+phi1+phi2=pi/2 and phi0-phi1+phi2=-pi/2, so e^{i pi/2}=i and e^{-i pi/2}=-i are exact negatives of each other. The x^2 pieces then cancel: P(x) = i x^2 - (-i)(1-x^2) = i x^2 + i - i x^2 = i for every x, so Im(P(x)) = 1.",
  },
  hints: [
    { text: "Plug phi0=0, phi1=pi/2, phi2=0 into the general d=2 formula's two exponents: phi0+phi1+phi2 and phi0-phi1+phi2." },
    { text: "e^{i pi/2}=i and e^{-i pi/2}=-i are exact negatives of one another." },
    { text: "When the two coefficients are negatives, the x^2 terms cancel exactly: i x^2 - (-i)(1-x^2) = i x^2 + i - i x^2 = i, independent of x." },
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
