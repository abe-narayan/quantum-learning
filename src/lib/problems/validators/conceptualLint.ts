import {
  conceptGroupAnchors,
  conceptGroupPhrases,
  type ConceptualProblem,
  type Problem,
} from "../types";
import { analyzeSubmission, groupsSatisfiedBy, phraseShape, validateConceptual } from "./conceptual";

/**
 * Mechanical quality gate on authored `requiredConceptGroups`.
 *
 * `validateConceptual` is a phrase matcher, and a phrase matcher is only as
 * good as its phrases. The failure modes below are not hypothetical — every
 * one of them was found in this corpus, and each made some problem grade
 * something other than what its author believed it graded. They are checked
 * here rather than fixed in the matcher because the matcher cannot tell a
 * deliberate one-glyph anchor from an accident; only the author can, and the
 * `anchors` map (see `ConceptGroup`) is where they say so.
 *
 * Run over every conceptual problem by `conceptualCorpus.test.ts`. The rules,
 * and what each one is protecting:
 *
 *   undeclared-anchor      A phrase that normalizes to nothing ("⁴", "±", "ρ")
 *                          can only ever be found as raw text, which is
 *                          sometimes intended and sometimes an accident.
 *   stub-phrase            Normalization left a one- or two-character token
 *                          ("−1" -> "1", "p²" -> "p", "tr(" -> "tr"), which is
 *                          a much weaker test than the author wrote.
 *   bare-common-word       A whole phrase that is one high-frequency English
 *                          word grades nothing: the group is free.
 *   cross-group-collision  One phrase satisfies a *different* group of the
 *                          same problem, so N required ideas grade as N−1.
 *   duplicate-phrase       The same phrase in two groups — the same collapse,
 *                          in its most literal form.
 *   anchor-not-a-phrase    An `anchors` key that is not in `phrases`: a typo,
 *                          and a declaration that protects nothing.
 *   single-concept-group   One group is a keyword search with a text box in
 *                          front of it. Require at least two ideas.
 *   prompt-satisfies-every-group
 *                          The question, pasted back, satisfies every group.
 *                          The student has to supply something the question
 *                          did not.
 */

export type ConceptLintRule =
  | "undeclared-anchor"
  | "stub-phrase"
  | "bare-common-word"
  | "cross-group-collision"
  | "duplicate-phrase"
  | "anchor-not-a-phrase"
  | "single-concept-group"
  | "prompt-satisfies-every-group";

export type ConceptLintViolation = {
  slug: string;
  rule: ConceptLintRule;
  groupIndex?: number;
  phrase?: string;
  /** One line, addressed to the author, saying what to do about it. */
  message: string;
};

/**
 * Words common enough in ordinary answers that a group consisting of one of
 * them grades nothing. Curated by hand rather than derived from corpus token
 * frequency on purpose: a derived threshold would silently change which
 * problems are legal every time content lands. Domain nouns that a student
 * would only write if they had understood something ("entangled", "unitary",
 * "degenerate", "impossible") are deliberately absent — the test is "would an
 * answer that missed the point still contain this word?", not "is it short".
 */
const BARE_COMMON_WORDS = new Set([
  "true",
  "false",
  "correct",
  "incorrect",
  "right",
  "wrong",
  "yes",
  "no",
  "exactly",
  "definition",
  "sum",
  "probability",
  "state",
  "answer",
  "value",
  "number",
  "thing",
  "because",
  "reason",
  "result",
  "always",
  "never",
  "both",
  "same",
  "equal",
  "different",
  "change",
  "important",
  "possible",
  "work",
  "know",
  "understand",
  "quantum",
  "system",
  "physics",
  "general",
  "simple",
  "easy",
  "hard",
]);

export function lintConceptualCorpus(problems: Problem[]): ConceptLintViolation[] {
  return problems.flatMap((problem) =>
    problem.answer.type === "conceptual" ? lintConceptualProblem(problem as ConceptualProblem) : []
  );
}

