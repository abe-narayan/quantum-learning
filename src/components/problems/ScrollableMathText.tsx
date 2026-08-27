import { MathText } from "@/components/ui/MathText";

/**
 * ============================================================
 * Inline problem math that survives a 320px viewport
 * ============================================================
 * Lesson prose gets this for free: `rehypeScrollableMath`
 * (`src/lib/mdx/rehypeScrollableMath.mjs`) runs after `rehype-katex` in the
 * MDX pipeline and marks every `.katex-display` container `tabIndex={0}`, so
 * the `overflow-x: auto` `globals.css` already gives it is reachable from the
 * keyboard as well as from a thumb.
 *
 * Problem content does not go through MDX at all. Prompts, options, hints and
 * solution steps are plain strings carrying inline `$...$` segments, rendered
 * by `MathText` — so none of them ever meet that rehype plugin. KaTeX sets
 * `white-space: nowrap` inside `.katex`, and 87 of the 1,164 inline segments
 * across `src/content/problems` are over 60 LaTeX characters (the longest is
 * 166: a two-matrix product). At 320px the prompt column is roughly 240px
 * wide, so those run straight off the side of the page and take the document's
 * horizontal scrollbar with them.
 *
 * This applies the same treatment the MDX path gets, at the one grain where
 * the problem system can reach it: each *long* math run becomes its own
 * `max-w-full overflow-x-auto` box, so the equation scrolls inside the column
 * instead of widening it, and carries `tabIndex={0}` so arrow keys reach that
 * scroll — focusable-by-default scroll containers are a Firefox-only
 * behaviour, exactly the gap `rehypeScrollableMath` documents.
 *
 * The length gate is the whole point of the component. Making *every* inline
 * run focusable would add a tab stop for each `$n$` and `$|0\rangle$` on the
 * page — a prompt with six short symbols would cost six meaningless stops,
 * which is a worse a11y outcome than the overflow it prevents. Only runs that
 * can plausibly exceed the narrowest column get one; short runs still render
 * through `MathText` untouched.
 *
 * Deliberately composes `MathText` rather than re-implementing it: KaTeX
 * rendering stays in exactly one place, and this file only owns the wrapper.
 * No `aria-label` and no `role` on the wrapper, for the reason
 * `rehypeScrollableMath` gives at length — KaTeX emits its own MathML for
 * assistive tech, and naming the container would flatten it to a string.
 */

/** LaTeX source length (including the `$` delimiters) past which a run is
 *  treated as "can overflow a phone column". Chosen against the real corpus:
 *  it leaves the vast majority of inline symbols alone and catches the
 *  fraction/matrix/bra-ket chains that actually run wide. */
const WIDE_MATH_CHARS = 40;

const MATH_SEGMENT = /(\$[^$]+\$)/g;

function isMath(part: string): boolean {
  return part.length > 1 && part.startsWith("$") && part.endsWith("$");
}

export function ScrollableMathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(MATH_SEGMENT).filter((part) => part.length > 0);

  // Nothing wide enough to need the treatment: render exactly what every
  // other caller of `MathText` renders, with no extra wrapper spans.
  if (!parts.some((part) => isMath(part) && part.length > WIDE_MATH_CHARS)) {
    return <MathText text={text} className={className} />;
  }

  return (
    <span className={className}>
      {parts.map((part, index) =>
        isMath(part) && part.length > WIDE_MATH_CHARS ? (
          <span
            key={index}
            tabIndex={0}
            className="inline-block max-w-full overflow-x-auto align-middle focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
          >
            <MathText text={part} />
          </span>
        ) : (
          <MathText key={index} text={part} />
        )
      )}
    </span>
  );
}
