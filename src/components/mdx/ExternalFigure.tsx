"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

type ExternalFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  creditUrl?: string;
  license: string;
  className?: string;
  /**
   * Tailwind aspect-ratio class reserving the figure's space before the
   * image loads — `"aspect-square"`, `"aspect-[4/3]"`, `"aspect-[3/4]"`, and
   * so on. Defaults to `aspect-video` (16:9), which suits most landscape
   * scientific photography.
   *
   * The reservation is not optional (see the render below for why); this prop
   * only lets an author who knows the image's real proportions reserve *those*
   * instead, so a portrait or square figure fills its box rather than
   * letterboxing inside a 16:9 one. Existing call sites omit it and are
   * unaffected.
   */
  aspect?: string;
  /** Optional figure number (e.g. `3`) — renders as a "Fig. 3" tech-label
   *  ahead of the caption. Omit for figures that don't need one; existing
   *  call sites don't pass it and render exactly as before, minus the
   *  numbering. */
  number?: number;
  /** Widens the figure beyond the reading column on large screens (a modest,
   *  bounded negative margin — it never reaches the 2xl table-of-contents
   *  rail, and does nothing below the `sm` breakpoint, so it cannot cause
   *  horizontal overflow on narrow viewports). For a true edge-to-edge
   *  figure, wrap in `<FullBleed>` (`src/components/ui/Section.tsx`) from
   *  the surrounding page instead — that's a layout decision, not this
   *  component's to make on its own. */
  wide?: boolean;
};

/**
 * MDX usage:
 * ```mdx
 * <ExternalFigure
 *   src="https://upload.wikimedia.org/.../stern-gerlach.png"
 *   alt="Schematic of the Stern–Gerlach apparatus"
 *   caption="Silver atoms split into two discrete beams by an inhomogeneous field."
 *   credit="Wikimedia Commons"
 *   creditUrl="https://commons.wikimedia.org/wiki/File:..."
 *   license="CC BY-SA 4.0"
 *   number={2}
 * />
 * ```
 */

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
 *
 * Styling is the scientific-figure voice: a numbered, labelled caption and a
 * credit/license line set in the technical (mono) voice, like a journal
 * plate rather than a blog image.
 */
export function ExternalFigure({
  src,
  alt,
  caption,
  credit,
  creditUrl,
  license,
  className,
  number,
  wide = false,
  aspect,
}: ExternalFigureProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={cn(
        "not-prose my-6 overflow-hidden rounded-panel border border-border bg-surface-muted/40",
        wide && "sm:mx-0 lg:-mx-6 xl:-mx-10",
        className
      )}
    >
      {failed ? (
        // Screen readers get this via role="img" + aria-label rather than a
        // real broken <img>, so the alt text is still announced here, in the
        // same reading position the image itself would have occupied.
        <div
          role="img"
          aria-label={alt}
          // `aspect ?? "aspect-video"`, not a bare `aspect-video`: this box
          // has to occupy exactly the space the loaded image would have. A
          // portrait figure (`aspect-[3/4]`) that fails to load used to
          // reserve 3:4 while loading and then collapse to 16:9 on failure —
          // a layout shift produced by the very component whose stated job is
          // to reserve space and prevent one.
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1 bg-surface-muted p-6 text-center text-sm text-muted-foreground",
            aspect ?? "aspect-video"
          )}
        >
          <span className="font-medium text-foreground">Image unavailable</span>
          <span>{alt}</span>
        </div>
      ) : (
        // The wrapper reserves the figure's space *before* the image arrives.
        // Without it the `<img>` has no intrinsic size until it downloads —
        // no width/height attributes, no aspect-ratio, and (being external)
        // no build-time dimensions to infer — so it occupies zero height and
        // then shoves the rest of the lesson down when it loads. With ~200
        // figures across the corpus, all lazy-loaded and therefore arriving
        // exactly as the reader scrolls to them, that is a jolt on almost
        // every scroll through an illustrated lesson.
        //
        // `object-contain` inside a fixed ratio means the reserved box is
        // always right, whatever the image's real proportions: a portrait
        // figure letterboxes rather than overflowing or re-flowing. Authors
        // who know the true shape can pass `aspect` to reserve it exactly and
        // avoid the letterboxing — see the prop's own comment.
        <div className={cn("w-full overflow-hidden", aspect ?? "aspect-video")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      <figcaption className="space-y-1.5 border-t border-border p-3 sm:p-4">
        {(number != null || caption) && (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {number != null ? <TechLabel className="text-pillar">{`Fig. ${number}`}</TechLabel> : null}
            {caption ? <span className="text-sm text-foreground">{caption}</span> : null}
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-subtle-foreground">
          <TechLabel className="!text-micro text-subtle-foreground">Source</TechLabel>
          <span>
            {creditUrl ? (
              <a
                href={creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-border underline-offset-2 hover:text-foreground"
              >
                {credit}
                {/* `target="_blank"` otherwise moves the reader to a new tab
                    with no warning — the one thing an attribution link owes a
                    screen-reader or keyboard user before they follow it. */}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              credit
            )}
          </span>
          <span aria-hidden="true">·</span>
          <TechLabel className="!text-micro text-subtle-foreground">{license}</TechLabel>
        </p>
      </figcaption>
    </figure>
  );
}
