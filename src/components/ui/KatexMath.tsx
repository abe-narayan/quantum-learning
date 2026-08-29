"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

/**
 * KaTeX's own display wrapper, and the same wrapper with the keyboard-scroll
 * tab stop injected. Kept byte-identical to `DISPLAY_OPEN` /
 * `DISPLAY_OPEN_FOCUSABLE` in `src/lib/mdx/rehypeKatexHtml.mjs` on purpose —
 * see `focusableDisplayHtml` below.
 */
const DISPLAY_OPEN = '<span class="katex-display">';
const DISPLAY_OPEN_FOCUSABLE = '<span class="katex-display" tabindex="0">';

/**
 * Injects `tabindex="0"` onto KaTeX's `.katex-display` wrapper, exactly as
 * `rehypeKatexHtml.mjs` does for compiled lesson math.
 *
 * WHY THIS AND NOT A WRAPPER ELEMENT: `globals.css` §6 gives `.katex-display`
 * `overflow-x: auto`, and `.katex-display` is a block that fills its parent's
 * content box — so the element that actually scrolls a too-wide equation is
 * `.katex-display` itself, never anything we could wrap around it. A scroll
 * container is focusable by default only in Firefox; in Chromium and WebKit a
 * keyboard-only reader sees the left edge of the formula and has no way
 * whatsoever to reach the rest of it (WCAG 2.1.1). Putting `tabIndex` on an
 * outer `<span>`/`<div>` does not fix that: arrow keys scroll the focused
 * element's own scroll container, and an outer box that cannot itself scroll
 * just passes the keystroke up to the document. The tab stop has to land on
 * the same element the overflow is on.
 *
 * This matters most for the ~13 simulator state readouts that render through
 * here: the ket IS the instrument's output, and at the narrowest real column
 * (~254px: a 320px phone, less the page's 16px gutters, less a figure frame's
 * `panel-inset p-4` border+padding) a two-qubit amplitude expression overflows
 * routinely. `globals.css` even styles `.katex-display:focus-visible`, a rule
 * this path could never fire before.
 *
 * Deliberately NO `role` and NO `aria-label` on the math container — same
 * decision as `rehypeKatexHtml.mjs`, for the reason its header gives: KaTeX
 * already emits a MathML tree for assistive tech, and naming the container
 * flattens the equation to that one string. One extra tab stop per display
 * equation is the accepted trade.
 *
 * Unlike the build-time plugin this does not throw when the prefix fails to
 * match, because a class-name change in a future KaTeX should not blank a
 * running simulator. It cannot rot silently either: both paths call the same
 * `katex` package with `displayMode: true`, so any change to that wrapper
 * fails `rehypeKatexHtml.mjs`'s hard check at build time first, and the build
 * is where it gets noticed.
 */
function focusableDisplayHtml(html: string): string {
  return html.startsWith(DISPLAY_OPEN) ? DISPLAY_OPEN_FOCUSABLE + html.slice(DISPLAY_OPEN.length) : html;
}

/**
 * Renders a LaTeX string client-side via KaTeX's own renderer. This is for
 * math whose value changes at runtime (e.g. live simulator state) — static
 * lesson math is instead compiled at build time via remark-math/rehype-katex.
 * Both paths share the same `katex` package, the same stylesheet, and (see
 * `focusableDisplayHtml`) the same keyboard affordance on display math.
 */
export function KatexMath({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    const rendered = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
    });
    // Inline math is not a scroll container (no `.katex-display`, no
    // `overflow-x`), so it must NOT get a tab stop: that would put a focus
    // stop on every symbol in a sentence.
    return display ? focusableDisplayHtml(rendered) : rendered;
  }, [tex, display]);

  return <span className={cn("katex-math", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
