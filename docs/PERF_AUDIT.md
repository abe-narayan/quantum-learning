# QuantumLearn — Performance & Build Audit

Run: 2026-08-26. First production build (`npm run build`, Next.js 16.3.2 /
Turbopack) of this sprint's visual reinvention, against a tree with other
agents' `.mdx` and `src/components/` edits still in flight. Result: **green**
(exit 0, 789/789 pages generated).

---

## A. Build status

**PASS.** `npm run build` completed successfully on the first run — no retry
needed on my part, no fix required in owned files to get to green.

```
✓ Compiled successfully in 2.8min
✓ Finished TypeScript in 24.7s
✓ Generating static pages using 7 workers (789/789) in 2.2min
```

One transient-looking issue appeared **and self-resolved** during static
generation, worth recording rather than hiding:

> `Failed to build /page: / (attempt 1 of 3) because it took more than 60
> seconds. Retrying again shortly.` — and 19 more lines like it (the
> homepage, five of six pillar pages, `/about`, `/current-quantum`,
> `/opengraph-image`, and 13 problem pages).

All 20 succeeded on retry; final tally is 789/789 and the process exited 0.
Cause: Next's default static-generation concurrency (`experimental.
staticGenerationMaxConcurrency`, effectively up to ~8 pages/worker × 7
workers) put roughly 50+ page renders in flight simultaneously in the first
burst (`0/789 → 197/789`), which is exactly when every one of the 60s
timeouts fired — not scattered through the run. This reads as CPU contention
on this machine during the opening burst, not a per-page defect (the same
pages that timed out on attempt 1 rendered in normal time on attempt 2 with
less concurrent load). **Risk to flag, not fix**: a CI runner with fewer
cores than this workstation, or a `staticGenerationRetryCount` of 0, could
turn this into a real failure. Recommend whoever owns CI config either raise
the timeout/lower `staticGenerationMaxConcurrency`, or confirm the CI
runner's core count comfortably exceeds what produced this contention here.
Not touched — `next.config.ts` is outside files I own.

---

## B. Measured numbers

**Routes: 789 generated pages, 100% static or SSG. Zero dynamic routes.**
Every route in the build's route table is marked `○` (Static) or `●` (SSG via
`generateStaticParams`) — no `ƒ` (Dynamic) marker anywhere. 219 lesson pages,
547 problem pages, plus 21 top-level/utility routes (home, six pillars,
`/learn`, `/map`, `/glossary`, `/simulators`, `/about`, `/current-quantum`,
icons, manifest, sitemap, robots). This is exactly what a pure-SSG site
should look like — nothing accidentally opted into request-time rendering.

**First Load JS**, from `.next/diagnostics/route-bundle-stats.json` (raw
chunk sizes on disk, cross-checked against `<script async>` tags actually
emitted in the prerendered HTML — gzip computed locally since the diagnostic
only reports uncompressed bytes):

| Route | Raw | Gzip | Notes |
| --- | --- | --- | --- |
| Shared baseline (all 18 route templates) | 505.3 KB | 153.5 KB | framework + `PillarScope`/`QuantumField`/`Reveal`/`useScrollProgress` glue |
| `/` (homepage) | **2032.0 KB** | **569.3 KB** | outlier — see below |
| `/lessons/[...slug]` | 1000.3 KB | 306.6 KB | narrative components + one `Lazy*` simulator per lesson |
| `/problems/[slug]` | 987.2 KB | 302.2 KB | `ProblemView` + KaTeX-bearing content |
| `/learn` | 772.4 KB | 240.1 KB | `CurriculumExplorer` client island |
| six pillar pages (`/mechanics`, `/computing`, `/hardware`, `/software`, `/mastery`, `/apex`) | 753–758 KB | 234–236 KB | consistent with each other, as expected |
| `/current-quantum`, `/glossary`, `/about`, `/map` | 709–759 KB | 220–236 KB | |
| `/problems`, `/simulators`, `/lessons` (index pages), `/_not-found` | 505–565 KB | 153–173 KB | near the shared baseline — correctly lean |

**The one real outlier is `/`.** It carries a chunk unique to it —
`3tvejfsoycrgn.js`, 1286 KB raw / 338 KB gzip, confirmed (by content —
`psi`/`schrodinger` occur hundreds of times, no `BlochSphere` strings) to be
`WavefunctionHeroExplorer`, loaded via `LazyWavefunctionHeroExplorer`
(`next/dynamic(..., { ssr: false })`) in `src/components/home/Hero.tsx`. This
**is not a code-splitting bug** — verified by reading the actual prerendered
`index.html`: the chunk ships as `<script src=".../3tvejfsoycrgn.js" async
crossorigin>`, i.e. it does not block SSR or first paint, exactly what
`ssr:false` buys you. But because the Hero explorer renders unconditionally,
above the fold, on mount, its JS is fetched immediately regardless — `ssr:
false` defers *server rendering*, not *network fetch timing*. The homepage's
569 KB gzip first load is therefore a real, currently-unavoidable-by-me cost
of showing a live wavefunction simulation in the hero, not a leak. Flagging
for whoever owns `src/components/home/Hero.tsx`: if this number needs to
come down, the lever is deferring the `import()` itself (e.g., behind an
`IntersectionObserver`/idle-callback gate so it fetches after first paint
rather than concurrently with it), not the existing `Lazy*` wrapper, which is
already doing its job.

**CSS**: two chunks, 145.9 KB raw / 24.0 KB gzip total — reasonable for a
system with six pillar ramps, a light+dark palette, and 1039 lines of
`globals.css`.

**Fonts**: self-hosted via `next/font/google`, confirmed no
`fonts.googleapis.com`/`fonts.gstatic.com` requests anywhere in the built
output. 14 non-KaTeX `.woff2` files (Geist Sans, Geist Mono, Fraunces)
totalling 397.5 KB on disk — but `next/font` splits by Unicode range, so a
given page only fetches the subsets its own text needs, not all 14. Fraunces
is loaded with exactly three variable axes (`opsz`, `SOFT`, `WONK`), not the
full axis set, and only the `latin` subset — correct discipline per
`AGENTS.md`/`layout.tsx`'s own comment. KaTeX ships its own 20 `.woff2`
files (253.7 KB combined) via the `katex` npm package, also same-origin, also
Unicode-range-gated so non-math pages don't pay for them.

**Build duration**: ~2.8 min Turbopack compile + 24.7s typecheck + 2.2 min
static generation (789 pages, 7 workers, including the retry churn above) ≈
5.5–6 minutes wall clock for a from-scratch build of an 800-page site. That
is acceptable for a static site of this size; nothing here suggests a
structural build-time problem.

---

## C. Client boundary audit

**PASS.** 131 files under `src/` declare `"use client"`. Spot-checked every
`src/app/**/page.tsx` for the homepage, all six pillar pages, `/learn`, and
the lesson route (`src/app/lessons/[...slug]/page.tsx`) — **none** declare
`"use client"` at the top; all are server components. The only `"use client"`
files under `src/app/` itself are the required Next.js `error.tsx`/
`global-error.tsx` boundaries (which must be client components) and two
legitimate client islands inside `/learn` (`RecommendedNext.tsx`,
`CurriculumExplorer.tsx`).

**Field machinery — exactly as specified:**
- `src/components/field/PillarScope.tsx` — **server component** (no
  directive), confirmed. Sets `data-pillar` and renders the CSS atmosphere
  layer server-side, so pillar color is present in the very first HTML byte.
- `src/components/field/FieldRegimeSetter.tsx` — client leaf, renders
  `null`, writes to a module-level store (`fieldStore.ts`) via one `useEffect`
  and nothing else. Confirmed this keeps the client boundary to exactly two
  leaves (`QuantumField` subscribes, `FieldRegimeSetter` publishes) rather
  than requiring a Context Provider that would client-ify the whole tree —
  the file's own comment states this design goal and the code matches it.
- `src/components/field/fieldStore.ts` — plain module store +
  `useSyncExternalStore`, with a `getServerSnapshot` that matches the default
  state, so no hydration mismatch.

No subtree-swallowing `"use client"` found anywhere in the sampled areas —
every simulator's client boundary starts at its own `Lazy*.tsx` leaf, not
higher up the tree.

---

## D. Runtime cost audit

**`QuantumField.tsx` — PASS on every checked item:**
- DPR capped at 2 (1.5 on phones, `NARROW_BREAKPOINT = 640`) via
  `measureQuality()`.
- `detail`/`intensity` scaled down on narrow viewports and on
  `navigator.hardwareConcurrency <= 4` (`frameInterval: 33` → 30fps ceiling).
- Loop stopped on `visibilitychange` (`document.hidden`) — confirmed.
- No `requestAnimationFrame` loop at all under
  `usePrefersReducedMotion()` — paints exactly one static frame instead.
- Nothing drawn under `navigator.connection.saveData` — the effect returns
  before even acquiring a 2D context.
- Effect dependency array (`[regime, prefersReducedMotion, themeEpoch,
  pillar]`) — every dependency is a legitimate reason to tear down and
  rebuild the loop (regime/pillar change on navigation, reduced-motion can
  flip live, theme can flip live); scroll is read through a ref
  (`useScrollSubscription`) and never enters the dependency array or
  triggers a re-render. Not recreated unnecessarily.

**`useScrollSubscription`/`useScrollProgress.ts` — PASS with one exception
outside my files.** It is the correct singleton: module-level `listeners`
Set, one `attach()`/`detach()` pair reference-counted against listener count,
one rAF-coalesced `scroll`+`resize` pair. Grepping all of `src/` for
`addEventListener("scroll"`/`addEventListener('scroll'` found exactly two
hits:
- `src/components/motion/useScrollProgress.ts:46` — the shared subscription
  itself (correct, this is the one).
- `src/components/lessons/ReadingProgressBar.tsx:54` — **a second,
  independent `scroll` + `resize` listener pair**, not routed through
  `useScrollSubscription`. It self-coalesces via its own `rAF` ref (so it
  isn't literally firing at raw event frequency), but it duplicates exactly
  the machinery `useScrollProgress.ts` exists to centralize, and its
  `measure()` calls `container.getBoundingClientRect()` on every animation
  frame while the page is scrolling (`ReadingProgressBar.tsx:30`) — a forced
  layout read on top of the shared subscription's own rAF, every frame,
  for the whole time a reader scrolls a lesson. **Not fixed — this file is
  under `src/components/lessons/`, outside files I own, and other agents
  were actively editing that directory this sprint.** Routing this through
  `useScrollSubscription` (deriving the container-relative percentage from
  the document-level `scrollY`/`progress` it already provides, or at minimum
  reading `getBoundingClientRect()` only when that shared callback fires)
  would remove the duplicate listener and the redundant rAF loop. Flagging
  for whoever owns `src/components/lessons/`.

**`Reveal.tsx` — PASS.** One shared `IntersectionObserver`
(`sharedObserver`, module-level), a `WeakMap` from element → handler, and an
`observedCount` that disconnects and nulls the observer when it reaches
zero — confirmed both the single-instance behavior and the teardown-on-empty
behavior by reading the code directly (`getObserver()`/`observe()` in
`src/components/motion/Reveal.tsx:57-90`).

Minor, low-severity, outside owned files: `src/components/lessons/
TableOfContents.tsx` mounts its **own** `IntersectionObserver` per
`useTocEntries()` call, and both `TableOfContentsDesktop` and
`TableOfContentsMobile` call that hook independently — so a lesson page
that renders both (CSS-hidden at different breakpoints, but both mounted)
creates two observers watching the same headings instead of one. This is a
different purpose from `Reveal`'s (active-heading tracking vs. entrance
animation) so it isn't the same violation, and two observers on one page is
nowhere near the "one per 60 elements" problem `Reveal.tsx`'s own comment
warns about — noting for completeness, not a priority.

**Layout thrash grep** (`getBoundingClientRect` across `src/`): the only
call site outside comments is the one flagged above in
`ReadingProgressBar.tsx`. Nothing in owned files.

**High-frequency `useState` grep**: no component drives `useState` directly
off raw `scroll`/`pointermove`/rAF frequency. `useScrollProgress(steps)`
quantizes to steps (default 200) by design — bounded, documented, fine.
`ReadingProgressBar`'s `setProgress` is throttled to at most once per
animation frame (not raw scroll-event frequency) — not a correctness bug,
just the duplicate-listener issue above. No `pointermove`/`mousemove`/
`touchmove` listeners exist anywhere in `src/` at all.

**Lazy simulators — PASS.** All 17 `Lazy*.tsx` wrappers
(`src/components/simulators/**/Lazy*.tsx`) follow the same verified-correct
shape: `"use client"` wrapper → `dynamic(() => import("./X").then(m =>
m.X), { ssr: false, loading: () => <SimulatorSkeleton .../> })` →
`SimulatorErrorBoundary`. Confirmed genuinely code-split in the build output
(each lazy-loaded explorer lands in its own chunk, separate from the shared
baseline and from other explorers) — see the homepage finding in §B for what
that looks like in practice for the Hero's explorer specifically.

---

## E. Assets and CSS audit

- `src/app/globals.css`: 1039 lines source, **145.9 KB raw / 24.0 KB gzip**
  built (two CSS chunks). No `backdrop-filter` anywhere in the file (grep
  returned zero matches) — consistent with §4 of `DESIGN_SYSTEM.md` ("No
  glassmorphism. No blur stacks over the canvas field."). No universal `*`
  selector overrides found.
- Fonts: see §B — self-hosted, subset, Unicode-range-split, Fraunces limited
  to three axes. No `fonts.googleapis.com`/`fonts.gstatic.com` in the CSP or
  in any built output.
- External requests: `next.config.ts`'s CSP `img-src` allow-lists exactly
  two hosts (`upload.wikimedia.org`, `www.nist.gov`) for
  `ExternalFigure`-rendered lesson photos, enforced at test time by
  `src/lib/content/__tests__/lessonImages.test.ts`. No other external origin
  appears anywhere in the built HTML's `<script>`/`<link>`/`<img>` tags I
  inspected. No new external requests were introduced by this sprint's
  visual work — the field/motion machinery is 100% same-origin canvas/CSS.

---

## F. What I changed

**Nothing, in the files I own.** `src/components/field/**` and
`src/components/motion/**` already meet every requirement in
`DESIGN_SYSTEM.md` §6/§7/§10 as built — DPR capping, quality scaling,
visibility pausing, reduced-motion/data-saver gating, one shared scroll
subscription, one shared IntersectionObserver with correct teardown, correct
effect dependency arrays, `PillarScope` as a true server component,
`FieldRegimeSetter` as a true null-rendering client leaf. I looked hard for
something to fix here (duplicate listeners, uncapped DPR, missing
cleanup, stray `useState` on high-frequency events, unnecessary effect
reruns) and did not find any — reporting "acceptable as built" rather than
manufacturing a change.

---

## G. Prioritized list of what remains (routed by owner)

1. **`src/components/lessons/ReadingProgressBar.tsx`** (lessons owner) —
   duplicate `scroll`/`resize` listener pair (lines 54–55) plus a
   `getBoundingClientRect()` read on every scroll animation frame (line 30),
   parallel to and duplicating `useScrollSubscription` from
   `src/components/motion/useScrollProgress.ts`. Low-medium priority: not
   broken, just doing by hand what the shared subscription already does
   site-wide. Fix: derive the container-relative percentage inside a
   `useScrollSubscription` callback instead of a private listener.

2. **`src/components/home/Hero.tsx`** (home owner) — the homepage's first
   load is the one real bundle-size outlier (569 KB gzip vs. ~220–240 KB for
   a typical pillar/content page), driven by
   `LazyWavefunctionHeroExplorer`'s chunk (338 KB gzip) being fetched
   eagerly (`async`, not deferred) because the Hero explorer mounts
   unconditionally on load. Low-medium priority, and arguably the right
   trade-off for a hero simulator that's the site's entire pitch — flagging
   as a number to be aware of, not a defect. If it needs to come down: gate
   the `import()` behind visibility/idle rather than mount.

3. **`src/components/lessons/TableOfContents.tsx`** (lessons owner) — two
   `IntersectionObserver` instances per lesson page (desktop rail + mobile
   disclosure each instantiate their own) instead of one shared. Cosmetic
   compared to finding 1; not urgent.

4. **CI / build config** (whoever owns `next.config.ts`/CI) — 20 pages hit
   Next's 60-second static-generation soft-timeout on their first attempt
   during this build's opening concurrency burst, all succeeded on retry, so
   this build is fully green — but a CI runner with less headroom than this
   workstation could see real failures from the same contention. Worth a
   look at `experimental.staticGenerationMaxConcurrency` /
   `staticGenerationRetryCount` before this becomes a flaky-CI problem.

Nothing above blocks shipping — the build is green, every route is static,
and the field/motion machinery this sprint most put at risk is built
correctly.

---

## H. Follow-up pass — homepage bundle, lesson chrome, home widgets

Owner of `src/app/page.tsx`, `src/components/home/**`,
`src/components/lessons/ReadingProgressBar.tsx` +
`TableOfContents.tsx`, `src/components/motion/**`, and the two homepage
hero simulator wrappers. This section reports on finding 1, 2 (partially —
see below), and 3 from §G, plus P2-8 from `docs/UX_REVIEW.md`.

### H.1 — What was actually in the 338 KB gzip chunk (measured, not §B's guess)

§B/§G.2 attributed the homepage's outlier chunk (`3tvejfsoycrgn.js`, 1317 KB
raw / **345 KB gzip measured directly via `gzip -c` on the file already on
disk in `.next/static/chunks/`**, close to §B's independently-measured 338
KB) entirely to `WavefunctionHeroExplorer`, on the strength of a `psi`/
`schrodinger` string search that found no `BlochSphere` strings. That
content search was real but incomplete — it didn't rule out a *third*
source sharing the same physical chunk.

Reading the chunk's actual bytes (`grep`/`head -c` on the built file, not
guessing) found the smoking gun at byte 275: a serialized `Problem` object
— `meta:{slug:"amplitude-estimation-grover-iterate-probability", ...}`,
followed by `question`, `answer`, `hints`, `solution`, `explanation` — and
547 repetitions of `meta:{slug`/`question:`/`prompt:`/`difficulty:` (547
being exactly the site's problem count). **The chunk contains the entire
547-problem registry — every hint, answer, and worked solution — not just
the wavefunction physics code.**

Traced to the cause: `src/components/home/DailyPuzzle.tsx` was a `"use
client"` component that called `getAllProblemMeta()`/`getProblem()` from
`@/lib/problems/registry` directly, to pick and preview one "problem of the
day." `registry.ts` imports `PROBLEMS` from `registry.generated.ts`, which
statically imports all 547 individual problem files from
`src/content/problems/**` (measured: 1.56 MB raw / 366.7 KB gzip
concatenated). Because `DailyPuzzle` ran client-side (it has to, to read
the real `Date()` without baking the build day into static HTML) and
imported from `registry.ts` at module scope, **the entire registry —
hints, answer keys, and worked solutions for all 547 problems, to preview
one of them** — became reachable from the client bundle, and Turbopack's
chunk grouping happened to land it in the same physical file as
`WavefunctionHeroExplorer`'s code, which is what made the earlier
string-search misattribute the whole 338 KB to the simulator.

**Estimate of the actual split** (not measured post-fix — see H.2 for why):
the wavefunction explorer's own code (`WavefunctionHeroExplorer.tsx`,
`presets.ts`, `WavefunctionCanvas.tsx`, the hand-written FFT/complex/
wavefunction math in `src/lib/quantum/`) totals under 800 source lines with
no external numerical dependency — a small fraction of 338 KB gzip. The
problems registry, by direct measurement of the source it's built from, is
the dominant contributor.

### H.2 — Fix: stop shipping the registry to the client (predicted number)

Split `DailyPuzzle` into a server half and a client half:

- `src/components/home/DailyPuzzle.tsx` — now a plain server component.
  Calls `getAllProblems()` (server-only; nothing here reaches the client
  bundle) and maps it down to a lean `DailyPuzzlePreview[]` — `slug`,
  `title`, `question.prompt`, `difficulty`, `estimatedMinutes` only, the
  five fields the card ever renders. No hints, no answer, no solution
  steps, no explanation, no tags/prerequisites/course/lesson.
- `src/components/home/DailyPuzzleClient.tsx` (new) — `"use client"`,
  receives `previews` as a prop, does the date-hash pick
  (`useSyncExternalStore` with a null server snapshot, same mechanism as
  before) and renders. This is the only part that still needs to run
  client-side, and it now carries only the trimmed data, not the registry
  module.

**Predicted new payload for this data, estimated (not measured against a
real build — see caveat below):** extracted the same five fields from all
547 problem source files with a small script and gzipped the resulting
JSON with Node's `zlib` directly (a real gzip computation on real content,
not a guess) — **183.3 KB raw → 56.2 KB gzip** for all 547 previews (543/547
parsed cleanly; 4 files use a multi-line prompt the extraction regex
didn't match, negligible at this scale). That replaces the ~280+ KB gzip of
hints/answers/solutions that no longer ship, while keeping every problem
previewable client-side (still required — the pick depends on the real
client `Date()`).

**Caveat, per this task's own constraint:** this is the gzip size of the
*data*, computed directly from real content, not the final bundled-and-
minified-and-gzipped JS chunk `next build` would actually produce (object
literal syntax, whatever Turbopack's chunk grouping does with it this
time). It is a solid estimate of the dominant term, not a measured build
number — I was not able to run `npm run build` per this task's constraints.
**Predicted new homepage total: roughly 569 KB gzip → very approximately
250–320 KB gzip**, i.e. landing near the other content-heavy routes
(~300 KB gzip) rather than far above them, assuming the actual
wavefunction/Bloch code plus this trimmed preview data plus the framework
baseline. Whoever next runs `npm run build` should replace this estimate
with the real number.

### H.3 — Fix: defer the hero chunk fetch itself (P2-6/finding 2's stated lever)

Independent of H.2, `LazyWavefunctionHeroExplorer.tsx` and
`LazyBlochSphereHeroExplorer.tsx` previously rendered their
`next/dynamic(..., { ssr: false })` component unconditionally on mount —
exactly the behavior §B called out: `ssr: false` defers *server*
rendering, not *fetch timing*, so the chunk's `import()` fired the instant
each wrapper mounted, competing with the homepage's own first paint.

Added `src/components/motion/useDeferredMount.ts`, a small shared gate
(same "module owns one shared primitive" convention as `Reveal.tsx`/
`useScrollProgress.ts`): holds the real component back until whichever
fires first — idle-after-paint (`requestIdleCallback`, capped, `setTimeout`
fallback), near-viewport (`IntersectionObserver`, opt-out), or the reader
interacting with the placeholder. Applied differently per widget:

- **Wavefunction hero** (always above the fold): visibility gate disabled
  (an already-visible element would report intersecting immediately and
  defeat the point) — idle-after-paint only, capped at 1.2 s, so the fetch
  starts a beat after first paint rather than racing it, and still arrives
  well within the "meet a real phenomenon within seconds" brief.
- **Bloch sphere hero** (below the fold on the homepage's Computing
  section, near the top of its own `/computing` pillar page): visibility
  gate stays on, so the below-the-fold homepage placement genuinely defers
  the fetch until a reader is about to scroll to it, while the near-top
  `/computing` placement still resolves almost immediately (an observer
  target already in view reports intersecting on its first callback).

Both wrappers show the *exact same* `SimulatorSkeleton` while gated as
`next/dynamic`'s own `loading:` fallback already shows during the fetch
itself — gating adds no new visual state and no flash between "not yet
gated," "gated but fetching," and "loaded."

**Not measured post-change** (no `npm run build` available this pass): the
expected effect is on *when* the 338 KB-ish chunk is requested relative to
first paint, not its size — H.2 is the size fix, this is the timing fix the
original audit explicitly asked for ("the lever is deferring the `import()`
itself"). Reduced motion, keyboard/focus, and accessible naming are
unaffected — the gate only changes which of two already-existing render
branches (`SimulatorSkeleton` vs. the real explorer) is active, both of
which existed before this change.

### H.4 — P2-8: homepage figure slot empty until hydration

Same root file as H.2. `DailyPuzzleClient` previously (`DailyPuzzle.tsx`,
pre-split) returned `null` until mount, so the Software section's
`SplitFigure` figure column was empty on first paint and popped in after
hydration — a real layout shift, called out in `docs/UX_REVIEW.md` P2-8.

Fixed by giving the pre-mount state a same-shaped skeleton instead of
`null`: the `Instrument` chrome (label, footnote) renders immediately
(neither depends on "today"), the date readout reserves its width with an
`aria-hidden`, `opacity-0` placeholder of the same string shape, and the
body renders `aria-hidden` shimmer bars (`SkeletonLine`, sized in `em` so
each one inherits the line-height of the real heading/paragraph/value it
stands in for by construction) plus a real, disabled `Button` with the same
static label — so every element in the loading state is the same tag with
the same classes as its real-content counterpart, differing only in
content, which is what makes the reserved height accurate without hand-
tuned pixel values. A `role="status"` + `sr-only` "Loading today's
problem…" string covers the accessible announcement.

Not verified visually (no build/browser check available this pass) —
structurally reserved by construction, not pixel-measured.

### H.5 — Lesson chrome: shared scroll subscription and one `IntersectionObserver`

`src/components/lessons/ReadingProgressBar.tsx` (finding 1 in §G): removed
the private `scroll`/`resize` listener pair and the per-frame
`getBoundingClientRect()` call. Now splits geometry (the tracked
container's document-relative top/height — cached, recomputed only via a
`ResizeObserver` on the container plus a window `resize` listener, both
rAF-coalesced) from position (derived arithmetic from that cache and the
`scrollY` the shared `useScrollSubscription` callback already provides, so
the scroll path itself performs zero DOM reads). Behavior preserved
exactly: same container-relative percentage formula, same short-container
edge case, and an initial synchronous measurement so a page mounted
mid-scroll (back-navigation, in-page anchor) reflects the true position
immediately instead of showing a stale 0% until the next event.

`src/components/lessons/TableOfContents.tsx` (finding 3 in §G): replaced
the per-`useTocEntries()`-call `IntersectionObserver` with one shared,
module-level observer keyed by `containerId` and reference-counted by
subscriber (same shape as `Reveal.tsx`'s shared observer) — the first of
`TableOfContentsDesktop`/`TableOfContentsMobile` to mount creates it and
observes the headings once; the second adds a listener to the existing one
instead of creating a second observer; it disconnects only once both have
unmounted. Both are always mounted simultaneously (CSS-hidden at different
breakpoints, per §D's own note), so this is a straight 2→1 reduction per
lesson page, all 219 of them. Active-heading semantics preserved exactly:
same `rootMargin`/`threshold`, same "topmost intersecting heading wins"
resolution, and a newly-subscribing consumer is synced to the
already-known `activeId` immediately rather than waiting for the next
intersection change.

Verified with `npx tsc --noEmit --incremental false` (clean — one
unrelated pre-existing error in `src/lib/content/__tests__/lessons.test.ts`
/ `src/lib/content/types.ts`, both outside owned files and mid-edit by
another agent per `git status`), `npx eslint` on every changed file
(clean), and `npx vitest run src/components src/lib/design` (206/206
passing, same as before this pass). `npm run build` was not run, per this
task's constraints — every number above not explicitly marked "measured"
is a predicted estimate.

---

## I. Post-fix build verification (measured)

Run at the end of the sprint, after every fix in §F and §H landed.
`npm run build`, exit code 0, on the tree as it then stood.

### Build outcome

| | |
| --- | --- |
| Routes | 789, **100% static** — every entry in the route table is `○` or `●`, no `ƒ` |
| Compile | 20.4s (Turbopack) |
| TypeScript | 5.4s, clean |
| Prerender | 789/789 pages, no errors, no retries |

### Two build-breaking bugs this run caught and that are now fixed

Both were invisible to `tsc`, to ESLint, and to the compile-only corpus
test — they only appear when a page actually *renders*:

1. **`ErrorCorrectionCycle` threw on every page that embedded it.** It
   computed `innerProduct` between the dimension-8 corrected codeword
   returned by `runBitFlipCorrectionCycle` and a dimension-2 logical state,
   giving "States must have the same dimension for an inner product." Fixed
   to compare the corrected codeword against the original *encoded* codeword,
   which is both dimensionally correct and what the demo actually means.
2. **`e^{iφ}` written in bare markdown prose.** MDX parses `{iφ}` as a JSX
   expression, so the page died with "iφ is not defined". Fixed by making it
   inline math, as the same file already does three lines further down.

The first aborted the build 591 pages in; the second was found only
afterwards, because a Next build stops at the first prerender failure and
never reveals the second. That is why
`src/lib/content/__tests__/lessonRender.test.ts` now exists: it renders all
219 lessons to static markup in ~80s, reports **every** failure rather than
the first, and would have caught both in one run.

### Client bundle, after the `DailyPuzzle` fix

Measured with `gzip -c` on the built files in `.next/static/chunks/`:

| | Before (§H) | After |
| --- | --- | --- |
| Largest single chunk | 345 KB gz | **77 KB gz** |

The whole-corpus problem registry is gone from the client bundle. Verified
two ways: no chunk contains the `meta:{slug` pattern that a serialized
`Problem` produces (547 occurrences before), and the only two chunks
matching `workedSolution`/`whyCorrect` are 7 KB and 11 KB gzip — the
`SolutionPanel`/`HintPanel` *component code* that reads those fields, not the
data. `src/lib/design/__tests__/clientBoundary.test.ts` now enforces this by
walking the real import graph from every `"use client"` entry point.
