/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnswerInput } from "@/components/problems/AnswerInput";
import { SolutionPanel } from "@/components/problems/SolutionPanel";
import { displayLetters } from "@/components/problems/optionOrder";
import { prerenderProblemMath, renderSolutionMath } from "@/components/problems/renderProblemMath";
import type { MultipleChoiceProblem, Solution } from "@/lib/problems/types";

/**
 * The bug these cover, precisely: options are rendered in a seeded shuffle, so
 * an option's authored id ("a", "b", "c", "d" across this corpus) is not the
 * letter shown beside it. Any explanation that spelled a letter into its prose
 * named whichever option used to occupy that slot. The fix routes both the
 * answer list and the solution's cross-references through one map
 * (`displayLetters`), so what is asserted below is not "the chip says B" — it
 * is "the chip says whatever the answer list says, for the same option".
 * Hardcoding an expected letter here would re-create the bug inside the test.
 */

/** Chosen deliberately: under this seed the shuffle moves *every* option, so
 *  id "b" is not letter B and a test that accidentally asserted the authored
 *  letter would fail. A slug whose shuffle happens to be the identity would
 *  pass these tests while the bug was fully present. */
const SLUG = "fixture-problem-slug";

const options = [
  { id: "a", text: "The authored-first option" },
  { id: "b", text: "A plausible confusion" },
  { id: "c", text: "A units error" },
  { id: "d", text: "An off-by-one" },
];

const solution: Solution = {
  steps: [{ description: "One step." }],
  finalAnswer: "The first option.",
};

function problemWith(whyWrong: MultipleChoiceProblem["explanation"]): MultipleChoiceProblem {
  return {
    meta: {
      slug: SLUG,
      title: "Fixture",
      course: "quantum-computing",
      difficulty: "beginner",
      estimatedMinutes: 2,
      problemType: "multiple-choice",
      tags: [],
    },
    question: { type: "multiple-choice", prompt: "Which?", options },
    answer: {
      type: "multiple-choice",
      correctOptionId: "a",
      defaultIncorrectFeedback: "Not quite.",
    },
    hints: [],
    solution,
    explanation: whyWrong,
  };
}

/* `math` rather than `solution`/`explanation`: the panel now takes its prose
   already rendered to KaTeX HTML, because it is inside the eager client graph
   of every problem page and importing a renderer there ships 74KB of KaTeX to
   all 547 of them (see `components/problems/mathRuns.ts`). These helpers go
   through the real `renderSolutionMath`/`prerenderProblemMath`, so the
   assertions below still exercise the path the site renders. */
function renderPanel(problem: MultipleChoiceProblem, withOptions = true) {
  return renderToStaticMarkup(
    createElement(SolutionPanel, {
      math: renderSolutionMath(problem.solution, problem.explanation),
      options: withOptions ? problem.question.options : undefined,
      problemSlug: withOptions ? problem.meta.slug : undefined,
      revealed: true,
      attempted: true,
      onReveal: () => {},
    })
  );
}

/** The answer list as the reader gets it — the ground truth for what letter
 *  sits beside which option id. */
function renderAnswerInput(problem: MultipleChoiceProblem): string {
  return renderToStaticMarkup(
    createElement(AnswerInput, {
      problem,
      optionMath: prerenderProblemMath(problem).options,
      value: "",
      onChange: () => {},
      disabled: false,
    })
  );
}

/** The panel in one of its three states, for the reveal-gate tests below. */
function renderGate({ revealed, attempted }: { revealed: boolean; attempted: boolean }): string {
  return renderToStaticMarkup(
    createElement(SolutionPanel, {
      math: renderSolutionMath(solution, { correctIdea: "The first option is right." }),
      options,
      problemSlug: SLUG,
      revealed,
      attempted,
      onReveal: () => {},
    })
  );
}

describe("SolutionPanel — the reveal gate", () => {
  /* The rule, which is easy to break in either direction: the panel is ALWAYS
     present and always says what it holds, because a worked solution nobody
     can find is the same as no worked solution. Only the reveal is gated —
     before a first submission the control states the condition instead of
     firing, so the answer cannot be read past on the way to the answer box. */

  it("is present and describes its contents before any submission", () => {
    const html = renderGate({ revealed: false, attempted: false });
    expect(html).toContain("Solution");
    expect(html).toContain("Every step worked out");
  });

  it("states the condition instead of offering a reveal, before any submission", () => {
    const html = renderGate({ revealed: false, attempted: false });
    expect(html).toContain("Opens after your first submission");
    expect(html).not.toContain("Reveal full solution");
  });

  it("holds nothing back that a reader could read past: no step text before the reveal", () => {
    const html = renderGate({ revealed: false, attempted: false });
    expect(html).not.toContain("One step.");
    expect(html).not.toContain("The first option.");
  });

  it("offers the reveal unconditionally after one submission, right or wrong", () => {
    const html = renderGate({ revealed: false, attempted: true });
    expect(html).toContain("Reveal full solution");
    expect(html).not.toContain("Opens after your first submission");
    // Still gated: attempting is what unlocks the control, not the content.
    expect(html).not.toContain("One step.");
  });

  it("moves focus to the steps once revealed, since the reveal control unmounts itself", () => {
    // `tabIndex={-1}` + `.focus()` on the steps list: the button the reader
    // pressed disappears, and without a landing focus falls to <body>. The
    // effect itself needs a DOM; what is assertable here is the affordance.
    const html = renderGate({ revealed: true, attempted: true });
    expect(html).toContain('aria-label="Solution steps"');
    expect(html).toMatch(/<ol[^>]*tabindex="-1"/);
    expect(html).toContain("One step.");
  });
});

