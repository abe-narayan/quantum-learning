import { ImageResponse } from "next/og";

// iOS home-screen bookmark icon. Reproduces the navbar's "Q" mark at the
// standard 180x180 apple-touch-icon size, recolored to the site's DARK
// identity (docs/DESIGN_SYSTEM.md §2) rather than a flat brand-color fill:
// a deep-space ground (--depth-1, #0a0e17) with a brand-indigo (--brand,
// #818cf8) ring and glyph, since iOS doesn't apply prefers-color-scheme to
// touch icons and the dark palette is this site's default, not a mode.
// Literal hex, not CSS variables — Satori (the ImageResponse renderer)
// can't read custom properties.

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
          background: "#0a0e17",
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
