import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Minimal CSS custom-property reader, shared by the design-token tests.
 *
 * Both `contrast.test.ts` and `pillars.test.ts` assert against the *real*
 * `src/app/globals.css` rather than a fixture — a test that restates the
 * expected values can only restate drift, not detect it. That means they need
 * to parse it, and parsing CSS with regex has exactly one trap that matters
 * here: **comments**.
 *
 * globals.css is heavily commented, and those comments legitimately quote
 * declaration syntax while explaining it (e.g. a note reading
 * "`--background: var(--depth-0)` on `:root` computes to..."). A naive
 * `--name: value;` scan matches inside that prose and then swallows
 * everything up to the next real semicolon — silently eating the genuine
 * declaration that follows it. That is not hypothetical: it made
 * `[data-pillar="apex"]`'s `--depth-0` disappear from the parse, which turned
 * a passing contrast assertion into a `TypeError` on undefined.
 *
 * So: strip comments first, always.
 */

const GLOBALS_CSS_PATH = path.resolve(import.meta.dirname, "../../../app/globals.css");

/** Removes `/* ... *\/` blocks. CSS has no line comments, so this is complete. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

export function readGlobalsCss(): string {
  return stripComments(readFileSync(GLOBALS_CSS_PATH, "utf8"));
}

/**
 * Extracts the custom-property declarations from the first rule whose
 * selector text matches `selector`, resolving one level of `var()` aliasing
 * (`--background: var(--depth-0)` becomes the literal `--depth-0` holds).
 * One level is all this stylesheet uses.
 *
 * Walks to the matching close brace rather than to the next `}`, so nested
 * at-rules and blocks don't truncate the body.
 */
export function tokensIn(css: string, selector: string): Record<string, string> {
  const index = css.indexOf(selector);
  if (index === -1) throw new Error(`selector not found in globals.css: ${selector}`);

  const open = css.indexOf("{", index);
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

  const body = css.slice(open + 1, end);
  const tokens: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    tokens[match[1]] = match[2].trim();
  }

  for (const [name, value] of Object.entries(tokens)) {
    const reference = value.match(/^var\((--[\w-]+)\)$/);
    if (reference && tokens[reference[1]]) tokens[name] = tokens[reference[1]];
  }

  return tokens;
}
