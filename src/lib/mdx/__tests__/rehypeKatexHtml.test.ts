import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeKatexHtml from "../rehypeKatexHtml.mjs";
import { KatexHtml } from "@/components/mdx/KatexHtml";

/**
 * `rehypeKatexHtml` replaced `rehype-katex` + `rehypeScrollableMath` for
 * build-memory reasons (see its header): equations compile to ONE
 * `<KatexHtml html="…"/>` string node instead of thousands of hast elements.
 * These tests protect the two things that must not drift:
 *
 * 1. RENDER FIDELITY — the HTML a reader gets must stay equivalent to what
 *    the rehype-katex pipeline produced (`.katex` structure, MathML for
 *    assistive tech, error fallbacks).
 * 2. THE KEYBOARD PATH — `.katex-display` is a horizontal scroll container
 *    (globals.css gives it `overflow-x: auto`); only Firefox makes scroll
 *    containers focusable by default, so the plugin must inject
 *    `tabindex="0"` on every display equation or keyboard-only readers in
 *    Chromium/WebKit can never reach the right-hand side of a wide equation.
 *    (This was `rehypeScrollableMath`'s whole job; it is folded in here
 *    because the rendered HTML no longer exists as hast for a later plugin
 *    to tag.)
 */

/** Compiles MDX through the production math pipeline and renders it to HTML
 *  with the KatexHtml component supplied, exactly as lesson pages do. */
async function render(md: string): Promise<string> {
  const compiled = await compile(
    { value: md },
    {
      outputFormat: "function-body",
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatexHtml, { strict: false }]],
    },
  );
  const mod = await run(compiled, { ...runtime, baseUrl: import.meta.url });
  return renderToStaticMarkup(createElement(mod.default, { components: { KatexHtml } }));
}

/** The old pipeline, as a fidelity reference. */
async function renderLegacy(md: string): Promise<string> {
  const compiled = await compile(
    { value: md },
    {
      outputFormat: "function-body",
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    },
  );
  const mod = await run(compiled, { ...runtime, baseUrl: import.meta.url });
  return renderToStaticMarkup(createElement(mod.default, {}));
}

const countOf = (haystack: string, needle: string) => haystack.split(needle).length - 1;

describe("rehypeKatexHtml", () => {
  it("renders inline and display math to real KaTeX markup", async () => {
    const out = await render("The energy $E = h\\nu$ is quantised.\n\n$$\n\\hat{H}\\psi = E\\psi\n$$\n");
    expect(out).toContain('class="katex"');
    expect(out).toContain('class="katex-display"');
    expect(out, "MathML for assistive tech must survive").toContain("<math");
    // (The raw TeX legitimately appears once, inside MathML's
    // <annotation encoding="application/x-tex"> — same as rehype-katex.)
    expect(out, "the visual HTML tree must be present").toContain('class="katex-html"');
  });

  it("matches the rehype-katex pipeline's equation structure", async () => {
    const md = "Inline $a^2 + b^2 = c^2$ and\n\n$$\n\\int_0^\\infty e^{-x}\\,dx = 1\n$$\n";
    const current = await render(md);
    const legacy = await renderLegacy(md);
    for (const marker of ['class="katex"', 'class="katex-display"', "<math", "katex-html"]) {
      expect(countOf(current, marker), `count of ${marker}`).toBe(countOf(legacy, marker));
    }
  });

  it("makes display math reachable by keyboard", async () => {
    const out = await render("Before.\n\n$$\n\\hat{H}\\psi = E\\psi\n$$\n\nAfter.\n");
    expect(out, "display math is a scroll container with no keyboard path").toContain(
      'class="katex-display" tabindex="0"',
    );
  });

  it("tags every display equation, not just the first", async () => {
    const out = await render("$$\na = b\n$$\n\ntext\n\n$$\nc = d\n$$\n");
    expect(countOf(out, 'tabindex="0"')).toBe(2);
  });

  it("leaves inline math without a tab stop", async () => {
    // Inline math does not scroll, so a tab stop there would be pure noise in
    // the middle of a sentence.
    const out = await render("The energy $E = h\\nu$ is quantised.\n");
    expect(out).toContain("katex");
    expect(out).not.toContain("katex-display");
    expect(out).not.toContain("tabindex");
  });

  it("adds no accessible name of its own", async () => {
    // KaTeX emits a MathML tree for assistive tech alongside the visual HTML.
    // An aria-label on the container would flatten that to one string, making
    // equations less legible to a screen reader, not more.
    const out = await render("$$\n\\int_0^\\infty e^{-x}\\,dx = 1\n$$\n");
    expect(out).not.toMatch(/aria-label/);
  });

  it("degrades malformed TeX the same way rehype-katex does (no thrown build error)", async () => {
    // An unclosed group is a genuine KaTeX ParseError (unknown macros are NOT
    // — KaTeX 0.18 renders them leniently): the first render throws, the
    // retry with strict:"ignore" + throwOnError:false produces KaTeX's inline
    // error markup instead of failing the compile.
    const malformed = "$a^{$\n";
    const out = await render(malformed);
    const legacy = await renderLegacy(malformed);
    expect(out).toContain("katex-error");
    expect(countOf(out, "katex-error")).toBe(countOf(legacy, "katex-error"));
  });

  it("renders math nested inside JSX components (mdxJsx nodes)", async () => {
    // Equations inside custom components are the corpus's common case
    // (`<TheoremBox>$$…$$</TheoremBox>`, DerivationStep bodies, …). Those
    // math elements live under mdxJsxFlowElement/mdxJsxTextElement — not
    // plain hast elements — and the walker must descend into them; a
    // version that didn't left ~2,000 corpus equations unrendered.
    const Box = ({ children }: { children?: unknown }) => createElement("div", null, children as never);
    const md = "<Box>\n  Inline $E=h\\nu$ and\n\n  $$\n  a = b\n  $$\n</Box>\n";
    const compiled = await compile(
      { value: md },
      {
        outputFormat: "function-body",
        remarkPlugins: [remarkMath],
        rehypePlugins: [[rehypeKatexHtml, { strict: false }]],
      },
    );
    const mod = await run(compiled, { ...runtime, baseUrl: import.meta.url });
    const out = renderToStaticMarkup(
      createElement(mod.default, { components: { KatexHtml, Box } as never }),
    );
    expect(countOf(out, 'class="katex"')).toBe(2);
    expect(out).toContain('class="katex-display" tabindex="0"');
  });

  it("supports ```math fences as display math (rehype-katex parity)", async () => {
    const out = await render("```math\na = b\n```\n");
    expect(out).toContain('class="katex-display" tabindex="0"');
  });
});
