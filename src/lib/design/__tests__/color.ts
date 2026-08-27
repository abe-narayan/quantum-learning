/**
 * Colour maths shared by the design-token contrast suites.
 *
 * `contrast.test.ts` checks literal hex tokens; `pillarContrast.test.ts`
 * checks the OKLCH pillar ramp. Both answer "is this token legible on a flat,
 * opaque ground?" — which is the easy half. The half neither could answer,
 * and which `docs/A11Y_AUDIT.md` explicitly listed under "What I could not
 * check", is the *composited* case: text sitting over the fixed atmosphere
 * layer, or over a translucent pillar wash, or both at once, where the ground
 * a reader actually sees is several alpha blends deep and is never any single
 * token's value.
 *
 * The audit's stated reason for skipping it was correct — "a wrong
 * hand-computed number is worse than an honest 'not checked'". So this
 * computes it rather than estimating it: real OKLab→sRGB, real source-over
 * compositing, real WCAG luminance, driven from the real stylesheet.
 */

export type Rgb = [number, number, number];
/** Straight (non-premultiplied) RGBA, channels 0–1. */
export type Rgba = [number, number, number, number];

/** OKLCH → linear-light sRGB, per the OKLab specification. */
export function oklchToLinearSrgb(l: number, c: number, hDegrees: number): Rgb {
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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Linear-light sRGB → gamma-encoded sRGB, clamped into gamut. */
export function linearToGamma([r, g, b]: Rgb): Rgb {
  const encode = (v: number) => {
    const c = clamp01(v);
    return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  return [encode(r), encode(g), encode(b)];
}

/** Gamma-encoded sRGB → linear-light sRGB. */
export function gammaToLinear([r, g, b]: Rgb): Rgb {
  const decode = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return [decode(r), decode(g), decode(b)];
}

/** `#rgb` / `#rrggbb` → gamma-encoded sRGB, channels 0–1. */
export function hexToRgb(hex: string): Rgb {
  const value = hex.trim().replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as Rgb;
}

/**
 * Source-over compositing of a translucent colour onto an opaque ground.
 *
 * Done in **gamma-encoded** sRGB rather than linear light, deliberately and
 * against the usual "always blend in linear" advice: this has to predict what
 * a browser actually paints, and browsers composite `background-color` /
 * `background-image` alpha in the sRGB colour space by default. Blending in
 * linear light here would produce prettier numbers that do not match the
 * pixels a reader sees, which defeats the point of the test.
 */
export function srcOver(fg: Rgba, bg: Rgb): Rgb {
  const a = clamp01(fg[3]);
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
}

/** Composites a stack of translucent layers, listed **topmost first** (CSS
 *  `background-image` order), down onto an opaque ground. */
export function flatten(layers: Rgba[], ground: Rgb): Rgb {
  let out = ground;
  for (let i = layers.length - 1; i >= 0; i -= 1) out = srcOver(layers[i], out);
  return out;
}

/** Multiplies a layer stack's alpha by a group opacity, the way an
 *  `opacity`-carrying element composites as a unit. */
export function withGroupOpacity(layers: Rgba[], opacity: number): Rgba[] {
  const o = clamp01(opacity);
  return layers.map(([r, g, b, a]) => [r, g, b, a * o] as Rgba);
}

/** WCAG 2.x relative luminance from gamma-encoded sRGB. */
export function luminance(rgb: Rgb): number {
  const [r, g, b] = gammaToLinear(rgb);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two opaque colours. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** `oklch(L C H / A)` as authored in globals.css → gamma-encoded sRGB + alpha. */
export function oklchToRgba(l: number, c: number, h: number, alpha = 1): Rgba {
  const [r, g, b] = linearToGamma(oklchToLinearSrgb(l, c, h));
  return [r, g, b, alpha];
}

/** `color-mix(in srgb, <colour> P%, transparent)` — the only `color-mix` form
 *  this stylesheet uses, and equivalent to scaling alpha by P. */
export function mixWithTransparent(rgb: Rgb, percent: number): Rgba {
  return [rgb[0], rgb[1], rgb[2], clamp01(percent / 100)];
}

/** Parses a bare number out of a token value (`--atmosphere-strength: 1.35`). */
export function numberToken(tokens: Record<string, string>, name: string): number {
  const raw = tokens[name];
  if (raw === undefined) throw new Error(`token not found: ${name}`);
  const parsed = Number.parseFloat(raw);
  if (Number.isNaN(parsed)) throw new Error(`token ${name} is not a number: ${raw}`);
  return parsed;
}
