import type { ConceptualProblem } from "@/lib/problems/types";

export const quantumVsClassicalIndistinguishability: ConceptualProblem = {
  meta: {
    slug: "quantum-vs-classical-indistinguishability",
    title: "Quantum vs. Classical Indistinguishability",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/indistinguishability",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["indistinguishability", "conceptual"],
    prerequisites: ["quantum-mechanics/identical-particles/indistinguishability"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the key difference between classical and quantum indistinguishability, focusing on whether a trajectory could in principle be used to tell particles apart.",
    placeholder: "Classically, identical particles could in principle be distinguished by... Quantum mechanically, this is impossible because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "no trajectory" does not match "no trajectories" (the stemmer turns the
      // plural into "trajectori", which the singular is not a prefix of), so
      // this problem's own model answer graded as incomplete. Splitting the two
      // groups along the classical/quantum line also stops a quantum-only
      // answer from satisfying both.
      {
        phrases: ["classically", "classical particle", "could in principle", "in principle be", "could be tracked", "could follow", "watch which one", "paint a dot", "billiard"],
        missingFeedback:
          "Start with the classical picture. Say what you would be able to do, at least in thought, to tell two identical balls apart.",
      },
      {
        phrases: ["no trajector", "no continuous path", "no well-defined path", "no path to follow", "do not have trajector", "don't have trajector", "lack trajector", "cannot", "impossible", "no dot to paint"],
        missingFeedback:
          "You have the classical side. Now say what quantum particles lack that rules the same trick out entirely, rather than merely making it hard.",
      },
    ],
    incorrectFeedback: "You said quantum particles are 'identical', which is also true of two mass-produced coins. The question is about labelling: name the thing a classical observer could use to keep two objects apart forever, and then say what the quantum description offers in its place.",
    partialFeedback: "State both the classical possibility and the quantum impossibility.",
    modelAnswers: [
      "Classically two identical billiard balls could in principle be told apart by watching which one went where: each follows a continuous trajectory, so you could track them even without painting a dot. Quantum particles have no trajectories at all, so there is no path to follow and the indistinguishability is fundamental rather than practical.",
      "A classical particle could be tracked along its path, so identical particles are only practically indistinguishable. Quantum mechanically there is no well-defined path, so telling them apart is impossible even in principle.",
    ],
  },
  hints: [
    { text: "Imagine two coins on a table. What could you do, even without marking either of them, to make sure you never confuse them after they collide?" },
    { text: "Now try the same with two electrons. What would you have to keep your eye on between measurements, and does the quantum description provide it?" },
    { text: "If the thing you would need to watch never exists between measurements, say what that costs you the moment the two overlap." },
  ],
  solution: {
    steps: [
      { description: "Classically, even perfectly identical particles could in principle be tracked via their continuous trajectories: you could watch which one started where and follow it the whole time." },
      { description: "Quantum mechanically, particles don't have well-defined continuous trajectories between measurements, so there is no analogous way, even in principle, to track 'which particle is which.'" },
      { description: "This is why quantum indistinguishability is a stronger, structural fact (forcing definite exchange symmetry) rather than just a practical limitation." },
    ],
    finalAnswer: "Classical particles could in principle be tracked via continuous trajectories despite looking identical; quantum particles have no trajectories to track, making indistinguishability fundamental rather than practical.",
  },
  explanation: {
    correctIdea: "This is the conceptual core the lesson's Motivation section opens with: the billiard-ball-with-a-dot thought experiment.",
    whyCorrect: "Classical indistinguishability is a limitation of the observer: the trajectories exist whether or not anyone follows them. Quantum indistinguishability removes the trajectories themselves, so there is nothing left that a better observer could have followed.",
    whyWrong: ["Saying quantum particles are just 'harder to measure individually' misses that the issue is not measurement difficulty. No well-defined trajectory-based identity exists to measure in the first place."],
  },
};
