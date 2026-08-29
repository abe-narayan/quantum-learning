import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, HADAMARD, PAULI_Z } from "@/lib/quantum/gates";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const start = StateVector.zero(2);
const afterFirstH = applySingleQubitGate(applySingleQubitGate(start, HADAMARD, 0), HADAMARD, 1);

// (a) Z on qubit 0 only -> |10>
const variantA = applySingleQubitGate(
  applySingleQubitGate(applySingleQubitGate(afterFirstH, PAULI_Z, 0), HADAMARD, 0),
  HADAMARD,
  1
);
// (b) Z on both qubits -> |11>
const variantB = applySingleQubitGate(
  applySingleQubitGate(
    applySingleQubitGate(applySingleQubitGate(afterFirstH, PAULI_Z, 0), PAULI_Z, 1),
    HADAMARD,
    0
  ),
  HADAMARD,
  1
);
// (c) skip Z entirely -> |00>
const variantC = applySingleQubitGate(applySingleQubitGate(afterFirstH, HADAMARD, 0), HADAMARD, 1);

// Sanity-check these are the distinct outcomes this problem's options describe.
if (variantA.probabilities()[2] < 0.999) throw new Error("variantA should concentrate on |10>");
if (variantB.probabilities()[3] < 0.999) throw new Error("variantB should concentrate on |11>");
if (variantC.probabilities()[0] < 0.999) throw new Error("variantC should concentrate on |00>");

export const whichVariantStillGives00: MultipleChoiceProblem = {
  meta: {
    slug: "which-variant-still-gives-00",
    title: "Which Variant of the Circuit Still Gives |00⟩?",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["interference", "phase", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The lesson's main derivation ($H\\otimes H$, $Z$ on qubit 1, $H\\otimes H$) concentrates onto $|01\\rangle$. Which of these alternatives instead concentrates back onto $|00\\rangle$, the same outcome as doing nothing between the two $H\\otimes H$ steps?",
    options: [
      { id: "a", text: "Apply $Z$ to qubit 0 instead of qubit 1." },
      { id: "b", text: "Apply $Z$ to both qubits instead of just one." },
      { id: "c", text: "Skip the middle $Z$ step entirely." },
      { id: "d", text: "Measure qubit 1 right after the middle step, then apply $H\\otimes H$ to the collapsed state." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "This concentrates onto $|10\\rangle$ instead (the previous problem in this set works this out directly).",
      b: "This concentrates onto $|11\\rangle$: $Z\\otimes Z$ turns $|+\\rangle\\otimes|+\\rangle$ into $|-\\rangle\\otimes|-\\rangle$, and $H|-\\rangle=|1\\rangle$ for both factors.",
      d: "Measuring partway through destroys the superposition needed for interference — you'd get a random definite outcome, not a guaranteed one, exactly the mistake the lesson's Common Mistakes section warns about.",
    },
    defaultIncorrectFeedback: "Work out what each alternative does to the intermediate $|+\\rangle\\otimes|+\\rangle$ state before the second $H\\otimes H$.",
  },
  hints: [
    { text: "Work out what each alternative leaves the intermediate $|+\\rangle\\otimes|+\\rangle$ looking like before the second $H\\otimes H$ layer." },
    { text: "A $Z$ turns $|+\\rangle$ into $|-\\rangle$, and $H|-\\rangle=|1\\rangle$, so each $Z$ moves one qubit's final outcome from 0 to 1." },
    { text: "$H^2=I$, so ask which alternative leaves the two Hadamard layers with nothing in between to undo." },
  ],
  solution: {
    steps: [
      { description: "With the $Z$ step skipped, the circuit is just $H\\otimes H$ followed immediately by $H\\otimes H$ again." },
      { description: "Since $H^2=I$, this is $(H\\otimes H)(H\\otimes H)|00\\rangle = (I\\otimes I)|00\\rangle = |00\\rangle$." },
    ],
    finalAnswer: "Skip the middle $Z$ step entirely.",
  },
  explanation: {
    correctIdea: "A phase gate is what causes the interference pattern to shift away from $|00\\rangle$; with no phase gate, the two Hadamard layers exactly undo each other.",
    whyCorrect: "A $Z$ on either qubit moves that qubit's final outcome from 0 to 1; removing the phase step entirely leaves the two Hadamard layers to cancel via $H^2=I$.",
    whyWrong: [
      { optionId: "a", text: "Moves the $Z$ to the other qubit, which concentrates onto $|10\\rangle$ rather than $|00\\rangle$." },
      { optionId: "b", text: "Phases both qubits, so both final outcomes flip and the state concentrates onto $|11\\rangle$." },
      { optionId: "d", text: "Measures partway through, which destroys the superposition the interference depends on. The outcome becomes random rather than certain." },
    ],
  },
};
