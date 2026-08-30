import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { conceptualContextFor, validateConceptual } from "../validators/conceptual";
import { conceptGroupPhrases, type ConceptualProblem } from "../types";

/**
 * What a student who is trying to beat the grader can get away with, and what
 * a student who is trying to answer it is charged for. Both measured against
 * every conceptual problem in the corpus rather than a hand-picked fixture,
 * because both defects this file exists for were invisible at fixture scale.
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS MEASURED, AND WHEN
 * ---------------------------------------------------------------------------
 * Before the §3b/§4 work in `validators/conceptual.ts`, over all 175 conceptual
 * problems, grading each problem's own `solution.finalAnswer` and variants of
 * it:
 *
 *   the model answer, asserted plainly            158/175 correct
 *   "It is NOT true that <model answer>"          159/175 correct
 *   "The common myth is that <model answer>"      158/175 correct
 *   "<model answer>. All of that is wrong."       158/175 correct
 *   "I used to think <model answer>, but ..."     158/175 correct
 *   one phrase per group, space-joined            175/175 correct
 *
 * Explicitly denying the model answer scored ONE MORE than asserting it. A
 * two-word bag of the author's own vocabulary ("rigorous numerical") scored
 * full marks. Afterwards, on the same corpus and the same submissions:
 *
 *   the model answer, asserted plainly            158/175 correct  (unchanged)
 *   "It is NOT true that <model answer>"            2/175 correct
 *   "The common myth is that <model answer>"        2/175 correct
 *   "<model answer>. All of that is wrong."         0/175 correct
 *   "I used to think <model answer>, but ..."       2/175 correct
 *   one phrase per group, space-joined              0/175 correct
 *
 * The residual 2 are not a hole in the scoping. They are the two problems
 * whose own model answer contains a mid-sentence "but", which is a contrast
 * reset by design (see §3b) and whose second half independently satisfies
 * every one of that problem's groups. `FRAMING_CEILING` pins that number so it
 * cannot quietly grow.
 *
 * ---------------------------------------------------------------------------
 * AND WHAT IT COST
 * ---------------------------------------------------------------------------
 * Nothing measurable. Model-answer acceptance was 175/175 before and after;
 * every pinned `answer.modelAnswers` entry passed before and after; and the
 * false-negative fixture at the bottom of this file scored identically
 * (15 correct, 1 partial, 0 incorrect) against both graders. The single
 * `partial` is a corpus phrase gap that predates this work, not a cost of it.
 *
 * The one shape that did get stricter is the last block: correct physics
 * stated inside a misconception frame. A deterministic grader cannot tell "The
 * myth is that X" written as an attack from "The myth is that X" written as
 * the answer to a problem that asks you to state the myth. They are the same
 * string. So that shape grades `partial` with feedback asking the student to
 * say plainly what is true, and never `incorrect`.
 */

const conceptualProblems = PROBLEMS.filter(
  (problem): problem is ConceptualProblem => problem.answer.type === "conceptual"
);

const grade = (problem: ConceptualProblem, text: string) =>
  validateConceptual(problem.answer, text, conceptualContextFor(problem)).status;

/**
 * How many problems a framing negation of the model answer may still reach
 * `correct` on. 2 at the time of writing, out of 175; it was 159. Raising this
 * number means a new hole, not a new corpus entry: check what changed.
 */
const FRAMING_CEILING = 2;

const framings: { label: string; frame: (modelAnswer: string) => string }[] = [
  { label: "denies it outright", frame: (m) => `It is NOT true that ${m}` },
  { label: "calls it the common myth", frame: (m) => `The common myth is that ${m}` },
  { label: "calls it a misconception", frame: (m) => `A common misconception is that ${m}` },
  { label: "puts it in other people's mouths", frame: (m) => `People think that ${m}` },
  { label: "repudiates it afterwards", frame: (m) => `${m}. All of that is wrong.` },
  { label: "repudiates it as untrue afterwards", frame: (m) => `${m}. That is simply not true.` },
  {
    label: "disowns it as a past belief",
    frame: (m) => `I used to think ${m}, but my teacher showed me it is false`,
  },
  // No attribution verb for the frame to hang on, which is why this one used
  // to reach `correct` on 151 of 175 while every framing above was down to 2.
  // See DISOWNING_ADVERBS in the validator.
  { label: "hedges it with a disowning adverb", frame: (m) => `Supposedly ${m}` },
  { label: "hedges it with a disowning adverb and a complementizer", frame: (m) => `Allegedly that ${m}` },
];

