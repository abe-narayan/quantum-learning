"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import "./globals.css";

// Catches an error thrown by the root layout itself (e.g. the Navbar), which
// error.tsx can't catch since it doesn't wrap layout.tsx/template.tsx in the
// same segment. This replaces the entire document, so it must bring its own
// <html>/<body> and re-import global styles — it does not inherit anything
// from layout.tsx, including the Geist font variables, so this intentionally
// falls back to the system font stack rather than a missing CSS variable.
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
        {/* Same no-flash theme script as the root layout, so an explicit
            light/dark choice still applies even when the layout itself is
            what crashed. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("quantumlearn:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()',
          }}
        />
      </head>
      <body
        className="flex min-h-screen flex-col bg-background text-foreground antialiased"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        <main className="flex flex-1 items-center">
          <Container className="py-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Something went wrong
            </p>
            <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              QuantumLearn hit an unexpected error
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              An error interrupted the page shell itself, not just its content. Reloading usually
              resolves it.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={() => retry()}>Try again</Button>
              <Button href="/" variant="secondary">
                Back to home
              </Button>
            </div>

            {error.digest ? (
              <p className="mt-8 text-xs text-muted-foreground">
                Error reference: <code className="font-mono">{error.digest}</code>
              </p>
            ) : null}
          </Container>
        </main>
      </body>
    </html>
  );
}
