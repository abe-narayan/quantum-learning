import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, HADAMARD } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

// Alice encodes bit 0 in the Z basis (the lesson's own sweep used bit 1;
// this reruns the identical method for bit 0 through the real engine).
const aliceZState = StateVector.basis(1, 0);
const bobMeasuredInX = applySingleQubitGate(aliceZState, HADAMARD, 0);
const probabilityBobReadsOne = bobMeasuredInX.probabilities()[1];

export const bb84MismatchedBasisProbability: NumericProblem = {
  meta: {
    slug: "bb84-mismatched-basis-probability",
    title: "Bob's Mismatched-Basis Probability for Bit 0",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["bb84", "quantum-key-distribution", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  question: {
    type: "numeric",
    prompt:
      "Alice encodes bit $0$ in the Z basis, i.e. $|0\\rangle$. Bob measures in the X basis (applies $H$ first, then reads off computational-basis probabilities) — a mismatched-basis case. What is Bob's probability of reading $1$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityBobReadsOne,
    tolerance: 0.01,
    incorrectFeedback:
      "Apply $H$ to $|0\\rangle$ first (Bob's X-basis measurement), then read off the computational-basis probabilities of the result — don't skip the basis-change step.",
    nearMisses: [
      {
        value: 0,
        feedback:
          "0 is the matching-basis answer: if Bob had measured in Z he would read Alice's bit 0 every time. The X-basis measurement destroys that determinism.",
      },
      { value: 1, feedback: "Certainty of reading 1 would mean the mismatched basis reliably inverts Alice's bit. It does something worse for Eve and better for security: it randomizes it." },
    ],
  },
  hints: [
    { text: "Bob measuring in X means: apply $H$ to Alice's state, then measure in the computational basis." },
    { text: "$H|0\\rangle = |+\\rangle$." },
    { text: "$|+\\rangle$ has equal probability on both outcomes." },
  ],
  solution: {
    steps: [
      { description: "Alice's state: $|0\\rangle$ (Z-basis encoding of bit 0)." },
      { description: "Bob's X-basis measurement applies $H$ first.", latex: "H|0\\rangle = |+\\rangle = \\tfrac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)" },
      { description: "Reading off computational-basis probabilities of $|+\\rangle$ gives an even split.", latex: `P(1) = ${probabilityBobReadsOne.toFixed(2)}` },
    ],
    finalAnswer: `$P(1) = ${probabilityBobReadsOne.toFixed(2)}$ — a mismatched basis destroys all information about Alice's bit, exactly as the lesson's mismatch case derives.`,
  },
  explanation: {
    correctIdea: "A mismatched basis always gives a uniformly random result (probability 1/2 on each outcome), regardless of which specific bit Alice encoded.",
    whyCorrect: "This is the same mismatch mechanism the lesson derives for bit 1 (Z/X and X/Z combinations), just rerun independently for bit 0 through the real engine.",
    whyWrong: [
      "Answering 0 or 1 (certainty) confuses this with the matching-basis case — Bob's basis here (X) does not match Alice's encoding basis (Z).",
    ],
  },
};
