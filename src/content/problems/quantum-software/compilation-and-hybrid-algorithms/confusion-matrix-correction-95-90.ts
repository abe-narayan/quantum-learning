import type { NumericProblem } from "@/lib/problems/types";

// M = [[0.95, 0.10], [0.05, 0.90]]; columns sum to 1, as any confusion
// matrix built from conditional probabilities must.
const m00 = 0.95;
const m01 = 0.1;
const m10 = 0.05;
const m11 = 0.9;
const det = m00 * m11 - m01 * m10;

const pMeas0 = 0.3;
const pMeas1 = 0.7;

// p_true = M^{-1} p_meas
const pTrue0 = (m11 * pMeas0 - m01 * pMeas1) / det;
const pTrue1 = (-m10 * pMeas0 + m00 * pMeas1) / det;

if (Math.abs(pTrue0 + pTrue1 - 1) > 1e-9) {
  throw new Error("confusion-matrix-correction-95-90: corrected distribution should sum to 1.");
}
const forwardCheck0 = m00 * pTrue0 + m01 * pTrue1;
const forwardCheck1 = m10 * pTrue0 + m11 * pTrue1;
if (Math.abs(forwardCheck0 - pMeas0) > 1e-9 || Math.abs(forwardCheck1 - pMeas1) > 1e-9) {
  throw new Error("confusion-matrix-correction-95-90: M * p_true should reproduce p_meas.");
}

export const confusionMatrixCorrection9590: NumericProblem = {
  meta: {
    slug: "confusion-matrix-correction-95-90",
    title: "Correcting a Measured Distribution with a New Confusion Matrix",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["quantum-error-mitigation", "readout-error-mitigation", "confusion-matrix"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"],
  },
  question: {
    type: "numeric",
    prompt:
      "A device's calibration gives readout confusion matrix $M=\\begin{pmatrix}0.95&0.10\\\\0.05&0.90\\end{pmatrix}$. A circuit's raw, uncorrected measurement gives $\\vec p_{\\text{meas}}=(0.30,0.70)$. Using $\\vec p_{\\text{true}}=M^{-1}\\vec p_{\\text{meas}}$, what is the readout-corrected estimate of $P(\\text{true }1)$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: pTrue1,
    tolerance: 0.005,
    incorrectFeedback:
      "First find det(M) = (0.95)(0.90) − (0.10)(0.05), then use M⁻¹ = (1/det)[[0.90,−0.10],[−0.05,0.95]] applied to (0.30,0.70).",
    nearMisses: [
      { value: 0.7, feedback: "0.70 is the raw measured value. Readout correction exists precisely to undo the bias in it." },
      { value: 0.235294, tolerance: 0.005, feedback: "That is the corrected P(true 0), the other component. The two sum to 1." },
      { value: 0.645, tolerance: 0.005, feedback: "That applies M rather than M⁻¹, simulating a further round of readout noise instead of undoing it." },
    ],
  },
  hints: [
    { text: "det(M) = (0.95)(0.90) − (0.10)(0.05) = 0.855 − 0.005 = 0.850." },
    { text: "M⁻¹ = (1/0.850) × [[0.90, −0.10], [−0.05, 0.95]]." },
    { text: "p_true = M⁻¹ p_meas: the second component is (1/0.850) × (−0.05×0.30 + 0.95×0.70)." },
  ],
  solution: {
    steps: [
      { description: "Compute the determinant of M.", latex: "\\det M = (0.95)(0.90) - (0.10)(0.05) = 0.850" },
      { description: "Invert M using the standard 2×2 formula.", latex: "M^{-1} = \\frac{1}{0.850}\\begin{pmatrix}0.90&-0.10\\\\-0.05&0.95\\end{pmatrix}" },
      { description: "Apply M⁻¹ to the measured distribution.", latex: "\\vec p_{\\text{true}} = \\frac{1}{0.850}\\begin{pmatrix}0.90(0.30)-0.10(0.70)\\\\-0.05(0.30)+0.95(0.70)\\end{pmatrix} = \\frac{1}{0.850}\\begin{pmatrix}0.20\\\\0.65\\end{pmatrix} \\approx \\begin{pmatrix}0.235\\\\0.765\\end{pmatrix}" },
      { description: `Check: $M\\vec p_{\\text{true}} \\approx (0.95\\times0.235+0.10\\times0.765,\\ 0.05\\times0.235+0.90\\times0.765) \\approx (0.300, 0.700)$, reproducing $\\vec p_{\\text{meas}}$ and confirming the inversion.` },
    ],
    finalAnswer: `≈ ${pTrue1.toFixed(4)} (equivalently 0.65/0.85 = 13/17)`,
  },
  explanation: {
    correctIdea:
      "This applies the lesson's own confusion-matrix-inversion procedure to a different, less severe misread rate (10% of 1→0 instead of 15%) and a different raw measurement.",
    whyCorrect: "Inverting the 2×2 confusion matrix and applying it to p_meas undoes the misclassification exactly. Applying M back to the recovered p_true returns the original p_meas, which is the check that the inversion was set up correctly.",
    whyWrong: [
      "Reporting the raw measured value (0.70) instead of inverting M skips the point of readout correction. The raw number is precisely what the asymmetric misread rate biases.",
      "Applying M (instead of M⁻¹) to p_meas runs the correction backward, simulating what an even noisier measurement would look like rather than recovering the true distribution.",
    ],
  },
};
