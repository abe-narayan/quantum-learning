import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { spinObservableInXZPlane, correlationExpectation } from "@/lib/quantum/chsh";
import type { NumericProblem } from "@/lib/problems/types";

const bellPhiPlus = new StateVector([new Complex(Math.SQRT1_2), Complex.ZERO, Complex.ZERO, new Complex(Math.SQRT1_2)]);
const rho = pureStateDensityMatrix(bellPhiPlus);
const theta = 0.9;
const value = correlationExpectation(rho, spinObservableInXZPlane(theta), spinObservableInXZPlane(theta));

export const sameAxisPerfectCorrelation: NumericProblem = {
  meta: {
    slug: "same-axis-perfect-correlation",
    title: "E(a,a)=1 for Any Shared Measurement Axis",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["chsh", "correlation", "bell-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/the-chsh-inequality"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\Phi^+\\rangle$, using $E(a,b)=\\cos(\\theta_a-\\theta_b)$, find $E(a,a)$ when both parties measure at the same angle $\\theta=0.9$ radians.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "θ_a-θ_b = 0 whenever both angles are equal, regardless of what that shared angle actually is.",
    nearMisses: [
      {
        value: Math.cos(theta),
        tolerance: 0.005,
        feedback: "cos(0.9) uses the shared angle itself. The correlator depends on the difference θ_a − θ_b, which is 0 when both parties measure along the same axis.",
      },
      { value: 0, feedback: "Zero correlation is what you would get for axes a quarter turn apart. Here both angles are the same, so their difference vanishes." },
    ],
  },
  hints: [
    { text: "E(a,a) = cos(θ_a - θ_a)." },
    { text: "θ_a - θ_a = 0 for any value of θ_a." },
    { text: "The cosine of a vanishing angle takes its maximum value. That maximum is your answer, whatever the shared axis was." },
  ],
  solution: {
    steps: [{ description: "$E(a,a) = \\cos(\\theta-\\theta) = \\cos(0) = 1$, for any shared angle θ." }],
    finalAnswer: "E(a,a) = 1, regardless of which specific axis is chosen.",
  },
  explanation: {
    correctIdea: "Measuring both qubits of |Φ+⟩ along the same axis, whatever that axis is, always gives perfect correlation.",
    whyCorrect: "This generalizes Bell States and Entanglement's original Z-basis and X-basis observations to every possible shared axis at once.",
    whyWrong: ["Assuming the correlation depends on the specific angle 0.9 misses that only the difference θ_a−θ_b matters, and it's always 0 here."],
  },
};