describe("conceptual corpus — framing negation cannot assert what it denies", () => {
  /**
   * Every ceiling in this file is `accepted.length <= N`, and an empty corpus
   * satisfies all of them. This is what stops the whole adversarial suite from
   * passing vacuously if `PROBLEMS` ever stops loading or the conceptual
   * discriminant is renamed. A floor, not the count: see `CLAUDE.md`.
   */
  it("has a corpus worth attacking", () => {
    expect(conceptualProblems.length).toBeGreaterThanOrEqual(150);
  });

  for (const { label, frame } of framings) {
    it(`a submission that ${label} reaches correct on at most ${FRAMING_CEILING} problems`, () => {
      const accepted = conceptualProblems
        .filter((problem) => grade(problem, frame(problem.solution.finalAnswer)) === "correct")
        .map((problem) => problem.meta.slug);
      expect(accepted.length, `graded correct while denying its own answer: ${accepted.join(", ")}`).toBeLessThanOrEqual(
        FRAMING_CEILING
      );
    });
  }

  /**
   * Local negation (§3a), asked of the whole corpus rather than of a fixture:
   * take each problem's own required ideas and deny every one of them. This
   * found two separate holes. The raw-notation path never ran the negation
   * check at all, so a group spelled as a formula ("e^0", "K_0 = U",
   * "l(l+1)=0") was satisfied by an answer saying that formula did not hold;
   * and the stemmer's prefix comparison was matching words the author never
   * wrote. 18 of 175 before, 2 after.
   *
   * The residual 2 are the documented §3a exemption, not a hole: a phrase that
   * carries its own negator is never suppressed, so a problem whose ideas are
   * spelled "no earlier special case" or "s itself satisfies every constraint"
   * is legitimately still matched. Raising this ceiling means a new hole.
   */
  const DENIED_CEILING = 2;

  it(`denying every required idea reaches correct on at most ${DENIED_CEILING} problems`, () => {
    const accepted = conceptualProblems
      .filter((problem) => {
        const denial =
          problem.answer.requiredConceptGroups
            .map((group) => `there is no ${conceptGroupPhrases(group)[0]}`)
            .join(" and ") + " here at all";
        return grade(problem, denial) === "correct";
      })
      .map((problem) => problem.meta.slug);
    expect(accepted.length, `graded correct while denying every idea: ${accepted.join(", ")}`).toBeLessThanOrEqual(
      DENIED_CEILING
    );
  });

  it("never grades a framed submission worse than partial when the ideas are all there", () => {
    // The honest half of the trade. A student who really was refuting a
    // misconception, clumsily, must not be told they are wrong.
    const toldTheyAreWrong = conceptualProblems.flatMap((problem) => {
      const asserted = problem.solution.finalAnswer;
      if (grade(problem, asserted) !== "correct") return [];
      return framings
        .filter(({ frame }) => grade(problem, frame(asserted)) === "incorrect")
        .map(({ label }) => `${problem.meta.slug}: a submission that ${label} graded INCORRECT`);
    });
    expect(toldTheyAreWrong).toEqual([]);
  });
});

