import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * Horizontally scrollable regions must be reachable by keyboard
 * ============================================================
 * A `div` with `overflow-x: auto` is NOT focusable by default in any browser
 * except Firefox. When its content overflows, a keyboard-only or
 * screen-reader user can see the left edge of a wide table, circuit diagram,
 * matrix or equation and has no way whatsoever to reach the rest of it — the
 * scroll is mouse-wheel and trackpad-gesture only. That is a WCAG 2.1.1
 * (Keyboard) failure, and it is *silent*: the page renders correctly, the
 * markup reads correctly, and nothing in review or in a type check points at
 * it. It can only be found by auditing, which is what this file replaces.
 *
 * The fix this codebase already applies in its canonical places —
 * `src/mdx-components.tsx`'s `Table` wrapper, `rehypeKatexHtml.mjs`'s
 * `.katex-display` injection, `SolutionPanel`, `ScrollableMathText`,
 * `BB84RoundTable` — is `tabIndex={0}` on the scroll container, plus a name
 * (`role="region"` for a landmark-worthy data table, `role="group"` where a
 * name is wanted without a landmark, no role at all where the content
 * underneath already announces itself) and a visible `focus-visible`
 * treatment, which globals.css supplies globally.
 *
 * WHAT THIS TEST CANNOT DO, AND HOW IT COMPENSATES
 * -----------------------------------------------
 * Whether a container *actually overflows* depends on runtime layout, so no
 * lexical scan can decide it. A container that never overflows must NOT get a
 * tab stop — an unreachable region is a bug, but so is a focus stop that
 * lands on nothing, and the second kind is paid by every keyboard user on
 * every page, on every visit. So the scan is deliberately over-inclusive
 * (every scroll container in the tree) and the judgement lives in two
 * explicit, documented, dated lists below:
 *
 *   EXCUSED_NO_OVERFLOW  — containers audited and confirmed unable to
 *                          overflow at any realistic viewport, each with the
 *                          measurement that settles it.
 *   BACKLOG_UNTRIAGED    — containers in directories the audit pass was not
 *                          allowed to edit, recorded so they are countable
 *                          rather than forgotten.
 *
 * Both lists are ratcheted (see "the excused set can only shrink") and both
 * are checked for stale entries, so neither can quietly become a place where
 * new defects are filed and left.
 */

const SRC = path.resolve(import.meta.dirname, "../../..");

/** Tailwind classes that create a horizontal scroll container. */
const SCROLL_CLASS = /\boverflow-(?:x-)?(?:auto|scroll)\b/g;

/** `tabIndex={0}` in JSX, or `tabindex="0"` in raw HTML strings. */
const KEYBOARD_AFFORDANCE = /\btabIndex\b|\btabindex=/;

/**
 * Containers verified NOT to overflow at any realistic viewport, so a tab
 * stop on them would be pure tab-order noise. Keyed by
 * `<path relative to src/>#<0-based index of the scroll container in that
 * file>` rather than by line number, so ordinary edits above them do not
 * invalidate the entry.
 *
 * Audited 2026-08-29. THIS LIST MAY ONLY SHRINK — an entry leaves it when the
 * container stops being a scroll container, never because it became
 * inconvenient. The reference width throughout is the narrowest real reading
 * column this site produces: a 320px viewport, less the page's own 16px
 * gutters, less a figure frame's `panel-inset p-4` — about 256px of content
 * box.
 */
