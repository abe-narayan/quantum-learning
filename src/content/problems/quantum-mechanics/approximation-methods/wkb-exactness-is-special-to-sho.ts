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
      {
        phrases: ["semiclassical", "correspondence principle", "slowly varying", "slowly-varying", "high quantum number", "large quantum number", "many wavelengths", "asymptotic regime"],
        missingFeedback:
          "Say when WKB is normally expected to be accurate. That expectation is the yardstick this result has to be measured against.",
      },
      {
        phrases: ["special property", "special mathematical", "specific to", "specific quadratic", "quadratic", "particular potential", "coincidence", "accident of", "peculiar to this potential", "does not carry over", "will not carry over", "won't carry over", "not a general feature"],
        missingFeedback:
          "You have the normal regime of validity. Now explain the anomaly: say what is unusual about this one potential's shape, and whether that would hold elsewhere.",
      },
    ],
    incorrectFeedback: "You defended the result as 'it was verified numerically', which is not in dispute. The question is what the verification licenses. Say what regime this approximation is normally argued to be good in, and then say what is unusual about the one potential it was tested on.",
    partialFeedback: "One half is there. The other half is a claim about the sample size: you have one potential, and the question is whether it is representative. Say what makes it unrepresentative.",
    modelAnswers: [
      "WKB is only supposed to be good in the semiclassical regime, at large quantum number where the potential varies slowly over a wavelength. Its exactness at n=0 here is a special mathematical property of the quadratic shape, a coincidence of that one potential, and it does not carry over.",
      "The correspondence principle is what justifies WKB, so accuracy at high quantum number is expected and accuracy at n=0 is not. The harmonic oscillator's specific quadratic form has a special property that makes the approximation exact, which is not a general feature.",
    ],
  },
  hints: [
    { text: "Recall the regime in which this approximation is derived, and what has to be true of the potential and of n for the derivation to hold." },
    { text: "The tested potential meets the exactness bar even at the very bottom of its ladder, which the derivation never promised. That is a clue about the potential, and no clue at all about the method." },
    { text: "Ask how many potentials the course actually tested, and what you would need to see before extending the claim to a potential with a sharp feature in it." },
  ],
  solution: {
    steps: [
      { description: "WKB is generally expected to be most accurate for large quantum numbers, where the potential varies slowly on the scale of the local wavelength (the semiclassical/correspondence-principle regime)." },
      { description: "The harmonic oscillator's quadratic potential is a special, exactly-solvable case where WKB happens to reproduce the exact spectrum at every n, including n=0, a known mathematical fact about this potential's shape." },
      { description: "This does not generalize: a different potential could show WKB working well only at large n, with noticeable error at small n, since the general accuracy argument relies on the large-n/slowly-varying-potential limit, which the harmonic oscillator's exactness doesn't actually need." },
    ],
    finalAnswer: "WKB's generally-expected accuracy regime is large n / slowly-varying potentials; the harmonic oscillator's exactness at all n (including n=0) is a special mathematical property of its specific quadratic shape, not evidence WKB is universally this accurate.",
  },
  explanation: {
    correctIdea: "This distinguishes a checked numerical result (WKB works well here) from an overgeneralization (WKB always works this well), the distinction the lesson's Common Mistakes section draws.",
    whyCorrect: "WKB's error comes from the potential varying appreciably across a wavelength. For a quadratic potential the leading correction happens to vanish identically at every n, which is a property of that one shape rather than evidence about the approximation in general.",
    whyWrong: ["Concluding 'WKB is always nearly exact' from a single worked example on one exactly-solvable potential over-generalizes from a special case."],
  },
};
