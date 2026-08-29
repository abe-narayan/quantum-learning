import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const phaseOracleVsDiffusionRole: MultipleChoiceProblem = {
  meta: {
    slug: "phase-oracle-vs-diffusion-role",
    title: "What the Oracle Reflects About, vs. What Diffusion Reflects About",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["grovers-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
  },
  question: {
    type: "multiple-choice",
    prompt: "In Grover's algorithm, what does the diffusion operator reflect about?",
    options: [
      { id: "a", text: "The uniform superposition |s⟩" },
      { id: "b", text: "The marked item itself" },
      { id: "c", text: "|0⟩⊗n directly, with no Hadamards involved" },
      { id: "d", text: "The computational basis as a whole" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Reflecting about the marked item is the oracle's job, not diffusion's.",
      c: "Diffusion is built from H^⊗n(2|0⟩⟨0|−I)H^⊗n — the Hadamards are essential, converting the |0⟩-reflection into an |s⟩-reflection.",
      d: "There's no single operator that reflects about 'the whole basis' — diffusion reflects about one specific state, |s⟩.",
    },
    defaultIncorrectFeedback: "Recall D=2|s⟩⟨s|−I by definition — what state does that formula name directly?",
  },
  hints: [
    { text: "Diffusion is defined as D=2|s⟩⟨s|−I." },
    { text: "This is, by construction, a reflection about |s⟩." },
    { text: "The oracle, separately, reflects about the unmarked subspace." },
  ],
  solution: {
    steps: [{ description: "D=2|s⟩⟨s|−I is a reflection about |s⟩ by its very definition." }],
    finalAnswer: "The diffusion operator reflects about |s⟩, the uniform superposition.",
  },
  explanation: {
    correctIdea: "Oracle and diffusion are two different reflections, about two different states — that's exactly what makes composing them a nontrivial rotation.",
    whyCorrect: "This distinction is the entire geometric picture the next lesson builds the closed-form success probability from.",
    whyWrong: [
      { optionId: "b", text: "Assigns the oracle's job to diffusion. Marking the target is the oracle's reflection, not this one." },
      { optionId: "c", text: "Drops the Hadamards, which are what turn a reflection about |0…0⟩ into a reflection about |s⟩." },
      { optionId: "d", text: "Names no single state. A reflection is defined about one vector, and here that vector is |s⟩." },
    ],
  },
};
