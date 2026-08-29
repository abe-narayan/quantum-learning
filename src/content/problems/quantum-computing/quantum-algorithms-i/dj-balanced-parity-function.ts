import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import { applyBitOracle, balancedFunction } from "@/lib/quantum/oracles";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

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

const value = djProbabilityOfZero(balancedFunction(0b11), 2);
if (Math.abs(value) > 1e-9) throw new Error("djBalancedParityFunction: expected exactly 0 for a balanced function.");

export const djBalancedParityFunction: MultipleChoiceProblem = {
  meta: {
    slug: "dj-balanced-parity-function",
    title: "Deutsch-Jozsa on a Balanced Parity Function",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["deutsch-jozsa"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For f(x) = parity of both bits of a 2-bit input (a balanced function), what is P(measuring |00⟩) after running Deutsch-Jozsa?",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "0.25" },
      { id: "c", text: "0.5" },
      { id: "d", text: "1" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "0.25 would be the 'no interference at all' guess — but Deutsch-Jozsa's interference forces an exact 0 or exact 1, never an intermediate value.",
      c: "0.5 isn't a possible outcome here — the balanced/constant promise rules out any value strictly between 0 and 1.",
      d: "P=1 is the constant-function outcome — this f is balanced, not constant.",
    },
    defaultIncorrectFeedback: "For a genuinely balanced function, the ± terms in the amplitude sum cancel exactly.",
  },
  hints: [
    { text: "Parity is a standard balanced function: two inputs give 0, two give 1." },
    { text: "The amplitude on |00⟩ is (1/4)Σₓ(−1)^f(x)." },
    { text: "With two +1 terms and two −1 terms, the sum is exactly 0." },
  ],
  solution: {
    steps: [{ description: "Balanced f gives exactly 0 amplitude on |00⟩, hence P=0." }],
    finalAnswer: "P = 0",
  },
  explanation: {
    correctIdea: "Deutsch-Jozsa's derivation guarantees exactly 0 probability on |0...0⟩ for any balanced function, this one included.",
    whyCorrect: "Verified directly against the engine's actual circuit execution, not just the general formula.",
    whyWrong: [
      { optionId: "b", text: "The no-interference guess, as if the four outcomes were equally likely. Deutsch-Jozsa's interference drives the answer to one end or the other." },
      { optionId: "c", text: "An intermediate value the promise rules out. Under constant-or-balanced, the amplitude on |00⟩ is all or nothing." },
      { optionId: "d", text: "The constant-function outcome. Parity is balanced, so the ± terms cancel rather than reinforce." },
    ],
  },
};
