import { cn } from "@/lib/utils";

export type SimulatorSkeletonVariant = "standard" | "hero" | "heroWide";

/**
 * ============================================================
 * What a simulator looks like before it exists
 * ============================================================
 * These placeholders are not "below the fold and nobody sees them":
 * `useDeferredMount`'s first trigger is idle-after-paint, capped at
 * `idleTimeoutMs = 1200` and independent of visibility, so on every embed
 * that does not gate on the viewport the swap happens while the reader is
 * looking straight at it. A skeleton that is the wrong height is therefore a
 * layout jump the reader watches, not one they scroll past.
 *
 * Each variant is built out of *the real component's own classes* rather than
 * a height picked to look about right: the same `.instrument` shell, the same
 * `p-4 sm:p-5` body, the same `mt-6 border-t pt-6` framing block. So the
 * chrome cannot drift, and the only thing left to estimate is how much text
 * each simulator happens to put inside it.
 *
 * Where the real height depends on content, these reserve the **minimum** the
 * real component can occupy, never an average. Over-reserving would jump the
 * page the other way, which is the same defect with the sign flipped.
 *
 * The arithmetic below is in CSS pixels at the default root size, from the
 * tokens in globals.css §4: `.tech-label` is `--text-meta` (0.6875rem = 11px)
 * at line-height 1.2, so 13px; `text-lg` is 18px/28px; `text-xs` is
 * 12px/16px; `text-sm` with `leading-relaxed` is 14px × 1.625 = 23px.
 */

/**
 * How the "standard" variant adds up, at a 704px lesson column (`sm:` active,
 * so `p-5` and the two-column framing grid), against `SimulatorInstrument` +
 * `Instrument` (ui/Panel.tsx) + `SimulatorFraming`:
 *
 *   panel border (top + bottom)                            2
 *   label strip: border-b 1 + py-2.5 20 + Readout 45       66
 *     (Readout is flex-col gap-1: label 13 + 4 + value 28)
 *   body padding: p-5 top + bottom                         40
 *   stage: aspect-[2/1] of the 662px inner width          331
 *   framing: mt-6 24 + border-t 1 + pt-6 24                49
 *     + the two-column row (13 + mt-1.5 6 + a 23px line)   42
 *     + mt-5 20 + a two-line "Try this" item 69            89
 *   footnote strip: border-t 1 + py-2.5 20 + text-xs 16    37
 *                                                        ----
 *                                                         656
 *
 * The old skeleton was a bare `aspect-[2/1]` box: 352px, against real chrome
 * alone (everything above except the stage) of 325px before a single pixel of
 * stage. All 15 explorers render a label strip and a framing block, and 14 of
 * the 15 render a footnote, so none of this is speculative decoration; it is
 * what always arrives.
 *
 * The remaining gap is text: the framing items above are reserved at one line
 * (two for "Try this"), and most simulators write two or three plus a
 * two-item list, which is another ~60px. That is the part a placeholder
 * cannot know, and it is reserved short on purpose.
 *
 * At 320px the same structure gives 2 + 66 + 32 (`p-4`) + 190
 * (`aspect-[4/3]` of the 254px inner width) + 242 (the framing grid is one
 * column below `sm`, so its first two items stack) + 37 = 569.
 */

/**
 * "Equipment powering up," not a grey box: a tech-voice label under three
 * staggered pulsing segments standing in for a live readout strip. Purely
 * decorative (the accessible loading state is the sr-only text in the
 * parent), so this whole block is `aria-hidden`. Reduced motion neuters the
 * pulse globally (globals.css §11 zeroes all animations/transitions) and
 * `motion-safe:` skips it at the Tailwind level too, leaving three static
 * segments, still legible as "not ready yet," never a frozen spinner.
 */
function PoweringUp() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-6 rounded-full bg-pillar/60 motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <span className="tech-label text-subtle-foreground">Initializing instrument</span>
    </div>
  );
}

/** A stand-in for one line of text. `h-[13px]` is `.tech-label`'s 11px at
 *  line-height 1.2; the sizes below are the line boxes of the type they
 *  replace, so a row of these is exactly as tall as the row it precedes. */
function Bar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block rounded-full bg-border", className)} />;
}

/** One `FramingItem` (shared/Framing.tsx): a tech label over body copy.
 *  13 + mt-1.5 6 + one 23px line of `text-sm leading-relaxed` = 42px, the
 *  least a filled slot can be. */
function FramingItemSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div>
      <Bar className="h-[13px] w-24" />
      <span aria-hidden="true" className="mt-1.5 block space-y-1">
        {Array.from({ length: lines }, (_, i) => (
          <Bar key={i} className={cn("h-[23px] bg-border/50", i === lines - 1 ? "w-3/4" : "w-full")} />
        ))}
      </span>
    </div>
  );
}

/**
 * The block every simulator ends its stage with, at its minimum height.
 * Structure copied from `SimulatorFraming` rather than measured off it, so
 * the two move together: same `mt-6 border-t pt-6`, same `grid gap-5
 * sm:grid-cols-2`, same `mt-5` before "Try this".
 */
function FramingSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 border-t border-border pt-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FramingItemSkeleton />
        <FramingItemSkeleton />
      </div>
      <div className="mt-5">
        <FramingItemSkeleton lines={2} />
      </div>
    </div>
  );
}

export function SimulatorSkeleton({
  variant = "standard",
  className,
}: {
  variant?: SimulatorSkeletonVariant;
  className?: string;
}) {
  // `data-simulator-skeleton` is a print hook, not styling. Every Lazy*
  // wrapper loads its simulator with `next/dynamic(..., { ssr: false })`, so
  // the *server-rendered* output of a simulator embed is permanently this
  // placeholder, which means a printed lesson (and a no-JS reader) sees
  // "Initializing instrument" boxes where the instrument should be. The
  // ~162 lessons that embed a simulator directly rather than through
  // <InteractiveSection> have nothing else to key off; globals.css §12 uses
  // this attribute to replace the box with a short note on paper. It hides
  // every *direct child*, so it keeps working however this is nested.
  if (variant === "hero") {
    /**
     * The homepage Bloch hero (BlochSphereHeroExplorer).
     *
     * **Re-derived** when that component stopped framing itself. It used to
     * open a `rounded-panel border ... p-6 shadow-sm sm:p-8` root inside an
     * `<Instrument>` that already draws a border at the same radius, so both
     * it and this placeholder now drop that chrome and the `<Instrument>` (or,
     * on `/computing`, the page) frames them. `max-w-sm` is 384px and there is
     * no border or padding of its own left to subtract, so the content width
     * is the full 384 — but the canvas is `max-w-xs`-capped, and that cap now
     * binds where at 318px it did not, which is why the square box below
     * carries the same `mx-auto w-full max-w-xs` the real canvas does. Without
     * it this would reserve 384 for a 320px sphere.
     *
     *   BlochSphereCanvas: a square viewBox, max-w-xs-capped        320
     *   narration: mt-4 16 + its own min-h-[2.5rem] 40               56
     *   gate row: mt-4 16 + the 44px control row                     60
     *   hint: mt-6 24 + border-t 1 + pt-4 16 + text-xs 16            57
     *   full-explorer link: mt-3 12 + min-h-11 44                    56
     *                                                              ----
     *                                                               549
     *
     * (Was 613 with the 66px of frame and a 318px sphere; the frame is worth
     * −66 and the uncapped-to-capped sphere +2.)
     *
     * Before either revision the skeleton was `aspect-square` on the panel:
     * 384px flat, against a real component that is 549px at its shortest (the
     * narration's own minimum; the opening sentence actually runs to about
     * five lines at this width, so ~590px is what a reader sees).
     */
    return (
      <div className="relative mx-auto w-full max-w-sm">
        <div data-simulator-skeleton="" className={cn("relative", className)} role="status">
          <span className="sr-only">Loading simulator…</span>
          <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center">
            <PoweringUp />
          </div>
          <div aria-hidden="true" className="mt-4 flex min-h-[2.5rem] flex-col items-center gap-1.5">
            <Bar className="h-4 w-full bg-border/50" />
            <Bar className="h-4 w-2/3 bg-border/50" />
          </div>
          {/* The gate row, at its real shape: three single-letter buttons and
              two word buttons, all `min-h-11 min-w-11`. */}
          <div aria-hidden="true" className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {["w-11", "w-11", "w-11", "w-20", "w-16"].map((width, i) => (
              <span
                key={i}
                className={cn("block h-11 rounded-(--radius-tight) border border-border", width)}
              />
            ))}
          </div>
          <div aria-hidden="true" className="mt-6 border-t border-border pt-4">
            <Bar className="h-4 w-3/4 bg-border/50" />
          </div>
          <div aria-hidden="true" className="mt-3 flex min-h-11 items-center justify-between gap-3">
            <Bar className="h-4 w-28 bg-border/50" />
            <Bar className="h-5 w-24 bg-border/50" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "heroWide") {
    /**
     * The homepage wavefunction hero (WavefunctionHeroExplorer): a title of
     * its own, three preset pills, and a canvas on a 640×280 viewBox.
     *
     * **Re-derived** twice over. That component no longer frames itself (see
     * its own note: it always mounts inside an `<Instrument>`, which was
     * drawing a second hairline at the same radius), so this placeholder drops
     * the matching `rounded-panel border ... p-6 sm:p-8` root. And the width
     * premise the old arithmetic ran on was wrong independently of that: it
     * said "a ~600px column" and then subtracted only the skeleton's own
     * chrome, forgetting the `<Instrument>` between the column and this
     * element. The real chain on the homepage is
     *
     *   `Container`   max-w-6xl 1152 − lg:px-8 64                = 1088
     *   `SplitFigure` (1088 − lg:gap-14 56) × 1.35/2.35          ≈  593
     *   `<Instrument>` border 2 + sm:p-5 40                      =  551
     *
     * so 551px is what this root is handed, and with no border or padding of
     * its own that is also the width its children get:
     *
     *   eyebrow: text-sm                                             20
     *   title: mt-2 8 + one line of sm:text-3xl 36                   44
     *   presets: mt-6 24 + the 44px pill row                         68
     *   canvas well: mt-4 16 + border 2 + p-3 24                     42
     *   canvas: 280/640 of the 525px inside that well               230
     *   play row: mt-4 16 + a 44px button                            60
     *   caption: mt-4 16 + one line of text-xs 16                    32
     *                                                              ----
     *                                                               496
     *
     * (The old 554 was 66 of frame plus a canvas computed from a 508px well
     * that never existed at that width; the same canvas under the old,
     * self-framed component was really 459px wide and 201 tall, for a true
     * 533. So this reserves 37px less than the placeholder did, against a
     * component that also lost 66px of chrome and gained 29px of canvas.)
     *
     * Before any of that it was `aspect-[16/10]` on the panel: 375px.
     * The title is reserved at one line and wraps to two at most widths
     * (+36px), and the caption likewise; both are text, so both are reserved
     * short.
     */
    return (
      <div data-simulator-skeleton="" className={className} role="status">
        <span className="sr-only">Loading simulator…</span>
        <Bar className="h-5 w-48 bg-border/50" />
        <Bar className="mt-2 h-9 w-4/5 bg-border/50" />
        <div aria-hidden="true" className="mt-6 flex flex-wrap gap-2">
          {["w-28", "w-24", "w-32"].map((width, i) => (
            <span key={i} className={cn("block h-11 rounded-full border border-border", width)} />
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-panel border border-border bg-surface-muted/40 p-3">
          <div className="flex aspect-[64/28] items-center justify-center">
            <PoweringUp />
          </div>
        </div>
        <div aria-hidden="true" className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="block h-11 w-24 rounded-(--radius-tight) border border-border" />
          <Bar className="h-4 w-28 bg-border/50" />
        </div>
        <Bar className="mt-4 h-4 w-2/3 bg-border/50" />
      </div>
    );
  }

  // "standard": the 13 simulators embedded through `SimulatorInstrument`, on
  // /simulators and inside lessons. Uses the raw `.instrument` class (the same
  // one `<Instrument>` renders, see ui/Panel.tsx) so the placeholder already
  // carries the pillar-tinted wash and corner ticks the real instrument will
  // swap in with, and now the same label strip, body padding, framing block
  // and footnote strip as well, so it swaps in at close to the real height
  // rather than growing by 300px under the reader's eyes.
  return (
    <div
      data-simulator-skeleton=""
      className={cn("not-prose instrument overflow-hidden", className)}
      role="status"
    >
      <span className="sr-only">Loading simulator…</span>
      {/* The label strip: `<Instrument>`'s own header, with a `Readout` in it. */}
      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2.5 sm:px-5"
      >
        <Bar className="h-[13px] w-40" />
        <span className="flex flex-col gap-1">
          <Bar className="h-[13px] w-10" />
          <Bar className="h-7 w-16 bg-border/50" />
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex aspect-[4/3] items-center justify-center sm:aspect-[2/1]">
          <PoweringUp />
        </div>
        <FramingSkeleton />
      </div>
      {/* The footnote strip, at one line. It is the caption under every
          instrument ("units, or what to look for"), and it wraps to three or
          four lines at 320px, where this reserves one. */}
      <div aria-hidden="true" className="border-t border-border px-4 py-2.5 sm:px-5">
        <Bar className="h-4 w-2/3 bg-border/50" />
      </div>
    </div>
  );
}
