import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const zeroMeanNotSufficientMc: MultipleChoiceProblem = {
  meta: {
    slug: "zero-mean-not-sufficient-mc",
    title: "Why Zero Mean Gradient Isn't the Barren Plateau",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["barren-plateaus", "gradients"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"],
  },
  question: {
    type: "multiple-choice",
    prompt: "This lesson derives E[∂C/∂θ]=0 exactly, using only an elementary trig integral, true for essentially any circuit depth or qubit count. Why isn't this fact, by itself, the barren plateau problem?",
    options: [
      { id: "a", text: "A zero-mean gradient holds for trainable landscapes too; what bites is that the typical gradient size collapses for deep circuits with global costs" },
      { id: "b", text: "The zero-mean result is sound but it is derived one parameter at a time, and the plateau only appears once every parameter is varied together" },
      { id: "c", text: "Zero mean is necessary but not sufficient: a landscape is flat only when mean and variance both vanish, and variance vanishes for shallow circuits" },
      { id: "d", text: "Zero mean has nothing to do with trainability; the real obstruction is that deep circuits outrun the hardware's coherence time on any device" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The per-parameter derivation is not the gap. Each parameter's gradient separately has zero mean and an exponentially small variance, so the plateau is already visible parameter by parameter; varying them together does not create it.",
      c: "The structure is right and the direction is backwards. The variance decays for deep, expressive circuits with global cost functions, and it is shallow circuits with local costs where usable gradients survive.",
      d: "This lesson's argument is about statistical and optimisation structure. Coherence time is a real constraint but a separate one: the plateau appears in noiseless simulation as well.",
    },
    defaultIncorrectFeedback: "Recall the lesson's explicit point: zero mean alone describes even well-behaved cost landscapes just fine.",
  },
  hints: [
    { text: "Think of an ordinary bowl-shaped (convex) cost function symmetric around its minimum. Its gradient also averages to zero over a symmetric domain." },
    { text: "What actually prevents an optimizer from finding a useful direction is the gradient being small everywhere, not just balanced on average." },
    { text: "The lesson's variance result is what's specifically tied to qubit count and circuit depth." },
  ],
  solution: {
    steps: [
      { description: "Zero mean is a property shared by any landscape symmetric enough for positive and negative gradient directions to balance, including easily trainable ones." },
      { description: "The real obstruction is the gradient's typical magnitude (standard deviation, i.e. √variance) collapsing toward zero as n grows." },
      { description: "That's a statement about variance, specifically shown (cited from concentration of measure) to scale as O(2^-n) for deep, expressive circuits against global cost functions." },
    ],
    finalAnswer: "Zero mean also holds for easily trainable landscapes; the obstruction is the gradient's variance collapsing for deep circuits and global cost functions.",
  },
  explanation: {
    correctIdea: "Barren plateaus are a variance (typical-magnitude) phenomenon, not a mean phenomenon.",
    whyCorrect: "The lesson proves two different things: one elementary and fully general, one deep and n-dependent. Reading the first as though it delivered the second is exactly the error being probed here.",
    whyWrong: [
      { optionId: "b", text: "Relocates the problem to how many parameters are varied. Zero mean and vanishing variance both hold parameter by parameter, so the plateau is there either way." },
      { optionId: "c", text: "Gets the dependence the wrong way round. It is depth and expressivity, together with a global cost, that drive the variance down; shallow local circuits are where gradients survive." },
      { optionId: "d", text: "Relocates the obstruction to hardware coherence times. This lesson's argument is about statistical and optimisation structure, and holds in noiseless simulation." },
    ],
  },
};
