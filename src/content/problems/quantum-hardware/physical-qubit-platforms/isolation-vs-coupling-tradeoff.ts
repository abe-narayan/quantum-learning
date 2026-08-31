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
      {
        phrases: ["isolated", "isolation", "well-shielded", "atomic levels", "not easily perturbed"],
        missingFeedback:
          "Start with the coherence side. Say what it is about a trapped ion that keeps the environment from disturbing it.",
      },
      {
        phrases: ["slow", "weak coupling", "laser-driven", "microseconds"],
        missingFeedback:
          "You have the coherence side. Now say what that same property costs you when you want to drive a gate, and how it shows up in the gate time.",
      },
    ],
    incorrectFeedback: "The two halves are the same fact seen twice, and the answer has to say so. Name the property of a trapped ion's energy levels that keeps the environment from reaching them, then point out that a gate drive is also part of the environment. Whatever makes the first true makes the second hard, and the answer should say what that costs in gate duration.",
    partialFeedback: "Good. Now make the causal link explicit rather than listing the two facts side by side: say why the very thing that protects the qubit is what forces the gate mechanism to be feeble and to take as long as it does.",
    modelAnswers: [
      "Trapped ions are extremely well isolated: the qubit lives in atomic levels that the environment barely touches, which is why coherence times are so long. But the same isolation means external fields couple to them weakly, so gates have to be laser-driven and end up slow, in the microseconds.",
      "You cannot have it both ways. Good isolation from noise is also isolation from your control fields, so the coupling is weak and gates take microseconds rather than nanoseconds.",
    ],
  },
  hints: [
    { text: "A trapped ion's energy levels sit deep inside the atom and the surroundings barely reach them. That is where the long coherence comes from." },
    { text: "A gate drive has to reach them too. Ask what the same protection does to the drive." },
    { text: "The result is a gate mechanism that is comparatively feeble, relying on light and on collective motion rather than on a strong, always-on link. Ask what that means for gate duration." },
  ],
  solution: {
    steps: [
      { description: "Trapped ions' atomic energy levels are naturally well-isolated from environmental perturbation, which is the property that gives them long coherence times." },
      { description: "This same isolation means the qubit doesn't readily couple to external fields either, including the ones used to drive gates." },
      { description: "As a result, gates rely on comparatively weak, laser-driven coupling through the shared motional mode, which is inherently slower (microseconds) than a strongly, directly coupled system like a superconducting circuit's fast (nanosecond) but noise-sensitive gates." },
    ],
    finalAnswer: "The same isolation from environmental noise that gives trapped ions long coherence also weakens their coupling to the fields used for gates, forcing slower (microsecond) gate mechanisms.",
  },
  explanation: {
    correctIdea: "This makes the abstract 'no free lunch' pattern concrete with a specific causal mechanism, using a platform this course already covered in detail.",
    whyCorrect: "Coherence and controllability are the same coupling seen from two sides. An ion's levels are hard for stray fields to reach, and a gate laser is a field too, so the protection that buys long coherence is what forces gates to take microseconds.",
    whyWrong: ["Restating 'there's always a tradeoff' without identifying the specific causal link, that isolation weakens coupling, does not demonstrate the mechanism."],
  },
};