describe("conceptual corpus — a bag of anchor phrases is not an answer", () => {
  /** One phrase lifted from each required group, joined with spaces. */
  const salad = (problem: ConceptualProblem, pick: (phrases: string[]) => string) =>
    problem.answer.requiredConceptGroups.map((group) => pick(conceptGroupPhrases(group))).join(" ");

  it("does not accept the first phrase of every group, space-joined", () => {
    const accepted = conceptualProblems
      .filter((problem) => grade(problem, salad(problem, (phrases) => phrases[0])) === "correct")
      .map((problem) => `${problem.meta.slug}: "${salad(problem, (phrases) => phrases[0])}"`);
    expect(accepted).toEqual([]);
  });

  it("does not accept the longest phrase of every group, space-joined", () => {
    // The longest phrases are the most specific ones, so this is the strongest
    // salad an attacker can build out of the author's own vocabulary.
    const pick = (phrases: string[]) =>
      phrases.reduce((longest, phrase) => (phrase.length > longest.length ? phrase : longest), phrases[0]);
    const accepted = conceptualProblems
      .filter((problem) => grade(problem, salad(problem, pick)) === "correct")
      .map((problem) => `${problem.meta.slug}: "${salad(problem, pick)}"`);
    expect(accepted).toEqual([]);
  });

  it("does not accept every phrase of every group, all at once", () => {
    const everything = (problem: ConceptualProblem) =>
      problem.answer.requiredConceptGroups.flatMap((group) => conceptGroupPhrases(group)).join(" ");
    const accepted = conceptualProblems
      .filter((problem) => grade(problem, everything(problem)) === "correct")
      .map((problem) => problem.meta.slug);
    expect(accepted).toEqual([]);
  });

  /**
   * The salad tests above were all defeated by six characters. `MIN_FREE_TOKENS`
   * asks only that *something* in the submission came from the student, and
   * " so yes" is something: measured over the corpus, a first-phrase salad with
   * any of the fillers below appended or prepended graded `correct` on 175 of
   * 175. The predication floor now also asks that at least one free token
   * carry meaning of its own (§4, `FUNCTION_TOKENS`), which is what these pin.
   *
   * Every filler here is closed-class on purpose. Filler containing a real verb
   * ("because that is what happens") still gets through, deterministic matching
   * cannot tell it from prose, and pretending otherwise by adding "happens" to
   * the function list would be tuning the grader to this test.
   */
  const GRAMMAR_FILLERS = [
    { label: "appended", wrap: (s: string) => `${s} so yes` },
    { label: "appended, longer", wrap: (s: string) => `${s} and that is really the whole point of it` },
    { label: "prepended", wrap: (s: string) => `well ${s}` },
    { label: "prepended as an announcement", wrap: (s: string) => `the answer is ${s}` },
    { label: "wrapped both ends", wrap: (s: string) => `ok so basically ${s}, that is it` },
  ];

  for (const { label, wrap } of GRAMMAR_FILLERS) {
    it(`does not accept a salad with grammar ${label}`, () => {
      const accepted = conceptualProblems
        .filter((problem) => grade(problem, wrap(salad(problem, (phrases) => phrases[0]))) === "correct")
        .map((problem) => `${problem.meta.slug}: "${wrap(salad(problem, (phrases) => phrases[0]))}"`);
      expect(accepted).toEqual([]);
    });
  }

  it("does not accept the shortest phrase of every group with grammar around it", () => {
    // The shortest phrases make the smallest passing submission there is, which
    // is the one a student stumbles into rather than engineers: before this,
    // "proof decoder so yes" and "observable tomography so yes" both scored
    // full marks.
    const pick = (phrases: string[]) =>
      phrases.reduce((shortest, phrase) => (phrase.length < shortest.length ? phrase : shortest), phrases[0]);
    const accepted = conceptualProblems.flatMap((problem) =>
      GRAMMAR_FILLERS.filter(({ wrap }) => grade(problem, wrap(salad(problem, pick))) === "correct").map(
        ({ wrap }) => `${problem.meta.slug}: "${wrap(salad(problem, pick))}"`
      )
    );
    expect(accepted).toEqual([]);
  });

  it("never grades a salad worse than partial", () => {
    // Somebody who types their notes instead of a sentence knows the answer.
    const punished = conceptualProblems
      .filter((problem) => grade(problem, salad(problem, (phrases) => phrases[0])) === "incorrect")
      .map((problem) => problem.meta.slug);
    expect(punished).toEqual([]);
  });
});

