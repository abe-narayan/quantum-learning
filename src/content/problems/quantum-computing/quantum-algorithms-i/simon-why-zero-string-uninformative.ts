import type { ConceptualProblem } from "@/lib/problems/types";

export const simonWhyZeroStringUninformative: ConceptualProblem = {
  meta: {
    slug: "simon-why-zero-string-uninformative",
    title: "Why Measuring the All-Zeros String Teaches Nothing",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/simons-algorithm",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["simons-algorithm", "linear-algebra"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Why does measuring $z=0\\cdots0$ (the all-zeros string) never provide any information about $s$, no matter what $s$ actually is?",
    placeholder: "Check what z·s equals when z is the all-zeros string, for any possible s...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["true for every s", "holds for any s", "satisfied regardless of s", "true no matter what s is", "for any s", "for every s", "for all s", "any possible s", "every possible s", "no matter what s", "regardless of s", "whatever s is", "every candidate", "any candidate"],
        missingFeedback:
          "Work out the dot product for this particular measured string. Then say for how many of the candidate strings that equation comes out true.",
      },
      {
        phrases: ["no constraint", "trivial equation", "0 equals 0", "tells you nothing new", "trivially", "automatically satisfied", "rules nothing out", "rules none", "no information", "zero information", "carries no", "tautolog", "vacuous", "narrows nothing"],
        missingFeedback:
          "You have seen that the equation holds universally. Now say what that makes the equation worth as a statement about s.",
      },
      {
        phrases: [
          "discard it",
          "discard",
          "measure again",
          "run again",
          "run it again",
          "rerun",
          "repeat the",
          "try again",
          "doesn't narrow down",
          "does not narrow",
          "useless run",
          "throw it away",
          "doesn't count",
          "does not count",
          "wasted",
        ],
        missingFeedback:
          "You have explained why that outcome is empty of content. Finish with what the algorithm does about it: say whether such a run advances the tally of useful equations, and what has to happen next.",
      },
    ],
    incorrectFeedback:
      "You said the run 'gives z = 0', which is the observation. Substitute it into the constraint equation and evaluate the left-hand side, then ask which candidate strings that equation excludes.",
    partialFeedback:
      "You have part of it. What is still open is what the algorithm actually does with such a run, and how many of the useful constraints it ends up contributing.",
    modelAnswers: [
      "The dot product of the all-zeros string with any s is 0, so the equation is satisfied regardless of s. It rules nothing out, carries no information about which s you have, and the run has to be discarded and repeated.",
      "0...0 is orthogonal to every possible s, so the constraint is trivially true no matter what s is. It narrows nothing down, so you throw it away and run the circuit again.",
    ],
  },
  hints: [
    { text: "Take $z$ to be the string of zeros and compute $z\\cdot s$ with $s$ left arbitrary." },
    { text: "The answer never consults $s$ at all. So the equation this run produces places what demand on the unknown?" },
    { text: "A demand that each possible string already meets narrows the field by how much? Say what the algorithm therefore does with this run." },
  ],
  solution: {
    steps: [
      { description: "For any candidate $s$, $z\\cdot s = 0\\cdot s = 0$ when $z=0\\cdots0$, since the dot product with the zero vector is always zero." },
      { description: "The measurement outcome $z=0\\cdots0$ therefore satisfies $z\\cdot s\\equiv0\\pmod2$ for every possible nonzero $s$, not just the actual hidden one." },
      { description: "A constraint satisfied by every candidate rules none of them out, so this outcome is discarded and the circuit is run again to get a useful (nonzero) $z$." },
    ],
    finalAnswer: "z=0...0 is trivially orthogonal to every possible s, so it carries zero information and must be discarded.",
  },
  explanation: {
    correctIdea: "Only nonzero measured z's give a genuine, discriminating linear constraint on s; the all-zeros outcome is a mathematical tautology.",
    whyCorrect: "z·s=0 holding for every candidate s is what it means for a constraint to carry no information.",
    whyWrong: ["Assuming z=0...0 is simply 'a rare unlucky outcome' misses that it is no rarer than any other outcome. Each of the 2^(n-1) orthogonal z's, zero included, is equally likely; zero is simply the one that constrains nothing."],
  },
};
