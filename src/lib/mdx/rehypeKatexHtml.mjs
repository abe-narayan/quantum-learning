import katex from "katex";

/**
 * Renders math to KaTeX HTML at compile time — like `rehype-katex`, with the
 * same matching rules and error semantics — but emits each equation as ONE
 * MDX JSX node (`<KatexHtml html="…"/>`, see
 * `src/components/mdx/KatexHtml.tsx`) carrying `katex.renderToString()`'s
 * output as a single string, instead of parsing that HTML back into a hast
 * tree the way `rehype-katex` does.
 *
 * WHY: build memory, not aesthetics. KaTeX HTML is enormous — this corpus's
 * 219 lessons hold ~17,500 equations, and with `rehype-katex` each equation
 * became hundreds of nested hast elements that MDX then compiled into
 * hundreds of `_jsx()` calls. Measured on this corpus: 3.4MB of MDX source
 * compiled to ~82MB of JS (24x, up to 61x for math-heavy Apex lessons), and
 * holding that many AST nodes through SWC parse → transform → minify →
 * Turbopack's retained task graph dominated the cold-build peak (~6.3GB in
 * one process — the thing that OOM'd Vercel's 8GB build container). As one
 * string literal per equation, the same HTML bytes are a single AST node:
 * the rendered page is unchanged, the compiler works ~50x fewer nodes.
 *
 * Matching follows `rehype-katex` exactly (see node_modules/rehype-katex):
 * elements classed `math-inline` (inline `$…$`), `math-display` (block
 * `$$…$$`), and `language-math` `<code>` inside `<pre>` (```math fences —
 * none currently authored, supported for parity). Error handling follows it
 * too: try `throwOnError: true` first, report via `file.message`, retry with
 * `strict: "ignore"` + `throwOnError: false`, and fall back to the same
 * `.katex-error` span it produces when KaTeX throws non-parse errors.
 *
 * ACCESSIBILITY (folded in from the retired `rehypeScrollableMath.mjs`):
 * display math gets `tabindex="0"` injected onto KaTeX's own
 * `.katex-display` wrapper. `globals.css` gives `.katex-display`
 * `overflow-x: auto`, and a scroll container is only focusable-by-default in
 * Firefox — without the tab stop, a keyboard-only reader in Chromium/WebKit
 * can see only the left edge of a wide equation with no way to scroll it.
 * Deliberately no `aria-label`/`role`: KaTeX already emits a MathML tree for
 * assistive tech, and naming the container would flatten equations for
 * screen readers. One extra tab stop per display equation is the accepted
 * trade. (It must be string-injected here because the rendered HTML never
 * exists as hast any more.)
 *
 * The walker is hand-rolled (no `unist-util-visit`) for the same reason the
 * old plugin's was: this file is loaded by absolute path from
 * next.config.ts, so bare-specifier resolution happens relative to
 * `@next/mdx`, not this file — `katex` itself resolves fine because Node
 * walks up from this file's real location for real `import` statements.
 */
export default function rehypeKatexHtml(options) {
  const settings = options || {};

  return (tree, file) => {
    walk(tree, file, settings);
  };
}

const DISPLAY_OPEN = '<span class="katex-display">';
const DISPLAY_OPEN_FOCUSABLE = '<span class="katex-display" tabindex="0">';

function walk(node, file, settings) {
  const children = node?.children;
  if (!Array.isArray(children)) return;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child?.type === "element") {
      // ```math fences: the classed <code> sits inside a <pre>; the <pre> is
      // what gets replaced, and fences are always display math.
      if (child.tagName === "pre") {
        const code = child.children?.find(
          (c) => c?.type === "element" && c.tagName === "code" && hasClass(c, "language-math")
        );
        if (code) {
          children[i] = renderNode(textOf(code), true, file, settings, code);
          continue;
        }
      }

      const inline = hasClass(child, "math-inline");
      const display = hasClass(child, "math-display") || (!inline && hasClass(child, "language-math"));
      if (inline || display) {
        children[i] = renderNode(textOf(child), display, file, settings, child);
        continue;
      }
    }

    // Recurse into EVERYTHING that has children, not just `element` nodes:
    // equations authored inside custom JSX components (`<TheoremBox>$$…$$
    // </TheoremBox>`, `<DerivationStep>` bodies, …) live under
    // `mdxJsxFlowElement`/`mdxJsxTextElement` nodes, exactly where
    // `unist-util-visit` would have descended for rehype-katex. Skipping
    // them left ~2,000 of the corpus's equations as raw math elements
    // (caught by the built-page fidelity diff — see the plugin tests).
    walk(child, file, settings);
  }
}

function renderNode(value, displayMode, file, settings, sourceElement) {
  let html;
  try {
    html = katex.renderToString(value, { ...settings, displayMode, throwOnError: true });
  } catch (error) {
    file?.message?.("Could not render math with KaTeX", {
      cause: error,
      place: sourceElement?.position,
      ruleId: String(error?.name || "error").toLowerCase(),
      source: "rehype-katex-html",
    });
    try {
      html = katex.renderToString(value, {
        ...settings,
        displayMode,
        strict: "ignore",
        throwOnError: false,
      });
    } catch (retryError) {
      // Same markup rehype-katex generates for non-parse errors.
      html = `<span class="katex-error" style="color:${settings.errorColor || "#cc0000"}" title="${escapeAttribute(
        String(retryError)
      )}">${escapeText(value)}</span>`;
    }
  }

  if (displayMode && html.startsWith(DISPLAY_OPEN)) {
    html = DISPLAY_OPEN_FOCUSABLE + html.slice(DISPLAY_OPEN.length);
  } else if (displayMode && !html.includes("katex-error")) {
    // KaTeX 0.18 emits exactly DISPLAY_OPEN for display mode with this
    // config. If a future settings change (e.g. `fleqn`/`leqno`, which add
    // classes to the wrapper) breaks the prefix match, every display
    // equation would silently lose its keyboard-scroll tab stop — fail loud
    // instead so the a11y affordance can't rot invisibly. (The katex-error
    // fallback path legitimately has no display wrapper — parity with
    // rehype-katex.)
    throw new Error(
      "rehypeKatexHtml: display-math output did not start with the expected " +
        `'${DISPLAY_OPEN}' wrapper — the tabindex injection would silently ` +
        "stop working. Update DISPLAY_OPEN to match this KaTeX version/config."
    );
  }

  return {
    // Flow position for block math (it replaces a div/pre), phrasing for
    // inline (it replaces a span inside a paragraph) — MDX's hast→ESTree
    // stage handles both node types natively.
    type: displayMode ? "mdxJsxFlowElement" : "mdxJsxTextElement",
    name: "KatexHtml",
    attributes: [{ type: "mdxJsxAttribute", name: "html", value: html }],
    children: [],
  };
}

function hasClass(node, name) {
  const className = node.properties?.className;
  if (Array.isArray(className)) return className.includes(name);
  return typeof className === "string" && className.split(/\s+/).includes(name);
}

/** Concatenated text content (whitespace preserved) — math elements produced
 *  by remark-math only ever contain text nodes. */
function textOf(node) {
  if (node.type === "text") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(textOf).join("");
}

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