const EXCUSED_NO_OVERFLOW: Record<string, string> = {
  // ---- Runtime/build-time KaTeX slabs -------------------------------------
  // This block held 12 entries at the 2026-08-29 audit and holds one now.
  //
  // The excuse was always correct as far as it went: globals.css §6 gives
  // `.katex-display` its own `overflow-x: auto`, and that element is a block
  // that fills its wrapper's content box, so the *inner* element takes the
  // overflow and the wrapper has nothing left to scroll. But the audit note
  // here also recorded the real defect one level down — the compiled-lesson
  // path injects `tabindex="0"` onto `.katex-display` in `rehypeKatexHtml.mjs`
  // while the runtime path (`src/components/ui/KatexMath.tsx`) and the server
  // path (`src/components/quantum/QuantumStateDisplay.tsx`) emitted the same
  // scrollable slab with no tab stop, leaving ~13 simulator state readouts
  // unreachable and `.katex-display:focus-visible` unfirable on those paths.
  //
  // Both paths now inject the tab stop (see `focusableDisplayHtml` in each).
  // With the slab focusable, the wrapper's `overflow-x-auto` was not merely
  // redundant but actively hazardous — `overflow-x: auto` with `overflow-y:
  // visible` computes the y axis to `auto`, so a tall equation could be
  // clipped with no scrollbar — and it was dropped from every wrapper whose
  // padding makes that safe, which is what deleted those entries from this
  // list rather than any change of judgement.
  //
  // The survivor is the one wrapper with no padding of its own: KaTeX gives
  // `.katex-display` `margin: 1em 0`, and without `overflow` (or padding, or a
  // border) on the parent to establish a block formatting context those
  // margins would collapse out through it and move the layout. Keeping the
  // class is the cheaper of the two, and it still cannot scroll.
  "components/simulators/rabi-explorer/RabiExplorer.tsx#0":
    "wraps a <KatexMath display> slab; .katex-display scrolls itself (and now carries the tab stop), this box cannot — the class is retained only to keep the slab's 1em margins from collapsing out of this unpadded div",

  // ---- Already-focusable content, or a nested scroller --------------------
  // This excuse was true of the DOM and false of the accessibility tree until
  // 2026-08-29. The gates are `role="button" tabIndex={0}` groups, but the
  // `<svg>` around them carried `role="img"` — a children-presentational role,
  // so Chrome and Safari pruned the whole subtree: the tab stops survived
  // (they are DOM, not ARIA) but the buttons and their "Jump to right after …"
  // labels did not. "Tabbing the circuit scrolls it" therefore held, while
  // "and the reader is told what each stop is" did not. The `<svg>` is now
  // `role="group"` + `aria-roledescription="quantum circuit"`, which exposes
  // the gate buttons, so the excuse below is now true as written.
  "components/simulators/circuit-builder/CircuitDiagram.tsx#0":
    "every gate inside is an exposed role=button tabIndex=0 group (the svg is role=group, not role=img); tabbing the circuit scrolls it, so a container stop would be redundant",
  "components/simulators/qaoa-explorer/QAOAExplorer.tsx#0":
    "wraps <GraphDiagram>, which brings its own overflow-x-auto wrapper (now with the tab stop); the outer box has nothing left to scroll",

  // ---- Responsive SVG: `w-full`/`max-w-*` means it shrinks, never overflows
  // A `width={N}` attribute is only an intrinsic size; `className=\"w-full\"`
  // sets `width: 100%`, which wins, so these figures scale down to the column
  // instead of overflowing it. The wrapper is belt-and-braces.
  "components/visualizations/ClassicalSimulabilityMap.tsx#0": "svg is mx-auto w-full max-w-lg — scales down, never overflows",
  "components/visualizations/ComplexityClassDiagram.tsx#0": "svg is mx-auto w-full max-w-lg — scales down, never overflows",
  "components/visualizations/ControlSignalChainDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/CrosstalkDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/DilutionRefrigeratorDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/DiscretizationLimit.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/DispersiveReadoutDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/ExpectationTrace.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/LinewidthDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/LogicalQubitPatchDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/LossVsDecoherence.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/NestedCodeDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/ParametricCurve.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/PhaseSpacePanel.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/PhaseSpacePanel.tsx#1": "svg is w-full — scales down, never overflows",
  "components/visualizations/ReadoutScatter.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/RydbergBlockadeDiagram.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/SurfaceCodePatchExplorer.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/SurfaceCodePatchExplorer.tsx#1": "svg is mx-auto w-full max-w-md — scales down, never overflows",
  "components/visualizations/UncertaintyEllipse.tsx#0": "svg is w-full — scales down, never overflows",
  "components/visualizations/VectorDiagram.tsx#0": "svg is w-full — scales down, never overflows",

  // ---- Intrinsic-width SVG that is narrower than the narrowest column -----
  // These deliberately do NOT scale (see each file's own note on why shrinking
  // would push its labels under the legibility floor), but their natural size
  // already fits the ~256px content box, so the wrapper never scrolls.
  "components/visualizations/OrbitalDensityCloud.tsx#0": "svg is 240px intrinsic inside a ~256px content box",
  "components/visualizations/OrbitalShapePlot.tsx#0": "svg is 220px intrinsic inside a ~256px content box",
  "components/visualizations/PhaseWindingCircle.tsx#0": "svg is 220px intrinsic inside a ~256px content box",

  // ---- Flex layouts that wrap instead of overflowing ----------------------
  "components/visualizations/ExchangeDiagram.tsx#0":
    "flex-wrap row of MatrixCellGrids; callers pass dim 2 or 3, so the widest item is 3 x 3.5rem = 168px",
  "components/visualizations/ExchangeDiagramExplorer.tsx#0":
    "flex-wrap row of MatrixCellGrids; callers pass dim 2 or 3, so the widest item is 3 x 3.5rem = 168px",
  "components/visualizations/PipelineDiagram.tsx#0":
    "inner row is flex flex-wrap; step boxes wrap onto new lines and no single box is column-width",
};

