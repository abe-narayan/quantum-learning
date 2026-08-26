import { ImageResponse } from "next/og";

// Site-wide default Open Graph / Twitter image. Next.js picks up any
// route-segment-local opengraph-image (none currently exist) in preference
// to this one; this file is the fallback every page gets automatically.
//
// Colors match the DARK theme's tokens in src/app/globals.css (the site's
// default identity, per docs/DESIGN_SYSTEM.md §2): --depth-0 (#05070c) for
// ground, --depth-2 (#10151f) as the deep end of the vignette, --brand
// (#818cf8) and --accent (#34d8e8) for the mark and rule, --foreground
// (#e6ebf4) for text. Satori (the ImageResponse renderer) can't read CSS
// custom properties, so these are the resolved hex values, not variables —
// the one place in the app literal hex is correct rather than a violation of
// "tokens only."

export const alt = "QuantumLearn — Learn Quantum Mechanics & Quantum Computing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(120% 130% at 12% 0%, #10151f 0%, #05070c 62%)",
          color: "#e6ebf4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#818cf8",
              color: "#05070c",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: -0.5,
              textTransform: "uppercase",
              color: "#98a2b6",
            }}
          >
            QuantumLearn
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 84,
            height: 3,
            background: "linear-gradient(90deg, #34d8e8, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Learn Quantum Mechanics &amp; Quantum Computing
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#98a2b6",
            maxWidth: 900,
          }}
        >
          Six pillars, real simulators, and graded problem sets — from first principles to
          research-depth work.
        </div>
      </div>
    ),
    { ...size }
  );
}
