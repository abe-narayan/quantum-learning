import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import type { Problem } from "../types";

/**
 * Cross-surface consistency: a problem must not contradict the lesson it is
 * attached to.
 *
 * The same fact is taught in up to four places here (lesson, problem,
 * glossary, simulator), and each surface is edited independently. Every
 * existing test checks a file against itself: the MDX compiles, the problem
 * grades, the near misses do not overlap. None of them can see that a problem
 * and its own prerequisite lesson now say different things, because both files
 * are internally perfect. Two such contradictions shipped and were caught only
 * because one reviewer happened to read both files:
 *
 *  1. A problem quoted the 3-qubit bit-flip code as `[[3,1,3]]` while its
 *     lesson said, in bold, that it is distance 1 against the full Pauli
 *     model. Both statements are true under their own error model and the
 *     problem named neither.
 *  2. A problem asserted a surface-code vertex stabilizer "always touches
 *     exactly 4 qubits" while the lesson had just been corrected to say
 *     boundary stabilizers are weight 3, and weight 2 at the corners. The
 *     problem's own hint already said "interior vertex".
 *
 * Both share a shape: an **unqualified absolute on the problem side** of a
 * claim the lesson side qualifies. That shape is what these rules catch. Each
 * rule below names the lesson text that is the authority for it, so a future
 * correction on the lesson side has one place to update here.
 *
 * These are not style rules. Each one is a statement a reader could act on and
 * be wrong. Adding a rule is cheap; the bar is that the unqualified form must
 * actually be false, not merely terse.
 */

/**
 * Every string a reader can see, for one problem, with a label for the failure
 * message and whether the site is *asserting* it.
 *
 * A multiple-choice distractor is the one kind of reader-facing text that is
 * meant to be wrong: `code-parameters-shor-vs-bitflip` offers "[[3,1,3]] and
 * [[9,1,3]]" precisely so a student can reject it. Scanning distractors for
 * unqualified absolutes would flag the problems that teach the qualification
 * best, so only assertive text is checked. Distractors still count toward the
 * corpus floor.
 */
type ReaderText = { label: string; text: string; assertive: boolean };

function readerFacingText(problem: Problem): ReaderText[] {
  const say = (label: string, text: string): ReaderText => ({ label, text, assertive: true });
  const out: ReaderText[] = [
    say("title", problem.meta.title),
    say("prompt", problem.question.prompt),
    say("solution.finalAnswer", problem.solution.finalAnswer),
  ];
  problem.solution.steps.forEach((step, i) => out.push(say(`solution.steps[${i}]`, step.description)));
  problem.hints.forEach((hint, i) => out.push(say(`hints[${i}]`, hint.text)));

  if (problem.question.type === "multiple-choice") {
    const correctId = problem.answer.type === "multiple-choice" ? problem.answer.correctOptionId : undefined;
    problem.question.options.forEach((option) =>
      out.push({ label: `option ${option.id}`, text: option.text, assertive: option.id === correctId })
    );
  }
  if (problem.answer.type === "multiple-choice") {
    for (const [id, text] of Object.entries(problem.answer.optionFeedback ?? {})) {
      if (text) out.push(say(`optionFeedback.${id}`, text));
    }
    if (problem.answer.defaultIncorrectFeedback) {
      out.push(say("defaultIncorrectFeedback", problem.answer.defaultIncorrectFeedback));
    }
  }
  if (problem.answer.type === "numeric") {
    out.push(say("incorrectFeedback", problem.answer.incorrectFeedback));
    (problem.answer.nearMisses ?? []).forEach((miss, i) => out.push(say(`nearMisses[${i}]`, miss.feedback)));
  }
  if (problem.answer.type === "conceptual") {
    out.push(say("incorrectFeedback", problem.answer.incorrectFeedback));
    if (problem.answer.partialFeedback) out.push(say("partialFeedback", problem.answer.partialFeedback));
    (problem.answer.modelAnswers ?? []).forEach((text, i) => out.push(say(`modelAnswers[${i}]`, text)));
  }

  const explanation = problem.explanation;
  if (explanation) {
    if (explanation.correctIdea) out.push(say("explanation.correctIdea", explanation.correctIdea));
    if (explanation.whyCorrect) out.push(say("explanation.whyCorrect", explanation.whyCorrect));
    for (const entry of explanation.whyWrong ?? []) {
      out.push(say("explanation.whyWrong", typeof entry === "string" ? entry : entry.text));
    }
  }
  return out;
}

