import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisTunnelingVsResonanceRegimes: ConceptualProblem = {
  meta: {
    slug: "synthesis-tunneling-vs-resonance-regimes",
    title: "Synthesis: The Two Barrier-Scattering Regimes",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "tunneling", "resonance"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A particle's energy E is slowly increased from below a barrier's height V0 to above it. In two or three sentences, describe how the transmission probability's qualitative behavior changes as E crosses V0, connecting the tunneling (tanh/exponential) and resonance (oscillatory) regimes.",
    placeholder: "Describe the transition between the two scattering regimes...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["exponentially small", "exponentially suppressed", "falls off exponentially", "decays exponentially", "small and exponential", "decaying inside", "evanescent"],
        missingFeedback:
          "Take the sub-barrier side first. Say what the wavefunction does inside the barrier there, and how the transmission depends on the barrier's width.",
      },
      {
        phrases: ["sin^2", "can reach exactly 1", "reaching exactly 1", "reaches 1", "perfect transmission", "transmission resonances", "oscillates with barrier width", "oscillates with width", "oscillates as the width"],
        missingFeedback:
          "You have the tunneling side. Now say what changes once E passes the top: what does transmission do as the width varies, and what is the largest value it reaches?",
      },
    ],
    incorrectFeedback: "You wrote that transmission simply rises as E increases. That is not what happens: on the two sides of the barrier top, T is described by two different kinds of function, and one of them does something the other cannot. Say what each function looks like and what the crossing point does to the graph.",
    partialFeedback: "You covered one side of the barrier top. The other side behaves qualitatively differently, not just quantitatively; say what its T does as E keeps rising, and whether it ever stops changing.",
    modelAnswers: [
      "Below V0 the wavefunction is evanescent inside the barrier and transmission is exponentially small in the barrier width. Above V0 it oscillates inside instead, so transmission oscillates with barrier width and reaches exactly 1 at the resonances.",
      "For E below the top, transmission decays exponentially with width, which is tunneling. Once E passes V0 the inside solution becomes oscillatory, transmission goes like sin^2 of the phase across the barrier, and you get perfect transmission at certain widths.",
    ],
  },
  hints: [
    { text: "Two different formulas for T are in play, one from Tunneling and the Finite Barrier and one from this course. Write both down side by side before comparing them." },
    { text: "Look at what sits inside each formula's special function. In one the argument is real; in the other the same quantity has turned imaginary. That single change is the whole transition." },
    { text: "Sketch T against E through the crossing. On one side it climbs steadily from almost nothing; on the other it does something no steadily-climbing curve does. What is the largest value it reaches there?" },
  ],
  solution: {
    steps: [
      { description: "Below $V_0$: the wavefunction decays inside the barrier, giving transmission that falls off roughly exponentially with barrier width. It is always small for a wide or tall barrier, and never exactly zero." },
      { description: "Above $V_0$: the wavefunction oscillates inside the barrier instead, giving transmission that oscillates with barrier width via $\\sin^2(k_2L)$. It is generally high, and reaches exactly 1 at resonance." },
    ],
    finalAnswer: "Below V0, transmission is small and roughly exponential in barrier width (tunneling); above V0, transmission is generally high and oscillates with barrier width, reaching exactly 1 at resonances. The change of behavior happens at E=V0, where the wavefunction's character inside the barrier switches from decaying to oscillating.",
  },
  explanation: {
    correctIdea: "E=V0 is a genuine qualitative transition point, not just a boundary between two similar formulas.",
    whyCorrect: "This synthesizes the two courses' complementary treatments of the same physical barrier.",
    whyWrong: ["Assuming transmission increases smoothly and monotonically as E crosses V0 misses that the resonance structure (oscillating between values, including exactly 1) appears only once E exceeds V0. The two regimes are qualitatively, not just quantitatively, different."],
  },
};
