import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD } from "@/lib/quantum/gates";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { dephasingChannel } from "@/lib/quantum/openSystems";
import { runNoisyCircuit } from "@/lib/quantum/noisyCircuitSimulation";
import type { NumericProblem } from "@/lib/problems/types";

const zero = new StateVector([Complex.ONE, Complex.ZERO]);
const rho0 = pureStateDensityMatrix(zero);
const result = runNoisyCircuit(rho0, [HADAMARD, HADAMARD], dephasingChannel(0.2));
const value = result.get(0, 0).re;

export const hhWithDephasingP0: NumericProblem = {
  meta: {
    slug: "hh-with-dephasing-p0",
    title: "P(0) After a Noisy H,H Circuit",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/noise-simulation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["noise-simulation"],
    prerequisites: ["quantum-software/simulating-quantum-systems/noise-simulation"],
  },
  question: {
    type: "numeric",
    prompt: "Running H then H (ideally identity) on |0⟩, with dephasing (λ=0.2) interleaved after each gate, what is the resulting P(0)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "This is exactly the lesson's own worked example — recall the specific P(0) value it reports.",
  },
  hints: [
    { text: "Without noise, H,H=I exactly, giving P(0)=1." },
    { text: "With dephasing interleaved, the circuit no longer returns perfectly to |0⟩." },
    { text: "The lesson's worked example reports P(0)≈0.9." },
  ],
  solution: {
    steps: [{ description: "With dephasing (λ=0.2) interleaved after each H, P(0)≈0.9, not the ideal 1.0." }],
    finalAnswer: "≈0.9",
  },
  explanation: {
    correctIdea: "This directly reproduces the lesson's central numerical demonstration of noise degrading an otherwise-perfect identity circuit.",
    whyCorrect: "Matches runNoisyCircuit's own computed output.",
    whyWrong: ["Answering exactly 1.0 would ignore the noise entirely — that's the NO-noise (identity channel) case, not this dephasing scenario."],
  },
};