export function lintConceptualProblem(problem: ConceptualProblem): ConceptLintViolation[] {
  const violations: ConceptLintViolation[] = [];
  const slug = problem.meta.slug;
  const groups = problem.answer.requiredConceptGroups;
  const add = (violation: Omit<ConceptLintViolation, "slug">) => violations.push({ slug, ...violation });

  if (groups.length < 2) {
    add({
      rule: "single-concept-group",
      message:
        "Only one required concept group, so the whole problem is one keyword list. Split the idea into the two or more things a complete answer has to say.",
    });
  }

  const firstSeenIn = new Map<string, number>();

  groups.forEach((group, groupIndex) => {
    const phrases = conceptGroupPhrases(group);
    const anchors = conceptGroupAnchors(group);

    for (const key of Object.keys(anchors)) {
      if (!phrases.includes(key)) {
        add({
          rule: "anchor-not-a-phrase",
          groupIndex,
          phrase: key,
          message: `Declared as an anchor but absent from this group's \`phrases\`. Fix the spelling, or drop the declaration.`,
        });
      }
    }

    for (const phrase of phrases) {
      const shape = phraseShape(phrase);
      const declared = Object.prototype.hasOwnProperty.call(anchors, phrase);

      if (shape.isAnchor && !declared) {
        add({
          rule: "undeclared-anchor",
          groupIndex,
          phrase,
          message:
            "Normalizes to nothing, so it can only be matched as raw text. If the literal glyph is what you are testing, declare it in this group's `anchors` map with a reason; otherwise spell the idea out in words.",
        });
      } else if (shape.isDegenerate && !declared) {
        add({
          rule: "stub-phrase",
          groupIndex,
          phrase,
          message: `Normalization leaves only "${shape.normalized}", a much weaker test than the phrase you wrote. Spell it out ("minus one", "p squared", "trace of"), or declare it in this group's \`anchors\` map with a reason.`,
        });
      }

      if (shape.tokens.length === 1 && BARE_COMMON_WORDS.has(shape.tokens[0])) {
        add({
          rule: "bare-common-word",
          groupIndex,
          phrase,
          message:
            "A single high-frequency English word, so this group is satisfied by almost any answer. Say what about it: the claim, not the topic.",
        });
      }

      const previous = firstSeenIn.get(shape.normalized || phrase.toLowerCase());
      if (previous !== undefined && previous !== groupIndex) {
        add({
          rule: "duplicate-phrase",
          groupIndex,
          phrase,
          message: `Also listed in group ${previous}, so those two groups grade as one. Give each group its own vocabulary.`,
        });
      } else if (previous === undefined) {
        firstSeenIn.set(shape.normalized || phrase.toLowerCase(), groupIndex);
      }

      // Behavioural, not textual: treat the phrase as if a student had typed
      // it and ask whether it satisfies some *other* group. That is exactly
      // the condition under which an N-idea problem grades like an
      // (N−1)-idea one, and it correctly ignores pairs the matcher already
      // keeps apart ("proof" is not satisfied by "not a proof", because the
      // negation check discards that match).
      const satisfied = groupsSatisfiedBy(groups, analyzeSubmission(phrase));
      satisfied.forEach((isSatisfied, otherIndex) => {
        if (otherIndex === groupIndex || !isSatisfied) return;
        add({
          rule: "cross-group-collision",
          groupIndex,
          phrase,
          message: `An answer saying only this also satisfies group ${otherIndex}, so those ${groups.length} ideas grade as ${groups.length - 1}. Narrow one of the two.`,
        });
      });
    }
  });

  // Deliberately run WITHOUT the echo guard: the guard stops a verbatim paste
  // at runtime, but a student who paraphrases the question would still score
  // full marks, and the fix for that is a better phrase list.
  if (validateConceptual(problem.answer, problem.question.prompt).status === "correct") {
    add({
      rule: "prompt-satisfies-every-group",
      message:
        "The prompt, pasted back, satisfies every required concept group: the question contains its own answer. Require at least one idea the student has to supply.",
    });
  }

  return violations;
}

/** One printable line per violation, for a test failure message. */
export function formatViolations(violations: ConceptLintViolation[]): string[] {
  return violations.map((violation) => {
    const where =
      violation.groupIndex === undefined
        ? ""
        : ` group ${violation.groupIndex}${violation.phrase === undefined ? "" : ` phrase ${JSON.stringify(violation.phrase)}`}`;
    return `${violation.slug} [${violation.rule}]${where}: ${violation.message}`;
  });
}