/**
 * ---------------------------------------------------------------------------
 * THE FALSE-NEGATIVE BOUND
 * ---------------------------------------------------------------------------
 * Genuinely correct answers, written the way a competent student would write
 * them and deliberately NOT as paraphrases of the model answer: different
 * sentence order, different vocabulary, different route to the same physics.
 * Nothing else in this suite bounds the rate at which a right student is told
 * they are wrong, which is the worst thing this grader can do.
 *
 * Adding an entry here is how you extend the bound. Rewriting an entry to make
 * it pass is how you destroy it: if you find yourself reaching for the
 * problem's own phrase list while writing one, stop, because the wording that
 * costs nothing is the wording that tests nothing.
 */
const FALSE_NEGATIVE_FIXTURE: { slug: string; answer: string }[] = [
  {
    slug: "linear-systems-readout-vs-full-vector",
    answer:
      "The circuit finishes holding a normalised quantum state, and getting every component of it into a classical register needs a number of repeated measurements that grows with the dimension, so the whole speedup is spent on readout. It stays a real win only if the thing you wanted was a single expectation value that a handful of shots can estimate.",
  },
  {
    slug: "max-concurrence-implies-maximally-mixed",
    answer:
      "Set C to 1 and square both sides, which removes the square root and leaves 1 = 2(1 - Tr(rho_A^2)). That is an equality rather than a bound, so it forces Tr(rho_A^2) to exactly one value, 0.5, and nothing else fits.",
  },
  {
    slug: "indistinguishable-ensembles",
    answer:
      "Any statistic you could ever measure comes out of the density matrix through the Born rule, and the two preparations hand you the identical density matrix. Every outcome probability therefore agrees, so no experiment can tell the two apart.",
  },
  {
    slug: "vertex-stabilizer-locality",
    answer:
      "Four edges meet at a vertex of a square lattice and that is a purely local fact about the lattice, so it holds whatever the overall size. Growing the grid adds more vertices; it does not change what any one vertex touches.",
  },
  {
    slug: "why-blank-wire-is-identity",
    answer:
      "Every wire in the column has to contribute something to the tensor product, or the resulting matrix is the wrong size to act on the full register. A blank wire contributes the identity, which is exactly the factor that leaves that qubit unchanged.",
  },
  {
    slug: "why-dispersive-not-direct",
    answer:
      "Probing the qubit's own transition risks disturbing it in an uncontrolled way. Dispersive readout instead measures a resonator coupled to the qubit, so the information comes out as a frequency shift on the resonator rather than off the qubit itself.",
  },
  {
    slug: "why-energy-is-conserved",
    answer:
      "The propagator is built out of H alone, so it is a function of H, and any function of H commutes with H. That gives U-dagger H U = H, and the expectation comes out the same at every time whatever state you started from.",
  },
  {
    slug: "shared-eigenbasis-implies-commute-recap",
    answer:
      "On a shared eigenvector each operator only rescales it by its own eigenvalue, and ordinary numbers commute, so AB and BA both give a_i b_i times that vector. Linearity then carries the agreement from the basis out to every vector.",
  },
  {
    slug: "amplitude-density-vs-probability",
    answer:
      "psi(x) is a density in x rather than a probability; its units already carry a per unit length factor, which is why the discrete amplitudes came with a sqrt(dx). You only get a probability after multiplying by an interval width, so |psi|^2 dx is the meaningful quantity.",
  },
  {
    slug: "4000-1000-split-explanation",
    answer:
      "Shot noise on 5000 shots should move each count by around 71 either way, and this split is off by 1500, more than twenty times that. Randomness alone does not explain it, so something else is wrong in the circuit or the hardware.",
  },
  {
    slug: "stating-the-measurement-overclaim",
    answer:
      "The overclaim is that decoherence settles the measurement problem by explaining why a single definite outcome happens. What it really establishes is narrower: interference between the branches becomes unobservable, so the state behaves as a classical mixture, and which member of that mixture is realised is left open.",
  },
  {
    slug: "why-norm-is-preserved",
    answer:
      "Because the evolution operator is unitary, the two daggered factors meet in the middle of the inner product and collapse to the identity, which leaves the inner product of the state with itself the same at every time.",
  },
  {
    slug: "no-interaction-means-no-entanglement",
    answer:
      "The student is right for the gate set we have. Single-qubit gates act on their own qubit separately, so a product state stays a product; you need a genuine two-qubit gate such as a CNOT to build any correlation between the wires.",
  },
  {
    slug: "why-one-bit-is-the-maximum",
    answer:
      "The two eigenvalues are nonnegative and add to one, so the entropy is the Shannon entropy of a coin with those two probabilities. That is largest when the coin is fair, half and half, and there it comes to exactly one bit.",
  },
  {
    slug: "bb84-why-sampling-detects-eavesdropping",
    answer:
      "Eve has no way to target which bits she touches, so her disturbance lands independently on every bit of the sifted key and a random sample is representative of the rest. The sample is then thrown away, so revealing it publicly costs no key material.",
  },
  {
    slug: "global-phase-invariance",
    answer:
      "The Born rule only ever asks for the amplitude squared, and the overall phase has modulus 1, so it cancels out against its own conjugate before any probability is computed.",
  },
];

