import type { ConceptualProblem } from "@/lib/problems/types";

export const queryLowerBoundVersusWallClockTime: ConceptualProblem = {
  meta: {
    slug: "query-lower-bound-versus-wall-clock-time",
    title: "What the √N Bound Does and Does Not Fix",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    difficulty: "master",
    estimatedMinutes: 9,
    problemType: "conceptual",
    tags: ["query-complexity", "lower-bounds", "oracle-model", "scope-of-a-theorem"],
    prerequisites: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  question: {
    type: "conceptual",
    prompt:
      "An engineer runs unstructured search on real hardware. On the bench there is no black box: the marking step is a compiled circuit of roughly ten thousand gates that evaluates f and flips the sign of the marked basis state, and the diffusion step sitting in between has to be executed too. This lesson established Q₂(OR_N) = Θ(√N) twice over, by the adversary method and by the polynomial method. Explain (a) what that result is a statement about, given the way the model it was proved in defines an algorithm's cost, and (b) why it fixes no figure in seconds for this device, in either direction.",
    placeholder:
      "Name the single quantity the theorem bounds. Then say what the model charges an algorithm nothing for, why that exemption is what makes the proof possible, and what the same exemption costs you when you try to predict a duration on real hardware.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["counts oracle calls", "counts only oracle calls", "number of oracle calls", "number of queries", "how many queries", "how many oracle calls", "queries to the oracle", "calls to the oracle"],
        missingFeedback:
          "Start by naming the single quantity the theorem puts a bound on. It is a tally of one specific kind of step, not a duration.",
      },
      {
        phrases: ["computation between queries", "between queries is free", "everything else is free", "everything else costs nothing", "free in the model", "unlimited computation", "unrestricted computation", "charged nothing for"],
        missingFeedback:
          "You named the tally. Now say what the model hands the algorithm for nothing, and why that generosity is what makes a proof covering every algorithm possible at all.",
      },
      {
        phrases: [
          "gate cost of the oracle",
          "cost of a single query",
          "cost per query",
          "how long one query takes",
          "how long a query takes",
          "time a query takes",
          "says nothing about runtime",
          "does not fix a runtime",
          "clock rate",
          "hardware speed",
          "one query is a circuit",
        ],
        missingFeedback:
          "The first two ideas are there: the quantity the theorem bounds, and the exemption the model grants everything else. What is still missing is the arithmetic that would turn a bound into a duration. On this bench, the thing being counted is not one machine instruction, and the model's exemption is not honoured by the hardware either. Say what would have to be measured, and in what units, before a figure in seconds could follow.",
      },
    ],
    incorrectFeedback:
      "Two separate failures are bundled together here. The first is about scope: the theorem was proved inside a model that charges an algorithm for one thing and hands it everything else for nothing, and part (a) asks you to name that one thing and say what the exemption buys the proof. The second is about units: a bound on how many times something happens is not a duration until you multiply it by what one of those happenings costs on the bench, and this bench also has to run the step in between. Name the quantity being bounded, name the exemption, and say what would have to be measured before seconds could be quoted.",
    partialFeedback:
      "Part of it is there. Three things have to appear together: the single quantity the theorem bounds, the exemption the model grants everything else, and the reason a bounded count of that quantity still leaves a duration undetermined on this device.",
    modelAnswers: [
      "Theta(sqrt N) counts oracle calls and nothing else. The model charges you nothing for the computation between queries, which is exactly why one proof can cover every algorithm. On the bench that exemption is fiction: one query is ten thousand gates, so until you know the gate cost of the oracle the theorem fixes no runtime at all.",
      "It bounds the number of queries. Everything else is free in the model, so the diffusion step and the compiled marking circuit cost the theorem nothing. That is why it says nothing about runtime in seconds, neither a floor nor a ceiling, until someone tells you how long one query takes.",
    ],
  },
  hints: [
    { text: "The model's definition of cost is doing all the work in part (a). Go back to what it says an algorithm is charged for, and what it declines to charge for." },
    { text: "Set part (b) up as a product rather than a single figure: a tally of something, multiplied by whatever one of those things costs to execute, plus whatever the device does in between." },
    { text: "Both proofs allow the algorithm to do arbitrary work between one call and the next, at no charge. Ask what that permission buys the proof, and what the same permission costs an estimate of a real machine." },
  ],
  solution: {
    steps: [
      {
        description:
          "The query model charges an algorithm for exactly one thing: calls to the oracle gate. Every other unitary between calls is free, unlimited, and allowed to depend arbitrarily on everything seen so far. $\\Theta(\\sqrt N)$ is therefore a statement about a count of oracle calls, and about nothing else.",
      },
      {
        description:
          "That exemption is not a simplification the proofs tolerate; it is what makes them possible. Both the adversary method and the polynomial method need to rule out every conceivable algorithm at once. Granting the algorithm unlimited free computation means the proof never has to reason about what that computation is: the adversary method only needs that one query moves a progress measure by a bounded amount, and the polynomial method only needs that one query raises the degree of the acceptance probability by at most one.",
      },
      {
        description:
          "On this device neither half of the accounting survives. One query is a compiled circuit of about ten thousand gates, so the tally has to be multiplied by a per-call cost the theorem never mentions, and the diffusion step the model hands over for free is a real circuit the hardware has to execute. A duration is a product of a count and a cost per item, and the theorem supplies only the count.",
      },
      {
        description:
          "The bound also carries a suppressed constant, so it does not even pin the count exactly for one $N$. This platform's own Grover helper puts the optimal iteration count at 3 for $N=16$, while the hand-computed $\\mathrm{ADV}(\\mathrm{OR}_{16})$ is 4, and $Q_2(f)=\\Omega(\\mathrm{ADV}(f))$ is consistent with that for any constant $c\\le3/4$. What the bound does establish is a growth rate that has no ceiling, so no fixed query count works for every $N$.",
      },
    ],
    finalAnswer:
      "Θ(√N) counts oracle calls and nothing else. All computation between queries is free in the model, and that exemption is exactly what lets one proof cover every conceivable algorithm. On real hardware the exemption is fiction and one query is a circuit of thousands of gates, so the gate cost of the oracle and the cost of the diffusion step would both have to be measured before any figure in seconds followed; the theorem sets neither a floor nor a ceiling on wall-clock time.",
  },
  explanation: {
    correctIdea:
      "A query lower bound is a statement about a tally, proved in a model that deliberately gives away everything except that tally, and a tally becomes a duration only when multiplied by a cost per item the model never supplies.",
    whyCorrect:
      "The universal quantifier is the whole content of a lower bound: it has to hold against every algorithm, including ones nobody has invented. Making all non-query computation free is what shrinks the space of things a proof must reason about down to something an adversary matrix or a polynomial degree can control. The price of that shrinkage is paid on the other side: the model has thrown away precisely the quantities, gate cost per call and the work between calls, that a wall-clock estimate is made of.",
    whyWrong: [
      "Treating a query bound as a circuit-complexity or time-complexity bound. This is the scope error the lesson attaches to both techniques and that BQP and Oracle Complexity attached to BBBV: a proof about calls to a black box says nothing about an algorithm allowed to inspect f's internal structure directly.",
      "Reading the raw number as an exact query count. The theorem promises an order of growth up to a fixed universal constant, which is why a real optimum can sit below the computed adversary value with no contradiction.",
    ],
  },
};
