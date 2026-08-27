/**
 * Injection target for `src/lib/mdx/rehypeKatexHtml.mjs` — every equation in
 * every lesson renders through this. The plugin compiles math to KaTeX HTML
 * at build time and hands it over as ONE string, which this server component
 * injects verbatim; see the plugin's header for why that (vs. rehype-katex's
 * element-tree splicing) is the difference between a ~6GB and a much smaller
 * cold-build peak.
 *
 * `display: contents` makes the wrapper invisible to layout and CSS
 * selectors: `.katex` / `.katex-display` (which carries the plugin-injected
 * `tabindex="0"` scroll-focus affordance) participate in the page exactly as
 * they did when they were direct siblings. The wrapper exists only because
 * React requires an element to attach `dangerouslySetInnerHTML` to.
 *
 * Never rendered from authored MDX directly — it is injected post-parse, so
 * it does not appear in any lesson source (and the mdxMapping census test
 * therefore never sees it as a used tag; it lives in the mapping so the
 * compiled `<KatexHtml/>` nodes resolve).
 */
export function KatexHtml({ html }: { html: string }) {
  return <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}
