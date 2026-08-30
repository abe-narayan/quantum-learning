import type { ConceptualProblem } from "@/lib/problems/types";

export const bohrRadiusAgreementMeaning: ConceptualProblem = {
  meta: {
    slug: "bohr-radius-agreement-meaning",
    title: "What the Bohr-Radius Agreement Does and Doesn't Mean",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["orbitals", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"],
  },
  question: {
    type: "conceptual",
    prompt: "mostProbableRadius1s() gives exactly r=1 (the Bohr radius). Does this mean the electron orbits at a fixed radius, as in the Bohr model? Explain what the result actually establishes.",
    placeholder: "The result establishes that... but it does NOT mean...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["most probable", "single most likely", "the peak", "peak of", "peaks at", "peak value", "argmax", "maximum of", "maximizes", "maximises", "where the density is largest"],
        missingFeedback:
          "Say precisely what quantity the function returns. It is one number extracted from a whole curve, so say which number.",
      },
      {
        phrases: ["does not mean", "no fixed orbit", "distribution", "any radius", "nonzero probability"],
        missingFeedback:
          "You have said what the number is. Now answer the question that was actually asked: say what the result does not license, and what the electron's radial position is really described by.",
      },
    ],
    incorrectFeedback: "You answered yes, or you answered no without saying what the computed number actually is. The function that produced r=1 maximizes something; name what it maximizes, and then say what a single argmax tells you, and fails to tell you, about a continuous random variable.",
    partialFeedback: "One side is stated. Add the other: say what the electron's chance of being found away from that radius is, and whether it is anything like zero.",
    modelAnswers: [
      "No. r=1 is the most probable radius, the peak of a continuous probability distribution over all r, not a fixed orbit. There is nonzero probability at any radius, so this does not mean the electron circles at that distance; the agreement with Bohr is a coincidence for the ground state.",
      "It establishes where the radial density is largest, and nothing more. It does not mean there is a fixed orbit, because the distribution is spread over every radius.",
    ],
  },
  hints: [
    { text: "Look at what the function actually computes. It searches for the argument that makes one particular quantity largest. Which quantity?" },
    { text: "That quantity is defined for every r > 0, not just at one value. Sketch it and mark where the answer sits on your sketch." },
    { text: "Now ask what fraction of the area under your sketch lies away from the marked point, and whether a model that puts the electron at a fixed radius could reproduce that shape." },
  ],
  solution: {
    steps: [
      { description: "The result establishes that r=1 is the single most likely radius to measure, the peak of the continuous probability distribution r²|R₁₀(r)|²." },
      { description: "It does NOT mean the electron is confined to r=1, or orbits there in any classical sense. The wavefunction has nonzero probability density at every r>0." },
      { description: "The numerical agreement with the Bohr model's fixed-orbit radius is a coincidence for the ground state specifically, not evidence that the Bohr model's classical-orbit picture is correct." },
    ],
    finalAnswer: "r=1 is the peak of a continuous probability distribution over all r, not a fixed orbit. The Bohr-model agreement is a numerical coincidence for the ground state, not a vindication of classical orbits.",
  },
  explanation: {
    correctIdea: "This distinguishes a checkable numerical fact (the location of a distribution's peak) from an interpretive overreach (concluding the electron 'orbits' there).",
    whyCorrect: "An argmax locates a distribution's peak and says nothing about its width. Here the distribution has substantial weight on both sides of the peak, which is exactly what a fixed-radius orbit would forbid.",
    whyWrong: ["Concluding the Bohr model was 'basically right' ignores that quantum mechanics gives a full probability distribution, with the Bohr radius being only its single most likely value, not its only possible value."],
  },
};
