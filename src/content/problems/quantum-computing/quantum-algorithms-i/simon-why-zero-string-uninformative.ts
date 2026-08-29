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
      [
        "true for every s",
        "holds for any s",
        "satisfied regardless of s",
        "true no matter what s is",
        "for any s",
        "for every s",
        "for all s",
        "any possible s",
        "every possible s",
        "no matter what s",
        "regardless of s",
        "whatever s is",
        "every candidate",
        "any candidate",
      ],
      [
        "no constraint",
        "trivial equation",
        "0 equals 0",
        "tells you nothing new",
        "trivially",
        "automatically satisfied",
        "rules nothing out",
        "rules none",
        "no information",
        "zero information",
        "carries no",
        "tautolog",
        "vacuous",
        "narrows nothing",
      ],
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
          "You have explained why the all-zeros outcome carries no information. Finish with what the algorithm does about it: the run is discarded and the circuit is measured again, so it never counts toward the n−1 useful constraints.",
      },
    ],
    incorrectFeedback:
      "Plug $z=0\\cdots0$ into $z\\cdot s\\equiv0\\pmod2$ for an arbitrary $s$, and explain what that tells you about whether this constraint helps narrow down which $s$ it is.",
    partialFeedback:
      "Good — now be explicit that since the equation is trivially satisfied for every possible $s$, this run has to be discarded and re-measured rather than counted as one of the useful $n-1$ constraints.",
  },
  hints: [
    { text: "Compute $z\\cdot s$ when $z=0\\cdots0$, for an arbitrary $s$." },
    { text: "$0\\cdot s = 0$ regardless of what $s$ is — the dot product with the all-zeros vector is always $0$." },
    { text: "A constraint that's automatically satisfied by every candidate $s$ rules nothing out, so it can't help identify the actual $s$." },
  ],
  solution: {
    steps: [
      { description: "For any candidate $s$, $z\\cdot s = 0\\cdot s = 0$ when $z=0\\cdots0$ — the dot product with the zero vector is always zero." },
      { description: "The measurement outcome $z=0\\cdots0$ therefore satisfies $z\\cdot s\\equiv0\\pmod2$ for every possible nonzero $s$, not just the actual hidden one." },
      { description: "A constraint satisfied by every candidate rules none of them out, so this outcome is discarded and the circuit is run again to get a useful (nonzero) $z$." },
    ],
    finalAnswer: "z=0...0 is trivially orthogonal to every possible s, so it carries zero information and must be discarded.",
  },
  explanation: {
    correctIdea: "Only nonzero measured z's give a genuine, discriminating linear constraint on s; the all-zeros outcome is a mathematical tautology.",
    whyCorrect: "z·s=0 holding for literally every candidate s is exactly what it means for a constraint to carry no information.",
    whyWrong: ["Assuming z=0...0 is simply 'a rare unlucky outcome' misses that it's not rare relative to other useful outcomes at all — each of the 2^(n-1) orthogonal z's, zero included, is equally likely, but zero specifically is uniquely useless."],
  },
};
