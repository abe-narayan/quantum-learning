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
      {
        phrases: ["n-1 independent constraints", "n-1 linearly independent equations", "independent constraint", "independent equation", "linearly independent", "each constraint cuts the dimension", "cuts the dimension", "reduces the dimension", "removes one dimension", "n unknowns", "n bits of freedom", "dimension count"],
        missingFeedback:
          "Count. Say how many unknowns s has, how many usable measurement equations you collected, and what each one does to the space of candidates.",
      },
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
          "You have the constraint tally and the reason the string you want qualifies. What is still missing is the size of the surviving set: work out its dimension over F₂ and then say how many elements a space of that size holds.",
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
          "You know one nonzero vector survives, but not that it is the one you want. Add the step the algorithm's own derivation supplies: what does every measured z obey with respect to the hidden string, and what does that put the hidden string inside?",
      },
    ],
    incorrectFeedback:
      "You described the algorithm's output without arguing about the solution set. Three separate things need saying: how much room n−1 good measurements leave in an n-bit string, how many nonzero vectors a space with that much room holds, and why the hidden string has to be one of them.",
    partialFeedback:
      "One or more of the three parts is missing. Check each: the amount of room left, the number of nonzero vectors that leaves, and the reason the hidden string has to be one of them.",
    modelAnswers: [
      "Each z_i gives one linearly independent constraint on s, and n-1 of them acting on n unknowns cut the solution space down to dimension one. A one-dimensional subspace over F2 has exactly two elements, the zero vector and one nonzero vector, and s satisfies every constraint by construction, so that nonzero vector is s.",
      "You have n bits of freedom and n-1 linearly independent equations, each removing one dimension, so what is left is 1-dimensional: two vectors, one of them zero. Since s is orthogonal to each measured z, s is a solution, and the only nonzero one, so it must be s.",
    ],
  },
  hints: [
    { text: "Each measured $z_i$ other than the trivial one imposes a linear equation on the vector you are looking for. Write down what that equation says." },
    { text: "Count how much room an $n$-bit vector has, then subtract one for each of your $n-1$ equations. What is left?" },
    { text: "A space over $\\mathbb{F}_2$ with that much room left has a definite number of elements. Count them, and count how many of those are nonzero." },
    { text: "Now show the one you want is in there: what does the algorithm's own derivation guarantee about $z_i\\cdot s$ for every measured $z_i$?" },
  ],
  solution: {
    steps: [
      { description: "Each of the $n-1$ independent measured $z_i$'s contributes one independent linear equation $z_i\\cdot s'\\equiv0\\pmod2$ on the unknown $s'\\in\\mathbb{F}_2^n$." },
      { description: "$n-1$ independent linear equations on an $n$-dimensional space over $\\mathbb{F}_2$ leave a solution space of dimension exactly $n-(n-1)=1$." },
      { description: "A 1-dimensional subspace of $\\mathbb{F}_2^n$ has exactly $2^1=2$ elements: the zero vector and exactly one nonzero vector." },
      { description: "Every measured $z_i$ satisfies $z_i\\cdot s=0$ by the algorithm's own derivation (that's why it was measured at all), so the true hidden $s$ is guaranteed to be a solution. Only one nonzero solution exists in total, so that solution is $s$ itself." },
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
