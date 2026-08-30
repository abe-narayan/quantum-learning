import type { NumericProblem } from "@/lib/problems/types";

export const crossBasisProbability: NumericProblem = {
  meta: {
    slug: "cross-basis-probability",
    title: "A Cross-Basis Measurement Probability",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["interference", "superposition"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\psi\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+e^{i\\varphi}|1\\rangle)$ with $\\varphi=\\pi/3$, compute $P(+)=|\\langle+|\\psi\\rangle|^2$ by expanding the overlap yourself.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.75,
    tolerance: 0.01,
    incorrectFeedback: "The overlap ⟨+|ψ⟩ is a complex number, and its squared modulus is not the square of its real part alone. Write ⟨+| out in the computational basis, take the inner product term by term, then multiply the result by its own conjugate.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is P(−), which uses (1 − cos φ)/2. The two outcomes sum to 1; check which sign the |+⟩ overlap carries." },
      { value: 0.5, feedback: "0.5 is the φ = π/2 case, where the interference term vanishes. At φ = π/3 the cosine is positive, so P(+) rises above a half." },
      { value: Math.PI / 3, tolerance: 0.01, feedback: "You used φ itself where the expansion leaves cos φ. The angle enters only through the exponential, and the conjugate product converts it into a cosine." },
    ],
  },
  hints: [
    { text: "$P(+)$ is the squared overlap of the state with $|+\\rangle$, so nothing can be substituted until $\\langle+|$ is written out in the computational basis." },
    { text: "Form $\\langle+|\\psi\\rangle$ term by term. Each surviving term picks up one factor of $1/\\sqrt2$ from $|+\\rangle$ and one from $|\\psi\\rangle$." },
    { text: "The overlap comes out as $(1+e^{i\\varphi})/2$, which is complex. Its squared modulus is that number times its own conjugate, and expanding that product is where a cosine of $\\varphi$ appears." },
  ],
  solution: {
    steps: [
      { description: "Write $\\langle+| = \\tfrac{1}{\\sqrt2}(\\langle0|+\\langle1|)$ and take the overlap term by term.", latex: "\\langle+|\\psi\\rangle = \\tfrac12\\left(1+e^{i\\varphi}\\right)" },
      { description: "Multiply by the conjugate to get the squared modulus; the two cross terms combine into a cosine.", latex: "|\\langle+|\\psi\\rangle|^2 = \\tfrac14\\left(1+e^{i\\varphi}\\right)\\left(1+e^{-i\\varphi}\\right) = \\frac{1+\\cos\\varphi}{2}" },
      { description: "Only now substitute $\\varphi=\\pi/3$, for which the cosine is $0.5$.", latex: "P(+) = \\frac{1+0.5}{2} = 0.75" },
    ],
    finalAnswer: "$P(+) = 0.75$",
  },
  explanation: {
    correctIdea: "The cross-basis probability is the squared modulus of a complex overlap, and the interference term is the cross product of the two basis amplitudes.",
    whyCorrect: "Expanding $(1+e^{i\\varphi})(1+e^{-i\\varphi})$ leaves $2+2\\cos\\varphi$, so the cosine is not an extra ingredient: it is what the conjugate product of the two amplitudes reduces to. At $\\varphi=\\pi/3$ that term is positive, so the $|+\\rangle$ outcome beats an even split.",
    whyWrong: ["Using φ itself instead of cos(φ) in the formula is a common substitution error."],
  },
};
