import type { MetadataRoute } from "next";

// Only favicon.ico exists in src/app/ today — no larger PNG/SVG icon assets
// have been generated for this repo, so `icons` only lists what actually
// exists. Add 192x192/512x512 PNGs (and reference them here) if/when real
// brand icon assets are produced.
//
// `background_color` (the splash-screen ground while a standalone/PWA
// launch is loading) and `theme_color` (the OS chrome around the page) are
// literal hex, matching src/app/globals.css's DARK theme tokens — the
// site's default identity, not a mode: --depth-0 (#05070c) and --brand
// (#818cf8) respectively. Previously these were the *light*-theme values,
// which briefly flashed a white/indigo splash screen on a site that now
// opens dark by default.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QuantumLearn — Learn Quantum Mechanics & Quantum Computing",
    short_name: "QuantumLearn",
    description:
      "An interactive platform for learning quantum mechanics and quantum computing — lessons, simulators, and problem sets for advanced high-school and early-college students.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070c",
    theme_color: "#818cf8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
