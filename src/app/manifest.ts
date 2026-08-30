import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/structuredData";

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
//
// `description` is now imported from `SITE_DESCRIPTION` rather than copied and
// kept in step by hand — the copy here had already fallen 7 problems behind the
// real corpus. An installed shortcut and a search result are the same promise
// made in two places; when they disagree, the reader has no way to tell which
// one the site meant. `name` still matches `title.default` in
// src/app/layout.tsx by hand, which is safe because it carries no figure.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyQuantum: Quantum Mechanics and Quantum Computing from Scratch",
    short_name: "StudyQuantum",
    description: SITE_DESCRIPTION,
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
