import { describe, expect, it } from "vitest";
import { compile } from "@mdx-js/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeScrollableMath from "../rehypeScrollableMath.mjs";

/**
 * `.katex-display` is a horizontal scroll container (globals.css gives it
 * `overflow-x: auto`, because KaTeX forces `white-space: nowrap` and this
 * site's equations routinely exceed a phone's width). Only Firefox makes a
 * scroll container keyboard-focusable on its own; in Chromium and WebKit a
 * keyboard-only reader can see the left of a wide equation and has no way to
 * reach the rest.
 *
 * These run the real MDX pipeline rather than a hand-built hast tree, because
 * the thing that actually breaks is *ordering*: `rehype-katex` replaces the
 * `<div class="math math-display">` wrapper outright
 * (`parent.children.splice(index, 1, ...result)`), so a plugin placed before
 * it silently matches nothing and everything still compiles.
 */

async function render(md: string): Promise<string> {
  const compiled = await compile(
    { value: md },
    {
      jsx: false,
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }], rehypeScrollableMath],
    },
  );
  return String(compiled);
}

describe("rehypeScrollableMath", () => {
  it("makes display math reachable by keyboard", async () => {
    const out = await render("Before.\n\n$$\n\\hat{H}\\psi = E\\psi\n$$\n\nAfter.\n");
    expect(out).toContain("katex-display");
    expect(out, "display math is a scroll container with no keyboard path").toMatch(/tabIndex/);
  });

  it("leaves inline math alone", async () => {
    // Inline math does not scroll, so a tab stop there would be pure noise in
    // the middle of a sentence.
    const out = await render("The energy $E = h\\nu$ is quantised.\n");
    expect(out).toContain("katex");
    expect(out).not.toContain("katex-display");
    expect(out).not.toMatch(/tabIndex/);
  });

  it("adds no accessible name of its own", async () => {
    // KaTeX emits a MathML tree for assistive tech alongside the visual HTML.
    // An aria-label on the container would flatten that to one string, making
    // equations less legible to a screen reader, not more.
    const out = await render("$$\n\\int_0^\\infty e^{-x}\\,dx = 1\n$$\n");
    expect(out).not.toMatch(/aria-label|ariaLabel/);
  });

  it("tags every display equation, not just the first", async () => {
    const out = await render("$$\na = b\n$$\n\ntext\n\n$$\nc = d\n$$\n");
    expect([...out.matchAll(/tabIndex/g)]).toHaveLength(2);
  });
});
