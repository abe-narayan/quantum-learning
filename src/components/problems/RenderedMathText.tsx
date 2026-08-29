import { isRenderedMath, type MathRun, type MathRuns } from "./mathRuns";

/**
 * ============================================================
 * Problem math, already rendered
 * ============================================================
 * The client-safe half of the split described in `mathRuns.ts`: these
 * components inject KaTeX HTML that `renderProblemMath.ts` produced on the
 * server, and import nothing that reaches `katex`. Every math-bearing client
 * component on `/problems/[slug]` renders through here, which is what keeps
 * the 268KB KaTeX runtime out of that route's eager bundle (pinned by
 * `src/lib/design/__tests__/clientBoundary.test.ts`).
 *
 * The markup below is not "equivalent to" `components/ui/MathText.tsx` and
 * the old `ScrollableMathText` — it is the same markup, element for element
 * and attribute for attribute, because the whole point of the change is that
 * no rendered pixel moves. `ScrollableMathText` now delegates its own output
 * to `RenderedScrollableMathText`, so the problem system has exactly one
 * implementation; the equivalence with `MathText`, which is still used
 * directly by server pages, is pinned across the whole problem corpus by
 * `__tests__/renderedMath.test.ts`.
 */

/**
 * `MathText`'s output, from runs instead of from source text: one `<span>`
 * per segment inside one optionally-classed wrapper. The per-segment spans
 * are not decorative — dropping them changes what `className` applies to and
 * how the wide-run wrapper below nests.
 */
export function RenderedMathText({ runs, className }: { runs: MathRuns; className?: string }) {
  return (
    <span className={className}>
      {runs.map((run, index) =>
        isRenderedMath(run) ? (
          <span key={index} dangerouslySetInnerHTML={{ __html: run.html }} />
        ) : (
          <span key={index}>{run.text}</span>
        )
      )}
    </span>
  );
}

/**
 * `ScrollableMathText`'s output, from runs.
 *
 * Each *long* math run becomes its own `max-w-full overflow-x-auto` box, so a
 * wide equation scrolls inside the column instead of widening it and taking
 * the document's horizontal scrollbar with it at 320px, and carries
 * `tabIndex={0}` so arrow keys reach that scroll — a scroll container is
 * focusable by default only in Firefox, exactly the gap
 * `src/lib/mdx/rehypeKatexHtml.mjs` documents for the lesson path.
 *
 * The length gate is the whole point: making *every* inline run focusable
 * would add a tab stop for each `$n$` and `$|0\rangle$` on the page, which is
 * a worse a11y outcome than the overflow it prevents. Short runs render
 * untouched. No `aria-label` and no `role` on the wrapper, for the reason
 * `rehypeKatexHtml` gives at length — KaTeX emits its own MathML for
 * assistive tech, and naming the container would flatten it to a string.
 */
export function RenderedScrollableMathText({
  runs,
  className,
}: {
  runs: MathRuns;
  className?: string;
}) {
  // Nothing wide enough to need the treatment: render exactly what every
  // other caller renders, with no extra wrapper spans.
  if (!runs.some((run) => isRenderedMath(run) && run.wide)) {
    return <RenderedMathText runs={runs} className={className} />;
  }

  return (
    <span className={className}>
      {runs.map((run: MathRun, index) =>
        isRenderedMath(run) && run.wide ? (
          <span
            key={index}
            tabIndex={0}
            className="inline-block max-w-full overflow-x-auto align-middle focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
          >
            <RenderedMathText runs={[run]} />
          </span>
        ) : (
          <RenderedMathText key={index} runs={[run]} />
        )
      )}
    </span>
  );
}

/**
 * `KatexMath`'s output for an already-rendered equation. `KatexMath` itself
 * stays as it is — simulators render math whose LaTeX changes with live
 * state, which genuinely needs the renderer in the browser — but a solution
 * step's `latex` is authored content, known at build time, so it arrives here
 * as a string. The `katex-math` class is load-bearing (`globals.css` styles
 * it), which is why this mirrors the class rather than inventing one.
 */
export function RenderedKatexMath({ html }: { html: string }) {
  return <span className="katex-math" dangerouslySetInnerHTML={{ __html: html }} />;
}
