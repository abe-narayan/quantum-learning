import katex from "katex";

/**
 * Renders plain text containing inline `$...$` LaTeX segments — the
 * lightweight alternative to full MDX compilation for content (like
 * problems) that's mostly short structured strings rather than long-form
 * prose. Pure function of its props (no hooks), so — like
 * `QuantumStateDisplay` — it renders correctly from a Server Component or a
 * Client Component without needing two versions.
 *
 * **Rendering correctly from a Client Component is not the same as belonging
 * there.** This file statically imports `katex`, which is 268KB raw / 74.1KB
 * gzip, so any `"use client"` module that reaches it — directly, or through
 * an intermediate like `ScrollableMathText` that carries no directive of its
 * own — puts the whole KaTeX runtime in that route's eager browser bundle.
 * That is exactly how all 547 problem pages came to ship it. The fix, and the
 * pattern to copy, is `src/components/problems/mathRuns.ts`: render on the
 * server, hand the client the HTML string. `app/courses/[slug]/page.tsx`, the
 * remaining caller, is a Server Component. `clientBoundary.test.ts` fails any
 * route that re-opens a chain to `katex`.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$[^$]+\$)/g).filter((part) => part.length > 0);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 1) {
          const html = katex.renderToString(part.slice(1, -1), {
            displayMode: false,
            throwOnError: false,
            strict: false,
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
