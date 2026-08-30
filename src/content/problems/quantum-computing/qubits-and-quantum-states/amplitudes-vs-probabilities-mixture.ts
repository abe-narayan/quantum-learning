import type { ConceptualProblem } from "@/lib/problems/types";

export const amplitudesVsProbabilitiesMixture: ConceptualProblem = {
  meta: {
    slug: "amplitudes-vs-probabilities-mixture",
    title: "Amplitudes vs. Classical Mixture Probabilities",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["interference", "amplitudes", "classical-probability"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A classical probabilistic bit is 0 with probability p and 1 with probability 1-p, which is also a kind of 'partly 0, partly 1'. Explain what separates this classical mixture from quantum superposition.",
    placeholder: "In a classical mixture, probabilities...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["add the amplitudes", "amplitudes add", "add amplitudes", "amplitudes are added", "add up the amplitudes", "adding amplitudes", "amplitudes first", "add then square", "square the sum", "squaring the sum", "sum of the amplitudes", "amplitudes can be negative", "negative amplitude", "amplitudes have signs", "amplitudes carry a phase", "complex number", "probabilities add directly", "add probabilities", "adding the probabilities", "probabilities just add", "square before adding", "squared before adding"],
        missingFeedback:
          "You have named the effect. Now say what is being added together in each of the two cases, and in what order the adding and the squaring happen.",
      },
      {
        phrases: ["interference", "cancel", "cancellation", "constructive", "destructive"],
        missingFeedback:
          "You have said what gets added in each case. Now say what that difference makes possible in the quantum case that simply cannot happen when probabilities are put together.",
      },
    ],
    incorrectFeedback:
      "You said the quantum case is 'random in a different way', which is a label rather than a mechanism. Ask what object is being added in each case before you square anything, and what that ordering of operations makes possible.",
    partialFeedback: "Now connect it to what that ordering allows. What can a sum of signed or complex quantities do that a sum of non-negative ones never can?",
    modelAnswers: [
      "In the classical case you just add the probabilities and that is that. In the quantum case you add the amplitudes first and square afterwards, and because amplitudes can be negative they can cancel, which is interference. Probabilities never cancel.",
      "A classical mixture adds probabilities directly, so nothing can ever cancel. A superposition adds amplitudes, and squaring the sum afterwards lets terms interfere constructively or destructively.",
    ],
  },
  hints: [
    { text: "In the classical mixture, write down what you add to get the total chance of an outcome." },
    { text: "In the quantum case, write down what you add first, and what you do to the sum afterwards." },
    { text: "Squaring a sum is not the same as summing squares. Say what that difference lets the quantum case produce that the classical one cannot." },
  ],
  solution: {
    steps: [
      {
        description:
          "A classical mixture combines probabilities directly: they simply add up to 1, with no room for cancellation or reinforcement.",
      },
      {
        description:
          "A quantum superposition combines amplitudes, which are added together (possibly with different signs or complex phases) before being squared into probabilities.",
      },
      {
        description:
          "Because $|\\alpha+\\beta|^2 \\neq |\\alpha|^2+|\\beta|^2$ in general, this amplitude-then-square process allows constructive interference (probabilities larger than either part) and destructive interference (probabilities exactly zero even though both parts are individually nonzero). A classical probability mixture can produce neither.",
      },
    ],
    finalAnswer:
      "Classical mixtures add probabilities directly (no interference possible); quantum superpositions add amplitudes first, and squaring that sum allows genuine interference.",
  },
  explanation: {
    correctIdea: "The order of operations, add-then-square (quantum) versus just add (classical), is the entire source of interference.",
    whyCorrect: "This is precisely the gap the lesson identifies as the origin of every quantum algorithmic advantage explored later in the curriculum.",
    whyWrong: [
      "Saying quantum states are 'more random' than classical mixtures misses the mathematical distinction. Both involve randomness at measurement; only one involves amplitudes that can interfere before that point.",
    ],
  },
};
