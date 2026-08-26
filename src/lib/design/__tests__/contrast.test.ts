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

const THEMES: Array<[label: string, selector: string]> = [
  // `:root` *is* the dark theme now — see the dark-first note in globals.css.
  ["dark (default)", ":root {"],
  ["light (explicit)", ':root[data-theme="light"] {'],
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

  it("keeps decorative washes far below text weight in both themes", () => {
    expect(Number(dark["--pillar-wash-alpha"])).toBeLessThanOrEqual(0.16);
    expect(Number(light["--pillar-wash-alpha"])).toBeLessThanOrEqual(0.16);
  });
});
