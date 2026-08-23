import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import { applyBitOracle, constantFunction } from "@/lib/quantum/oracles";
import type { NumericProblem } from "@/lib/problems/types";

function djProbabilityOfZero(f: (x: number) => 0 | 1, nInput: number): number {
  const zeros = StateVector.zero(nInput);
  const one = StateVector.basis(1, 1);
  let s = new StateVector(zeros.amplitudes.flatMap((a) => one.amplitudes.map((m) => a.mul(m))));
  for (let q = 0; q < s.numQubits; q++) s = applySingleQubitGate(s, HADAMARD, q);
  s = applyBitOracle(s, f);
  for (let q = 0; q < nInput; q++) s = applySingleQubitGate(s, HADAMARD, q);
  const probs = s.probabilities();
  let p0 = 0;
  for (let anc = 0; anc < 2; anc++) p0 += probs[anc];
  return p0;
}

const value = djProbabilityOfZero(constantFunction(0), 3);

export const djConstantFunctionAmplitude: NumericProblem = {
  meta: {
    slug: "dj-constant-function-amplitude",
    title: "Deutsch-Jozsa on a Constant Function, n=3",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["deutsch-jozsa"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"],
  },
  question: {
    type: "numeric",
    prompt: "Running Deutsch-Jozsa on the constant-0 function with n=3 input qubits, what is P(measuring |000⟩)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "For any constant function, every term in the sum (1/2ⁿ)Σₓ(−1)^f(x) has the same sign.",
  },
  hints: [
    { text: "f is constant, so (−1)^f(x) is the same for every x." },
    { text: "The sum (1/8)Σₓ(−1)^f(x) becomes (1/8)(±8) = ±1." },
    { text: "Probability is the squared amplitude." },
  ],
  solution: {
    steps: [{ description: "For constant f, the amplitude on |000⟩ is exactly ±1, so P(|000⟩)=1." }],
    finalAnswer: "P = 1.0",
  },
  explanation: {
    correctIdea: "Every constant function gives certainty of measuring the all-zero string — the defining signature Deutsch-Jozsa checks for.",
    whyCorrect: "This holds for any n, not just n=3 — verified directly against the engine's actual circuit execution.",
    whyWrong: ["Answering 0.5 would describe neither the constant nor balanced case correctly — both give a definite (0 or 1) probability, never something in between."],
  },
};
