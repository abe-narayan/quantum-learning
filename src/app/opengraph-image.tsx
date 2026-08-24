import { ImageResponse } from "next/og";

// Site-wide default Open Graph / Twitter image. Next.js picks up any
// route-segment-local opengraph-image (none currently exist) in preference
// to this one; this file is the fallback every page gets automatically.
// Colors match the light-theme --brand (#4f46e5) and --accent (#0e7490)
// custom properties in src/app/globals.css.

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
          background: "linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 55%, #0e7490 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#818cf8",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -0.5 }}>
            QuantumLearn
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
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
            marginTop: 32,
            fontSize: 28,
            color: "#c7d2fe",
            maxWidth: 900,
          }}
        >
          Interactive lessons, real simulators, and graded problem sets.
        </div>
      </div>
    ),
    { ...size }
  );
}
