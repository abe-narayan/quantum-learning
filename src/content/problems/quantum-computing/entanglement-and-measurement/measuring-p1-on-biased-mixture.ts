import { Complex } from "@/lib/quantum/complex";
import { Matrix } from "@/lib/quantum/matrix";
import { computationalBasisDensityMatrix, densityMatrixMeasurementProbability } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const rho = new Matrix([
  [new Complex(0.75), Complex.ZERO],
  [Complex.ZERO, new Complex(0.25)],
]);
const p1 = computationalBasisDensityMatrix(1, 1);
const value = densityMatrixMeasurementProbability(rho, p1);

export const measuringP1OnBiasedMixture: NumericProblem = {
  meta: {
    slug: "measuring-p1-on-biased-mixture",
    title: "Measuring P₁ on a Biased Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["measurement", "born-rule"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"],
  },
  question: {
    type: "numeric",
    prompt: "For $\\rho=\\begin{pmatrix}0.75&0\\\\0&0.25\\end{pmatrix}$, find $p_1=\\text{Tr}(\\rho P_1)$ where $P_1=|1\\rangle\\langle1|$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "For a diagonal ρ, Tr(ρP₁) just picks out ρ's (1,1) diagonal entry.",
    nearMisses: [
      { value: 0.75, feedback: "0.75 is p₀, the weight on |0⟩. P₁ projects onto |1⟩, so it reads the other diagonal entry." },
    ],
  },
  hints: [
    { text: "P₁ projects onto |1⟩, so it is diag(0,1)." },
    { text: "ρP₁ zeroes out ρ's first row/column contribution, leaving only the (1,1) entry." },
    { text: "Tr(ρP₁) = ρ's own (1,1) entry, directly." },
  ],
  solution: {
    steps: [{ description: "For diagonal ρ and P₁=diag(0,1), Tr(ρP₁) is exactly ρ's (1,1) entry, 0.25." }],
    finalAnswer: "p₁ = 0.25",
  },
  explanation: {
    correctIdea: "Measuring a diagonal density matrix in the same basis it's diagonal in just reads off the corresponding diagonal entry.",
    whyCorrect: "This matches the intuitive reading of ρ=diag(0.75,0.25) as '75% chance of 0, 25% chance of 1.'",
    whyWrong: ["Answering 0.75 confuses P₀'s probability with P₁'s."],
  },
};
