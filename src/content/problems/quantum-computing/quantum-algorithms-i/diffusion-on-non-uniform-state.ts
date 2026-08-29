import { StateVector } from "@/lib/quantum/state";
import { groverDiffusion } from "@/lib/quantum/grover";
import type { NumericProblem } from "@/lib/problems/types";

const state = StateVector.basis(2, 0); // |00>, not the uniform superposition
const result = groverDiffusion(state);
const value = result.probabilities()[0];

export const diffusionOnNonUniformState: NumericProblem = {
  meta: {
    slug: "diffusion-on-non-uniform-state",
    title: "Applying Diffusion to |00⟩ Instead of |s⟩",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["grovers-algorithm", "diffusion"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
  },
  question: {
    type: "numeric",
    prompt: "Apply the diffusion operator to |00⟩ directly (not the uniform superposition |s⟩). What is P(measuring |00⟩) afterward?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Diffusion only fixes |s⟩ exactly — |00⟩ is a different state, so there's no guarantee it's left unchanged.",
    nearMisses: [
      { value: 1, feedback: "Probability 1 would mean diffusion is the identity. It fixes |s⟩ alone; on |00⟩ it returns |s⟩ − |00⟩, whose |00⟩ amplitude is −1/2." },
      { value: 0, feedback: "The |00⟩ amplitude does not vanish: 2|s⟩⟨s| − I sends |00⟩ to |s⟩ − |00⟩, leaving −1/2 on |00⟩. Square that magnitude." },
      { value: 0.5, feedback: "0.5 is the surviving amplitude's magnitude, not its square. The probability is that magnitude squared." },
    ],
  },
  hints: [
    { text: "The 'fixes |s⟩ exactly' guarantee only applies to |s⟩ itself, not to an arbitrary input like |00⟩." },
    { text: "|00⟩ has overlap with |s⟩ of exactly 1/√N (N=4 here), not 1." },
    { text: "Work through H^⊗2, the reflection, and H^⊗2 again applied to |00⟩ specifically." },
  ],
  solution: {
    steps: [
      { description: "H^⊗2|00⟩ = |s⟩ (the uniform superposition itself)." },
      { description: "Reflecting |s⟩ about |0⟩ gives a new state; applying H^⊗2 again does not return to |00⟩." },
    ],
    finalAnswer: "P(|00⟩) after diffusion applied to |00⟩ = 0.25 (not 1) — diffusion doesn't fix an arbitrary input the way it fixes |s⟩.",
  },
  explanation: {
    correctIdea: "The '2|s⟩⟨s|−I fixes |s⟩' identity is specific to |s⟩ — it doesn't mean diffusion is the identity operator on every state.",
    whyCorrect: "Directly computed from the engine: only 0.25 probability remains on |00⟩, confirming diffusion genuinely moves this state.",
    whyWrong: ["Assuming diffusion always returns 1.0 confuses 'fixes the specific state |s⟩' with 'is the identity on every state' — very different claims."],
  },
};
