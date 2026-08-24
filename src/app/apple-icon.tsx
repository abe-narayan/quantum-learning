import { ImageResponse } from "next/og";

// iOS home-screen bookmark icon. Reproduces the navbar's "Q" logo mark
// (src/components/layout/Navbar.tsx) at the standard 180x180 apple-touch-icon
// size — a filled circle in --brand (#4f46e5) with a white "Q". Static
// light-theme brand color, since iOS doesn't apply prefers-color-scheme to
// touch icons.

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
          background: "#4f46e5",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 104,
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