/**
 * Scroll containers in directories the 2026-08-29 audit pass was not allowed
 * to edit. Recorded here so the guard is meaningful today AND so these stay
 * countable: they are reported to whoever owns those areas, and each entry is
 * deleted as it is triaged (fixed, or moved into EXCUSED_NO_OVERFLOW with a
 * measurement). This list exists to be emptied.
 *
 * Two clusters are worth knowing about when picking them up:
 *  - The `.mdx` entries are lesson-authored figure frames. Most wrap an SVG
 *    that is already `w-full`/`max-w-full` and so belong in the excused list;
 *    the exceptions are the ones wrapping a `min-w-full` circuit SVG with a
 *    hard `width` (e.g. quantum-phase-estimation.mdx's 492px diagram), which
 *    are real WCAG 2.1.1 failures.
 *  - `QuantumStateDisplay.tsx` was the server-rendered twin of the KaTeX
 *    problem described in EXCUSED_NO_OVERFLOW above. Triaged and deleted on
 *    2026-08-29: its inner `.katex-display` now gets `tabindex="0"` from
 *    `focusableDisplayHtml`, and the outer `overflow-x-auto` (which could
 *    never scroll, and which forced `overflow-y: auto` onto a box holding a
 *    tall ket) is gone, so the file has no scroll container left to track.
 */
const BACKLOG_UNTRIAGED: Record<string, string> = {
  "app/software/page.tsx#0": "flex-nowrap shrink-0 card strip with no focusable children — reads as a real failure",
  "components/curriculum/CourseTimeline.tsx#0": "sm:min-w-max rail; likely reachable via the course links inside, needs confirming",
  "components/glossary/GlossaryFilter.tsx#0": "<nav> of letter links — focusable children already scroll it, likely needs nothing",
  "components/narrative/DerivationSteps.tsx#0": "wraps compiled display math, which already carries its own tabindex",
  "content/lessons/apex/algorithmic-frontiers/the-quantum-singular-value-transformation.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/fault-tolerance-frontiers/decoding-surface-codes.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/fault-tolerance-frontiers/magic-states-and-distillation.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/quantum-complexity-theory/qma-and-quantum-verification.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/quantum-complexity-theory/the-local-hamiltonian-problem.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx#1": "lesson-authored figure frame",
  "content/lessons/apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims.mdx#0": "lesson-authored figure frame",
  "content/lessons/apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx#0": "lesson-authored figure frame",
  "content/lessons/quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction.mdx#0":
    "lesson-authored figure frame",
  "content/lessons/quantum-computing/quantum-algorithms-i/quantum-phase-estimation.mdx#0":
    "wraps a 492px min-w-full circuit SVG — a real WCAG 2.1.1 failure, fix first",
  "content/lessons/quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform.mdx#0": "lesson-authored figure frame",
  "content/lessons/quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space.mdx#0":
    "lesson-authored figure frame",
  "content/lessons/quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness.mdx#0":
    "lesson-authored figure frame",
  "content/lessons/quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi.mdx#0": "lesson-authored figure frame",
  "content/lessons/quantum-mastery/quantum-information-theory/trace-distance-and-fidelity.mdx#0": "lesson-authored figure frame",
};

/**
 * The ratchet. The number of scroll containers standing without a keyboard
 * affordance, excused or backlogged. It may go down and never up: a new scroll
 * container either gets its tab stop or it fails the main test, and it cannot
 * be waved through by appending to a list, because doing so trips this bound.
 *
 * 64 at the 2026-08-29 audit; 52 after the KaTeX pass later the same day
 * retired 11 excused wrappers and the QuantumStateDisplay backlog entry. The
 * number is re-tightened on every reduction — a ratchet left slack by 12 is a
 * ratchet with 12 free slots in it.
 */
const EXCUSED_TOTAL_AT_AUDIT = 52;

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    // `.tsx`/`.mdx` only: JSX is the only place a scroll container is written
    // in this codebase, and it keeps this very file (a `.ts`, full of the
    // class names it is matching on) out of its own scan.
    else if (/\.(tsx|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Blanks comments while preserving line numbers, so the prose *explaining*
 * these class names — which this codebase writes a great deal of, including
 * on the very containers being matched — is never mistaken for markup.
 * Block comments (the form `{/* … *​/}` JSX comments take) keep their
 * newlines; whole-line `//` comments are erased. A trailing `//` after code
 * is left alone so a `https://…` inside a string cannot swallow its line.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, " "))
    .split("\n")
    .map((line) => (line.trimStart().startsWith("//") ? "" : line))
    .join("\n");
}

