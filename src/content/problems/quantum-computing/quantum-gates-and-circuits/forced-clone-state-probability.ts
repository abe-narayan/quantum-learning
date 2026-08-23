import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

// If a hypothetical device U clones |0> and |1> correctly, linearity forces
// U(|i>|0>) = (1/sqrt2)(U(|00>) + i*U(|10>)) = (1/sqrt2)(|00> + i|11>),
// where |i> = (|0>+i|1>)/sqrt2. This is the exact state that gets forced,
// computed the same way the lesson's own |+> and |-> cases are.
const forcedState = new StateVector([
  new Complex(Math.SQRT1_2),
  Complex.ZERO,
  Complex.ZERO,
  new Complex(0, Math.SQRT1_2),
]);
const probabilityOf11 = forcedState.probabilities()[3];

export const forcedCloneStateProbability: NumericProblem = {
  meta: {
    slug: "forced-clone-state-probability",
    title: "What Linearity Forces for an |i⟩ Input",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["no-cloning", "linearity", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"],
  },
  question: {
    type: "numeric",
    prompt:
      "Suppose a device $U$ correctly clones $|0\\rangle$ and $|1\\rangle$: $U(|0\\rangle\\otimes|0\\rangle)=|0\\rangle\\otimes|0\\rangle$ and $U(|1\\rangle\\otimes|0\\rangle)=|1\\rangle\\otimes|1\\rangle$. By linearity, what does $U$ produce on the input $|i\\rangle\\otimes|0\\rangle$, where $|i\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+i|1\\rangle)$? Compute the probability of measuring \"11\" on the two output qubits of that forced state.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf11,
    tolerance: 0.01,
    incorrectFeedback:
      "Expand $U(|i\\rangle\\otimes|0\\rangle)$ using linearity first — it's a fixed combination of the two already-known outputs $U(|00\\rangle)$ and $U(|10\\rangle)$, not something new $U$ gets to choose.",
  },
  hints: [
    { text: "Write $|i\\rangle\\otimes|0\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+i|1\\rangle)\\otimes|0\\rangle = \\frac{1}{\\sqrt2}(|00\\rangle+i|10\\rangle)$." },
    { text: "Apply $U$ term by term using linearity: $U$ is already fixed to act as $U(|00\\rangle)=|00\\rangle$ and $U(|10\\rangle)=|11\\rangle$." },
    { text: "The forced output is $\\frac{1}{\\sqrt2}(|00\\rangle+i|11\\rangle)$. Square the magnitude of the $|11\\rangle$ coefficient." },
  ],
  solution: {
    steps: [
      {
        description: "Expand the input using linearity of the tensor product.",
        latex: "|i\\rangle\\otimes|0\\rangle = \\frac{1}{\\sqrt2}(|00\\rangle + i|10\\rangle)",
      },
      {
        description: "Apply $U$ term by term, using the two facts already assumed about $U$.",
        latex: "U(|i\\rangle\\otimes|0\\rangle) = \\frac{1}{\\sqrt2}\\big(U(|00\\rangle) + i\\,U(|10\\rangle)\\big) = \\frac{1}{\\sqrt2}(|00\\rangle + i|11\\rangle)",
      },
      {
        description: "The $|11\\rangle$ coefficient is $\\frac{i}{\\sqrt2}$; its squared magnitude is the probability of measuring 11.",
        latex: `P(11) = \\left|\\frac{i}{\\sqrt2}\\right|^2 = ${probabilityOf11.toFixed(3)}`,
      },
    ],
    finalAnswer: `$P(11) = ${probabilityOf11.toFixed(2)}$`,
  },
  explanation: {
    correctIdea:
      "Linearity doesn't just forbid perfect cloning in the abstract — it pins down exactly what state a would-be cloner is forced into for every superposition input, once its behavior on the basis states is fixed.",
    whyCorrect:
      "$U(|00\\rangle)=|00\\rangle$ and $U(|10\\rangle)=|11\\rangle$ together with linearity leave no freedom in what $U(|i\\rangle\\otimes|0\\rangle)$ can be — it's a fixed superposition of $|00\\rangle$ and $|11\\rangle$, an entangled state, not two independent copies of $|i\\rangle$.",
    whyWrong: [
      "Correct cloning of $|i\\rangle$ would require the product state $|i\\rangle\\otimes|i\\rangle$, which has nonzero amplitude on all four basis states, not just $|00\\rangle$ and $|11\\rangle$ — the forced state and the required state are not the same.",
    ],
  },
};