/**
 * A rule fires when every pattern in `claim` matches a sentence and none of
 * `qualifiers` appears in that same sentence. Sentence-scoped rather than
 * problem-scoped on purpose: a qualifier three paragraphs away does not save
 * the sentence a reader stops at.
 *
 * `claim` is a *list* of independent patterns rather than one regex, so a rule
 * does not depend on word order. The real defect this file was written after
 * read "the four-body plaquette and vertex operators", with the weight named
 * before the stabilizer; an ordered regex written from the other example
 * ("a vertex stabilizer touches exactly 4 qubits") walks straight past it.
 */
type ConsistencyRule = {
  name: string;
  /** The lesson (or lesson prose) that is the authority for this rule. */
  authority: string;
  claim: RegExp[];
  qualifiers: RegExp;
  /** What the author should write instead. */
  remedy: string;
};

const SENTENCE = /[^.!?;:]+[.!?;:]?/g;

const RULES: ConsistencyRule[] = [
  {
    name: "surface-code stabilizer weight is a bulk claim",
    authority:
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction, practice answer 1: " +
      "'vertices on the boundary have only three incident edges and carry weight-3 stabilizers, with weight-2 at the corners'; " +
      "apex/fault-tolerance-frontiers/surface-codes-in-depth says 'touches at most 4'.",
    claim: [
      /\b(?:vertex|vertices|face|plaquette|stabiliz\w+|check)\w*\b/i,
      /\b(?:weight[ -]?4|four[ -]body|4[ -]body|(?:touch\w*|act\w*\s+on|involv\w*)\s+(?:exactly\s+)?(?:4|four)\s+qubits)\b/i,
    ],
    qualifiers: /\b(?:interior|bulk|at most|up to|smaller|truncat\w+|boundar\w+|corner|toric|no more than|3×3|30×30|300×300)\b/i,
    remedy:
      "Say 'weight 4 in the bulk' or 'at most 4': on the planar patch hardware builds, boundary stabilizers are weight 3 and corner ones weight 2.",
  },
  {
    name: "T2 is the total coherence time, not the pure-dephasing mechanism",
    authority:
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence: 'T_2 is not one of those two mechanisms... " +
      "\"T2 processes\" is a common shorthand for pure dephasing and it is the same word doing two jobs: T_2 is the total, T_varphi is the one mechanism.'",
    claim: [
      /\bT_?2\b[^.!?;:]{0,20}?\(\s*pure[ -]dephasing\s*\)|\bpure[ -]dephasing\b[^.!?;:]{0,20}?\(\s*T_?2\s*\)|\bT_?2\b\s+(?:is\s+)?the\s+pure[ -]dephasing\s+(?:time|constant|process)/i,
    ],
    qualifiers: /\bT_?(?:phi|varphi|φ|\\varphi)\b/i,
    remedy:
      "The pure-dephasing constant is T_phi. T2 is the total the two mechanisms produce: 1/T2 = 1/(2*T1) + 1/T_phi.",
  },
  {
    name: "the 3-qubit bit-flip code's distance needs its error model",
    authority:
      "quantum-computing/error-correction-and-fault-tolerance: the bit-flip code is [[3,1,3]] against X errors alone and " +
      "[[3,1,1]] against the full Pauli model, because a single Z commutes with both stabilizers.",
    claim: [/\[\[\s*3\s*,\s*1\s*,\s*3\s*\]\]/],
    qualifiers: /\b(?:X errors?|X-only|bit[ -]flip errors?|against X|only against|distance against)\b/i,
    remedy:
      "Quote [[3,1,3]] only alongside the X-only error model it holds under; against arbitrary single-qubit Paulis the code is [[3,1,1]].",
  },
  {
    name: "qubit 0 is the leftmost, most significant label",
    authority:
      "quantum-computing/quantum-gates-and-circuits/tensor-products: 'qubit 0 is the leftmost (most significant) label in a " +
      "multi-qubit ket, everywhere on this site'.",
    claim: [/\bqubit\s*0\b[^.!?;:]{0,40}?\b(?:rightmost|least significant|little[ -]endian)\b/i],
    qualifiers: /$^/,
    remedy: "This site is big-endian: qubit 0 is the leftmost, most significant label in a ket.",
  },
];

