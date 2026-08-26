import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const magicStateEastinKnillTransversalGates: MultipleChoiceProblem = {
  meta: {
    slug: "magic-state-eastin-knill-transversal-gates",
    title: "Which Gates Are Transversal on the Surface Code, and Why Not All of Them?",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["eastin-knill", "gottesman-knill", "transversal-gates", "magic-states"],
    prerequisites: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "On the surface code, H, S, and CNOT can be implemented transversally (fault-tolerantly, with no error spreading within a logical block), but T cannot. Which statement best explains why this is not just a current engineering limitation?",
    options: [
      {
        id: "a",
        text: "The Eastin-Knill theorem proves no code can have both a universal transversal gate set and the ability to correct arbitrary single-qubit errors, so a transversal fault-tolerant T gate on an error-correcting surface code is provably impossible, not merely undiscovered",
      },
      {
        id: "b",
        text: "T is simply a harder gate to engineer than H, S, or CNOT, and a sufficiently clever lattice-surgery scheme could eventually make it transversal too",
      },
      {
        id: "c",
        text: "T cannot be made transversal only because current decoders are too slow to keep up with T gates specifically",
      },
      {
        id: "d",
        text: "T is already transversal on the surface code; magic-state distillation is used only to reduce qubit overhead, not because transversal T is impossible",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This treats it as an engineering gap. Eastin-Knill is a no-go theorem: it is not that nobody has found the right transversal circuit for T, it is that no such fault-tolerant transversal circuit can exist on a code that also corrects arbitrary single-qubit errors.",
      c: "Decoder speed affects how fast syndromes are processed, not whether a transversal circuit for T exists at all. The obstruction is structural (Eastin-Knill), not a speed problem.",
      d: "T is exactly the gate that is NOT transversal on the surface code; that is the whole reason magic-state injection and distillation are needed as a separate mechanism.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's precise statement of the Eastin-Knill theorem: no code can simultaneously have a universal transversal gate set and correct arbitrary single-qubit errors.",
  },
  hints: [
    { text: "This is a named no-go theorem, not an open engineering problem." },
    { text: "The theorem trades off two properties: a universal transversal gate set, and full single-qubit error correction. A code can't have both." },
    { text: "Ask which of H, S, CNOT, T is the one gate that would make the Clifford group universal if it were added transversally." },
  ],
  solution: {
    steps: [
      {
        description: "Eastin-Knill states: no quantum error-correcting code can have both (a) a universal set of transversal logical gates, and (b) the ability to correct arbitrary single-qubit errors.",
      },
      {
        description: "The surface code corrects arbitrary single-qubit errors (up to its distance), so by the theorem it cannot also have a universal transversal gate set. Since H, S, CNOT (Clifford) are already transversal, T (which would complete universality) is the gate that must fail to be transversal.",
      },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "Eastin-Knill is a structural no-go result, not an unsolved engineering challenge: any error-correcting code with full single-qubit error correction is barred from also having a universal transversal gate set.",
    whyCorrect:
      "This is exactly why magic-state injection (a fundamentally different, non-transversal mechanism) exists as the standard workaround, rather than the field simply waiting for a better transversal T circuit.",
    whyWrong: [
      "Option b mistakes a proven impossibility for a temporary limitation.",
      "Option c confuses decoder throughput with the existence of a fault-tolerant circuit.",
      "Option d gets the facts backwards: T is precisely the non-transversal gate.",
    ],
  },
};
