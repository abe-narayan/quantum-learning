import { createGrid } from "@/lib/quantum/wavefunction";
import { infiniteSquareWellEigenstate } from "@/lib/quantum/potentials";
import type { NumericProblem } from "@/lib/problems/types";

const grid = createGrid(1024, 8 / 1024);
const halfWidth = 1;
const psi2 = infiniteSquareWellEigenstate(grid, 2, halfWidth);
const psi4 = infiniteSquareWellEigenstate(grid, 4, halfWidth);
const overlap = psi2.innerProduct(psi4).re;

export const infiniteWellOrthogonalityCheck: NumericProblem = {
  meta: {
    slug: "infinite-well-orthogonality-check",
    title: "Predict the Overlap of Two Different Eigenstates",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["sturm-liouville", "orthogonality"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"],
  },
  question: {
    type: "numeric",
    prompt:
      "The infinite well's n=2 and n=4 eigenstates (both eigenfunctions of the same Sturm-Liouville problem, different eigenvalues) are numerically overlapped via innerProduct(). What value does the Sturm-Liouville orthogonality theorem predict this should be, to within numerical precision?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 1e-6,
    incorrectFeedback:
      "This is exactly the theorem's orthogonality prediction — ψ₂ and ψ₄ belong to different eigenvalues of the same Sturm-Liouville problem (w=1), so ∫wψ₂ψ₄dx must be zero.",
  },
  hints: [
    { text: "ψ₂ and ψ₄ are eigenfunctions of the same operator with different eigenvalues (E₂≠E₄)." },
    { text: "The Sturm-Liouville orthogonality theorem applies to ANY two eigenfunctions with different eigenvalues, not just adjacent n values." },
    { text: "The predicted overlap is exactly zero (up to floating-point roundoff)." },
  ],
  solution: {
    steps: [
      {
        description: "n=2 and n=4 have different eigenvalues E₂≠E₄ of the same Sturm-Liouville problem (p=w=1, q=0, Dirichlet BCs).",
      },
      {
        description: "The orthogonality theorem derived in the lesson applies regardless of which two distinct eigenvalues are chosen.",
        latex: "\\int_{-a}^{a} w(x)\\,\\psi_2(x)\\psi_4(x)\\,dx = 0",
      },
    ],
    finalAnswer: "0 (confirmed numerically to machine precision by this platform's real innerProduct computation).",
  },
  explanation: {
    correctIdea:
      "Orthogonality isn't special to adjacent quantum numbers or to any particular pair — it holds for every pair of distinct eigenvalues of the same self-adjoint Sturm-Liouville problem.",
    whyCorrect: `Directly verified: this platform's real infiniteSquareWellEigenstate/innerProduct computation gives an overlap of ${overlap.toExponential(3)} for n=2, n=4 (halfWidth=1), consistent with exactly 0 up to floating-point roundoff.`,
    whyWrong: [
      "Expecting a nonzero overlap because n=2 and n=4 are 'far apart' misunderstands the theorem — orthogonality is exact for any two distinct eigenvalues, not a matter of degree that fades with the gap between quantum numbers.",
    ],
  },
};
