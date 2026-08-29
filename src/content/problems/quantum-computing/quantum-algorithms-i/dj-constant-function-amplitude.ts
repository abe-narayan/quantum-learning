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
    incorrectFeedback: "For a constant function, every term in the final interference sum carries the same sign, so nothing cancels. If you answered a half, you may be picturing a single-qubit superposition rather than the fully constructive interference happening here.",
    nearMisses: [
      { value: 0, feedback: "Zero is the balanced-function answer: there the ±1 terms cancel in pairs. A constant function makes every term agree in sign, so they add rather than cancel." },
      { value: 1 / 8, tolerance: 0.005, feedback: "1/8 is 2⁻ⁿ, the probability of |000⟩ in the uniform superposition before the oracle and the final Hadamards. The interference is what concentrates all of it on one string." },
    ],
  },
  hints: [
    { text: "Ask what the oracle does when f is constant: it applies one overall sign to the whole superposition, the same for every input x." },
    { text: "The amplitude on the all-zeros string is the normalized sum 2⁻ⁿ Σₓ(-1)^f(x). With f constant, every term in that sum carries the same sign." },
    { text: "All 2ⁿ terms add coherently, so the amplitude reaches the largest magnitude it possibly can. Square it to get the probability." },
  ],
  solution: {
    steps: [{ description: "For constant f, the amplitude on |000⟩ is exactly ±1, so P(|000⟩)=1." }],
    finalAnswer: "P = 1.0",
  },
  explanation: {
    correctIdea: "Every constant function gives certainty of measuring the all-zero string, the defining signature Deutsch-Jozsa checks for.",
    whyCorrect: "This holds for any n, not just n=3, verified directly against the engine's actual circuit execution.",
    whyWrong: ["Answering 0.5 would describe neither the constant nor balanced case correctly: both give a definite (0 or 1) probability, never something in between."],
  },
};
