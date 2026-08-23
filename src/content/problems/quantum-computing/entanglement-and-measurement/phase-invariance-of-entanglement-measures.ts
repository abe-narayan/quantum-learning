import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { entanglementEntropy, concurrenceOfPureState } from "@/lib/quantum/entanglement";
import type { NumericProblem } from "@/lib/problems/types";

const state = new StateVector([
  Complex.fromPolar(Math.sqrt(0.5), 0),
  Complex.ZERO,
  Complex.ZERO,
  Complex.fromPolar(Math.sqrt(0.5), Math.PI / 6),
]);
const value = concurrenceOfPureState(state);
const entropy = entanglementEntropy(state);
if (Math.abs(entropy - 1) > 1e-9) {
  throw new Error("phaseInvarianceOfEntanglementMeasures: expected entropy exactly 1 bit, same as any Bell state.");
}

export const phaseInvarianceOfEntanglementMeasures: NumericProblem = {
  meta: {
    slug: "phase-invariance-of-entanglement-measures",
    title: "A Relative Phase Doesn't Change Concurrence or Entropy",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["concurrence", "entanglement-entropy", "capstone"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"],
  },
  question: {
    type: "numeric",
    prompt:
      "Compute the concurrence of $|\\psi'\\rangle=\\sqrt{0.5}|00\\rangle+\\sqrt{0.5}\\,e^{i\\pi/6}|11\\rangle$.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Concurrence uses |ad-bc|, and a phase on d only changes its phase, not its magnitude — compare to an ordinary Bell state.",
  },
  hints: [
    { text: "a=√0.5, d=√0.5·e^(iπ/6), b=c=0." },
    { text: "|ad-bc|=|ad|=√0.5·√0.5=0.5, regardless of d's phase." },
    { text: "C=2×0.5." },
  ],
  solution: {
    steps: [
      { description: "$|ad-bc|=|a||d|=\\sqrt{0.5}\\times\\sqrt{0.5}=0.5$ — the phase $e^{i\\pi/6}$ doesn't affect the magnitude." },
      { description: "$C=2\\times0.5=1$." },
    ],
    finalAnswer: "C = 1, exactly the same as an ordinary |Φ+⟩ Bell state (phase 0) — confirming the phase doesn't affect concurrence.",
  },
  explanation: {
    correctIdea: "Concurrence depends only on the magnitude |ad-bc|, and multiplying by a unit-magnitude phase factor doesn't change any magnitude.",
    whyCorrect: "This state's entanglement entropy is also exactly 1 bit (verified directly), matching a Bell state in every entanglement measure this course built.",
    whyWrong: ["Expecting a different value because of the phase confuses what determines entanglement (amplitude magnitudes) with what determines the state's full description (magnitudes and phases together)."],
  },
};
