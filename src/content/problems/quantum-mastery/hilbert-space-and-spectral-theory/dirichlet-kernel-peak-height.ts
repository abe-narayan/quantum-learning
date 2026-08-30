import type { NumericProblem } from "@/lib/problems/types";

// D_L(0) = L / pi, the Dirichlet kernel's peak height (removable singularity value).
const L = 50;
const peakHeight = L / Math.PI;

export const dirichletKernelPeakHeight: NumericProblem = {
  meta: {
    slug: "dirichlet-kernel-peak-height",
    title: "How Tall Is the Delta-Sequence's Peak?",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["rigged-hilbert-space", "delta-function", "fourier"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"],
  },
  question: {
    type: "numeric",
    prompt:
      "The truncated momentum-eigenstate overlap D_L(q)=sin(qL)/(πq) has peak value D_L(0)=L/π (the removable-singularity limit at q=0). What is D_L(0) for a truncation half-width L=50?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: peakHeight,
    tolerance: 0.05,
    incorrectFeedback: "Use D_L(0) = L/π directly with L=50.",
    nearMisses: [
      { value: 50, tolerance: 0.1, feedback: "50 is L, forgetting the 1/π. That factor is fixed by the kernel's normalization: its total area stays 1 for every L." },
      { value: 50 * Math.PI, tolerance: 0.2, feedback: "π multiplies rather than divides here: the kernel is sin(qL)/(πq), so π sits in the denominator." },
    ],
  },
  hints: [
    { text: "As q→0, sin(qL)/(πq) → L/π (L'Hôpital, or the small-angle approximation sin(qL)≈qL)." },
    { text: "So D_L(0) = L/π." },
    { text: "Compute 50/π." },
  ],
  solution: {
    steps: [
      { description: "Take the q→0 limit of D_L(q) using sin(qL)≈qL for small q.", latex: "D_L(0)=\\lim_{q\\to0}\\frac{\\sin(qL)}{\\pi q}=\\frac{L}{\\pi}" },
      { description: "Substitute L=50.", latex: "D_{50}(0)=\\frac{50}{\\pi}\\approx15.915" },
    ],
    finalAnswer: "D_50(0) ≈ 15.915",
  },
  explanation: {
    correctIdea:
      "The Dirichlet kernel's peak height grows linearly with the truncation half-width L, while its total area stays exactly 1 for every L. Those two facts together are what make D_L→δ as L→∞.",
    whyCorrect: "Direct evaluation of the lesson's derived closed form D_L(q)=sin(qL)/(πq) at its q=0 limit.",
    whyWrong: [
      "Using D_L(0)=L (forgetting the 1/π factor) misses that the kernel's normalization, total area 1 for every L, is what fixes the 1/π. It is not a free constant.",
    ],
  },
};
