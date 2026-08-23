import type { ConceptualProblem } from "@/lib/problems/types";

export const whyGlobalPhaseToleranceCorrect: ConceptualProblem = {
  meta: {
    slug: "why-global-phase-tolerance-correct",
    title: "Why Checking 'Up to Global Phase' Is Correct, Not a Shortcut",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["gate-decomposition", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why matricesEqualUpToGlobalPhase is the PHYSICALLY CORRECT way to verify a gate decomposition, not a looser approximation of 'true' equality.",
    placeholder: "Global phase is unobservable because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["unobservable", "no measurement can detect", "cancels in probabilities"],
      ["same physical gate", "physically identical", "correct decomposition"],
    ],
    incorrectFeedback: "Address both: why global phase specifically is unobservable, and why this makes phase-tolerant equality the CORRECT (not merely convenient) check.",
    partialFeedback: "Good — now be explicit that a decomposition matching up to phase is a fully correct, not approximate, decomposition.",
  },
  hints: [
    { text: "Mathematical Foundations established that multiplying an entire state vector by e^{iφ} changes nothing observable — probabilities involve |amplitude|², where the phase cancels." },
    { text: "Two gate matrices differing only by a global phase factor produce IDENTICAL measurement statistics on every possible input state." },
    { text: "So requiring EXACT matrix equality (no phase tolerance) would incorrectly reject decompositions that are, physically, completely correct." },
  ],
  solution: {
    steps: [
      { description: "A global phase e^{iφ} multiplying an entire state vector is unobservable — any measurement probability involves |amplitude|², and the phase factor cancels out completely (Mathematical Foundations)." },
      { description: "Two gate matrices differing only by such a phase produce IDENTICAL measurement outcomes for every possible input, so they implement the exact same physical gate." },
      { description: "Therefore, checking equality 'up to global phase' is the PHYSICALLY CORRECT equivalence for verifying a decomposition — not a loosened or approximate check, but the right one; requiring exact matrix equality would incorrectly reject genuinely correct decompositions." },
    ],
    finalAnswer: "Global phase is unobservable in any measurement, so two matrices differing only by phase implement the identical physical gate — checking equality up to phase is the physically correct verification, not an approximation.",
  },
  explanation: {
    correctIdea: "This connects a practical compilation-verification tool back to a foundational physics fact (global phase invariance), showing WHY the engineering choice is correct, not just convenient.",
    whyCorrect: "Matches the lesson's explicit 'Why up to global phase is the right check' section.",
    whyWrong: ["Treating phase tolerance as a 'looser' or 'less strict' check misunderstands that it's actually the MORE precise physical equivalence, correctly excluding only unobservable differences."],
  },
};
