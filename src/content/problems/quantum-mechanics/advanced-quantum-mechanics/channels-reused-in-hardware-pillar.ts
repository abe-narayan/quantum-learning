import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const channelsReusedInHardwarePillar: MultipleChoiceProblem = {
  meta: {
    slug: "channels-reused-in-hardware-pillar",
    title: "What Amplitude Damping and Dephasing Each Leave Behind",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["capstone", "open-systems", "decoherence"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Both amplitude damping and dephasing destroy a qubit's coherences, which is why a hardware course reaches for the same two channels under the names $T_1$ and $T_2$. Applied over and over to an arbitrary one-qubit $\\rho$, what does each of them leave behind in the long-time limit?",
    options: [
      {
        id: "a",
        text: "Amplitude damping leaves the pure ground state; dephasing leaves $\\rho$'s own diagonal, with the populations it started with.",
      },
      {
        id: "b",
        text: "Both leave the maximally mixed state $I/2$, differing only in how quickly they arrive there.",
      },
      {
        id: "c",
        text: "Amplitude damping leaves $\\rho$'s own diagonal, with the populations it started with; dephasing leaves the pure ground state.",
      },
      {
        id: "d",
        text: "Dephasing leaves $I/2$ whatever $\\rho$ was, since removing the coherences removes everything $\\rho$ was carrying.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That is the depolarizing channel's fixed point, not these two. $I/2$ is where a channel that shrinks the whole Bloch vector toward the origin ends up. Amplitude damping instead drives the vector to a pole, and dephasing moves it only in the plane.",
      c: "The two channels are the right way round in another option. Damping is the one that moves probability between the levels, since its Kraus operator carries $|0\\rangle\\langle1|$; dephasing's Kraus operators are diagonal, so they cannot move population at all.",
      d: "Removing the coherences is not the same as removing the information. Dephasing kills the off-diagonal entries and leaves the diagonal untouched, so a $\\rho$ that began at 90/10 populations still reads 90/10 afterwards. It reaches $I/2$ only from the states that already had even populations.",
    },
    defaultIncorrectFeedback:
      "Ask what each channel's Kraus operators can and cannot do to the diagonal of $\\rho$, then push that answer to its limit.",
  },
  hints: [
    {
      text: "Both channels leave $\\rho$ diagonal in the long run, so the coherences do not separate them. The diagonal does: ask, for each channel, whether the two populations are free to move.",
    },
    {
      text: "Look at the Kraus operators. One channel's set includes an operator that maps $|1\\rangle$ to $|0\\rangle$; the other's are all diagonal. Only one of those can shift probability between the levels.",
    },
    {
      text: "Push each one to its limit. A channel that keeps moving probability one way has a single fixed point; a channel that cannot move probability at all has a different fixed point for every starting diagonal.",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "Amplitude damping's Kraus set contains $K_1=\\sqrt{\\gamma}\\,|0\\rangle\\langle1|$, which transfers population from the excited level to the ground level and never the other way. Repeated application drains the excited population to zero.",
        latex: "\\rho \\longrightarrow |0\\rangle\\langle 0|",
      },
      {
        description:
          "Dephasing's Kraus operators are diagonal (built from $I$ and $Z$), so they commute with the population operator and cannot move probability between the levels. What they do is attenuate the off-diagonal entries by a factor below 1 on every application.",
        latex: "\\rho_{01} \\longrightarrow 0, \\qquad \\rho_{00},\\rho_{11}\\ \\text{unchanged}",
      },
      {
        description:
          "So the two channels have different fixed points: damping has exactly one, the pure ground state, while dephasing has a whole family, one for every set of starting populations.",
      },
    ],
    finalAnswer:
      "Amplitude damping leaves $|0\\rangle\\langle0|$; dephasing leaves the diagonal matrix built from $\\rho$'s original populations.",
  },
  explanation: {
    correctIdea:
      "The two channels look alike through the coherences and differ entirely through the populations. That difference is what makes $T_1$ and $T_2$ two separate numbers on a hardware datasheet rather than one.",
    whyCorrect:
      "A channel's long-time behaviour is decided by its fixed points, and the Kraus operators say what those can be. Damping's off-diagonal Kraus operator makes the flow one-way, which admits only one fixed point; dephasing's diagonal operators leave the populations invariant by construction, so every diagonal $\\rho$ is a fixed point of it. This is also why $T_2 \\le 2T_1$: whatever relaxes the populations dephases the coherences as a side effect, but dephasing can and does happen on its own.",
    whyWrong: [
      {
        optionId: "b",
        text: "Attributes the depolarizing channel's fixed point to both of these. $I/2$ is where a uniform contraction of the Bloch vector ends; neither of these channels contracts it uniformly.",
      },
      {
        optionId: "c",
        text: "Swaps the two. Diagonal Kraus operators cannot move population, so dephasing is the one that cannot reach a fixed ground state from an arbitrary start.",
      },
      {
        optionId: "d",
        text: "Reads loss of coherence as loss of everything. The diagonal survives dephasing intact, and it is exactly the classical information a measurement in the computational basis would have returned all along.",
      },
    ],
  },
};
