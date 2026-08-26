import type { ConceptualProblem } from "@/lib/problems/types";

export const quantumAdvantageHardVsUsefulTwoAxes: ConceptualProblem = {
  meta: {
    slug: "quantum-advantage-hard-vs-useful-two-axes",
    title: "Hard to Simulate vs. Practically Useful: Two Separate Axes",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    difficulty: "advanced",
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
      [
        "two separate axes",
        "two independent axes",
        "independent questions",
        "orthogonal",
        "not the same axis",
        "two different questions",
        "separate from",
      ],
      [
        "random circuit sampling",
        "boson sampling",
        "sample from the output distribution",
      ],
      [
        "no direct use",
        "no practical use",
        "not useful on its own",
        "no economic",
        "engineered to be hard",
        "chosen for hardness",
        "not for its usefulness",
      ],
      [
        "molecular",
        "ground state",
        "ground-state energy",
        "molecule",
        "chemistry",
      ],
      [
        "useful regardless",
        "useful whether or not",
        "independently useful",
        "useful either way",
        "valuable regardless of hardness",
      ],
    ],
    incorrectFeedback:
      "Make sure your answer names both examples specifically and states the independence clearly: random circuit sampling was deliberately chosen because it is hard to classically simulate (avoiding both the Gottesman-Knill and bounded-bond-dimension loopholes), but the sampled distribution itself has no direct practical or economic use. A molecule's ground-state energy is independently useful to chemistry and materials science regardless of whether that specific molecule turns out to be classically easy or classically hard to simulate. Because these are two separate questions, a task can be hard-and-useless, useful-and-easy, or (the valuable target) useful-and-hard -- and treating 'hard to simulate' as synonymous with 'important' (or vice versa) is what produces public confusion.",
    partialFeedback:
      "You have part of the idea -- be sure to explicitly name both example tasks and state clearly that usefulness and classical hardness are answers to two different questions, not two words for the same property.",
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
          "That same task -- sampling from one specific random circuit's output distribution -- has essentially no independent economic or scientific application; nobody wants that particular sample for its own sake. So it is low on the separate 'practically useful' axis.",
      },
      {
        description:
          "A molecule's ground-state energy sits differently: it is independently valuable to chemistry, materials science, and drug design regardless of whether that specific molecule is classically easy or classically hard to compute. Its position on the 'useful' axis does not move based on its position on the 'hardness' axis.",
      },
      {
        description:
          "Because the two axes vary independently, a task can occupy any of the four combinations (hard-and-useless, easy-and-useless, easy-and-useful, hard-and-useful), and reporting that assumes hardness implies usefulness (or the reverse) collapses two genuinely separate questions into one, which is exactly the confusion seen in public coverage of 'quantum supremacy' results.",
      },
    ],
    finalAnswer:
      "Hardness-to-simulate and practical usefulness are two independent axes: random circuit sampling is deliberately hard to simulate (it avoids both the Gottesman-Knill and bounded-bond-dimension loopholes) but has no direct practical use on its own, while a molecule's ground-state energy is independently useful to chemistry regardless of whether that specific molecule is classically easy or hard to simulate. Conflating the two axes -- assuming 'hard to simulate' means 'important' or that 'useful' implies 'hard' -- is a common, real source of confusion in how these results are reported.",
  },
  explanation: {
    correctIdea:
      "A demonstration's classical-simulation hardness and its real-world usefulness are answers to two separate questions, and a rigorous evaluation of any quantum advantage claim has to check both without assuming one from the other.",
    whyCorrect:
      "Random circuit sampling and molecular ground-state simulation sit at opposite points on the usefulness axis while both potentially sitting high on the hardness axis, which is direct evidence the two axes vary independently rather than tracking each other.",
    whyWrong: [
      "Treating hardness as a proxy for importance ignores that random circuit sampling was chosen specifically because it is hard, with no separate claim to usefulness ever being made about the sampling task itself.",
      "Treating usefulness as requiring classical hardness ignores that plenty of practically important computations (including many real molecules) are classically tractable and still worth doing -- usefulness doesn't wait for hardness to be established.",
    ],
  },
};
