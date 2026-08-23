import type { ConceptualProblem } from "@/lib/problems/types";

export const wkbExactnessIsSpecialToSho: ConceptualProblem = {
  meta: {
    slug: "wkb-exactness-is-special-to-sho",
    title: "Why the Harmonic Oscillator's WKB Exactness Doesn't Generalize",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-wkb-approximation",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["wkb", "conceptual"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-wkb-approximation"],
  },
  question: {
    type: "conceptual",
    prompt: "The lesson found WKB matches the harmonic oscillator's exact spectrum extremely closely at every n tested (n=0..3), not just for large n. Explain why this should NOT be read as general evidence that WKB is always this accurate.",
    placeholder: "WKB is generally expected to be most accurate when...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["large n", "semiclassical", "correspondence principle", "slowly varying"],
      ["special", "specific to", "harmonic oscillator", "particular potential", "not general"],
    ],
    incorrectFeedback: "Address both: (1) the general expectation for WKB's accuracy regime (large n / slowly-varying potential), and (2) why the harmonic oscillator is a special case that doesn't fit the general pattern.",
    partialFeedback: "Good — make sure you explicitly flag this as a property of the harmonic oscillator's specific mathematical shape, not evidence for WKB in general.",
  },
  hints: [
    { text: "WKB is a semiclassical approximation, generally expected to work best in the large-n / correspondence-principle limit." },
    { text: "The harmonic oscillator's exactness at even n=0 is a documented special mathematical property of its specific quadratic potential shape, not a general WKB feature." },
    { text: "A different potential (not tested in this course) could show much larger errors at small n." },
  ],
  solution: {
    steps: [
      { description: "WKB is generally expected to be most accurate for large quantum numbers, where the potential varies slowly on the scale of the local wavelength (the semiclassical/correspondence-principle regime)." },
      { description: "The harmonic oscillator's quadratic potential is a special, exactly-solvable case where WKB happens to reproduce the exact spectrum at every n, including n=0 — a known mathematical fact about this specific potential's shape." },
      { description: "This does not generalize: a different potential could show WKB working well only at large n, with noticeable error at small n, since the general accuracy argument relies on the large-n/slowly-varying-potential limit, which the harmonic oscillator's exactness doesn't actually need." },
    ],
    finalAnswer: "WKB's generally-expected accuracy regime is large n / slowly-varying potentials; the harmonic oscillator's exactness at all n (including n=0) is a special mathematical property of its specific quadratic shape, not evidence WKB is universally this accurate.",
  },
  explanation: {
    correctIdea: "This distinguishes a genuine, checked numerical result (WKB works great here) from an overgeneralization (WKB always works this well) — exactly the distinction the lesson's Common Mistakes section draws.",
    whyCorrect: "Matches the lesson's explicit framing of the harmonic-oscillator result as special, not representative.",
    whyWrong: ["Concluding 'WKB is always nearly exact' from a single worked example on one exactly-solvable potential over-generalizes from a special case."],
  },
};
