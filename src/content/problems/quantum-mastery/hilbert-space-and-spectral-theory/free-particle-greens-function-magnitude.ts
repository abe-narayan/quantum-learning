import type { NumericProblem } from "@/lib/problems/types";

// G_0(x,x';E) = -(i/k) e^{ik|x-x'|}, |G_0| = 1/k, k = sqrt(2E).
const E = 8;
const k = Math.sqrt(2 * E);
const magnitude = 1 / k;

export const freeParticleGreensFunctionMagnitude: NumericProblem = {
  meta: {
    slug: "free-particle-greens-function-magnitude",
    title: "Magnitude of the Free-Particle Green's Function",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["greens-functions", "resolvent", "free-particle"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using G₀(x,x';E) = −(i/k)e^{ik|x−x'|} with k=√(2E), compute |G₀(x,x';E)| for E=8 (natural units). (Hint: |e^{iθ}|=1 for any real θ.)",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: magnitude,
    tolerance: 0.005,
    incorrectFeedback: "Since |e^{ik|x-x'|}|=1 exactly (a pure phase), |G₀|=|−i/k|=1/k. Compute k=√(2×8) first.",
    nearMisses: [
      { value: 0.0625, tolerance: 0.002, feedback: "1/k² squares the magnitude. |G₀| is itself a magnitude, so it is the reciprocal of k, not of k²." },
      { value: 4, feedback: "4 is k. The Green's function's magnitude is its reciprocal." },
      { value: 0.125, tolerance: 0.002, feedback: "0.125 is 1/(2k) or 1/E; k = √(2E) = 4, so the magnitude is 1/4." },
    ],
  },
  hints: [
    { text: "e^{ik|x-x'|} is a pure phase for real k, so its magnitude is exactly 1 regardless of x,x'." },
    { text: "So |G₀(x,x';E)| = |-i/k| = 1/k." },
    { text: "k = √(2E) = √16 = 4." },
  ],
  solution: {
    steps: [
      { description: "The phase factor has magnitude 1.", latex: "|e^{ik|x-x'|}|=1" },
      { description: "So the whole Green's function's magnitude is just 1/k.", latex: "|G_0|=\\left|\\frac{-i}{k}\\right|=\\frac1k" },
      { description: "Compute k from E=8.", latex: "k=\\sqrt{2E}=\\sqrt{16}=4 \\Rightarrow |G_0|=\\frac14=0.25" },
    ],
    finalAnswer: "|G₀(x,x';8)| = 0.25, independent of the specific x,x' (only |x-x'| would affect the phase, not the magnitude).",
  },
  explanation: {
    correctIdea:
      "The free-particle Green's function's magnitude depends only on E (through k), never on the specific positions — only its phase carries position information.",
    whyCorrect: "Direct consequence of |e^{iθ}|=1 for any real phase θ=k|x-x'|, applied to the boxed closed form derived in the lesson.",
    whyWrong: [
      "Computing |G₀| as 1/k² (squaring k rather than taking the reciprocal of k itself) confuses the Green's function's magnitude with a probability-density-like quantity — |G₀| is a magnitude, not a squared magnitude.",
    ],
  },
};
