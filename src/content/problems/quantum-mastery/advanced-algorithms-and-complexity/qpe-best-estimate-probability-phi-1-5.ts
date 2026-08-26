import type { NumericProblem } from "@/lib/problems/types";

function closedFormProb(phi: number, m: number, t: number): number {
  const N = 2 ** t;
  const eps = phi - m / N;
  const num = Math.sin(Math.PI * eps * N);
  const den = Math.sin(Math.PI * eps);
  return (1 / (N * N)) * (num * num) / (den * den);
}

const phi = 1 / 5;
const t = 4;
const N = 2 ** t;
const b = Math.round(phi * N);
const value = closedFormProb(phi, b, t);

export const qpeBestEstimateProbabilityPhi15: NumericProblem = {
  meta: {
    slug: "qpe-best-estimate-probability-phi-1-5",
    title: "QPE Success Probability for φ=1/5, t=4",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["phase-estimation", "closed-form"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth"],
  },
  question: {
    type: "numeric",
    prompt: "For φ=1/5 with t=4 precision qubits (N=16), use the lesson's derived closed form P(m) = (1/N²)sin²(πεN)/sin²(πε), ε=φ−m/N, to compute P(b) where b is the nearest integer to φN.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "First find b=round(16/5)=3 and δ=16/5−3=0.2, then plug ε=δ/N=0.0125 and εN=δ=0.2 into the closed form.",
  },
  hints: [
    { text: "φN = 16/5 = 3.2, so b = round(3.2) = 3, and δ = φN − b = 0.2." },
    { text: "ε = φ − b/N = δ/N = 0.2/16 = 0.0125." },
    { text: "Compute (1/16²)·sin²(π·0.2)/sin²(π·0.0125)." },
  ],
  solution: {
    steps: [
      { description: "N=16, φN=3.2, so b=3 and δ=0.2." },
      { description: "ε=δ/N=0.0125; εN=δ=0.2." },
      { description: "P(b) = (1/256)·sin²(0.2π)/sin²(0.0125π) ≈ (1/256)·0.345491/0.001541 ≈ 0.8756." },
    ],
    finalAnswer: `≈${value.toFixed(4)}`,
  },
  explanation: {
    correctIdea: "The closed-form probability formula applies to any phase, exactly representable or not, and gives a specific, checkable number.",
    whyCorrect: "This value comfortably exceeds the worst-case 4/π²≈0.405 guarantee, exactly as expected since δ=0.2 is well short of the worst case δ=0.5.",
    whyWrong: ["Using the 4/π² floor itself as the answer confuses the guaranteed minimum with this specific phase's actual (higher) success probability."],
  },
};
