import { ImageResponse } from "next/og";

// iOS home-screen bookmark icon. Reproduces the navbar's "Q" mark at the
// standard 180x180 apple-touch-icon size, recolored to the site's DARK
// identity (docs/DESIGN_SYSTEM.md §2) rather than a flat brand-color fill:
// the page ground (--depth-0, #05070c) with a brand-indigo (--brand,
// #818cf8) ring and an --foreground (#e6ebf4) glyph, since iOS doesn't apply
// prefers-color-scheme to touch icons and the dark palette is this site's
// default, not a mode.
//
// The ground was #0a0e17, which is not any token in globals.css: --depth-0 is
// #05070c and --depth-1 is #0c111b, so the icon was a shade nobody chose and
// nothing could keep in step. --depth-0 is the right rung of the three
// anyway: it is what manifest.ts sets as `background_color` for the
// standalone splash screen and what opengraph-image.tsx uses as its ground,
// so the three surfaces that represent the site outside the browser now open
// on one colour.
//
// Literal hex, not CSS variables — Satori (the ImageResponse renderer) can't
// read custom properties. This is one of exactly three files where a literal
// is correct rather than a violation of "tokens only": here,
// src/app/opengraph-image.tsx and src/app/manifest.ts. All three render
// outside any CSS cascade. Because these are resolved copies rather than
// references, a change to --depth-0, --brand or --foreground has to be
// mirrored here by hand.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 148,
            height: 148,
            borderRadius: "50%",
            border: "3px solid #818cf8",
            color: "#e6ebf4",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          Q
        </div>
      </div>
    ),
    { ...size }
  );
}