describe("SolutionPanel — whyWrong option references", () => {
  it("labels an object-form entry with the letter AnswerInput gives that same option", () => {
    // The single assertion the whole change exists to make true. `b` is chosen
    // because it is the id most of the de-lettered corpus points at, and
    // because under this slug's shuffle it is demonstrably not letter B.
    const expected = displayLetters(options, SLUG).get("b");
    expect(expected).toBeDefined();

    // Sanity on the fixture itself: the answer list runs A, B, C, D top to
    // bottom, and the ids sitting under those letters are *not* in authored
    // order — so `expected` is genuinely a letter other than "B", and this
    // test would catch a renderer that echoed the id back.
    const answerHtml = renderAnswerInput(problemWith(undefined));
    expect([...answerHtml.matchAll(/Option ([A-Z]+): /g)].map((m) => m[1])).toEqual(["A", "B", "C", "D"]);
    expect([...answerHtml.matchAll(/value="([a-d])"/g)].map((m) => m[1])).not.toEqual(["a", "b", "c", "d"]);
    expect(expected).not.toBe("B");

    const html = renderPanel(
      problemWith({
        correctIdea: "The first option is right.",
        whyWrong: [{ optionId: "b", text: "confuses the two registers" }],
      })
    );
    expect(html).toContain(`Option ${expected}: `);
    expect(html).toContain("confuses the two registers");
  });

  it("renders the chip visually and the letter for assistive tech separately", () => {
    const letter = displayLetters(options, SLUG).get("c");
    const html = renderPanel(
      problemWith({ correctIdea: "…", whyWrong: [{ optionId: "c", text: "drops the normalization" }] })
    );
    // Visible chip: aria-hidden, so the letter is not read out mid-sentence...
    expect(html).toMatch(new RegExp(`aria-hidden="true"[^>]*>${letter}<`));
    // ...and an sr-only prefix carries it instead, so the reference is never
    // visual-only.
    expect(html).toContain(`<span class="sr-only">Option ${letter}: </span>`);
  });

  it("renders a string-form entry as prose, with no chip at all", () => {
    const html = renderPanel(
      problemWith({
        correctIdea: "…",
        whyWrong: ["Squaring the amplitude twice gives a probability of a probability."],
      })
    );
    expect(html).toContain("Squaring the amplitude twice");
    expect(html).not.toContain("sr-only\">Option ");
  });

  it("falls back to prose alone when the optionId does not resolve", () => {
    // Content is edited independently of this component — an option renamed,
    // an entry copied between problems. The failure has to be a missing chip,
    // never a blank one and never a throw.
    const html = renderPanel(
      problemWith({ correctIdea: "…", whyWrong: [{ optionId: "z", text: "names an option that no longer exists" }] })
    );
    expect(html).toContain("names an option that no longer exists");
    expect(html).not.toContain("sr-only\">Option ");
  });

  it("falls back to prose alone when options/problemSlug are not supplied", () => {
    // Numeric and conceptual problems take this path: there are no options, so
    // there is no letter to name, and the entry must still render.
    const html = renderPanel(
      problemWith({ correctIdea: "…", whyWrong: [{ optionId: "b", text: "still needs to be readable" }] }),
      false
    );
    expect(html).toContain("still needs to be readable");
    expect(html).not.toContain("sr-only\">Option ");
  });

  it("renders mixed string and object entries in authored order", () => {
    const html = renderPanel(
      problemWith({
        correctIdea: "…",
        whyWrong: ["First, as prose.", { optionId: "d", text: "Second, about one option." }, "Third, as prose."],
      })
    );
    expect(html.indexOf("First, as prose.")).toBeLessThan(html.indexOf("Second, about one option."));
    expect(html.indexOf("Second, about one option.")).toBeLessThan(html.indexOf("Third, as prose."));
  });
});
