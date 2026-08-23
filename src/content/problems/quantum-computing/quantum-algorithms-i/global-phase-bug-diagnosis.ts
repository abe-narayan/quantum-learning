import type { ConceptualProblem } from "@/lib/problems/types";

export const globalPhaseBugDiagnosis: ConceptualProblem = {
  meta: {
    slug: "global-phase-bug-diagnosis",
    title: "Diagnosing the Global-Phase Diffusion Bug",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["grovers-algorithm", "testing"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
  },
  question: {
    type: "conceptual",
    prompt: "The lesson describes a real bug where flipping |0⟩'s sign (instead of every other state's) passed every success-probability test. Explain precisely why a global phase difference is invisible to any test that only checks measurement probabilities.",
    placeholder: "Think about the Born rule's dependence on |amplitude|²...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["born rule", "\\|amplitude\\|", "magnitude squared", "probability depends on"],
      ["same magnitude", "-1 squared", "identical probabilities"],
    ],
    incorrectFeedback: "Recall the Born rule: probability is the squared magnitude of an amplitude. What happens to |z|² when z is replaced by −z?",
    partialFeedback: "Good — now state explicitly that this holds for every amplitude in the state simultaneously, not just one.",
  },
  hints: [
    { text: "The Born rule says P = |amplitude|²." },
    { text: "For any complex z, |−z|² = |z|² (magnitude is unaffected by an overall sign)." },
    { text: "If every amplitude in a state is multiplied by the same −1, every probability is exactly unchanged." },
  ],
  solution: {
    steps: [
      { description: "Measurement probabilities are |amplitude|² for each outcome." },
      { description: "|−z|²=|z|² for any complex z, so multiplying an entire state by −1 changes no probability at all." },
      { description: "A test that only checks final measurement probabilities can never detect this kind of global sign (or any global phase e^{iθ}) difference." },
    ],
    finalAnswer: "Because probability depends only on |amplitude|², and |−z|²=|z|², a global −1 (or any global phase) leaves every probability exactly unchanged.",
  },
  explanation: {
    correctIdea: "Global phase is fundamentally unobservable — this is a basic quantum mechanics fact, not a testing quirk, and it applies to any overall e^{iθ}, not just −1.",
    whyCorrect: "This is exactly why the lesson's fix required testing groverDiffusion(|s⟩)=|s⟩ directly, an intermediate check insensitive to being 'washed out' by later measurement.",
    whyWrong: ["Saying 'the test just wasn't thorough enough' misses the specific reason: no measurement-probability-only test, however thorough, could ever catch this class of bug."],
  },
};