describe("cross-surface consistency: problems against their lessons", () => {
  /**
   * Corpus floor. Without it, a registry that failed to populate would make
   * every rule below pass over an empty list and read as a clean run.
   */
  it("runs against the whole authored corpus", () => {
    expect(PROBLEMS.length).toBeGreaterThanOrEqual(500);
    const withText = PROBLEMS.filter((problem) => readerFacingText(problem).length > 4);
    expect(withText.length).toBe(PROBLEMS.length);
  });

  it.each(RULES.map((rule) => [rule.name, rule] as const))(
    "no problem states an unqualified absolute: %s",
    (_name, rule) => {
      const violations: string[] = [];
      for (const problem of PROBLEMS) {
        for (const { label, text, assertive } of readerFacingText(problem)) {
          if (!assertive) continue;
          for (const sentence of text.match(SENTENCE) ?? []) {
            if (!rule.claim.every((pattern) => pattern.test(sentence))) continue;
            if (rule.qualifiers.test(sentence)) continue;
            violations.push(`${problem.meta.slug} → ${label}: "${sentence.trim()}"`);
          }
        }
      }
      expect(
        violations,
        `${violations.length} sentence(s) contradict the lesson side.\n` +
          `Authority: ${rule.authority}\n` +
          `Fix: ${rule.remedy}\n\n` +
          violations.join("\n")
      ).toEqual([]);
    }
  );

  /**
   * Non-vacuity. A rule that no longer matches anything has usually been
   * defeated by a rewording rather than satisfied, so each `claim` is checked
   * against the unqualified sentence it exists to reject. This is the part
   * that would have caught both shipped defects.
   */
  it("each rule still rejects the sentence it was written for", () => {
    const specimens: [string, string][] = [
      [
        "surface-code stabilizer weight is a bulk claim",
        "A surface code's vertex stabilizer always touches exactly 4 qubits.",
      ],
      [
        "T2 is the total coherence time, not the pure-dephasing mechanism",
        "A T2 (pure dephasing) process needs no energy exchange.",
      ],
      [
        "the 3-qubit bit-flip code's distance needs its error model",
        "The 3-qubit bit-flip code is a [[3,1,3]] code.",
      ],
      ["qubit 0 is the leftmost, most significant label", "Here qubit 0 is the rightmost label in the ket."],
    ];
    expect(specimens.length).toBe(RULES.length);
    for (const [name, sentence] of specimens) {
      const rule = RULES.find((candidate) => candidate.name === name);
      expect(rule, `no rule named "${name}"`).toBeDefined();
      expect(rule!.claim.every((pattern) => pattern.test(sentence)), `claim did not match: ${sentence}`).toBe(true);
      expect(rule!.qualifiers.test(sentence), `qualifier wrongly excused: ${sentence}`).toBe(false);
    }
  });

  /**
   * And that a qualified sentence is accepted, so the rules stay usable rather
   * than banning the vocabulary outright.
   */
  it("each rule accepts the qualified form the lesson actually uses", () => {
    const accepted: [string, string][] = [
      [
        "surface-code stabilizer weight is a bulk claim",
        "A vertex stabilizer at an interior vertex touches exactly 4 qubits.",
      ],
      [
        "T2 is the total coherence time, not the pure-dephasing mechanism",
        "Pure dephasing has its own constant T_phi, and T2 is the total: 1/T2 = 1/(2*T1) + 1/T_phi.",
      ],
      [
        "the 3-qubit bit-flip code's distance needs its error model",
        "Against X errors alone the bit-flip code is [[3,1,3]].",
      ],
    ];
    for (const [name, sentence] of accepted) {
      const rule = RULES.find((candidate) => candidate.name === name)!;
      const flagged = rule.claim.every((pattern) => pattern.test(sentence)) && !rule.qualifiers.test(sentence);
      expect(flagged, `rule "${name}" wrongly rejects: ${sentence}`).toBe(false);
    }
  });
});