/** Index of the `<` that opens the JSX element owning the character at `from`. */
function openingTagStart(source: string, from: number): number {
  for (let i = from; i >= 0; i--) {
    if (source[i] === "<" && /[A-Za-z]/.test(source[i + 1] ?? "")) return i;
  }
  return -1;
}

/**
 * Index of the `>` that closes the opening tag beginning at `start`, skipping
 * `>` characters that sit inside a quoted attribute value or inside a braced
 * JSX expression (`className={cn("a", x > 1 && "b")}`, `stage={<>…</>}`).
 */
function openingTagEnd(source: string, start: number): number {
  let i = start + 1;
  let depth = 0;
  let quote: string | null = null;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0) return i;
    i++;
  }
  return -1;
}

type ScrollContainer = {
  /** `<path relative to src/>#<index within that file>` — the allowlist key. */
  key: string;
  file: string;
  line: number;
  /** The opening tag, as written. */
  tag: string;
  hasKeyboardAffordance: boolean;
};

/**
 * Every horizontal scroll container in one file's source, in document order.
 *
 * Works backwards from the class name to the element that owns it — rather
 * than forwards from every `<` — because a render-prop attribute
 * (`stage={<>…</>}`, which the simulators use constantly) nests a whole JSX
 * subtree inside an opening tag, and a forward scan attributes every class
 * name in that subtree to the outer component. Walking back from the match to
 * the nearest `<Tag` finds the real owner in both shapes.
 */
export function scrollContainersIn(source: string, relPath: string): ScrollContainer[] {
  const clean = stripComments(source);
  const found: ScrollContainer[] = [];
  const seenTagStarts = new Set<number>();

  SCROLL_CLASS.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SCROLL_CLASS.exec(clean))) {
    const start = openingTagStart(clean, match.index);
    // A second scroll class on the same element (`overflow-x-auto
    // overflow-y-hidden`) must not count as a second container.
    if (start === -1 || seenTagStarts.has(start)) continue;
    seenTagStarts.add(start);

    const end = openingTagEnd(clean, start);
    found.push({
      key: `${relPath}#${found.length}`,
      file: relPath,
      line: clean.slice(0, start).split("\n").length,
      tag: end === -1 ? clean.slice(start, match.index + 200) : clean.slice(start, end + 1),
      hasKeyboardAffordance: KEYBOARD_AFFORDANCE.test(
        end === -1 ? clean.slice(start, match.index + 200) : clean.slice(start, end + 1)
      ),
    });
  }
  return found;
}

const ALL_CONTAINERS: ScrollContainer[] = walk(SRC).flatMap((file) =>
  scrollContainersIn(readFileSync(file, "utf8"), path.relative(SRC, file).replace(/\\/g, "/"))
);

function describeFailure(container: ScrollContainer): string {
  return (
    `src/${container.file}:${container.line} is a horizontal scroll container with no keyboard affordance. ` +
    `If its content can overflow at ~256px of column, add tabIndex={0} (plus role="group"/"region" and an ` +
    `aria-label if the region needs a name). If it can never overflow, add its key ` +
    `"${container.key}" to EXCUSED_NO_OVERFLOW with the measurement that proves it.`
  );
}

// ---------------------------------------------------------------------------
// Guard the guard
// ---------------------------------------------------------------------------

