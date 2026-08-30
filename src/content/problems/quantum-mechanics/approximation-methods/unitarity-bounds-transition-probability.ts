import type { ConceptualProblem } from "@/lib/problems/types";

export const unitarityBoundsTransitionProbability: ConceptualProblem = {
  meta: {
    slug: "unitarity-bounds-transition-probability",
    title: "Why the Exact Transition Probability Can Never Exceed 1",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["time-dependent-perturbation-theory", "conceptual"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"],
  },
  question: {
    type: "conceptual",
    prompt: "The exact (Runge-Kutta) two-level transition probability never exceeds 1, no matter how strong V is. Explain why, using the fact that time evolution is unitary.",
    placeholder: "Unitary time evolution preserves...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "unitary" does not match "unitarity", and the superscript in |c_f|² is
      // stripped rather than turned into a digit, so "|c_i|^2" never matched a
      // student who typed the squares as ². Both cost this problem its own
      // model answer. The prefix "unitar" and the ² forms cover them.
      {
        phrases: ["unitar", "norm-preserving", "norm preserving", "preserves"],
        missingFeedback:
          "Name the property of time evolution the question points you at, and say what quantity that property holds fixed.",
      },
      {
        phrases: ["|c_i|^2", "|c_f|^2", "|c_i|²+|c_f|²=1", "|c_i|² + |c_f|² = 1", "|c_i|^2+|c_f|^2=1", "total probability", "sums to 1", "sum to 1", "sums to one", "sum to one", "add to 1", "add to one", "adds to 1", "adds to one", "equals 1", "equal 1", "probabilities sum"],
        missingFeedback:
          "You have the property. Now write down what it forces about the two amplitudes at every instant, and say why that caps the transition probability.",
      },
    ],
    incorrectFeedback: "You said the exact solver 'is more accurate', which is about the method rather than the physics. The bound comes from a property of the evolution itself: name what that evolution does to the length of the state vector, then write the two-level consequence and read the bound off it.",
    partialFeedback: "Now say explicitly that this forces each individual probability, P_f included, to lie between 0 and 1.",
    modelAnswers: [
      "Time evolution is unitary, and a unitary is norm preserving, so |c_i|^2 + |c_f|^2 = 1 at every instant. The transition probability is one of two non-negative pieces of a total that equals 1, so it can never exceed 1.",
      "Unitarity preserves the norm of the state vector, which means the two populations always sum to one. The exact integration respects that automatically; the perturbative formula does not, which is why that one can run past 1.",
    ],
  },
  hints: [
    { text: "Whatever the coupling, the state vector's length at time t is fixed by the kind of map that produced it. Say what that length is." },
    { text: "In a two-level system the length is built from just two numbers. Write the relation those two must satisfy at every t." },
    { text: "One of the two is a squared modulus and therefore cannot be negative. Use that to put a ceiling on the other." },
  ],
  solution: {
    steps: [
      { description: "Unitary time evolution preserves the norm of the state vector: |c_i(t)|²+|c_f(t)|²=1 for all t, exactly as at t=0." },
      { description: "Since |c_i(t)|²≥0 always, this forces |c_f(t)|²=P_f(t)≤1 at every instant. Probability can never exceed 1, by construction of the exact dynamics." },
      { description: "The first-order perturbative formula has no such built-in constraint. It is an approximation that can, and at strong coupling does, produce values that would violate this bound if taken at face value." },
    ],
    finalAnswer: "Unitarity forces |c_i(t)|²+|c_f(t)|²=1 always, so P_f(t)=|c_f(t)|² can never exceed 1. The exact RK4 integration respects that constraint automatically; the perturbative formula does not.",
  },
  explanation: {
    correctIdea: "This explains structurally why the exact and perturbative answers must eventually diverge at strong coupling: only one of them is built to respect the underlying unitarity constraint.",
    whyCorrect: "Unitarity is a constraint on the norm, and the norm is a sum of the two squared coefficients. Fixing that sum at 1 caps each term individually, so no exact solution can push one of them past 1 however strong the coupling gets.",
    whyWrong: ["Attributing the bound to some property specific to this V or t misses that it is a general consequence of any unitary two-level evolution."],
  },
};
