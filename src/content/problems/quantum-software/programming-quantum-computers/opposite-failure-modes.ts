import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const oppositeFailureModes: MultipleChoiceProblem = {
  meta: {
    slug: "opposite-failure-modes",
    title: "How Do Simulators and Hardware Fail Differently?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["simulators"],
    prerequisites: ["quantum-software/programming-quantum-computers/simulators-vs-real-hardware"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, how do simulators and real hardware fail in 'opposite' ways?",
    options: [
      { id: "a", text: "Simulators are exact but pay exponential memory; hardware has no memory wall but carries real physical error" },
      { id: "b", text: "Simulators approximate the physics to stay fast; hardware is exact because it is the physics" },
      { id: "c", text: "Both run out at the same place: qubit count is the binding limit for either one" },
      { id: "d", text: "Simulators carry accumulated floating-point error; hardware pays the exponential memory cost of holding 2ⁿ amplitudes" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "A state-vector simulator does not approximate: it multiplies the exact matrices and keeps every amplitude. That is the whole reason it costs 2ⁿ memory. Hardware is the physics, but noisy physics, so its answers are the approximate ones.",
      c: "Qubit count binds a simulator hard, since memory doubles per qubit. Hardware adds qubits cheaply by comparison; what binds it is circuit depth against the error rate.",
      d: "This swaps the two. Floating-point rounding on a simulator is far below the noise floor of any device, and hardware never stores 2ⁿ amplitudes anywhere; the physical state holds them implicitly.",
    },
    defaultIncorrectFeedback: "Ask what each one is good at before asking what it is limited by: a simulator's answers are exact, and a device's qubit count is not the thing that costs it.",
  },
  hints: [
    { text: "Take each system in turn and name what it does well, then what runs out." },
    { text: "A simulator does exact linear algebra, and holding a general n-qubit state takes 2ⁿ amplitudes in memory." },
    { text: "Hardware never stores those amplitudes anywhere, but every gate it applies is a physical operation with a real error rate." },
  ],
  solution: {
    steps: [{ description: "A simulator computes exact amplitudes, and paying for that exactness costs memory that doubles with every qubit. Hardware holds the state physically, so it faces no memory wall, and pays instead in real gate error. The strength of each is the weakness of the other." }],
    finalAnswer: "Simulators are exact but pay exponential memory; hardware has no memory wall but carries real physical error.",
  },
  explanation: {
    correctIdea: "The two limits are complementary rather than shared: exactness at the cost of memory on one side, unlimited state size at the cost of noise on the other. That is why the choice between them depends on what a given experiment needs.",
    whyCorrect: "Matches the lesson's Physical Interpretation section.",
    whyWrong: [
      { optionId: "b", text: "Reverses which system is exact. The simulator's exactness is what makes it expensive." },
      { optionId: "c", text: "Collapses two different limits into one. Qubit count binds the simulator; depth against error rate binds the device." },
      { optionId: "d", text: "Swaps the two failure modes outright." },
    ],
  },
};
