import type { ConceptualProblem } from "@/lib/problems/types";

export const quantumAdvantageHardVsUsefulTwoAxes: ConceptualProblem = {
  meta: {
    slug: "quantum-advantage-hard-vs-useful-two-axes",
    title: "Hard to Simulate vs. Practically Useful: Two Separate Axes",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["quantum-advantage", "random-circuit-sampling", "quantum-chemistry", "claim-evaluation"],
    prerequisites: ["apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why 'hard to classically simulate' and 'practically useful' are two separate, independent axes for evaluating a quantum computing demonstration, rather than two names for the same property. Use random circuit sampling and molecular ground-state simulation as your two contrasting examples, and explain why conflating the two axes is a common source of confusion in how these results are reported publicly.",
    placeholder:
      "Think about where random circuit sampling and molecular simulation would each land on a hardness axis and a usefulness axis separately...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["two separate axes", "two independent axes", "independent questions", "orthogonal", "not the same axis", "two different questions", "separate from"],
        missingFeedback:
          "Your examples are right but you have not said what they are examples of. State the relationship between the two properties before you illustrate it.",
      },
      {
        phrases: ["random circuit sampling", "boson sampling", "sample from the output distribution"],
        missingFeedback:
          "The question asks for two named contrasting demonstrations. Name the one that was designed to be difficult rather than to answer anything.",
      },
      {
        phrases: ["no direct use", "no practical use", "not useful on its own", "no economic", "no use", "no application", "no real use", "useless", "not useful", "nobody wants", "no one wants", "no one needs", "engineered to be hard", "chosen for hardness", "chosen because it is hard", "not for its usefulness"],
        missingFeedback:
          "You have named the hardness-designed demonstration but not said where it lands on the other axis. Say what its output is actually good for.",
      },
      {
        phrases: ["molecular", "ground state", "ground-state energy", "molecule", "chemistry"],
        missingFeedback:
          "You have one example. Give the contrasting one: a computation people genuinely want the answer to.",
      },
      {
        phrases: [
          "useful regardless",
          "useful whether or not",
          "independently useful",
          "useful either way",
          "valuable regardless of hardness",
          "regardless of",
          "whether or not",
          "no matter",
          "independent of",
          "does not depend",
          "doesn't depend",
          "even if it is classically easy",
          "even if classically easy",
          "still worth",
        ],
        missingFeedback:
          "Both tasks and both axes are on the page. The contrast is unfinished until you say why the second example lands differently: its worth is settled by what the number is for, and a faster way to compute it would leave that worth exactly where it was. Say why.",
      },
    ],
    incorrectFeedback:
      "The claim collapses two questions into one. 'Hard for a classical computer' and 'worth doing' answer unrelated things, and a task can score high on either while scoring low on the other. The lesson's two examples were chosen to sit in opposite corners of that grid, so an answer naming only one of them, or naming both but treating hardness as the reason the second matters, has missed the point. Name each task, say where each lands on both axes, and say what the second example would be worth even if it turned out to be easy to simulate.",
    partialFeedback:
      "You have part of it. Four things have to appear: both example tasks by name, where each one lands on hardness, where each one lands on worth, and the reason the second example's worth would survive a discovery that it is easy to simulate.",
    modelAnswers: [
      "They are two independent questions. Random circuit sampling was engineered to be hard to simulate and has no practical use on its own; nobody wants those samples. A molecule's ground-state energy is useful to chemistry regardless of whether that particular molecule happens to be classically easy. Reporting slides from one axis to the other, which is where the confusion comes from.",
      "Hard to simulate and useful are not the same axis. Boson sampling and random circuit sampling are chosen for hardness, not for their usefulness, and on their own they have no application. The ground-state energy of a molecule is independently useful even if it is classically easy, so usefulness does not depend on hardness. Press coverage treats the two as one.",
    ],
  },
  hints: [
    { text: "Where would random circuit sampling land on a 'hard to classically simulate' axis? Where would it land on a 'practically useful' axis? Are those the same answer?" },
    { text: "Does a molecule's ground-state energy stop being useful to chemistry if that particular molecule happens to be classically easy to simulate?" },
    { text: "Name the specific structural reason (from the prerequisite lesson's two loopholes) that random circuit sampling is deliberately hard to simulate, and contrast it with why usefulness doesn't depend on that reason at all." },
  ],
  solution: {
    steps: [
      {
        description:
          "Random circuit sampling is deliberately constructed to avoid both known efficient-classical-simulation loopholes (Gottesman-Knill/stabilizer structure and bounded bond-dimension growth), which places it high on the 'hard to classically simulate' axis.",
      },
      {
        description:
          "That same task, sampling from one specific random circuit's output distribution, has no independent economic or scientific application; nobody wants that particular sample for its own sake. So it is low on the separate 'practically useful' axis.",
      },
      {
        description:
          "A molecule's ground-state energy sits differently: it is independently valuable to chemistry, materials science, and drug design regardless of whether that specific molecule is classically easy or classically hard to compute. Its position on the 'useful' axis does not move based on its position on the 'hardness' axis.",
      },
      {
        description:
          "Because the two axes vary independently, a task can occupy any of the four combinations (hard-and-useless, easy-and-useless, easy-and-useful, hard-and-useful). Reporting that assumes hardness implies usefulness, or the reverse, collapses two separate questions into one, which is the confusion seen in public coverage of 'quantum supremacy' results.",
      },
    ],
    finalAnswer:
      "Hardness-to-simulate and practical usefulness are two independent axes: random circuit sampling is deliberately hard to simulate (it avoids both the Gottesman-Knill and bounded-bond-dimension loopholes) but has no direct practical use on its own, while a molecule's ground-state energy is independently useful to chemistry regardless of whether that specific molecule is classically easy or hard to simulate. Conflating the two axes, by assuming 'hard to simulate' means 'important' or that 'useful' implies 'hard', is a real source of confusion in how these results are reported.",
  },
  explanation: {
    correctIdea:
      "A demonstration's classical-simulation hardness and its real-world usefulness are answers to two separate questions, and a rigorous evaluation of any quantum advantage claim has to check both without assuming one from the other.",
    whyCorrect:
      "Random circuit sampling and molecular ground-state simulation sit at opposite points on the usefulness axis while both potentially sitting high on the hardness axis, which is direct evidence the two axes vary independently rather than tracking each other.",
    whyWrong: [
      "Treating hardness as a proxy for importance ignores that random circuit sampling was chosen specifically because it is hard, with no separate claim to usefulness ever being made about the sampling task itself.",
      "Treating usefulness as requiring classical hardness ignores that plenty of practically important computations, many real molecules included, are classically tractable and still worth doing. Usefulness does not wait for hardness to be established.",
    ],
  },
};
