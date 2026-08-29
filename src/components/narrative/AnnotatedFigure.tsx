"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

export type FigurePin = {
  /** Stable key, unique within this figure. */
  id: string;
  /** Horizontal position, percent of image width (0–100). */
  x: number;
  /** Vertical position, percent of image height (0–100). */
  y: number;
  /** What the pin points out — plain text, shown in the legend and (for
   *  screen readers) inline at the pin itself. */
  label: string;
};

/**
 * MDX usage:
 * ```mdx
 * <AnnotatedFigure
 *   src="https://upload.wikimedia.org/.../dilution-fridge.png"
 *   alt="Cutaway of a dilution refrigerator"
 *   caption="Each stage cools the mixing chamber further toward millikelvin temperatures."
 *   pins={[
 *     { id: "still", x: 30, y: 22, label: "Still — where the ³He/⁴He mixture is distilled." },
 *     { id: "mc", x: 55, y: 78, label: "Mixing chamber — the coldest stage, where the qubits sit." },
 *   ]}
 *   number={3}
 * />
 * ```
 * `x`/`y` are percentages of the image's own box, so pins stay correctly
 * placed at any width. As with `ExternalFigure`, an external `src` must be
 * on next.config.ts's CSP `img-src` allow-list.
 *
 * This is the component to reach for the moment a figure needs a reader to
 * find more than one specific thing in it — a labelled apparatus photo, an
 * instrument cutaway, a schematic with several named stages. If the image
 * only needs one caption describing the whole thing, that's `ExternalFigure`
 * instead; converting *to* `AnnotatedFigure` only pays for itself once
 * you're naming individual features. `number`/`wide` intentionally mirror
 * `ExternalFigure`'s props of the same name, so swapping one for the other
 * on an existing figure (e.g. Quantum Hardware's platform/dilution-fridge
 * photos, which are exactly this shape) never loses figure numbering or
 * width, and involves no other API relearning.
 */

/**
 * A figure with numbered pins over the image and a matching keyed legend —
 * for pointing at several specific features of one diagram or photo at
 * once, rather than describing them in prose. Each pin carries its note as
 * screen-reader-only text inline (`sr-only`), so a screen reader user
 * reaches the same information at the point in the image where a sighted
 * reader would look, in addition to the always-visible legend below.
 *
 * ## Why this is a client component now
 *
 * It was a Server Component, and its doc comment defended that — correctly,
 * while the only thing at stake was a few bytes. Two failures made the trade
 * go the other way, and both of them are about pins pointing at nothing:
 *
 * 1. **A blocked or missing image.** An external `src` that 404s, or whose
 *    host is not on next.config.ts's CSP `img-src` allow-list, fires an
 *    `error` event and renders the browser's broken-image glyph — with six
 *    numbered pins absolutely positioned on top of it, over nothing. That
 *    is worse than the plain broken image `ExternalFigure` used to show, and
 *    the CSP half of it is exactly the production failure
 *    `src/lib/content/__tests__/lessonImages.test.ts` exists to catch.
 *    `ExternalFigure` already degrades to a labelled "Image unavailable"
 *    panel; there is no server-side way to do the same here, because the
 *    failure only exists in the browser.
 * 2. **An image that has not arrived yet.** With no `aspect` the wrapper had
 *    no reserved height and the `<img>` had no intrinsic dimensions (no
 *    `width`/`height`, no `aspect-ratio`, external so no build-time size), so
 *    the box was 0px tall until the bytes landed — and every pin is placed at
 *    `top: <percent>%` of that box, so all of them stacked on one line at the
 *    top edge before snapping into place. Four call sites omit `aspect`.
 *
 * The cost is bounded: unlike `ExternalFigure`, this component is not in
 * `src/mdx-components.tsx`, so it is only in the client graph of the eight
 * lessons that explicitly import it, not all 219.
 */
