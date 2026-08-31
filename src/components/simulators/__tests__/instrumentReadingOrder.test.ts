/* A raw `createElement` harness rather than JSX: vitest's `include` here is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. Same harness as
   `src/components/ui/__tests__/ariaPassthrough.test.ts`. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";

/**
 * ============================================================
 * The order a reader meets an instrument in
 * ============================================================
 * Measured on `/simulators` at 375x812, against the tree these tests were
 * written for: **nine of the thirteen instruments had no control at all in
 * the first screen**, and the first control on several sat 1500-2200px below
 * the top of their own mount. Two causes, both of them ordering rather than
 * anything about the controls themselves:
 *
 *   1. When `SimulatorInstrument`'s split layout collapses (which it does at
 *      every phone width), the controls rail lands after the *whole* stage,
 *      and every stage on this bench ended with several hundred pixels of
 *      trailing narrative: a `<Predict>` quiz, a `<SimulatorFraming>` essay,
 *      a KaTeX slab. `stageAfter` exists to move that narrative after the
 *      rail. See `SimulatorInstrument.tsx`.
 *
 *   2. The rail itself opened with a right-aligned "Copy link" button, so on
 *      nine instruments the first control a phone reader could reach, having
 *      scrolled past the picture, was the share button.
 *
 * Neither is visible from a component's own source, and neither is a physics
 * claim, so `simulatorClaims.test.ts` and `instrumentPhysics.test.ts` cannot
 * see them. These are the two mechanical halves that can be pinned: the
 * shell's ordering contract, and the per-instrument call sites that depend
 * on it.
 */

const SIM_DIR = path.resolve(__dirname, "..");

function source(relative: string): string {
  return readFileSync(path.join(SIM_DIR, relative), "utf8");
}

describe("SimulatorInstrument: slot ordering", () => {
  const render = (props: Parameters<typeof SimulatorInstrument>[0]) =>
    renderToStaticMarkup(createElement(SimulatorInstrument, props));

  it("puts stageAfter after the controls in DOM order, not after the stage", () => {
    const html = render({
      label: "test",
      stage: "STAGE_MARKER",
      controls: "CONTROLS_MARKER",
      stageAfter: "AFTER_MARKER",
    });

    const stage = html.indexOf("STAGE_MARKER");
    const controls = html.indexOf("CONTROLS_MARKER");
    const after = html.indexOf("AFTER_MARKER");

    expect(stage).toBeGreaterThan(-1);
    expect(controls).toBeGreaterThan(stage);
    // The whole point. DOM order is also the order a phone scrolls and the
    // order a screen reader walks, so this single assertion is what moves
    // every instrument's controls above its trailing narrative.
    expect(after).toBeGreaterThan(controls);
  });

  it("spans the rail across both stage rows, and pins row 1 to its content, only when there is a stageAfter to place", () => {
    const withAfter = render({
      label: "test",
      stage: "s",
      controls: "c",
      stageAfter: "a",
    });
    expect(withAfter).toContain("row-span-2");
    // `auto 1fr` rather than the implicit `auto auto`: grid hands a spanning
    // item's surplus height to the rows it spans, which opened a ~350px hole
    // between the stage and the block under it on every instrument whose rail
    // is taller than its stage (most of them).
    expect(withAfter).toContain("grid-rows-[auto_1fr]");

    // No second row to span, so neither may be emitted: an unconditional
    // `row-span-2` opens an empty grid row.
    const withoutAfter = render({ label: "test", stage: "s", controls: "c" });
    expect(withoutAfter).not.toContain("row-span-2");
    expect(withoutAfter).not.toContain("grid-rows-[auto_1fr]");

    // The stacked layout has one column and needs neither.
    const stacked = render({
      label: "test",
      stage: "s",
      controls: "c",
      stageAfter: "a",
      layout: "stacked",
    });
    expect(stacked).not.toContain("row-span-2");
    expect(stacked).not.toContain("grid-rows-[auto_1fr]");
  });

  it("renders stageAfter with the stage's own spacing unless told otherwise", () => {
    const inherited = render({
      label: "test",
      stage: "s",
      controls: "c",
      stageAfter: "AFTER_MARKER",
      stageClassName: "space-y-6",
    });
    expect(inherited).toMatch(/class="[^"]*space-y-6[^"]*"[^>]*>AFTER_MARKER/);

    const overridden = render({
      label: "test",
      stage: "s",
      controls: "c",
      stageAfter: "AFTER_MARKER",
      stageClassName: "@container",
      stageAfterClassName: "space-y-8",
    });
    expect(overridden).toMatch(/class="[^"]*space-y-8[^"]*"[^>]*>AFTER_MARKER/);
  });
});

