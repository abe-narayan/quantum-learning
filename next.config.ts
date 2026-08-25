import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Security headers for this pure-SSG site (no `output: 'export'` — this repo
// has no next.config `output` override, so `next build`/`next start` run the
// default Node server that serves the prerendered pages, meaning
// `headers()` below is honored at request time; see
// node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md).
//
// CSP notes (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md):
// - Nonce-based script-src is NOT used here. Next.js only injects a nonce
//   into a page when the CSP header's nonce is read via a dynamically
//   rendered request (the docs' Proxy-based flow), which requires opting
//   every page out of static rendering. That would defeat the point of this
//   being a pure-SSG app (no backend/DB/proxy), so `'unsafe-inline'` is used
//   for `script-src` instead — this is the docs' own documented fallback
//   for apps "that do not require nonces" (see "Without Nonces" section).
// - `'unsafe-inline'` for `script-src` is required in practice, not just a
//   default: this app ships one static inline script (the no-flash
//   light/dark theme script in src/app/layout.tsx), and — independent of
//   that — every App Router page (static or not) embeds its RSC/"flight"
//   payload in inline `<script>` tags (`self.__next_f.push(...)`) that
//   React needs for hydration; these differ per page/build so they can't be
//   allow-listed by a fixed hash. The inline `application/ld+json`
//   structured-data scripts do NOT need `script-src` permission — browsers
//   only apply `script-src` to elements with an executable script type, and
//   `application/ld+json` isn't one.
// - `'unsafe-inline'` for `style-src` is required too: several simulator
//   components (Bloch sphere canvas, matrix/bar-chart visualizations, etc.)
//   set React `style={{...}}` inline styles to position/size elements from
//   live numeric state, which the CSP style-src directive also governs.
// - `'unsafe-eval'` is added for `script-src` only in development, per the
//   docs ("React uses eval ... to reconstruct server-side error stacks in
//   the browser"; not needed in production).
// - No external origins are allow-listed: fonts are self-hosted via
//   `next/font/google` (downloaded at build time, served from this origin —
//   no fonts.googleapis.com/fonts.gstatic.com requests), KaTeX's CSS/fonts
//   ship from the `katex` npm package via globals.css (no CDN), and the only
//   runtime `fetch()` in the app (src/lib/search/fetchIndex.ts) requests the
//   same-origin `/search-index.json`. There is no analytics/GTM script and
//   no <iframe>/<form> usage anywhere in src/.
const isDev = process.env.NODE_ENV === "development";
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Superseded by CSP's frame-ancestors below, but kept for older
          // browsers that don't support frame-ancestors.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Plugins are passed as strings (rather than imported) so they can be
    // used with Turbopack, which can't serialize JS functions.
    remarkPlugins: ["remark-gfm", "remark-math"],
    // rehype-slug adds a stable `id` (github-slugger) to every heading node
    // it visits, which the ToC/reading-progress work needs to `<a href="#...">`
    // + `IntersectionObserver` into. It only mutates heading nodes' hast
    // properties, so it doesn't need to run before or after rehype-katex —
    // katex output lives inside heading *children*, not on the heading
    // element itself, so the two plugins don't touch the same properties.
    rehypePlugins: ["rehype-slug", ["rehype-katex", { strict: false }]],
  },
});

export default withMDX(nextConfig);