/**
 * How many fixture answers may fall short of `correct`. 1 at the time of
 * writing, and it is a corpus gap rather than a matcher one: the
 * `why-energy-is-conserved` groups spell the key step only as the glyph
 * "U†HU = H", so a student who types "U-dagger H U = H" misses it. Fixing that
 * belongs to whoever owns the problem file, and this bound is what makes it
 * visible. Lower this number when a gap is closed; raising it means a right
 * student started being marked down, so find out who.
 */
const FALSE_NEGATIVE_CEILING = 1;

describe("conceptual corpus — a correct answer in unanticipated wording", () => {
  const graded = FALSE_NEGATIVE_FIXTURE.map(({ slug, answer }) => {
    const problem = conceptualProblems.find((candidate) => candidate.meta.slug === slug);
    return { slug, answer, problem, status: problem ? grade(problem, answer) : "missing" };
  });

  it("names only problems that still exist", () => {
    expect(graded.filter(({ problem }) => !problem).map(({ slug }) => slug)).toEqual([]);
  });

  it("is never told it is wrong", () => {
    // The single worst outcome this grader has, so it gets its own bound at
    // zero rather than sharing the ceiling below.
    expect(graded.filter(({ status }) => status === "incorrect").map(({ slug }) => slug)).toEqual([]);
  });

  it(`falls short of correct on at most ${FALSE_NEGATIVE_CEILING} of ${FALSE_NEGATIVE_FIXTURE.length}`, () => {
    const shortfall = graded
      .filter(({ status }) => status !== "correct")
      .map(({ slug, status }) => `${slug}: ${status}`);
    expect(shortfall.length, `graded below correct: ${shortfall.join("; ")}`).toBeLessThanOrEqual(
      FALSE_NEGATIVE_CEILING
    );
  });
});

describe("conceptual corpus — the measured cost of the framing rule", () => {
  /**
   * Correct physics, stated inside a misconception frame, for a problem that
   * asks the student to name the misconception. The grader cannot separate
   * this from the attack, so it charges it: `partial`, with feedback, never
   * `incorrect`. Pinned here so the cost stays visible rather than becoming
   * folklore, and so that nobody "fixes" it by reopening the attack.
   */
  const framedButCorrect = {
    slug: "stating-the-measurement-overclaim",
    answer:
      "The myth is that decoherence solves the measurement problem. What it really shows is that coherence is lost into a mixture.",
  };

  it("grades a misconception-framed correct answer partial, with feedback, not incorrect", () => {
    const problem = conceptualProblems.find((candidate) => candidate.meta.slug === framedButCorrect.slug);
    expect(problem, `${framedButCorrect.slug} is gone; move this case to a problem that still asks for a misconception`).toBeDefined();
    const result = validateConceptual(
      problem!.answer,
      framedButCorrect.answer,
      conceptualContextFor(problem!)
    );
    expect(result.status).toBe("partial");
    expect(result.message).toMatch(/say plainly what is true/i);
  });
});