/**
 * A numeric problem's worked solution and its graded answer are two surfaces on
 * the same fact, in the same file, and they drift the same way: someone
 * retunes `answer.value` and leaves the prose, or vice versa. The student is
 * then marked wrong by the number the solution told them to compute.
 *
 * Parsing is deliberately generous (thousands separators, unicode superscripts,
 * scientific notation, simple fractions) because the finalAnswer is prose: the
 * point is to catch a genuine disagreement, not to police formatting.
 */
const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁻": "-", "⁺": "+",
};

function candidateNumbers(prose: string): number[] {
  const text = prose
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, (character) => SUPERSCRIPTS[character])
    .replace(/[−–]/g, "-")
    .replace(/\\times|×|·/g, "x")
    .replace(/\{,\}|(?<=\d),(?=\d{3}\b)/g, "")
    .replace(/\\d?frac\{(-?[\d.]+)\}\{(-?[\d.]+)\}/g, (_m, a, b) => String(Number(a) / Number(b)));

  const values: number[] = [];
  const SCIENTIFIC = /(-?\d+(?:\.\d+)?)\s*x\s*10\s*\^?\s*\{?(-?\d+)\}?/g;
  for (const match of text.matchAll(SCIENTIFIC)) values.push(Number(match[1]) * 10 ** Number(match[2]));
  const FRACTION = /(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g;
  for (const match of text.matchAll(FRACTION)) values.push(Number(match[1]) / Number(match[2]));
  const PLAIN = /-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][-+]?\d+)?/g;
  for (const match of text.match(PLAIN) ?? []) values.push(Number(match));

  return values.filter((value) => Number.isFinite(value));
}

describe("a numeric problem's worked solution states the number it grades", () => {
  const numericProblems = PROBLEMS.filter((problem) => problem.answer.type === "numeric");

  it("has a corpus to check", () => {
    expect(numericProblems.length).toBeGreaterThanOrEqual(200);
  });

  it("quotes the graded value in solution.finalAnswer", () => {
    const drifted: string[] = [];
    for (const problem of numericProblems) {
      if (problem.answer.type !== "numeric") continue;
      const { value, tolerance, toleranceType } = problem.answer;
      // The prose is usually rounded, so allow the grading window or 0.5%,
      // whichever is wider: this is a drift check, not a precision check.
      const window = Math.max(
        (toleranceType ?? "absolute") === "relative" ? Math.abs(value) * tolerance : tolerance,
        Math.abs(value) * 0.005,
        1e-9
      );
      const candidates = candidateNumbers(problem.solution.finalAnswer);
      if (candidates.some((candidate) => Math.abs(candidate - value) <= window)) continue;
      drifted.push(
        `${problem.meta.slug}: answer.value = ${value} but solution.finalAnswer reads "${problem.solution.finalAnswer}"`
      );
    }
    expect(drifted, `${drifted.length} worked solution(s) disagree with the graded answer:\n${drifted.join("\n")}`).toEqual(
      []
    );
  });
});
