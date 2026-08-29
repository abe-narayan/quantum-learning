import { describe, expect, it } from "vitest";
import { readGlobalsCss, tokensIn } from "./cssTokens";

/**
 * WCAG contrast guard for the color tokens in src/app/globals.css.
 *
 * The palette was retuned wholesale when the site went dark-first, and every
 * one of these values is used as *text* somewhere — `--muted-foreground` on
 * lesson metadata, `--subtle-foreground` on units and captions, `--success` /
 * `--warning` / `--danger` on problem feedback. A color that looks fine to
 * the eye on a big monitor can sit at 3.9:1, and nothing in the build would
 * ever say so.
 *
 * This parses the real stylesheet rather than restating the values, so it
 * fails when someone retunes a token, not when someone forgets to update a
 * fixture. Only literal hex values are checked: the pillar ramp is authored
 * in OKLCH and derived at runtime, and is covered by the lightness floors
 * asserted at the end instead.
 */

const GLOBALS_CSS = readGlobalsCss();

/** AA for normal-size text. */
const AA_NORMAL = 4.5;

/**
 * WCAG 2.1 SC 1.4.11 "Non-text Contrast" — the floor for a graphical object a
 * reader has to perceive in order to understand the content. An axis line, a
 * tick, or a threshold rule in a figure is exactly that: if you cannot see it,
 * you cannot read the chart, and no amount of surrounding prose substitutes.
 */
