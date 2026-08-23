import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, purity } from "@/lib/quantum/densityMatrix";
import { reducedDensityMatrixQubit0 } from "@/lib/quantum/partialTrace";
import type { NumericProblem } from "@/lib/problems/types";

const psiMinus = new StateVector([Complex.ZERO, new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2), Complex.ZERO]);
const value = purity(reducedDensityMatrixQubit0(pureStateDensityMatrix(psiMinus)));

export const psiMinusPurityViaIdentity: NumericProblem = {
  meta: {
    slug: "psi-minus-purity-via-identity",
    title: "Reduced Purity of |Ψ−⟩ via the Boxed Identity",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["purity", "entanglement", "bell-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using $1-\\text{Tr}(\\rho_A^2)=2|ad-bc|^2$, find $\\text{Tr}(\\rho_A^2)$ for $|\\Psi^-\\rangle=\\frac{1}{\\sqrt2}(|01\\rangle-|10\\rangle)$ (here $a=d=0$, $b=\\frac{1}{\\sqrt2}$, $c=-\\frac{1}{\\sqrt2}$).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute ad-bc first (remember a=d=0 here), then apply the identity.",
  },
  hints: [
    { text: "ad = 0 since a=d=0 for |Ψ−⟩." },
    { text: "bc = (1/√2)(-1/√2) = -0.5." },
    { text: "ad-bc = 0-(-0.5) = 0.5, so |ad-bc|=0.5 — the maximal value." },
  ],
  solution: {
    steps: [
      { description: "$ad-bc = 0 - \\left(\\tfrac{1}{\\sqrt2}\\right)\\left(-\\tfrac{1}{\\sqrt2}\\right) = 0.5$." },
      { description: "$1-\\text{Tr}(\\rho_A^2) = 2(0.5)^2 = 0.5$, so $\\text{Tr}(\\rho_A^2)=0.5$." },
    ],
    finalAnswer: "Tr(ρ_A²) = 0.5 — |Ψ−⟩ is maximally entangled, just like the other three Bell states.",
  },
  explanation: {
    correctIdea: "|Ψ−⟩ has |ad-bc|=0.5, the maximum possible, giving the same maximally mixed reduced state as any Bell state.",
    whyCorrect: "This matches the fact that all four Bell states are maximally entangled, verified directly in this course's engine tests.",
    whyWrong: ["Forgetting the minus sign in |Ψ−⟩'s definition when computing bc would give ad-bc=0, incorrectly suggesting a product state."],
  },
};
