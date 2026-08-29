import type { ConceptualProblem } from "@/lib/problems/types";

export const simonOrthogonalComplementRecoversS: ConceptualProblem = {
  meta: {
    slug: "simon-orthogonal-complement-recovers-s",
    title: "Why n-1 Constraints Pin Down s Uniquely",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/simons-algorithm",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["simons-algorithm", "linear-algebra"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Once you've collected $n-1$ linearly independent nonzero measured $z_i$'s, describe in words (no need for full Gaussian elimination) why their orthogonal complement in $\\mathbb{F}_2^n$ contains exactly one nonzero vector, and why that vector must be $s$.",
    placeholder: "Each z_i cuts the space of candidate s's down by one dimension...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "n-1 independent constraints",
        "n-1 linearly independent equations",
        "independent constraint",
        "independent equation",
        "linearly independent",
        "each constraint cuts the dimension",
        "cuts the dimension",
        "reduces the dimension",
        "removes one dimension",
        "n unknowns",
        "n bits of freedom",
        "dimension count",
      ],
      {
        phrases: [
          "one-dimensional subspace",
          "one dimensional",
          "1-dimensional",
          "dimension 1",
          "dimension one",
          "exactly one nonzero vector",
          "exactly one nonzero",
          "only one nonzero",
          "single nonzero",
          "orthogonal complement has dimension one",
          "two vectors",
          "two elements",
          "zero vector and",
        ],
        missingFeedback:
          "You have the constraint count and why s must be a solution. Say what those n−1 constraints leave behind: a solution space of dimension 1 over F₂, which holds exactly two vectors, the zero vector and one other.",
      },
      {
        phrases: [
          "s itself satisfies every constraint",
          "s is orthogonal to each measured z",
          "by construction s is one of the solutions",
          "by construction",
          "s satisfies",
          "satisfies every",
          "satisfies all",
          "orthogonal to s",
          "s is a solution",
          "s is among",
          "guaranteed",
          "always holds for s",
          "true s",
          "hidden string is",
        ],
        missingFeedback:
          "The dimension count tells you one nonzero vector survives, but not that it is s. Add the step the algorithm's own derivation supplies: every measured z satisfies z·s = 0, so the true s is always among the solutions, and there is only one nonzero solution to be.",
      },
    ],
    incorrectFeedback:
      "Cover three points: why n−1 independent linear constraints leave only a one-dimensional space of solutions, why that space contains exactly one nonzero vector, and why s specifically must be that vector (not some other candidate).",
    partialFeedback:
      "Good — now make sure you explicitly connect the dimension-counting argument to why s itself is guaranteed to be a solution of every one of the n−1 constraints.",
  },
  hints: [
    { text: "Each independent measured $z_i$ gives one independent linear equation $z_i\\cdot s'=0$ on the unknown $n$-bit vector $s'$." },
    { text: "$n$ unknowns with $n-1$ independent linear constraints leaves a solution space of dimension $n-(n-1)=1$ over $\\mathbb{F}_2$." },
    { text: "A 1-dimensional subspace of $\\mathbb{F}_2^n$ contains exactly 2 vectors: the zero vector and exactly one nonzero vector." },
    { text: "Every measured $z_i$ is, by the algorithm's own derivation, guaranteed to satisfy $z_i\\cdot s=0$ — so the true $s$ is always among the solutions, and since there's only one nonzero solution, it must be $s$ itself." },
  ],
  solution: {
    steps: [
      { description: "Each of the $n-1$ independent measured $z_i$'s contributes one independent linear equation $z_i\\cdot s'\\equiv0\\pmod2$ on the unknown $s'\\in\\mathbb{F}_2^n$." },
      { description: "$n-1$ independent linear equations on an $n$-dimensional space over $\\mathbb{F}_2$ leave a solution space of dimension exactly $n-(n-1)=1$." },
      { description: "A 1-dimensional subspace of $\\mathbb{F}_2^n$ has exactly $2^1=2$ elements: the zero vector and exactly one nonzero vector." },
      { description: "Every measured $z_i$ satisfies $z_i\\cdot s=0$ by the algorithm's own derivation (that's why it was measured at all), so the true hidden $s$ is guaranteed to be a solution — and since there's only one nonzero solution total, that solution must be $s$ itself." },
    ],
    finalAnswer:
      "n−1 independent constraints leave a 1-dimensional solution space (2 vectors: zero and one nonzero vector), and since s always satisfies every constraint by construction, that unique nonzero vector must be s.",
  },
  explanation: {
    correctIdea:
      "Linear algebra over F₂ turns 'enough independent measurement outcomes' into 'exactly one nonzero candidate left,' and the derivation guarantees that candidate is the true hidden string.",
    whyCorrect:
      "This is the same dimension-counting argument used throughout linear algebra, specialized to F₂, combined with the earlier derivation that z·s=0 always holds for the true s.",
    whyWrong: [
      "Assuming more than one nonzero vector could remain ignores the dimension count: exactly n−1 independent constraints on n unknowns always leaves a 1-dimensional (2-element) solution space, no more.",
    ],
  },
};
