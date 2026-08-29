/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Feedback } from "@/components/problems/Feedback";
import type { ValidationResult } from "@/lib/problems/validators/types";

/**
 * Grading feedback is the one thing on a problem page a reader is guaranteed
 * to be waiting for, so the three properties asserted here are the ones whose
 * loss would be invisible in a screenshot:
 *
 * 1. The live region is mounted BEFORE it has anything to say. A region
 *    inserted into the DOM in the same commit that gives it content is
 *    unreliably announced, so an empty wrapper that renders only once there
 *    is a result would look identical and announce nothing.
 * 2. The result box is programmatically focusable. `ProblemView` moves focus
 *    onto it when a correct answer unmounts the Submit button; without the
 *    `tabindex="-1"` that move silently no-ops and focus falls to <body>.
 * 3. Status is never carried by color alone — each of the three states has a
 *    text label, its own glyph, and its own surface.
 *
 * Effects (and therefore the focus move itself) cannot be exercised here:
 * this suite renders to static markup, and the project has no DOM
 * environment configured (see vitest.config.ts). What is testable is that the
 * affordance the effect depends on is present.
 */

function render(result: ValidationResult | null): string {
  return renderToStaticMarkup(createElement(Feedback, { result }));
}

const CORRECT: ValidationResult = { status: "correct", message: "That is the right value." };
const PARTIAL: ValidationResult = { status: "partial", message: "Half of it is there." };
const INCORRECT: ValidationResult = { status: "incorrect", message: "Check the normalization." };

describe("Feedback", () => {
  it("mounts the live region before there is any result to announce", () => {
    const html = render(null);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it("keeps the same live region once a result arrives, rather than swapping it in", () => {
    // Same region, new contents — this is what makes the announcement fire.
    expect(render(CORRECT)).toContain('role="status"');
  });

  it("makes the result box programmatically focusable and nothing more", () => {
    const html = render(INCORRECT);
    // -1, not 0: ProblemView needs to be able to focus it, but a reader
    // tabbing down the page must not be made to stop on it.
    expect(html).toContain('tabindex="-1"');
    expect(html).not.toContain('tabindex="0"');
  });

  it("names every status in words, so none of the three is color-only", () => {
    expect(render(CORRECT)).toContain("Correct");
    expect(render(PARTIAL)).toContain("Partially correct");
    expect(render(INCORRECT)).toContain("Not quite");
  });

  it("gives partial its own surface, not a restyled correct or incorrect", () => {
    // The brief this answers: a partially-correct answer has to be visibly a
    // third thing at a glance, not the same box with different words.
    const surfaces = [CORRECT, PARTIAL, INCORRECT].map((result) => {
      const match = render(result).match(/class="flex gap-2\.5 [^"]*"/);
      expect(match, `no result box rendered for ${result.status}`).not.toBeNull();
      return match![0];
    });
    expect(new Set(surfaces).size).toBe(3);
  });

  it("gives each status its own glyph, decorative and never the only signal", () => {
    const paths = [CORRECT, PARTIAL, INCORRECT].map((result) => {
      const html = render(result);
      expect(html).toContain('aria-hidden="true"');
      return [...html.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1]).join(" ");
    });
    expect(new Set(paths).size).toBe(3);
  });

  it("shows nothing at all before a submission", () => {
    const html = render(null);
    expect(html).not.toContain("Correct");
    expect(html).not.toContain("Not quite");
  });
});
