"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

// Catches an error thrown by the root layout itself (e.g. the Navbar), which
// error.tsx can't catch since it doesn't wrap layout.tsx/template.tsx in the
// same segment. This replaces the entire document, so it must bring its own
// <html>/<body> and re-import global styles — it does not inherit anything
// from layout.tsx, including the Geist/Fraunces font variables, so every
// class below sticks to the system font stack rather than `font-display`/
// `font-tech` (which would silently resolve to nothing without those
// variables). Design tokens (--background, --border, --pillar-*, ...) are
// still available: they're set directly on `:root` in globals.css, not
// derived from next/font.
//
// `retry` (not `reset`) is this modified Next.js's stable recovery prop —
// see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // No error-reporting service is wired up in this project; console.error
    // is the honest fallback so the failure isn't silent.
    console.error(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Something went wrong · QuantumLearn</title>
        {/* Same no-flash theme script as the root layout, so an explicit
            theme choice still applies even when the layout itself is what
            crashed. `"system"` has to be in the accepted list alongside
            `"light"`/`"dark"` — it was missing, and it is not a no-op: the
            site is dark-first, so globals.css gates its
            `prefers-color-scheme: light` block on `:root[data-theme="system"]`
            precisely so an *undecided* visitor is not flipped to light by
            their OS. Without the attribute, a reader who explicitly chose
            "follow my system" and is on a light OS is indistinguishable from
            an undecided one and got a dark crash page. Keep this list in sync
            with src/app/layout.tsx and ThemeToggle.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("quantumlearn:theme");if(t==="light"||t==="dark"||t==="system")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()',
          }}
        />
      </head>
      <body
        className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground antialiased"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pillar-text">
            Root-level fault
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            The instrument itself failed
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Something broke below the site&rsquo;s own shell, not just this page — reloading
            usually resolves it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              // Shape hand-rolled rather than imported from Button.tsx (this
              // page must not depend on anything that could be part of what
              // crashed), but it uses the same `--radius-tight` that
              // Button.tsx switched to: a full pill "reads as a soft SaaS
              // chip — the exact generic look the instrument language
              // avoids", and this page is still the site.
              className="inline-flex min-h-11 items-center justify-center rounded-(--radius-tight) bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-(--radius-tight) border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              Back to home
            </Link>
          </div>

          {error.digest ? (
            <p className="mt-8 text-xs text-muted-foreground">
              Error reference:{" "}
              <code style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>
                {error.digest}
              </code>
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