/**
 * Every instrument on the bench that has both a controls rail and a trailing
 * `<SimulatorFraming>`, and has been moved onto `stageAfter`.
 *
 * `wavefunction-explorer` is the one absentee, and its absence is a gap
 * rather than an exemption: it has the same rail, the same framing block and
 * the same share button, and it measured the same way. It was being reworked
 * in parallel by another owner when this list was written, so converting it
 * would have collided. Adding it here is the whole of the remaining work; the
 * assertions below are what it has to satisfy.
 */
const INSTRUMENTS_WITH_RAILS = [
  "bloch-sphere/BlochSphereExplorer.tsx",
  "chsh-bell-test/CHSHBellTestExplorer.tsx",
  "circuit-builder/CircuitBuilder.tsx",
  "density-matrix-explorer/DensityMatrixExplorer.tsx",
  "grover-explorer/GroverExplorer.tsx",
  "noise-explorer/NoiseExplorer.tsx",
  "period-finding-explorer/PeriodFindingExplorer.tsx",
  "qaoa-explorer/QAOAExplorer.tsx",
  "rabi-explorer/RabiExplorer.tsx",
  "syndrome-explorer/SyndromeExplorer.tsx",
  "two-qubit-explorer/TwoQubitExplorer.tsx",
];

describe("every railed instrument puts its trailing narrative after its controls", () => {
  it.each(INSTRUMENTS_WITH_RAILS)("%s", (relative) => {
    const text = source(relative);

    expect(text, "passes a controls rail").toContain("controls={");
    expect(text, "closes its stage with a stageAfter slot").toContain("stageAfter={");

    // The framing block is the longest piece of trailing narrative on every
    // one of these, so it is the one that decides where the rail lands when
    // the split collapses. It must be inside `stageAfter`, i.e. after it in
    // source, and `stageAfter` must itself come after `stage`.
    const stage = text.indexOf("stage={");
    const stageAfter = text.indexOf("stageAfter={");
    const framing = text.indexOf("<SimulatorFraming");

    expect(stage).toBeGreaterThan(-1);
    expect(stageAfter).toBeGreaterThan(stage);
    expect(framing).toBeGreaterThan(stageAfter);
  });
});

/**
 * The share button, and the control it must never precede.
 *
 * `compare-states` and `complex-amplitude-explorer` hand-roll their controls
 * inside the stage rather than passing a rail, so there is no `*Controls`
 * component to name; their invariant is that the share button comes after
 * the sliders the reader is actually meant to drive.
 */
const COPY_LINK_MUST_FOLLOW: Record<string, string> = {
  "bloch-sphere/BlochSphereExplorer.tsx": "<BlochSphereControls",
  "compare-states/CompareStatesExplorer.tsx": "<SimulatorSlider",
  "complex-amplitude-explorer/ComplexAmplitudeExplorer.tsx": "<AmplitudeControls",
  "density-matrix-explorer/DensityMatrixExplorer.tsx": "<DensityMatrixControls",
  "grover-explorer/GroverExplorer.tsx": "<GroverControls",
  "noise-explorer/NoiseExplorer.tsx": "<NoiseControls",
  "rabi-explorer/RabiExplorer.tsx": "<RabiControls",
  "syndrome-explorer/SyndromeExplorer.tsx": "<ControlSection",
};

