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
    incorrectFeedback: "If you answered the ideal value, you ignored the interleaved dephasing: the coherence present between the two H gates is partially destroyed, so P(0) must land below the noiseless result. This is the lesson's own worked example.",
    nearMisses: [
      { value: 1, feedback: "1 is the noiseless result, since H·H = I. The interleaved dephasing damages the coherence that lives between the two Hadamards, so some weight leaks to |1⟩." },
      { value: 0.8, tolerance: 0.005, feedback: "0.8 is the surviving coherence factor 1 − λ. P(0) is (1 + that factor)/2, since the second Hadamard turns the surviving X-coherence into a Z-population." },
      { value: 0.5, feedback: "0.5 is full decoherence, what λ = 1 would give. At λ = 0.2 most of the coherence survives." },
    ],
  },
  hints: [
    { text: "Without noise, H,H=I exactly, giving P(0)=1." },
    { text: "With dephasing interleaved, the circuit no longer returns perfectly to |0⟩." },
    { text: "Re-derive the lesson's worked example: only the coherence present between the two H gates gets damaged, and the surviving coherence fixes how far below one P(0) lands." },
  ],
  solution: {
    steps: [{ description: "With dephasing (λ=0.2) interleaved after each H, P(0)≈0.9, not the ideal 1.0." }],
    finalAnswer: "≈0.9",
  },
  explanation: {
    correctIdea: "This directly reproduces the lesson's central numerical demonstration of noise degrading an otherwise-perfect identity circuit.",
    whyCorrect: "The two Hadamards would undo each other exactly, but they can only do so through the coherence that sits between them. Dephasing at λ = 0.2 shrinks that off-diagonal weight to 0.8 of its value, and P(0) = (1 + 0.8)/2 = 0.9 follows. runNoisyCircuit computes the same number.",
    whyWrong: ["Answering exactly 1.0 would ignore the noise entirely: that's the no-noise (identity channel) case, not this dephasing scenario."],
  },
};
