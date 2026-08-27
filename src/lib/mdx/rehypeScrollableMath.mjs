/**
 * Give display math a keyboard path to its own horizontal scroll.
 *
 * `globals.css` gives `.katex-display` `overflow-x: auto`, because KaTeX ships
 * `.katex-display > .katex { white-space: nowrap }` and this site's equations
 * are routinely wider than a phone viewport. But a scroll container is only
 * focusable-by-default in Firefox. In Chromium and WebKit a keyboard-only
 * reader has no way to scroll it: they can see the left of the equation and
 * nothing else, with no affordance and no error. On a site where the equation
 * *is* the content, that hides the substance rather than the decoration.
 *
 * The fix is the standard one for scrollable regions — make the container
 * focusable so the arrow keys reach it. It has to happen here rather than in
 * `mdx-components.tsx`, because `rehype-katex` splices its rendered nodes over
 * the `<div class="math math-display">` that remark-rehype produced
 * (`parent.children.splice(index, 1, ...result)`), so by the time MDX maps
 * element names to components there is no distinguishable wrapper left to
 * target — only a `<span class="katex-display">`, and overriding every `span`
 * is obviously not an option.
 *
 * Deliberately no `aria-label` and no `role`: KaTeX already emits a MathML
 * tree for assistive tech alongside the visual HTML, and naming the container
 * would override that with a flat string, making equations *less* legible to a
 * screen reader. The only change is focusability.
 *
 * This costs one extra tab stop per display equation. That is a real trade,
 * accepted because the alternative is that the right-hand side of every wide
 * equation is unreachable without a mouse.
 *
 * Must run *after* `rehype-katex` in the `rehypePlugins` array in
 * `next.config.ts` — before it, `.katex-display` does not exist yet.
 */
export default function rehypeScrollableMath() {
  return (tree) => {
    visit(tree);
  };
}

/** Minimal walker — avoids depending on `unist-util-visit` resolving from a
 *  plugin loaded by module path rather than by package name. */
function visit(node) {
  if (!node || typeof node !== "object") return;

  if (node.type === "element" && isDisplayMath(node)) {
    node.properties = { ...node.properties, tabIndex: 0 };
    return; // no nested display math to find inside a rendered equation
  }

  const children = node.children;
  if (!Array.isArray(children)) return;
  for (const child of children) visit(child);
}

function isDisplayMath(node) {
  const className = node.properties?.className;
  if (Array.isArray(className)) return className.includes("katex-display");
  return typeof className === "string" && className.split(/\s+/).includes("katex-display");
}
