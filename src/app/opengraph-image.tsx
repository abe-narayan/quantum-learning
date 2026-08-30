import { ImageResponse } from "next/og";
import { PROBLEM_COUNT } from "@/lib/structuredData";

// Site-wide default Open Graph / Twitter image. Next.js picks up any
// route-segment-local opengraph-image (none currently exist) in preference
// to this one; this file is the fallback every page gets automatically.
//
// Colors match the DARK theme's tokens in src/app/globals.css (the site's
// default identity, per docs/DESIGN_SYSTEM.md §2): --depth-0 (#05070c) for
// ground, --depth-2 (#141a26) as the deep end of the vignette, --brand
// (#818cf8) and --accent (#34d8e8) for the mark and rule, --foreground
// (#e6ebf4) for text. Satori (the ImageResponse renderer) can't read CSS
// custom properties, so these are the resolved hex values, not variables —
// the one place in the app literal hex is correct rather than a violation of
// "tokens only."
//
// Nothing checks that copy against its source, and it had already drifted: the
// vignette said #10151f while --depth-2 has been #141a26, so the comment named
// a token it no longer carried. Re-resolve every hex above by hand whenever a
// dark-theme token moves; the names in this comment are the only link back.

// The problem count is `PROBLEM_COUNT`, not a literal, in both places it
// appears on this card. It was 549 here against a corpus of 556, in a file
// nothing renders in a browser and nobody rereads — the worst possible home
// for a hand-kept figure. `PROBLEM_COUNT` counts the generated problem-meta
// array, which carries no problem bodies (see its note in
// src/lib/structuredData.ts), so this costs the OG route nothing.
export const alt = `StudyQuantum: learn quantum mechanics and quantum computing from the ground up. 219 lessons, 14 simulators, ${PROBLEM_COUNT} graded problems.`;
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
          background: "radial-gradient(120% 130% at 12% 0%, #141a26 0%, #05070c 62%)",
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
            StudyQuantum
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
          {/* One interpolated string, not text-number-text: Satori lays out a
              `display: flex` node's children as flex items, so splitting this
              sentence into three children would set it three ways. */}
          {`219 lessons, 14 simulators, and ${PROBLEM_COUNT} graded problems, from your first qubit to research-level fault tolerance.`}
        </div>
      </div>
    ),
    { ...size }
  );
}
