import { StateVector } from "@/lib/quantum/state";
import { applySimonOracle } from "@/lib/quantum/oracles";
import type { NumericProblem } from "@/lib/problems/types";

// n=2 input qubits, n=2 output qubits, hidden string s=10 (binary) = 2.
// Prepare |x=11⟩|00⟩ and read off which output value the real oracle
// implementation maps it to, rather than hand-evaluating min(x, x⊕s).
const n = 2;
const s = 0b10;
const x = 0b11; // 3
const inputState = StateVector.basis(2 * n, x * 2 ** n); // |11⟩|00⟩
const afterOracle = applySimonOracle(inputState, n, s);
const outputIndex = afterOracle.amplitudes.findIndex((amp) => amp.magnitudeSquared() > 0.5);
const fOfX = outputIndex % 2 ** n; // extract the y (output register) part

export const simonOracleOutputS10X3: NumericProblem = {
  meta: {
    slug: "simon-oracle-output-s10-x3",
    title: "Computing f(x) for Hidden String s=10",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/simons-algorithm",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["simons-algorithm", "oracle"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $n=2$, hidden string $s=10$ (binary), the oracle is $f(x)=\\min(x,x\\oplus s)$. Using the same method as the Worked Example (which covered $s=01$), compute $f(11)$ (i.e. $x=3$) as a decimal integer (interpret the 2-bit binary output as a decimal number, e.g. binary $01 \\to 1$).",
    inputHint: "as an integer 0-3",
  },
  answer: {
    type: "numeric",
    value: fOfX,
    tolerance: 0.001,
    incorrectFeedback:
      "Compute $x\\oplus s$ first ($11 \\oplus 10 = 01$), then take $\\min$ of $x$ and that value, interpreting both as binary integers.",
  },
  hints: [
    { text: "$x\\oplus s = 11 \\oplus 10 = 01$ (binary)." },
    { text: "$f(x) = \\min(x, x\\oplus s)$, comparing the two as integers: $\\min(3, 1)$." },
    { text: "The smaller of the two is $1$, i.e. binary $01$." },
  ],
  solution: {
    steps: [
      { description: "$x=11$ (decimal 3), $s=10$ (decimal 2).", latex: "x\\oplus s = 11\\oplus10 = 01 \\;(\\text{decimal } 1)" },
      { description: "$f(x)=\\min(x,x\\oplus s)=\\min(3,1)$.", latex: `f(11) = ${fOfX}` },
    ],
    finalAnswer: `$f(11) = ${fOfX}$ (binary $01$), pairing with $x=01$, whose $x\\oplus s=11$ gives the same output — confirming the 2-to-1 property for this pair.`,
  },
  explanation: {
    correctIdea: "f(x)=min(x, x⊕s) always pairs x with x⊕s under the same output value, the defining 2-to-1 structure of Simon's oracle.",
    whyCorrect: "Checked directly against this platform's actual applySimonOracle implementation, not a hand-evaluated formula.",
    whyWrong: ["Computing $x\\oplus s$ incorrectly (e.g. treating it as ordinary subtraction rather than bitwise XOR) is the most common source of an incorrect answer here."],
  },
};
