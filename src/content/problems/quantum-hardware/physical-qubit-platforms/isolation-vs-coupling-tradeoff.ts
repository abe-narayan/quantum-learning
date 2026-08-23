import type { ConceptualProblem } from "@/lib/problems/types";

export const isolationVsCouplingTradeoff: ConceptualProblem = {
  meta: {
    slug: "isolation-vs-coupling-tradeoff",
    title: "Why Isolation and Fast Coupling Pull in Opposite Directions",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["capstone", "conceptual"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"],
  },
  question: {
    type: "conceptual",
    prompt: "Using trapped ions as your example, explain why strong environmental isolation (good for coherence) tends to work against strong, fast coupling (good for gate speed).",
    placeholder: "Trapped ions are well-isolated because... but this same isolation means gates must rely on...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["isolated", "well-shielded", "atomic levels", "not easily perturbed"],
      ["slow", "weak coupling", "laser-driven", "microseconds"],
    ],
    incorrectFeedback: "Address both halves: why the isolation that helps coherence exists, and why that same property makes fast coupling harder to achieve.",
    partialFeedback: "Good — now be explicit about the causal link between the isolation property and the resulting SLOW gate mechanism.",
  },
  hints: [
    { text: "Trapped ions' atomic energy levels are naturally well-isolated from environmental noise — this is exactly what gives them long coherence times." },
    { text: "But that same isolation means the qubit doesn't easily couple to anything, including the fields used to drive gates." },
    { text: "Gates then rely on comparatively weak, slow laser-driven mechanisms (and collective motion) rather than fast, strong, always-on coupling." },
  ],
  solution: {
    steps: [
      { description: "Trapped ions' atomic energy levels are naturally well-isolated from environmental perturbation — exactly the property that gives them long coherence times." },
      { description: "This same isolation means the qubit doesn't readily couple to external fields either, including the ones used to drive gates." },
      { description: "As a result, gates rely on comparatively weak, laser-driven coupling through the shared motional mode, which is inherently slower (microseconds) than a strongly, directly coupled system like a superconducting circuit's fast (nanosecond) but noise-sensitive gates." },
    ],
    finalAnswer: "The same isolation from environmental noise that gives trapped ions long coherence also weakens their coupling to the fields used for gates, forcing slower (microsecond) gate mechanisms.",
  },
  explanation: {
    correctIdea: "This makes the abstract 'no free lunch' pattern concrete with a specific causal mechanism, using a platform this course already covered in detail.",
    whyCorrect: "Matches the general physical principle underlying every platform comparison in this course, applied specifically to trapped ions as requested.",
    whyWrong: ["Simply restating 'there's always a tradeoff' without identifying the SPECIFIC causal link (isolation weakens coupling) doesn't demonstrate the mechanism."],
  },
};