const NON_TEXT_GRAPHICAL = 3;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** WCAG 2.x relative luminance. */
function luminance(hex: string): number {
  const channels = hexToRgb(hex).map((raw) => {
    const c = raw / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** The text-bearing tokens, and the minimum ratio each must clear against
 *  the page ground it is used on. */
const TEXT_TOKENS: Array<[token: string, minimum: number, note: string]> = [
  ["--foreground", AA_NORMAL, "body text"],
  ["--muted-foreground", AA_NORMAL, "secondary text (lesson metadata, descriptions)"],
  ["--subtle-foreground", AA_NORMAL, "tertiary text (units, captions, axis labels)"],
  ["--success", AA_NORMAL, "correct-answer feedback text"],
  ["--warning", AA_NORMAL, "warning callout text"],
  ["--danger", AA_NORMAL, "incorrect-answer feedback text"],
  ["--brand", AA_NORMAL, "links and primary accents"],
  ["--accent", AA_NORMAL, "secondary accents"],
  // Not text, but must still be perceivable as a boundary.
  ["--border-strong", 1.4, "emphasised borders"],
];

/** The three neutral text voices. Unlike the accent colors, these carry
 *  running prose, so they have to hold up on every panel body text sits on,
 *  not just on the page ground. */
const NEUTRAL_TEXT: Array<[token: string, note: string]> = [
  ["--foreground", "body text"],
  ["--muted-foreground", "secondary text (lesson metadata, descriptions)"],
  ["--subtle-foreground", "tertiary text (units, captions, axis labels)"],
];

/** The surface ladder is authored as aliases (`--surface: var(--depth-1)`),
 *  so a token has to be followed one hop to reach a literal color. */
function resolve(tokens: Record<string, string>, token: string): string {
  const value = tokens[token];
  const alias = value?.match(/^var\((--[\w-]+)\)$/);
  return alias ? tokens[alias[1]] : value;
}

const THEMES: Array<[label: string, selector: string]> = [
  // `:root` *is* the dark theme now — see the dark-first note in globals.css.
  ["dark (default)", ":root {"],
  ["light (explicit)", ':root[data-theme="light"] {'],
  // The "follow my OS" light block inside `@media (prefers-color-scheme:
  // light)`. globals.css documents it as a verbatim duplicate of the explicit
  // block, but only this suite makes that true: a value retuned in one block
  // and not the other (exactly what happened to --pillar-l-accent) passes
  // every check that reads a single selector.
  ["light (system)", ':root[data-theme="system"] {'],
];

describe.each(THEMES)("palette contrast — %s", (label, selector) => {
  const tokens = tokensIn(GLOBALS_CSS, selector);
  const background = tokens["--background"];

  it("defines a literal background", () => {
    expect(background, `${label} has no resolvable --background`).toMatch(/^#[0-9a-f]{3,8}$/i);
  });

  it.each(TEXT_TOKENS)("%s clears its minimum (%s)", (token, minimum) => {
    const value = tokens[token];
    expect(value, `${label}: ${token} is not declared`).toBeDefined();
    expect(contrast(value, background)).toBeGreaterThanOrEqual(minimum);
  });
});

describe.each(THEMES)("text on the panels it sits on — %s", (label, selector) => {
  // Checking text against `--background` alone is not enough: almost nothing
  // on this site sits directly on the page ground. Lesson metadata, captions,
  // and axis labels sit on `.panel` and its muted variant, which are one and
  // two steps *up* the depth ladder — a lighter ground in dark mode, so the
  // ratio is always worse there than the `--background` check reports.
  const tokens = tokensIn(GLOBALS_CSS, selector);

  it.each(NEUTRAL_TEXT)("%s clears AA on --surface and --surface-muted", (token) => {
    for (const surface of ["--surface", "--surface-muted"] as const) {
      const ground = resolve(tokens, surface);
      expect(ground, `${label}: ${surface} does not resolve to a literal`).toMatch(/^#[0-9a-f]{3,8}$/i);
      expect(
        contrast(tokens[token], ground),
        `${label}: ${token} on ${surface}`,
      ).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  it("clears AA for body text on --surface-raised", () => {
    // Only `--foreground` is asserted here. `--surface-raised` has exactly two
    // usages (the incorrect state in `Feedback.tsx` and the hover state in
    // `PracticeLinks.tsx`), and both put `--foreground` on it. Demanding the
    // dimmer voices clear it too would force darkening colors for a pairing
    // that does not exist on the site.
    const ground = resolve(tokens, "--surface-raised");
    expect(contrast(tokens["--foreground"], ground)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("keeps the two secondary text voices distinguishable", () => {
    // `--muted-foreground` and `--subtle-foreground` encode a real hierarchy
    // (description vs. caption). If a contrast fix pushes one onto the other
    // they still pass AA individually while the hierarchy silently collapses.
    const ratio = contrast(tokens["--muted-foreground"], tokens["--subtle-foreground"]);
    expect(ratio, `${label}: the two secondary voices have converged`).toBeGreaterThan(1.15);
  });
});

describe.each(THEMES)("figure axis channel — %s", (label, selector) => {
  // Before `--axis` existed, every graph on the site drew its axes, ticks and
  // threshold rules with `--border` — the *panel-edge* token, which measures
  // 1.41:1 on `--surface-muted` in dark. A frame around a card can afford to
  // be that quiet; the axis a reader is meant to read a value off cannot, and
  // nothing failed when it was. `--axis` is the separate channel for marks
  // that are load-bearing, and these are the assertions that keep it one: the
  // day someone "simplifies" it back to `var(--border)`, or retunes it toward
  // the panel edge for visual calm, this suite says so instead of the figure
  // quietly going unreadable.
  //
  // Figures sit on opaque panels, not on the atmosphere layer, so the flat
  // grounds checked here are the grounds a reader actually gets — this does
  // not need the composited model in `compositedContrast.test.ts`.
  const tokens = tokensIn(GLOBALS_CSS, selector);

  /** Every panel depth a figure is drawn on. `--surface-raised` is the worst
   *  case in dark (lightest ground under a light axis) and the mildest in
   *  light, so all three have to be checked in both directions. */
  const PANELS = ["--surface", "--surface-muted", "--surface-raised"] as const;

  it.each(PANELS)("--axis clears the non-text floor on %s", (surface) => {
    const ground = resolve(tokens, surface);
    expect(ground, `${label}: ${surface} does not resolve to a literal`).toMatch(
      /^#[0-9a-f]{3,8}$/i,
    );
    expect(
      contrast(tokens["--axis"], ground),
      `${label}: --axis on ${surface}`,
    ).toBeGreaterThanOrEqual(NON_TEXT_GRAPHICAL);
  });

  it.each(PANELS)("--axis-grid stays quieter than --axis on %s", (surface) => {
    // The two tokens only earn their keep as a *pair*: `--axis-grid` is the
    // optional ruling a reader may use but never has to, and it is below the
    // 3:1 floor on purpose so the data stays the loudest thing in the frame.
    // Swapping the two values would leave both assertions above passing while
    // inverting the whole hierarchy — gridlines shouting over the axis — and
    // would be invisible in review. Asserting the ordering is what catches it.
    const ground = resolve(tokens, surface);
    expect(
      contrast(tokens["--axis-grid"], ground),
      `${label}: --axis-grid has caught up with --axis on ${surface}`,
    ).toBeLessThan(contrast(tokens["--axis"], ground));
  });
});

describe("the two light blocks stay verbatim duplicates", () => {
  // globals.css documents `:root[data-theme="light"]` and the
  // `prefers-color-scheme: light` / `:root[data-theme="system"]` block as
  // identical, but nothing enforces it: a value retuned in one and not the
  // other passes every check that reads a single selector, and a visitor who
  // never touched the theme toggle gets the stale half. That is not
  // hypothetical — `--pillar-l-accent` sat at 0.52 in one block and 0.51 in
  // the other until this test existed. Any token whose drift a reader would
  // *see* rather than debug belongs on this list.
  const light = tokensIn(GLOBALS_CSS, ':root[data-theme="light"] {');
  const systemLight = tokensIn(GLOBALS_CSS, ':root[data-theme="system"] {');

  it.each([
    // The pillar ramp decides link and accent text contrast on paper.
    "--pillar-l-accent",
    "--pillar-l-strong",
    "--pillar-l-dim",
    "--pillar-l-wash",
    "--pillar-wash-alpha",
    "--pillar-edge-alpha",
    "--pillar-glow-alpha",
    "--atmosphere-strength",
    // The chart channel decides whether a figure can be read at all. It is
    // authored as two adjacent lines in each block, which is exactly the
    // shape of edit that gets applied to one copy and forgotten in the other.
    "--axis",
    "--axis-grid",
  ])("%s matches between the explicit and system light blocks", (token) => {
    expect(systemLight[token], token).toBe(light[token]);
  });
});

describe("Apex surface override", () => {
  // Apex drops the whole surface ladder darker and raises foreground
  // contrast. That must make text *more* readable, never less — a darker
  // ground with the same text color is fine, a darker ground with a dimmer
  // text color is a regression.
  const base = tokensIn(GLOBALS_CSS, ":root {");
  const apex = tokensIn(GLOBALS_CSS, '[data-pillar="apex"] {');

  it("keeps body text at least as readable as the default ground", () => {
    const baseRatio = contrast(base["--foreground"], base["--background"]);
    const apexRatio = contrast(apex["--foreground"], apex["--depth-0"]);
    expect(apexRatio).toBeGreaterThanOrEqual(baseRatio);
  });

  it("keeps secondary text at AA on the darker ground", () => {
    // Apex does not override --muted-foreground, so it inherits the default.
    expect(contrast(base["--muted-foreground"], apex["--depth-0"])).toBeGreaterThanOrEqual(
      AA_NORMAL,
    );
    expect(contrast(base["--subtle-foreground"], apex["--depth-0"])).toBeGreaterThanOrEqual(
      AA_NORMAL,
    );
  });

  it("stays the least saturated pillar", () => {
    expect(Number(apex["--pillar-chroma"])).toBeLessThan(0.06);
  });
});

describe("pillar ramp lightness floors", () => {
  // The pillar accent is authored in OKLCH and derived at runtime, so an
  // exact ratio can't be computed here. What can be pinned is the lightness
  // the ramp is aimed at in each theme, which is what keeps a pillar accent
  // readable as text: high on the dark ground, low on paper.
  const dark = tokensIn(GLOBALS_CSS, ":root {");
  const light = tokensIn(GLOBALS_CSS, ':root[data-theme="light"] {');

  it("aims the accent light enough to read on the dark ground", () => {
    expect(Number(dark["--pillar-l-accent"])).toBeGreaterThanOrEqual(0.72);
  });

  it("aims the accent dark enough to read on paper", () => {
    expect(Number(light["--pillar-l-accent"])).toBeLessThanOrEqual(0.56);
  });

  // The system-light/explicit-light ramp values used to be pinned here. They
  // moved to the "two light blocks stay verbatim duplicates" suite above, so
  // that the ramp and the chart channel are guarded by one list rather than
  // two that can disagree about which tokens matter.

  it("keeps decorative washes far below text weight in both themes", () => {
    expect(Number(dark["--pillar-wash-alpha"])).toBeLessThanOrEqual(0.16);
    expect(Number(light["--pillar-wash-alpha"])).toBeLessThanOrEqual(0.16);
  });
});
