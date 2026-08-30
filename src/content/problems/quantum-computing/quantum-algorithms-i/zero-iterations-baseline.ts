import { runGrover } from "@/lib/quantum/grover";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const value = runGrover(4, [3], 0).probabilities()[3];
if (Math.abs(value - 1 / 16) > 1e-9) throw new Error("zeroIterationsBaseline: expected exactly 1/16 at zero iterations.");

export const zeroIterationsBaseline: MultipleChoiceProblem = {
  meta: {
    slug: "zero-iterations-baseline",
    title: "Grover's Success Probability at Zero Iterations",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["grovers-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For N=16, what is P(marked) after 0 Grover iterations (i.e., just measuring the uniform superposition directly)?",
    options: [
      { id: "a", text: "1/16" },
      { id: "b", text: "1/4" },
      { id: "c", text: "1/2" },
      { id: "d", text: "0" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "1/4 is 1/√N, the amplitude rather than the probability. The Born rule squares it.",
      c: "Nothing here gives 50/50 odds. The starting state spreads uniformly over all 16 outcomes.",
      d: "The marked item already carries amplitude before any iteration, so its probability is not 0 at the start.",
    },
    defaultIncorrectFeedback: "At k=0, the closed form sin²((2(0)+1)θ) reduces to sin²(θ) = (1/√N)² = 1/N.",
  },
  hints: [
    { text: "At k=0, no oracle or diffusion has been applied, so the state is the plain uniform superposition." },
    { text: "Every one of the N=16 outcomes is equally likely." },
    { text: "Reading one outcome out of N equally likely ones is the same odds as guessing blindly." },
  ],
  solution: {
    steps: [{ description: "sin²((2(0)+1)θ)=sin²(θ)=(1/√16)²=1/16, the same odds as classical guessing." }],
    finalAnswer: "P = 1/16 = 0.0625",
  },
  explanation: {
    correctIdea: "Zero iterations means zero amplification: Grover's algorithm starts at the classical guessing baseline.",
    whyCorrect: "This confirms the closed form correctly reduces to the 'no advantage yet' case, a sanity check on the formula itself.",
    whyWrong: [
      { optionId: "b", text: "Reports the amplitude, 1/√N, rather than its square. The Born rule squares it." },
      { optionId: "c", text: "Would need a two-outcome state. The starting superposition spreads over all 16." },
      { optionId: "d", text: "Gives the marked item no amplitude at all, but the uniform superposition weights it like every other." },
    ],
  },
};