export function AnnotatedFigure({
  src,
  alt,
  caption,
  pins,
  aspect,
  credit,
  creditUrl,
  license,
  number,
  wide = false,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  pins: FigurePin[];
  /**
   * Tailwind aspect-ratio class for the figure's box — e.g. `"aspect-[4/3]"`,
   * `"aspect-square"`. **Pass the image's real ratio.** Doing so is what buys
   * zero layout shift and an undistorted image, and it is the only thing this
   * component cannot work out for itself.
   *
   * Unlike `ExternalFigure` this has no ratio default, and the reason is
   * `object-fit`, not pin accuracy. With an explicit ratio the image is
   * `object-fill`, which maps it affinely onto the box — pin `x`/`y`
   * percentages survive that map exactly, so a *wrong* ratio here does not
   * slide a pin off its feature (an earlier version of this comment claimed
   * it would; that is what `object-contain`'s letterboxing does, and this
   * component does not use it). What a wrong ratio does instead is stretch
   * the photograph, which on lab apparatus is its own kind of lie.
   *
   * So when `aspect` is omitted the component does not guess a ratio to
   * stretch to. It reserves a 16:9 placeholder, lets the image size itself
   * naturally on arrival, and holds the pins back until it has (see the
   * render below) — correct pins and an undistorted image, at the cost of one
   * reflow the moment the bytes land.
   */
  aspect?: string;
  credit?: string;
  creditUrl?: string;
  license?: string;
  /** Optional figure number, e.g. `3` — renders as a "Fig. 3" tech-label
   *  ahead of the caption, matching `ExternalFigure`'s prop of the same
   *  name so converting between the two never loses numbering. */
  number?: number;
  /** Widens the figure beyond the reading column on large screens — same
   *  bounded, `sm`-and-up-only treatment as `ExternalFigure`'s `wide`, safe
   *  at 320px. Multi-pin apparatus photos are the case this most often
   *  helps: more width means less pin/legend crowding. */
  wide?: boolean;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  // Only consulted when `aspect` is absent — with an explicit ratio the box
  // is already the right size on the server's first paint and the pins can
  // be placed immediately.
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish loading before React attaches `onLoad` during
  // hydration — a back-navigation to a lesson the reader has already scrolled
  // through is the ordinary way to hit that. The event never fires, so
  // without this check `loaded` would stay false forever and the pins would
  // never appear on exactly the visit where the figure renders fastest.
  // `naturalHeight` guards the other direction: `complete` is also true for
  // an image that has already errored.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalHeight > 0) setLoaded(true);
    else setFailed(true);
  }, []);

  // Pins are absolutely positioned at percentages of this box, so they must
  // not be painted while the box's height is a placeholder rather than the
  // image's own — otherwise all of them stack at the reserved box's top edge
  // and then jump. With an explicit `aspect` the box is correct from the
  // first paint and there is nothing to wait for.
  const canPlacePins = Boolean(aspect) || loaded;

  return (
    <figure className={cn("not-prose my-8", wide && "sm:mx-0 lg:-mx-6 xl:-mx-10", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-panel border border-border bg-surface-muted/40",
          // Explicit ratio wins. Otherwise reserve 16:9 *until the image
          // arrives* and then hand the box back to the image's own
          // proportions: the reservation stops the figure occupying 0px and
          // shoving the rest of the lesson down as the reader scrolls to it,
          // and dropping it on load is what keeps the photograph undistorted.
          // The failure panel keeps the reservation permanently, since there
          // is no image left to size the box.
          aspect ?? (loaded && !failed ? undefined : "aspect-video")
        )}
      >
        {failed ? (
          // Same degradation `ExternalFigure` performs, for the same reason:
          // a browser that blocked or could not fetch the image otherwise
          // paints its broken-image glyph with the pins floating on top of
          // it. `role="img"` + `aria-label` keeps the alt text in the reading
          // position the image would have held. The pin legend below is not
          // suppressed — those labels are prose the surrounding lesson refers
          // to by number, and they are still readable without the picture.
          <div
            role="img"
            aria-label={alt}
            className="flex h-full w-full flex-col items-center justify-center gap-1 bg-surface-muted p-6 text-center text-sm text-muted-foreground"
          >
            <span className="font-medium text-foreground">Image unavailable</span>
            <span>{alt}</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              // `object-fill`, not `object-contain`: the pins are percentages
              // of this box, and only a fill maps the image onto the box
              // affinely enough for those percentages to still name the same
              // features. Without an explicit ratio there is no box to fill,
              // so the image sizes itself and the box follows it.
              className={aspect ? "h-full w-full object-fill" : "h-auto w-full"}
            />
            {canPlacePins
              ? pins.map((pin, index) => (
                  <span
                    key={pin.id}
                    className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-pillar-edge bg-pillar text-[0.6875rem] font-semibold text-background shadow-[0_1px_4px_rgb(0_0_0_/_0.35)]"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <span aria-hidden="true">{index + 1}</span>
                    <span className="sr-only">{`Note ${index + 1}: ${pin.label}`}</span>
                  </span>
                ))
              : null}
          </>
        )}
      </div>

      {(number != null || caption || pins.length > 0) && (
        <figcaption className="mt-3 space-y-2">
          {(number != null || caption) && (
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {number != null ? <TechLabel className="text-pillar">{`Fig. ${number}`}</TechLabel> : null}
              {caption ? <span className="text-sm text-foreground">{caption}</span> : null}
            </p>
          )}
          {pins.length > 0 ? (
            <ol className="space-y-1 text-sm">
              {pins.map((pin, index) => (
                <li key={pin.id} className="flex gap-2">
                  <span className="tech-value shrink-0 text-pillar-strong">{index + 1}</span>
                  <span className="text-muted-foreground">{pin.label}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {credit ? (
            <p className="flex flex-wrap items-center gap-x-1.5 pt-1 text-xs text-subtle-foreground">
              {creditUrl ? (
                <a
                  href={creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-2 hover:text-foreground"
                >
                  {credit}
                  {/* Same debt `ExternalFigure`'s credit link pays: `target="_blank"`
                      otherwise moves the reader to a new tab with no warning. */}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                credit
              )}
              {license ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{license}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
