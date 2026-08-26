import { describe, expect, it } from "vitest";
import { readGlobalsCss, tokensIn } from "./cssTokens";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * ============================================================
 * Pillar accent contrast — the real number, not the proxy
 * ============================================================
 * `contrast.test.ts` checks every token that is a literal hex. It cannot
 * check the pillar ramp, because that ramp is authored in OKLCH and composed
 * at runtime from two numbers per pillar plus a per-theme lightness. So it
 * settles for asserting the *lightness* the ramp aims at, which is a proxy.
 *
 * That proxy is not good enough for `--pillar-accent`. It is `--pillar-text`
 * — the color of every prose link inside a pillar-scoped lesson, every
 * eyebrow, every breadcrumb's current segment, every focus ring. It is read
 * as body-size text across the whole site, in six hues, against two different
 * grounds. A perceptual lightness of 0.52 does not by itself guarantee 4.5:1,
 * and whether it does depends on the hue.
 *
 * So this converts OKLCH to sRGB properly and computes the actual WCAG ratio,
 * for all six pillars in both themes, plus Apex's darker ground.
 */

const AA_NORMAL = 4.5;
const GLOBALS_CSS = readGlobalsCss();

/** OKLab -> linear sRGB, per the OKLab specification. */
function oklchToLinearSrgb(l: number, c: number, hDegrees: number): [number, number, number] {
  const h = (hDegrees * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;

  return [
    +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

/** WCAG relative luminance from linear-light sRGB, clamped into gamut. */
function luminanceFromLinear([r, g, b]: [number, number, number]): number {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(b);
}

function luminanceFromHex(hex: string): number {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : value;
  const channels = [0, 2, 4].map((i) => {
    const raw = parseInt(full.slice(i, i + 2), 16) / 255;
    return raw <= 0.04045 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a: number, b: number): number {
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

const dark = tokensIn(GLOBALS_CSS, ":root {");
const light = tokensIn(GLOBALS_CSS, ':root[data-theme="light"] {');
const apex = tokensIn(GLOBALS_CSS, '[data-pillar="apex"] {');

const THEMES = [
  { label: "dark", tokens: dark, background: dark["--background"] },
  { label: "light", tokens: light, background: light["--background"] },
] as const;

describe("pillar accent contrast (OKLCH resolved to sRGB)", () => {
  it.each(THEMES.map((t) => [t.label, t] as const))(
    "every pillar accent reads as text in the %s theme",
    (label, theme) => {
      const lightness = Number(theme.tokens["--pillar-l-accent"]);
      expect(Number.isFinite(lightness), `${label}: --pillar-l-accent missing`).toBe(true);
      const groundLuminance = luminanceFromHex(theme.background);

      const failures: string[] = [];
      for (const pillar of PILLAR_ORDER) {
        const { hue, chroma } = PILLAR_VISUALS[pillar];
        const accent = luminanceFromLinear(oklchToLinearSrgb(lightness, chroma, hue));
        const contrast = ratio(accent, groundLuminance);
        if (contrast < AA_NORMAL) {
          failures.push(`${pillar} (hue ${hue}) is ${contrast.toFixed(2)}:1`);
        }
      }

      expect(failures, `--pillar-text must pass AA as body-size text in ${label}`).toEqual([]);
    },
  );

  it("every pillar accent still reads on Apex's darker ground", () => {
    // Apex overrides the surface ladder darker but not `--pillar-l-accent`.
    // A darker ground only helps a light accent, but this asserts it rather
    // than assuming it — and it is the ground the densest text sits on.
    const lightness = Number(dark["--pillar-l-accent"]);
    const ground = luminanceFromHex(apex["--depth-0"]);

    for (const pillar of PILLAR_ORDER) {
      const { hue, chroma } = PILLAR_VISUALS[pillar];
      const accent = luminanceFromLinear(oklchToLinearSrgb(lightness, chroma, hue));
      expect(ratio(accent, ground), `${pillar} on Apex ground`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  it("converts a known OKLCH value correctly (guards the guard)", () => {
    // oklch(1 0 0) is white; oklch(0 0 0) is black. If the conversion were
    // wrong, every assertion above could pass or fail for the wrong reason.
    expect(luminanceFromLinear(oklchToLinearSrgb(1, 0, 0))).toBeCloseTo(1, 2);
    expect(luminanceFromLinear(oklchToLinearSrgb(0, 0, 0))).toBeCloseTo(0, 2);
    // And a mid grey should land near the sRGB mid-luminance for L=0.5.
    const mid = luminanceFromLinear(oklchToLinearSrgb(0.5, 0, 0));
    expect(mid).toBeGreaterThan(0.1);
    expect(mid).toBeLessThan(0.35);
  });
});
