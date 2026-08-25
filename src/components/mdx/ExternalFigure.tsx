"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ExternalFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  creditUrl?: string;
  license: string;
  className?: string;
};

/**
 * ⚠️ CSP COUPLING — READ BEFORE POINTING `src` AT A NEW HOST ⚠️
 * next.config.ts sets a Content-Security-Policy `img-src` of `'self' data:
 * blob:` plus an explicit external-host allow-list (currently
 * upload.wikimedia.org and www.nist.gov — see the CSP notes atop
 * next.config.ts). If `src` points at a host that isn't in that directive,
 * the browser silently blocks the request — it never reaches the network
 * tab — and neither `next build` nor `tsc` reports anything wrong. This
 * exact failure once broke every lesson image on the site with zero
 * build/type error.
 *
 * This is NOT just documented and left to be forgotten: `npm test` runs
 * `src/lib/content/__tests__/lessonImages.test.ts`, which parses
 * next.config.ts's real `img-src` directive and fails the build the moment
 * any `<ExternalFigure src="...">` in the lesson corpus points at a host
 * that directive doesn't allow-list. Adding a new host therefore requires
 * updating next.config.ts's `img-src` too, or that test — not just this
 * component — fails loudly in CI.
 */

/**
 * An externally-sourced photo/illustration (NASA, a university lab, IBM/Google
 * Quantum AI, Wikimedia Commons, etc.) — deliberately rendered as a plain
 * `<img>`, not next/image: next/image would require every external host to be
 * listed in next.config.ts's `images.remotePatterns` and can fail the whole
 * static build if a single external URL is unreachable at build time. A plain
 * `<img>` just shows a broken-image icon for that one lesson instead — or it
 * did, until the `onError` fallback below replaced that with a styled
 * "Image unavailable" panel that still shows the credit/source link. That
 * fallback also happens to cover the CSP-block failure mode described above:
 * a browser-blocked image fires the same `error` event as a 404, so even a
 * forgotten CSP update degrades to a labeled fallback instead of a bare
 * broken-image glyph.
 *
 * This is a client component (not a Server Component) purely so the
 * `onError`/`useState` interaction below can exist — see
 * `PredictBeforeReveal.tsx` for the same "use client" pattern applied to an
 * MDX component. It still renders the same markup at build/prerender time;
 * "use client" only changes how it hydrates, not its prop API or output for
 * any of its ~155 existing call sites in lesson content.
 */
export function ExternalFigure({ src, alt, caption, credit, creditUrl, license, className }: ExternalFigureProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={cn("not-prose my-6 overflow-hidden rounded-xl border border-border bg-surface-muted/40", className)}>
      {failed ? (
        // Screen readers get this via role="img" + aria-label rather than a
        // real broken <img>, so the alt text is still announced here, in the
        // same reading position the image itself would have occupied.
        <div
          role="img"
          aria-label={alt}
          className="flex aspect-video w-full flex-col items-center justify-center gap-1 bg-surface-muted p-6 text-center text-sm text-muted-foreground"
        >
          <span className="font-medium text-foreground">Image unavailable</span>
          <span>{alt}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-auto w-full"
        />
      )}
      <figcaption className="space-y-1 border-t border-border p-3 text-xs text-muted-foreground">
        {caption && <p className="text-sm text-foreground">{caption}</p>}
        <p>
          {creditUrl ? (
            <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              {credit}
            </a>
          ) : (
            credit
          )}
          {" · "}
          {license}
        </p>
      </figcaption>
    </figure>
  );
}
