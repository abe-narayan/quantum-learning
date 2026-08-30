import type { ConceptualProblem } from "@/lib/problems/types";

export const whyRxNeedsFullTurnOnOne: ConceptualProblem = {
  meta: {
    slug: "why-rx-needs-full-turn-on-one",
    title: "Why Rx Needs a Full 2π Turn on |1⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["rotations", "rx", "bloch-sphere"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
  },
  question: {
    type: "conceptual",
    prompt:
      "|1⟩, the south pole, is fixed by Rz for any angle, but not by Rx. Explain geometrically why Rx(θ)|1⟩ needs a full θ = 2π before it returns to the same Bloch point as |1⟩. Why can no smaller angle work?",
    placeholder: "Where does |1⟩ sit relative to the x-axis, and what shape does it trace under Rx?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["not on the x-axis", "off the x-axis", "off axis", "off-axis", "perpendicular", "not on the rotation axis", "not the rotation axis", "z-axis", "z axis", "different axis", "away from the axis"],
        missingFeedback:
          "Say where |1> sits relative to the axis Rx turns about. That position is the whole reason it moves at all.",
      },
      // Bare "2π" strips to the token "2", which matched any answer containing
      // the digit 2. Each phrase below pairs the angle with a word.
      {
        phrases: ["full circle", "2pi", "2π rotation", "2π about", "complete revolution", "complete circle", "full turn", "full rotation", "360", "traces a whole circle", "closes only after a whole turn"],
        missingFeedback:
          "You have said where the point sits. Now describe the path it follows under Rx, and say how much of that path has to be covered before it lands back where it began.",
      },
    ],
    incorrectFeedback: "Start with where |1⟩ actually sits on the sphere relative to the x-axis, then think about what path it traces under a rotation about that axis.",
    partialFeedback: "Now explain why a point that does not sit on the line being turned about has to go all the way round before it comes home.",
    modelAnswers: [
      "|1> sits on the z-axis, not on the x-axis, so it is not on the rotation axis. Under Rx it traces a whole circle around the x-axis, and a circle only closes back on itself after a complete revolution, so nothing smaller than 2pi brings it back.",
      "Only points on the rotation axis stay put. |1> is off the x-axis, so Rx sweeps it around a full circle; any angle less than a full turn leaves it somewhere else on that circle.",
    ],
  },
  hints: [
    { text: "Locate |1⟩ on the sphere and locate the axis Rx turns about. Are they the same line?" },
    { text: "A rotation fixes exactly the points lying on its own axis. Everything else traces something as the angle grows. What shape?" },
    { text: "Follow |1⟩ along that shape. At which angle does it first arrive back where it started, and why can no smaller angle do it?" },
  ],
  solution: {
    steps: [
      { description: "|1⟩ sits on the $z$-axis (the south pole), which is perpendicular to, not aligned with, the $x$-axis." },
      { description: "Under $R_x(\\theta)$, a point not on the $x$-axis traces a circle around that axis as $\\theta$ varies." },
      { description: "Like any point moving uniformly around a circle, it returns to its starting position only after a full $2\\pi$ sweep, and no smaller positive angle brings it back." },
    ],
    finalAnswer: "θ = 2π is the smallest positive angle, because |1⟩ is off the x-axis and traces a full circle under Rx, only closing back on itself after a complete revolution.",
  },
  explanation: {
    correctIdea: "Only points sitting exactly on a rotation's own axis are fixed by that rotation; every other point traces a circle and needs a full 2π to return.",
    whyCorrect: "This is the same reasoning Rz's effect on θ used, applied to a different axis: |1⟩ is fixed by Rz (it's on the z-axis) but not by Rx (it isn't on the x-axis).",
    whyWrong: [
      "Assuming any rotation returns a point to itself after π, by analogy with X, Y, Z each squaring to the identity. That is a fact about those particular π-rotations, not about sweep angles in general.",
      "Confusing 'fixed by the rotation' with 'moved, then eventually returning'. Under Rx, |1⟩ is the second case.",
    ],
  },
};
