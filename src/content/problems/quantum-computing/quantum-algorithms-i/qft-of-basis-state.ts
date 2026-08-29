import { StateVector } from "@/lib/quantum/state";
import { quantumFourierTransform } from "@/lib/quantum/qft";
import type { NumericProblem } from "@/lib/problems/types";

const result = quantumFourierTransform(StateVector.basis(2, 2)); // j=2, n=2
const value = result.amplitudes[3].im;

export const qftOfBasisState: NumericProblem = {
  meta: {
    slug: "qft-of-basis-state",
    title: "The Imaginary Part of QFT|10⟩'s Last Amplitude",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["qft"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"],
  },
  question: {
    type: "numeric",
    prompt: "For n=2, compute QFT|10⟩ (j=2) using the direct DFT formula, and give the imaginary part of the amplitude on |11⟩ (k=3).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Use QFT|j⟩=(1/√N)Σₖ e^{2πijk/N}|k⟩ with j=2, N=4, k=3.",
    nearMisses: [
      { value: -0.5, feedback: "−0.5 is the amplitude itself. The question asks for its imaginary part, and this amplitude is purely real." },
      { value: 0.5, feedback: "Check the phase: e^{3πi} reduces to e^{iπ} = −1, so the amplitude is −0.5. Either way, the question asks for the imaginary part." },
    ],
  },
  hints: [
    { text: "The k=3 term's phase is e^{2πi(2)(3)/4} = e^{3πi}." },
    { text: "e^{3πi} = e^{iπ} = −1 (since 3π and π differ by 2π)." },
    { text: "The amplitude is (1/2)(−1) = −0.5, which is purely real." },
  ],
  solution: {
    steps: [
      { description: "Phase: e^{2πi(2)(3)/4}=e^{3πi}=e^{iπ}=−1 (angles are mod 2π)." },
      { description: "Amplitude: (1/2)(−1) = −0.5 + 0i." },
    ],
    finalAnswer: "Imaginary part = 0",
  },
  explanation: {
    correctIdea: "This particular amplitude comes out purely real (−0.5), so its imaginary part is exactly 0.",
    whyCorrect: "e^{3πi} reduces to e^{iπ}=−1 exactly, since phases are only defined mod 2π.",
    whyWrong: ["Forgetting that 3π and π give the same complex exponential (differing by a full 2π turn) leads to an incorrect nonzero imaginary part."],
  },
};
