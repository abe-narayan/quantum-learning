import type { MetadataRoute } from "next";

// Only favicon.ico exists in src/app/ today — no larger PNG/SVG icon assets
// have been generated for this repo, so `icons` only lists what actually
// exists. Add 192x192/512x512 PNGs (and reference them here) if/when real
// brand icon assets are produced.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QuantumLearn — Learn Quantum Mechanics & Quantum Computing",
    short_name: "QuantumLearn",
    description:
      "An interactive platform for learning quantum mechanics and quantum computing — lessons, simulators, and problem sets for advanced high-school and early-college students.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