describe("the share button is never the first control a reader can reach", () => {
  it.each(Object.entries(COPY_LINK_MUST_FOLLOW))("%s", (relative, primaryControl) => {
    const text = source(relative);
    const copyLink = text.indexOf('"Copy link"');
    const primary = text.indexOf(primaryControl);

    expect(copyLink, "has a Copy link button").toBeGreaterThan(-1);
    expect(primary, `renders ${primaryControl}`).toBeGreaterThan(-1);
    expect(copyLink).toBeGreaterThan(primary);
  });

  it("covers every converted instrument that has a Copy link button", () => {
    // A new share button added to an instrument not in the table above would
    // otherwise be unguarded, and this rule is exactly the kind that gets
    // re-broken by a copy-paste from a neighbouring file.
    const withCopyLink = [...INSTRUMENTS_WITH_RAILS, ...Object.keys(COPY_LINK_MUST_FOLLOW)]
      .filter((relative, i, all) => all.indexOf(relative) === i)
      .filter((relative) => source(relative).includes('"Copy link"'));

    for (const relative of withCopyLink) {
      expect(COPY_LINK_MUST_FOLLOW, `${relative} needs an entry in COPY_LINK_MUST_FOLLOW`).toHaveProperty(
        relative
      );
    }
  });
});

/**
 * ============================================================
 * Range inputs
 * ============================================================
 * `SimulatorSlider` (shared/controls.tsx) is the only range input the
 * simulators may use: it carries the 44px touch target, the label/value
 * pairing, `aria-valuetext` and the `aria-describedby` that makes a disabled
 * slider explain why it is disabled. Nothing enforced that, and a slider
 * hand-rolled next to an existing one is the obvious way to lose all four at
 * once.
 *
 * `visualizations/` is held to the substance of the rule rather than to the
 * component, because those are lesson figures rather than instrument
 * controls: several predate `SimulatorSlider` and are tinted `accent-brand`
 * rather than `accent-pillar` on purpose. What they may not do is ship a
 * 16px-tall unnamed track.
 */
function tsxFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...tsxFilesUnder(full));
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

/** Every `<input …>` element in a source file, as its own raw text. */
function inputElements(text: string): string[] {
  return [...text.matchAll(/<input\b[\s\S]*?\/>/g)].map((m) => m[0]);
}

describe("range inputs", () => {
  it("appear in the simulators only inside SimulatorSlider", () => {
    const offenders = tsxFilesUnder(SIM_DIR)
      .filter((file) => !file.endsWith(path.join("shared", "controls.tsx")))
      .filter((file) => inputElements(readFileSync(file, "utf8")).some((el) => el.includes('type="range"')))
      .map((file) => path.relative(SIM_DIR, file));

    expect(offenders, "use SimulatorSlider from ../shared instead").toEqual([]);
  });

  it("carry a 44px target and an accessible name wherever a visualization hand-rolls one", () => {
    const visualizations = path.resolve(SIM_DIR, "..", "visualizations");
    const offenders: string[] = [];

    for (const file of tsxFilesUnder(visualizations)) {
      const text = readFileSync(file, "utf8");
      for (const element of inputElements(text)) {
        if (!element.includes('type="range"')) continue;
        // A `<label htmlFor>` counts, and is how `SimulatorSlider` itself
        // names its input; `LinewidthDiagram` uses exactly that form.
        const id = element.match(/\bid=\{([^}]+)\}/)?.[1];
        const named =
          element.includes("aria-label") ||
          element.includes("aria-labelledby") ||
          (id !== undefined && text.includes(`htmlFor={${id}}`));
        // `h-11` is 44px, and a range input centres its track inside whatever
        // height it is given, so this is the whole touch target.
        if (!element.includes("h-11") || !named) {
          offenders.push(`${path.relative(visualizations, file)} (h-11: ${element.includes("h-11")}, named: ${named})`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
