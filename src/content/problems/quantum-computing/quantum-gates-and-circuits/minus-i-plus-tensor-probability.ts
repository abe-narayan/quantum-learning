import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

const minusI = new StateVector([new Complex(Math.SQRT1_2), new Complex(0, -Math.SQRT1_2)]);
const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const combined = minusI.tensor(plus);
const probabilityOf11 = combined.probabilities()[3];

export const minusIPlusTensorProbability: NumericProblem = {
  meta: {
    slug: "minus-i-plus-tensor-probability",
    title: "Measuring |−i⟩ ⊗ |+⟩",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/tensor-products",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["tensor-product", "complex-amplitudes", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/tensor-products"],
  },
  question: {
    type: "numeric",
    prompt:
      "Let $|{-i}\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle - i|1\\rangle)$ and $|+\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$. Compute $|{-i}\\rangle \\otimes |+\\rangle$, then find the probability of measuring $|11\\rangle$.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf11,
    tolerance: 0.01,
    incorrectFeedback: "Multiply the amplitudes on the |1⟩ term of each factor first, then take the squared magnitude of the product.",
  },
  hints: [
    { text: "The amplitude on |11⟩ in a tensor product is the product of each factor's amplitude on |1⟩." },
    { text: "|−i⟩'s amplitude on |1⟩ is $-i/\\sqrt2$; |+⟩'s amplitude on |1⟩ is $1/\\sqrt2$." },
    { text: "Multiply those two amplitudes, then square the magnitude of the result — the phase from $-i$ disappears once you square." },
  ],
  solution: {
    steps: [
      {
        description: "Identify each factor's amplitude on $|1\\rangle$.",
        latex: "(-i)|1\\rangle \\text{ amplitude } = -\\frac{i}{\\sqrt2}, \\qquad |+\\rangle \\text{ amplitude on } |1\\rangle = \\frac{1}{\\sqrt2}",
      },
      {
        description: "Multiply them to get the amplitude on $|11\\rangle$ in the tensor product.",
        latex: "c_{11} = \\left(-\\frac{i}{\\sqrt2}\\right)\\left(\\frac{1}{\\sqrt2}\\right) = -\\frac{i}{2}",
      },
      { description: "Apply the Born rule.", latex: "P(11) = \\left|-\\frac{i}{2}\\right|^2 = \\frac14" },
    ],
    finalAnswer: "$P(11) = 0.25$",
  },
  explanation: {
    correctIdea: "A tensor product's amplitude on a basis state is the product of each factor's amplitude on its own bit.",
    whyCorrect: "The complex phase $-i$ contributes to the amplitude but vanishes once the Born rule squares the magnitude.",
    whyWrong: [
      "Multiplying probabilities (1/2 × 1/2 = 1/4) happens to give the same number here, but only by coincidence — this state has a complex amplitude, and multiplying amplitudes first is the rule that generalizes correctly (it wouldn't coincidentally match once relative phases between terms actually matter, e.g. after interference).",
      "Forgetting to square the magnitude and reporting 1/2 (the magnitude of the amplitude, not the probability) skips the Born rule entirely.",
    ],
  },
};
