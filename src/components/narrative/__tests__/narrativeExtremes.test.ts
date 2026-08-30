import { describe, expect, it } from "vitest";
/* Components are constructed with `createElement` rather than JSX, for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's
   `include` is `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement as h, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ChallengePrompt } from "@/components/narrative/ChallengePrompt";
import { DerivationStep, DerivationSteps } from "@/components/narrative/DerivationSteps";
import { HistoricalMoment } from "@/components/narrative/HistoricalMoment";
import { InsightBlock } from "@/components/narrative/InsightBlock";
import { LessonHook } from "@/components/narrative/LessonHook";
import { NextDiscovery } from "@/components/narrative/NextDiscovery";
import { Question } from "@/components/narrative/Question";
import { ResearchConnection } from "@/components/narrative/ResearchConnection";
import { Callout } from "@/components/mdx/Callout";
import { DefinitionBox } from "@/components/mdx/DefinitionBox";
import { TheoremBox } from "@/components/mdx/TheoremBox";
import { ScrollableFigure } from "@/components/mdx/ScrollableFigure";

/**
 * ============================================================
 * The narrative vocabulary at its extremes
 * ============================================================
 * Every component here takes rich `children` straight from MDX, and MDX hands
 * over whatever the author wrote — one sentence, five paragraphs, an empty
 * block, a stray line of prose where a structured child was expected. None of
 * those shapes is a type error and none of them fails a build. The failures
 * they cause are visual (paragraphs sitting flush with no gap, a hint
 * pointing at a control that is not rendered, a numbered list whose numbers
 * skip), and they are only visible by opening the page.
 *
 * These tests pin the extremes that were actually found broken on
 * 2026-08-30, plus the "renders at all" floor for the whole set, so a future
 * refactor of any one of them cannot quietly reintroduce a shape that only
 * shows up in one of 219 lessons.
 */

const P = (text: string) => h("p", { key: text }, text);
const FIVE_PARAGRAPHS: ReactNode = [
  P("One."),
  P("Two."),
  P("Three."),
  P("Four."),
  P("Five, the last one."),
];

const render = (node: ReactNode) => renderToStaticMarkup(node as never);

describe("multi-paragraph children get vertical separation", () => {
  /**
   * `not-prose` takes these subtrees out of the typography plugin's
   * selectors, and Tailwind's preflight has already zeroed every `p` margin,
   * so a component whose children wrapper carries no `space-y-*` renders two
   * MDX paragraphs flush against each other with no gap at all. It reads as
   * one run-on paragraph. `NextDiscovery` was the one still missing it.
   */
  const cases: [string, ReactNode][] = [
    ["LessonHook", h(LessonHook, { children: FIVE_PARAGRAPHS })],
    ["Question", h(Question, { children: FIVE_PARAGRAPHS })],
    ["InsightBlock", h(InsightBlock, { children: FIVE_PARAGRAPHS })],
    ["NextDiscovery", h(NextDiscovery, { children: FIVE_PARAGRAPHS })],
    ["HistoricalMoment", h(HistoricalMoment, { date: "1935", children: FIVE_PARAGRAPHS })],
    [
      "ResearchConnection",
      h(ResearchConnection, { title: "T", source: "S", children: FIVE_PARAGRAPHS }),
    ],
    [
      "ChallengePrompt",
      h(ChallengePrompt, { prompt: "Try it.", children: FIVE_PARAGRAPHS }),
    ],
  ];

  for (const [name, node] of cases) {
    it(`${name} separates stacked paragraphs`, () => {
      const markup = render(node);
      // The wrapper that directly holds the paragraphs carries a `space-y-*`.
      expect(markup).toMatch(/class="[^"]*\bspace-y-\d/);
      // And all five survived.
      expect(markup).toContain("Five, the last one.");
    });
  }
});

