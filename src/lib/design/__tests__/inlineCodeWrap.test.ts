import { describe, expect, it } from "vitest";
import { readGlobalsCss } from "./cssTokens";

/**
 * ============================================================
 * Inline code must be able to wrap
 * ============================================================
 * A backtick-quoted identifier in lesson prose (`optimalGroverIterations(6)`)
 * has no space in it, so the browser's default line-break algorithm has
 * nowhere to break it: without `overflow-wrap`, a long token just keeps its
 * full width and pushes past the reading column. `body` carries
 * `overflow-x: clip` (see CLAUDE.md / DESIGN_SYSTEM.md), so that overflow
 * produces no scrollbar and no ragged edge at 320px — the token's tail is
 * simply gone, invisible to anyone not measuring `scrollWidth` against
 * `clientWidth` on the element itself. Measured against the real corpus: 510
 * inline `<code>` spans longer than 22 characters, across 152 of 219 lesson
 * files, so this is one styling rule to get right rather than hundreds of
 * call sites to rewrap by hand.
 *
 * This can't be a rendered-page audit assertion here (that's
 * `scripts/audit/responsive.mjs`, which caught the original defect on the
 * Grover's algorithm lesson at 320px); jsdom does no layout and this repo
 * carries no DOM-emulation devDependency to fake one. What *is* checkable
 * without a browser is that the rule a fix depends on actually exists, says
 * what it must, and is scoped the way the surrounding code (and
 * `cascadeLayers.test.ts`'s allowlist, which this selector is also entered
 * into) assumes it is.
 */

const GLOBALS_CSS = readGlobalsCss();

/** Same brace-depth walk as cssTokens.ts's tokensIn() and the print/
 *  reduced-motion test's extractBlock() — CSS can nest braces (at-rules,
 *  and this stylesheet's own multi-line selectors), so "find the next `}`"
 *  is not safe. */
function declarationBlockFor(css: string, selector: string): string {
  const at = css.indexOf(selector);
  if (at === -1) throw new Error(`selector not found in globals.css: ${selector}`);
  const open = css.indexOf("{", at);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return css.slice(open + 1, end);
}

describe("inline code wrapping", () => {
  const SELECTOR = ".prose :where(code):not(:where(pre code))";

  it("sets overflow-wrap on bare inline code in prose", () => {
    const body = declarationBlockFor(GLOBALS_CSS, SELECTOR);
    expect(body).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it("excludes code inside a fenced block, which already scrolls instead of wrapping", () => {
    // `pre code` gets its horizontal scrollbar from the typography plugin's
    // own `pre` rule; wrapping it instead would defeat indentation. The
    // selector has to say so explicitly, or a future find-and-replace could
    // widen it without anyone noticing the fenced-block case regressed.
    expect(SELECTOR).toContain(":not(:where(pre code))");
    expect(GLOBALS_CSS).toContain(SELECTOR);
  });

  // Whether this rule actually outranks the typography plugin's own
  // unlayered `code` rule (i.e. that it sits outside every `@layer`, and is
  // entered in `INTENTIONALLY_UNLAYERED` with a real reason) is
  // `cascadeLayers.test.ts`'s job, not re-derived here with a weaker check:
  // it already fails if this selector is ever moved into a layer without
  // updating that allowlist.
});
