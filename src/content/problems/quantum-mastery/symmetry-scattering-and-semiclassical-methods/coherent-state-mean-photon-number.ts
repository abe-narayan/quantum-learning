import type { NumericProblem } from "@/lib/problems/types";

const alpha = 2;
const meanN = alpha * alpha;

export const coherentStateMeanPhotonNumber: NumericProblem = {
  meta: {
    slug: "coherent-state-mean-photon-number",
    title: "Mean Photon Number of a Coherent State",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["coherent-states", "harmonic-oscillator"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  question: {
    type: "numeric",
    prompt: "For a coherent state |α⟩ with α=2 (real), what is the mean photon number ⟨N⟩?",
    inputHint: "an integer or decimal",
  },
  answer: {
    type: "numeric",
    value: meanN,
    tolerance: 0.01,
    incorrectFeedback: "⟨N⟩=|α|² for a coherent state, directly from |cₙ|²=e^(−|α|²)|α|^(2n)/n! being a Poisson distribution with mean |α|².",
    nearMisses: [
      { value: 2, feedback: "2 is α itself. The Poisson mean is |α|², so square it." },
      { value: 16, feedback: "16 is |α|⁴, which is ⟨N⟩², the mean squared. The mean itself is |α|², so square α once, not twice." },
    ],
  },
  hints: [{ text: "⟨N⟩=|α|² exactly, the mean of the Poisson distribution |cₙ|²=e^(−|α|²)|α|^(2n)/n!." }],
  solution: {
    steps: [{ description: "⟨N⟩=|α|²=2²=4." }],
    finalAnswer: "4",
  },
  explanation: {
    correctIdea: "This is a direct property of the Poisson distribution the lesson derived for |c_n|², not a separate calculation — its mean is exactly its own parameter |α|².",
  },
};