describe("one line of content still reads as the component it is", () => {
  it("LessonHook without an eyebrow keeps the display treatment", () => {
    const markup = render(h(LessonHook, { children: "A single photon goes through both slits." }));
    expect(markup).toContain("A single photon goes through both slits.");
    expect(markup).toContain("font-display");
  });

  it("ChallengePrompt with no children renders the prompt and no empty hint box", () => {
    const markup = render(h(ChallengePrompt, { prompt: "Work out the ground-state energy." }));
    expect(markup).toContain("Work out the ground-state energy.");
    expect(markup).toContain("Challenge");
    // The optional hint wrapper must not render as an empty block.
    expect(markup).not.toMatch(/text-muted-foreground"><\/div>/);
  });

  it("ResearchConnection without a url prints the source as plain text, not a dead link", () => {
    const markup = render(
      h(ResearchConnection, { title: "A result", source: "Nature (2023)", children: P("Body.") })
    );
    expect(markup).toContain("Nature (2023)");
    expect(markup).not.toContain("<a");
  });

  it("ResearchConnection with a url warns that it opens a new tab", () => {
    const markup = render(
      h(ResearchConnection, {
        title: "A result",
        source: "Nature (2023)",
        url: "https://example.org/x",
        children: P("Body."),
      })
    );
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain("opens in a new tab");
  });

  it("HistoricalMoment without a place still leads with the date", () => {
    const markup = render(h(HistoricalMoment, { date: "1964", children: P("Bell writes it down.") }));
    expect(markup).toContain("1964");
    expect(markup).toContain("Bell writes it down.");
  });
});

describe("DerivationSteps numbering", () => {
  const step = (key: string, body: string) =>
    h(DerivationStep, { key, annotation: `Why ${key}.`, children: body });

  it("numbers steps from position, 1..n", () => {
    const markup = render(
      h(DerivationSteps, {
        children: [step("a", "line one"), step("b", "line two"), step("c", "line three")],
      })
    );
    expect(markup).toContain(">1<");
    expect(markup).toContain(">2<");
    expect(markup).toContain(">3<");
    expect(markup).not.toContain(">4<");
  });

  it("a single step is still step 1, not an unnumbered slab", () => {
    const markup = render(h(DerivationSteps, { children: step("only", "the whole derivation") }));
    expect(markup).toContain(">1<");
    expect(markup).toContain("the whole derivation");
  });

  it("keeps list semantics that WebKit would otherwise drop", () => {
    const markup = render(h(DerivationSteps, { children: step("a", "x") }));
    expect(markup).toContain('role="list"');
  });

  it("annotates each step for assistive tech", () => {
    const markup = render(h(DerivationSteps, { children: step("a", "x") }));
    expect(markup).toContain("Why this step is legal:");
  });

  it("a step with no annotation renders no empty gloss paragraph", () => {
    const markup = render(h(DerivationSteps, { children: h(DerivationStep, { key: "a", children: "bare" }) }));
    expect(markup).toContain("bare");
    expect(markup).not.toContain("Why this step is legal:");
  });

  /**
   * The regression this block exists for. MDX hands a stray `<p>` to this
   * component whenever an author writes a line of prose between two steps.
   * `stepNumber` used to be cloned onto whatever element sat there, so the
   * paragraph absorbed a number, React warned about an unrecognised DOM
   * attribute, and the visible badges skipped: 1, then 3.
   */
  it("does not number, or leak stepNumber onto, a stray block between steps", () => {
    const markup = render(
      h(DerivationSteps, {
        children: [
          step("a", "first"),
          h("p", { key: "prose" }, "An aside the author dropped in."),
          step("b", "second"),
        ],
      })
    );
    expect(markup).not.toMatch(/stepnumber/i);
    // Two real steps, numbered 1 and 2 — not 1 and 3.
    expect(markup).toContain(">1<");
    expect(markup).toContain(">2<");
    expect(markup).not.toContain(">3<");
    // And the stray prose is kept, in place, rather than silently dropped.
    expect(markup).toContain("An aside the author dropped in.");
    expect(markup.indexOf("first")).toBeLessThan(markup.indexOf("An aside"));
    expect(markup.indexOf("An aside")).toBeLessThan(markup.indexOf("second"));
  });
});

describe("mdx boxes at their empty and full extremes", () => {
  it("Callout defaults to the quietest tier when no type is passed", () => {
    const bare = render(h(Callout, { children: P("An aside.") }));
    const note = render(h(Callout, { type: "note", children: P("An aside.") }));
    expect(bare).toEqual(note);
  });

  it("Callout escalates the three tiers into visibly different markup", () => {
    const seen = new Set(
      (["note", "warning", "mistake"] as const).map((type) =>
        render(h(Callout, { type, children: P("x") }))
      )
    );
    expect(seen.size).toBe(3);
  });

  it("DefinitionBox and TheoremBox are told apart by more than their label text", () => {
    const def = render(h(DefinitionBox, { title: "Self-adjoint operator", children: P("body") }));
    const thm = render(h(TheoremBox, { title: "Stone's theorem", children: P("body") }));
    // Strip the two titles and the two device labels; what is left is the
    // shape vocabulary, and it still has to differ.
    const strip = (s: string) =>
      s
        .replace(/Self-adjoint operator|Stone&#x27;s theorem|Stone's theorem/g, "")
        .replace(/Definition|Theorem/g, "");
    expect(strip(def)).not.toEqual(strip(thm));
  });

  it("ScrollableFigure is always focusable and always named", () => {
    const markup = render(
      h(ScrollableFigure, {
        label: "Quantum Fourier transform circuit for three qubits",
        children: "svg",
      })
    );
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain('role="group"');
    expect(markup).toContain('aria-label="Quantum Fourier transform circuit for three qubits"');
  });
});