describe("the scroll-container scan itself", () => {
  it("finds the scroll containers that exist in this tree", () => {
    // A regex or a walker that silently stops matching would make every other
    // assertion in this file pass while checking nothing. 60 is well under the
    // 89 found at audit and well over anything a broken extractor produces.
    expect(ALL_CONTAINERS.length).toBeGreaterThan(60);
  });

  it("recognizes the keyboard affordance where this codebase already applies it", () => {
    // If the affordance detector breaks, every container reads as "missing",
    // the main test drowns in noise, and the excused lists all look stale.
    // This is the counter-check: a healthy tree has many fixed containers.
    expect(ALL_CONTAINERS.filter((c) => c.hasKeyboardAffordance).length).toBeGreaterThan(20);

    // Two canonical examples named outright, so a break says which detector
    // failed instead of only that a count moved. Deliberately the two most
    // stable ones — the global MDX table wrapper and the BB84 round table;
    // the problems/ math wrappers move between files as that area is
    // refactored and are covered by the count above.
    const canonical = ["mdx-components.tsx", "components/visualizations/BB84RoundTable.tsx"];
    for (const file of canonical) {
      const containers = ALL_CONTAINERS.filter((c) => c.file === file);
      expect(containers.length, `no scroll container found in src/${file}`).toBeGreaterThan(0);
      expect(
        containers.some((c) => c.hasKeyboardAffordance),
        `src/${file} is a canonical fixed example but no container in it was detected as focusable`
      ).toBe(true);
    }
  });

  it("classifies a synthetic container by whether it carries tabIndex", () => {
    const withStop = scrollContainersIn(
      `const A = () => <div role="group" aria-label="x" tabIndex={0} className="overflow-x-auto">{k}</div>;`,
      "fixture.tsx"
    );
    expect(withStop).toHaveLength(1);
    expect(withStop[0].hasKeyboardAffordance).toBe(true);

    const withoutStop = scrollContainersIn(`const B = () => <div className="mt-4 overflow-x-auto p-2">{k}</div>;`, "fixture.tsx");
    expect(withoutStop).toHaveLength(1);
    expect(withoutStop[0].hasKeyboardAffordance).toBe(false);
  });

  it("attributes a class to the element that carries it, not to an enclosing render prop", () => {
    // `stage={<>…</>}` is the shape that defeats a naive forward scan: the
    // inner div's class would be attributed to <Instrument>, and the failure
    // message would name the wrong element and the wrong line.
    const source = `const C = () => <Instrument label="x" stage={<><div className="overflow-x-auto">{k}</div></>} />;`;
    const found = scrollContainersIn(source, "fixture.tsx");
    expect(found).toHaveLength(1);
    expect(found[0].tag.startsWith("<div")).toBe(true);
  });

  it("ignores class names that appear only inside comments", () => {
    // Several components in this tree explain `overflow-x-auto` in prose right
    // above an element that has nothing to do with it.
    const source = `const D = () => (\n  // the overflow-x-auto wrapper takes the overflow\n  <p>{k}</p>\n);`;
    expect(scrollContainersIn(source, "fixture.tsx")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// The invariant
// ---------------------------------------------------------------------------

describe("horizontally scrollable regions", () => {
  it("are reachable by keyboard wherever their content can overflow", () => {
    const unexcused = ALL_CONTAINERS.filter(
      (c) => !c.hasKeyboardAffordance && !(c.key in EXCUSED_NO_OVERFLOW) && !(c.key in BACKLOG_UNTRIAGED)
    );
    expect(unexcused.map(describeFailure)).toEqual([]);
  });

  it("keep the excused set shrinking, never growing", () => {
    const excused = Object.keys(EXCUSED_NO_OVERFLOW).length + Object.keys(BACKLOG_UNTRIAGED).length;
    expect(
      excused,
      `${excused} containers are excused, up from ${EXCUSED_TOTAL_AT_AUDIT} at the audit. ` +
        "A new scroll container gets a tab stop or a fix — it does not get an allowlist entry."
    ).toBeLessThanOrEqual(EXCUSED_TOTAL_AT_AUDIT);
  });

  it("carry no excuse for a container that no longer needs one", () => {
    const live = new Map(ALL_CONTAINERS.map((c) => [c.key, c]));
    const stale: string[] = [];
    for (const key of Object.keys(EXCUSED_NO_OVERFLOW)) {
      const container = live.get(key);
      if (!container) {
        stale.push(`${key} is excused but is no longer a scroll container — delete the entry.`);
      } else if (container.hasKeyboardAffordance) {
        stale.push(
          `${key} is excused as unable to overflow, but it has been given tabIndex. ` +
            "Either the measurement in its reason is wrong, or the tab stop is noise — settle it and delete the entry."
        );
      }
    }
    expect(stale).toEqual([]);
  });

  it("carry no backlog entry for a container that no longer exists", () => {
    // Deliberately weaker than the excused check: these live in areas other
    // work touches, and a container that has since been *fixed* should simply
    // be deleted from the backlog rather than failing the suite in the
    // meantime. A container that has vanished entirely still must be cleaned
    // up, so the backlog cannot rot into a list of dead paths.
    const live = new Set(ALL_CONTAINERS.map((c) => c.key));
    const stale = Object.keys(BACKLOG_UNTRIAGED).filter((key) => !live.has(key));
    expect(stale.map((key) => `${key} is on the backlog but is no longer a scroll container — delete the entry.`)).toEqual([]);
  });
});
