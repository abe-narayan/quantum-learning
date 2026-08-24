import { T_GATE, PAULI_Z } from "@/lib/quantum/gates";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const t2 = T_GATE.mul(T_GATE);
const t4 = t2.mul(t2);
if (!t4.equals(PAULI_Z, 1e-9)) {
  throw new Error("t-fourth-power-equals-z: expected T^4 to equal Z exactly.");
}

export const tFourthPowerEqualsZ: MultipleChoiceProblem = {
  meta: {
    slug: "t-fourth-power-equals-z",
    title: "Is T·T·T·T a Valid Decomposition of Z?",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["universal-quantum-computation", "clifford-group", "t-gate"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The lesson notes $T^2=S$ and $S^2=Z$. Is the four-gate sequence $T\\cdot T\\cdot T\\cdot T$ (applying $T$ four times) a valid decomposition of the Pauli $Z$ gate?",
    options: [
      { id: "a", text: "Yes — $T^4=Z$ exactly, not just up to global phase" },
      { id: "b", text: "Yes, but only up to an unavoidable global phase factor" },
      { id: "c", text: "No — four applications of $T$ give $S$, not $Z$" },
      { id: "d", text: "No — $T$ has infinite order, so no finite power of $T$ equals any Pauli gate" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "No phase tolerance is even needed here: $T=\\text{diag}(1,e^{i\\pi/4})$, so $T^4=\\text{diag}(1,e^{i\\pi})=\\text{diag}(1,-1)$, which is the Z matrix exactly, entry for entry.",
      c: "$T^2=S$ is only two applications; $T^4=(T^2)^2=S^2=Z$ needs all four.",
      d: "T is diagonal with a rational-multiple-of-$\\pi$ phase ($\\pi/4$), so it has finite order: $T^8=I$ exactly (checked directly: $\\text{diag}(1,e^{i\\pi/4})^8=\\text{diag}(1,e^{i2\\pi})=\\text{diag}(1,1)=I$).",
    },
    defaultIncorrectFeedback:
      "Use $T=\\text{diag}(1,e^{i\\pi/4})$ directly: raising the phase entry to the 4th power gives $e^{i\\pi}=-1$, which is exactly Z's second diagonal entry.",
  },
  hints: [
    { text: "T is diagonal: $T=\\text{diag}(1,e^{i\\pi/4})$, so $T^k=\\text{diag}(1,e^{ik\\pi/4})$ for any power $k$." },
    { text: "At $k=4$: the phase entry becomes $e^{i4\\pi/4}=e^{i\\pi}=-1$." },
    { text: "$\\text{diag}(1,-1)$ is exactly the Z matrix — an exact match, no global-phase tolerance required." },
  ],
  solution: {
    steps: [
      { description: "T is diagonal, $T=\\text{diag}(1,e^{i\\pi/4})$, so $T^k=\\text{diag}(1,e^{ik\\pi/4})$." },
      { description: "At $k=4$: $e^{i4\\pi/4}=e^{i\\pi}=-1$, so $T^4=\\text{diag}(1,-1)$.", latex: "T^4 = \\text{diag}(1,-1) = Z" },
      { description: "This matches the lesson's own $T^2=S$, $S^2=Z$ chain: $T^4=(T^2)^2=S^2=Z$, and this platform's own T_GATE and PAULI_X-style matrix objects confirm $T^4$ equals Z's matrix exactly (to machine precision), not merely up to phase." },
    ],
    finalAnswer: "(a) Yes — $T^4=Z$ exactly",
  },
  explanation: {
    correctIdea: "T's phase angle ($\\pi/4$) is a rational multiple of $\\pi$, so finite integer powers of T land exactly on other named gates: $T^2=S$, $T^4=Z$, $T^8=I$.",
    whyCorrect: "Diagonal unitary powers just raise the phase entry to that power; $e^{i\\pi/4}$ raised to the 4th power is exactly $e^{i\\pi}=-1$, Z's second diagonal entry, with no rounding or phase ambiguity involved.",
    whyWrong: [
      "Claiming T has infinite order misreads T's angle as irrational; $\\pi/4$ is a rational multiple of $\\pi$, so T has finite order (8), unlike a generic single-qubit rotation.",
      "Stopping at $T^2=S$ instead of going to the fourth power under-applies the given identity chain.",
    ],
  },
};
