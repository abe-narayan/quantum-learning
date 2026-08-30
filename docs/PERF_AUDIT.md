# StudyQuantum — Performance & Build Audit

> **This file is a findings log, not a guide.** It records measured build and
> bundle numbers from specific runs, each dated, plus the punch list that
> came out of them. **Nothing in it is a rule.** The performance rules that
> bind live in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) §10 (the client-bundle
> boundary and its budgets) and [`DEPLOYMENT.md`](DEPLOYMENT.md) (the build's
> memory profile).
>
> **Every number here belongs to the run it was taken in.** Sections B, H and
> I are measurement records and are appended to over time rather than
> rewritten; do not update a number in place, and do not assume a figure from
> one run is comparable to one from another unless the run says so. §G now
> carries a dated code-inspection status for each of its open items.

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
| `/problems/[slug]` | 987.2 KB | 302.2 KB | `ProblemView` + KaTeX-bearing content — **superseded, see below** |
| `/learn` | 772.4 KB | 240.1 KB | `CurriculumExplorer` client island |
| six pillar pages (`/mechanics`, `/computing`, `/hardware`, `/software`, `/mastery`, `/apex`) | 753–758 KB | 234–236 KB | consistent with each other, as expected |
| `/current-quantum`, `/glossary`, `/about`, `/map` | 709–759 KB | 220–236 KB | |
| `/problems`, `/simulators`, `/lessons` (index pages), `/_not-found` | 505–565 KB | 153–173 KB | near the shared baseline — correctly lean |

> **Resolved 2026-08-29 — `/problems/[slug]` no longer ships KaTeX.** The
> "KaTeX-bearing content" in that row was not content at all: `ProblemView`
> was a client component, and `AnswerInput`/`HintPanel`/`SolutionPanel`
> render authored strings through `ScrollableMathText` → `MathText` →
> `katex`. None of those four files declares `"use client"` itself, so they
> were dragged across the boundary by their importer — which is exactly why
> the two by-name katex guards (`mdx-components.tsx`, `LessonLayout.tsx`)
> never saw it, and why §C's client-boundary pass, which checked *declared*
> boundaries, called it a PASS. `ProblemView` is now a Server Component that
> renders the problem's math to KaTeX HTML strings
> (`components/problems/renderProblemMath.ts`) and hands them to
> `ProblemViewClient`, whose subtree only injects strings
> (`RenderedMathText.tsx`). Re-measured on the source graph: the route's
> eager client graph is **86.6 KB → 13.8 KB gzip**, i.e. 74 KB of
> `katex.min.js` off all 547 problem pages, bought for ~568 bytes gzip of
> prerendered HTML per page in the flight payload (median 163B, max 2.8KB).
> The First Load JS column above predates the change and has not been
> re-measured with a build. See ARCHITECTURE.md §7b and
> `clientBoundary.test.ts`, whose `KATEX_IN_EAGER_CLIENT_GRAPH` map is now
> empty.

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
  selector overrides found. *(The line count is from this run and has since
  grown substantially, because a later design-system sprint added the type,
  tracking, container and rhythm token scales. The zero-`backdrop-filter`
  property still holds, re-checked 2026-08-29; the built size has not been
  re-measured here.)*
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

> **Status of this list, re-checked against the code 2026-08-29** (code
> inspection only, with no numbers re-measured, so nothing below contradicts
> any measurement in §B, §H or §I):
>
> 1. **`ReadingProgressBar.tsx`: resolved.** It now drives off
>    `useScrollSubscription` rather than a private `scroll`/`resize` pair,
>    and computes `top - scrollY` instead of calling
>    `getBoundingClientRect()` per frame. It still re-measures on `resize`,
>    which is the correct remaining listener rather than the duplicate one
>    the finding named.
> 2. **`Hero.tsx` bundle: addressed in §H**, which measured what was
>    actually in the chunk rather than inferring it, and shipped the
>    `DailyPuzzle` client/server split. See §H.1–§H.3 and §I for the numbers;
>    they are not restated here.
> 3. **`TableOfContents.tsx`: resolved.** One `IntersectionObserver`, not
>    two.
> 4. **Static-generation timeouts: superseded, not fixed as written.** The
>    suggested levers (`staticGenerationMaxConcurrency`,
>    `staticGenerationRetryCount`) are not set in `next.config.ts`. What
>    happened instead is a much larger build-memory effort against a
>    different root cause (the corpus being held in memory per worker), and
>    that work is documented in [`DEPLOYMENT.md`](DEPLOYMENT.md) and
>    `ARCHITECTURE.md` §5, not here. `next.config.ts` now carries
>    `enablePrerenderSourceMaps: false` and
>    `experimental.turbopackRustReactCompiler` for the same campaign. Read
>    `DEPLOYMENT.md` before touching build concurrency.

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

---

## J. End-of-sprint build & performance audit (2026-08-29, measured)

Run against the tree as it stood at the close of the ~20-agent sprint, with
other agents still writing under `src/components/**` and `src/content/**`.
Everything below is measured on this machine (Node 24.19.0, 7 static-generation
workers) unless a line says otherwise. **Result: green.** Two builds, exit 0,
821/821 routes; 100 test files / 1504 tests passing; every budget in the repo
still under its ceiling.

*Provenance:* the tree kept moving throughout — 113 files under `src/` were
written between the cold build's `prebuild` and the end of this audit,
`lib/content/curriculum.ts` among them. Every budget in §J.4 was re-measured
after the last of those writes and came back byte-identical, so the numbers
below describe the tree as it stands, not a snapshot that has since drifted.

### J.1 — Build, cold and warm

Cold = `.next` deleted entirely first. Warm = immediately after, reusing
`.next/cache/turbopack`. Peak memory is the summed working set of every `node`
process, sampled at 700 ms — an over-estimate, since shared pages are counted
once per worker.

| Phase | Cold | Warm | §I / earlier-sprint baseline (cold) |
| --- | --- | --- | --- |
| `prebuild` generate (3 scripts) | ~4s | ~4s | — |
| Compile (Turbopack) | **27.6s** | **9.4s** | 31.6s |
| TypeScript | **13.8s** | **8.0s** | 13.9s |
| Static generation (821 pages) | **44s** | **54s** | 36.7s |
| Wall clock, `npm run build` | **113.2s** | **114.5s** | — |
| Peak node RSS (all workers) | **3451 MB** | 2911 MB | ~3.1 GB (architecture note) |
| Peak node RSS (single worker) | 1936 MB | 971 MB | — |
| `.next/cache` after | **213.3 MB** | — | 210 MB |
| `.next` total | 771.7 MB | — | — |

No errors, no warnings, and — unlike the §A run — **no 60-second prerender
retries at all**. The `Failed to build … (attempt 1 of 3)` contention §A
recorded did not reproduce on either build.

Route count is exactly right: `prerender-manifest.json` lists **821** routes —
219 lessons, 547 problems, 32 courses, 23 other. 815 of them emit an `.html`
file; the remaining six are the non-HTML routes (`robots.txt`, `sitemap.xml`,
`manifest.webmanifest`, `favicon.ico`, `opengraph-image`, `apple-icon`).

Two things worth noting rather than acting on. Warm builds save 18.2s in
compile and 5.8s in TypeScript and give it all back in static generation
(+10s), which is re-run in full every time and is the phase that dominates:
wall clock is within 1.3s across the two. And static generation is the noisy
phase — 44s vs 36.7s vs 54s across three runs of the same corpus is machine
load, not a regression in any one concern.

### J.2 — The build-memory invariants, re-verified

All four hold. Checked, not assumed:

1. **Generated registries are never executed at build time.** All three
   (`lessonMeta.generated.ts`, `problemMeta.generated.ts`,
   `registry.generated.ts`) are produced by `scripts/lib/extract.mjs`, which
   brace-scans the source text and evaluates *only the extracted literal*
   (`new Function('"use strict"; return (' + literal + ');')`, extract.mjs:270)
   — never the surrounding module. The two meta registries import nothing but
   a type.
2. **Nothing imports the whole corpus.** The only `import()` of a compiled
   `.mdx` module in the entire tree is the pair inside `loadLesson()`
   (`src/lib/content/lessons.ts:74,82`), reached only from
   `app/lessons/[...slug]/page.tsx`. Every other consumer —
   `getAllLessonsMeta()` in the root-layout `Footer`, 14 catalog pages, both
   problem routes — reads `LESSON_METAS`, a plain array.
3. **`rehypeKatexHtml.mjs` is still in the pipeline and still collapsing.**
   Wired in `next.config.ts` (absolute path) and in `vitest.config.mts`, so
   tests exercise the real pipeline. It still emits
   `{type: mdxJsx*Element, name: "KatexHtml", attributes: [html], children: []}`
   — one node, no descendants (rehypeKatexHtml.mjs:145–149). Measured directly
   by compiling three of the heaviest lessons through both pipelines:

   | Lesson | With `rehypeKatexHtml` | With plain `rehype-katex` |
   | --- | --- | --- |
   | `three-dimensional-scattering-and-the-s-matrix` | 210.8 KB, 194 JSX calls, 122 `<KatexHtml/>` | 655.7 KB, 4,843 JSX calls |
   | `quantum-signal-processing` | 447.4 KB, 547 JSX calls, 312 `<KatexHtml/>` | 1,455.3 KB, 10,777 JSX calls |
   | `hamiltonian-simulation-and-trotterization` | 432.4 KB, 443 JSX calls, 255 `<KatexHtml/>` | 1,361.4 KB, 10,063 JSX calls |
   | **Total** | **1,090.5 KB / 293 ms** | **3,472.4 KB / 761 ms** |

   **3.18× the compiled JS and 2.60× the compile time** if it were removed, on
   these three files. The lever is intact.
4. **`src/mdx-components.tsx` is under its ≤30 budget.** The count the test
   actually makes (`importedNames`, mdxMapping.test.ts:114) is **27 of 30** —
   25 component imports plus two erased type-only imports — for 26 mapped
   entries (25 imports + the local `Table`). **Headroom: 3 more import
   statements, or 5 more components.** Tighter than it reads, because the
   budget counts import statements and two of the 27 ship nothing.

### J.3 — What ships to the browser

Measured by parsing the emitted HTML of each route for `<script src>`,
`rel=preload as=script` and `modulepreload`, then gzipping the referenced files
at level 9. This is ground truth per route, not a manifest estimate — Next 16
no longer prints the size columns in the route table.

One correction the numbers need: the 110.0 KB / 38.6 KB gz polyfill chunk is
emitted with `noModule`, so **no modern browser downloads it**. Both figures
are given.

| Route | Files | Raw | First Load JS (gz) | …minus `noModule` polyfill | Route-owned (gz) | CSS (gz) |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 12 | 916.4 KB | 289.1 KB | **250.5 KB** | 123.4 KB | 26.0 KB |
| lesson (`/lessons/…/what-is-a-qubit`) | 14 | 925.2 KB | 292.7 KB | **254.1 KB** | 127.0 KB | 26.0 KB |
| problem (`/problems/…`) | 14 | 941.0 KB | 297.4 KB | **258.8 KB** | 131.7 KB | 26.0 KB |
| `/simulators` | 14 | 907.6 KB | 286.5 KB | **247.9 KB** | 120.8 KB | 26.0 KB |
| `/problems` (heaviest realistic) | 16 | 986.1 KB | 311.5 KB | **272.9 KB** | 145.8 KB | 26.0 KB |
| `/map` (lightest content route) | 13 | 905.7 KB | 285.5 KB | **246.9 KB** | 119.9 KB | 26.0 KB |
| mean, all 815 pages | — | — | 296.0 KB | **257.4 KB** | — | 26.0 KB |

The shared chunk — the five files present on literally every emitted page — is
**539.6 KB raw / 165.7 KB gz**, or **127.1 KB gz** discounting the `noModule`
polyfill:

| Chunk | Raw | gz | What it is |
| --- | --- | --- | --- |
| `354-*.js` | 228.9 KB | 71.5 KB | React + React DOM |
| `0gpuh00-*.js` | 158.0 KB | 42.9 KB | Next App Router client runtime |
| `0cz1d0mv5g_q7.js` | 110.0 KB | 38.6 KB | polyfills — **`noModule`, not fetched by modern browsers** |
| `3qq9fjtagffmo.js` | 32.1 KB | 8.6 KB | bootstrap |
| `turbopack-*.js` | 10.7 KB | 4.2 KB | chunk loader |

Spread across route shapes is small: 246.9 → 272.9 KB gz, a 26 KB band. There
is no outlier route.

**KaTeX has not crept back.** The runtime is exactly one chunk —
`2seuyohx86c8u.js`, 257.3 KB raw / **74.7 KB gz** — and it is referenced from
**0 of 815** emitted HTML files. It is reachable only as a lazily-loaded chunk
(`Promise.all(["…2seuyohx86c8u.js"].map(e.l))`) behind
`EquationReveal.tsx`'s `import("katex")` misuse-fallback. `KATEX_IN_EAGER_CLIENT_GRAPH`
in clientBoundary.test.ts is still `{}`, and the byte-parity suite
(`src/components/problems/__tests__/renderedMath.test.ts`, 4 assertions across
the whole 547-problem corpus against `MathText`, the pre-refactor
`ScrollableMathText`, and `KatexMath`) passes.

Nor has anything else crept back. Scanning all 65 emitted client JS files
(2,223.7 KB raw / 744.3 KB gz total) for corpus fingerprints:

| Fingerprint | Chunks |
| --- | --- |
| `meta:{slug` (serialized `Problem`) | **0** (0 occurrences) |
| `workedSolution` | **0** |
| `LESSON_METAS` / `PROBLEM_METAS` | **0** |
| glossary definitions | **0** |
| inlined search index | **0** |

### J.4 — Every budget in the repo, with its headroom

| Budget | Ceiling | Now | Headroom | Owner |
| --- | --- | --- | --- | --- |
| Client-reachable data total | 100 KB gz | **92.7 KB** (87 modules) | 7.3 KB (7.3%) | clientBoundary.test.ts |
| `lib/content/curriculum.ts` | 12 KB | **11.58 KB** | **0.42 KB (3.5%)** | clientBoundary.test.ts |
| `lib/content/concepts.ts` | 14 KB | 12.79 KB | 1.21 KB | clientBoundary.test.ts |
| `lib/content/currentQuantum/metaRegistry.ts` | 4 KB | 2.83 KB | 1.17 KB | clientBoundary.test.ts |
| `components/layout/problemPillarIndex.ts` | 9 KB | 7.08 KB | 1.92 KB | clientBoundary.test.ts |
| `lib/content/types.ts` | 1 KB | 0.43 KB | 0.57 KB | clientBoundary.test.ts |
| `lib/problems/types.ts` | 2 KB | 1.07 KB | 0.93 KB | clientBoundary.test.ts |
| `lib/content/progress` | 3 KB | 1.85 KB | 1.15 KB | clientBoundary.test.ts |
| `lib/problems/progress` | 3 KB | 2.17 KB | 0.83 KB | clientBoundary.test.ts |
| `search-index.json` raw | 560 KB | **539.8 KB** | **20.2 KB (3.6%)** | generate-search-index.mjs |
| `search-index.json` gzip | 140 KB | **135.6 KB** | **4.4 KB (3.2%)** | clientBoundary.test.ts |
| `mdx-components.tsx` imports | 30 | 27 | 3 | mdxMapping.test.ts |

The search index is 552,732 bytes across 1,090 entries (272 glossary terms,
219 lessons, 547 problems, plus courses/simulators/pillar links). **At the cap
the build fails, not the test suite**: `MAX_INDEX_BYTES` is asserted inside
`generate-search-index.mjs`, which runs as `prebuild`, so the generator throws
and `next build` never starts. That is the correct failure mode and it is
working; it is also the tightest ceiling in the repo in relative terms
alongside `curriculum.ts`.

Movement against the sprint baselines:

| | Baseline | Now | Δ |
| --- | --- | --- | --- |
| Client-boundary total | 90.1 KB / 85 modules | 92.7 KB / 87 modules | **+2.6 KB, +2 modules** |
| Tests | 1499 / 100 files | 1504 / 100 files | +5 tests, 0 failures |
| Cold-build cache | 210 MB | 213.3 MB | +3.3 MB |

+2.6 KB against 7.3 KB of remaining headroom is the number to watch: at this
sprint's rate, roughly three more sprints of this size consume the ceiling.

### J.5 — Fonts: the built output matches what `layout.tsx` claims

Verified against the emitted CSS and HTML, not the source comment.

- **Exactly two `rel=preload as=font` tags on every page**: Geist latin
  (23,108 B) and Geist Mono latin (29,288 B) = **51.2 KB**, against the
  comment's stated 52.4 KB. Fraunces is **not** preloaded.
- **Fraunces ships without SOFT/WONK.** Its latin subset is **67,388 B**,
  matching the documented "opsz + wght = 67.3 KB" row and ruling out the
  121.0 KB `opsz + SOFT + WONK + wght` file.
- **`adjustFontFallback` did emit the metric overrides**, so `preload: false`
  costs no layout shift. The built CSS contains, byte for byte, what the
  comment says it does:
  `@font-face{font-family:Fraunces Fallback;src:local(Times New Roman);ascent-override:84.71%;descent-override:22.09%;line-gap-override:0.0%;size-adjust:115.45%}`
  (plus `Geist Fallback` and `Geist Mono Fallback` against `local(Arial)`).
- 37 `@font-face` rules total, all three families at `font-display:swap`.

### J.6 — Runtime characteristics, read statically

**`QuantumField` — no layout read in the frame loop.** Confirmed by reading
the whole effect. `getBoundingClientRect` appears exactly once, inside
`measureStops()` (QuantumField.tsx:218), which is called from `resize()`, from
the `ResizeObserver` on `document.documentElement`, and once at effect setup —
never from `paint()` or `loop()`. `paint()` reads only the precomputed `stops`
array, a `useRef` scroll position, and cached colors, so `journeyProgress()`
costs an array scan and no synchronous layout. The `ResizeObserver` cannot
loop, because `measureStops` writes nothing. It is also only constructed at all
when `stops.length > 1`. Data-saver (`connection.saveData`) returns before the
canvas context is even acquired; `prefersReducedMotion` paints exactly one
frame and starts no loop, with `frame.time`, `frame.scroll` and `frame.scrollY`
all pinned to 0.

**`[data-reveal]` has four escape hatches, all intact.** (1) the `<noscript>`
style block in `layout.tsx:152–154`; (2) the `prefers-reduced-motion` override
in globals.css §11 (line 1342); (3) the print override in §12 (line 1442);
(4) the `revealAfterMs = 2500` timer in `Reveal.tsx:148`. There is a fifth:
when `IntersectionObserver` is undefined, `observe()` calls its handler
synchronously so content reveals immediately, and the `released` flag added
for that path is what keeps it from throwing a TDZ `ReferenceError`. Nothing
here is broken.

**Lazy simulator boundaries: 22 wrappers, every one with an error boundary and
a skeleton, but the skeletons do not match the real components' heights.** All
22 `Lazy*` files import both `SimulatorErrorBoundary` and `SimulatorSkeleton`;
20 use `variant="standard"`, one `"hero"`, one `"heroWide"`. The shapes do not
match, and this is structural rather than marginal:

- The `standard` skeleton is a bare `.instrument` box at
  `aspect-[4/3] sm:aspect-[2/1]` — it models *only the stage*. The real
  component is `SimulatorInstrument` → `Instrument`, which adds a header row
  (`px-5 py-2.5` + `border-b`, ≈37 px), body padding (`sm:p-5`, 40 px), and an
  always-rendered `SimulatorFraming` block (`mt-6 pt-6` + a two-column
  "What this shows"/"What to watch for" grid + a "Try this" list — no
  `<details>`, never collapsed). Computing from the CSS at a 704 px column:
  the skeleton is 352 px tall, while the real component's *non-stage chrome
  alone* is ≈340 px before the canvas contributes a single pixel.
- The `hero` skeleton pins `aspect-square` inside `max-w-sm`, i.e. 384 px. The
  real `BlochSphereHeroExplorer` shares the wrapper classes exactly but is
  content-sized: a square `max-w-xs` canvas (≈318 px) plus a `min-h-[2.5rem]`
  narration line, a wrapping gate-button row (`min-h-11`), a bordered rotate
  hint and a link, inside `sm:p-8` — ≈600 px.
- `heroWide` pins `aspect-[16/10]`; `WavefunctionHeroExplorer` is an eyebrow,
  an `sm:text-3xl` h2, a `min-h-11` preset row and a simulation block, and
  carries no `shadow-sm` where the skeleton does.

This matters more than "it's below the fold", because `useDeferredMount`'s
first trigger is **idle-after-paint with `idleTimeoutMs = 1200`**, independent
of visibility — every gated simulator on a page swaps within ~1.2 s of paint,
not when scrolled to.

*Caveat on the pixel figures:* no browser was available in this environment
(the Chrome extension is not connected), so the heights above are computed
from the CSS with stated assumptions, not measured. The **structural**
claim — that the skeleton models the stage box only, while the real component
adds an instrument header, body padding and an always-visible framing
block — is certain from reading both files, and is the part that needs
fixing. Whoever owns the simulator shell should measure the two in a browser
and either give the skeleton the same chrome or drop the fixed aspect ratio
for a `min-height` taken from the real component.

### J.7 — The largest thing left, and it is not a regression

`2q4cp180nuxzo.js` — **232.2 KB raw / 72.5 KB gz** — is an eager
`<script async>` on **814 of 815** pages (all but `_global-error`), and is the
single largest chunk any visitor actually downloads. Probing it for strings, it
carries the MDX-mapped client visualization components (`StaticCircuitDiagram`,
`BarChartExplorer`, `MatrixGridExplorer`, `InteractiveSection`,
`EquationReveal` — it is the module that holds the dynamic edge to the KaTeX
chunk), alongside `SimulatorSkeleton`/`SimulatorErrorBoundary`, the field
regimes, the search UI, and the `lib/quantum` `Complex` kernel.

The policy comment in `src/mdx-components.tsx` says every mapped component
lands in "every lesson page's client bundle". The built output says the blast
radius is wider than that: it lands on **every route**, including `/problems`
and `/map`, which never render a lesson. Lesson-specific code is a separate
7.0 KB chunk, so the visualization set is genuinely in the universal one.

No prior per-route number exists in this document, so **this is not
attributable to the sprint** — it is recorded here as the standing largest
lever, with a number, for whoever owns the MDX mapping. Splitting it would take
roughly 72 KB gz off `/problems`, `/map`, `/glossary` and the other non-lesson
routes.

### J.8 — Test state

`npx vitest run`: **100 test files, 1504 tests, all passing**, exit 0, 76.88 s.
No failures, no skips, nothing flaky, and nothing that looked like another
agent mid-write. Against the 1499/100 baseline: +5 tests, same file count.

---

## K. Second verification pass, same day, later tree (2026-08-29, measured)

A re-run of §J's checks several hours later, against a tree that had moved
underneath it: **556 problems (was 547), 830 routes (was 821), 1,042
uncommitted files**, and roughly a dozen agents still writing. Run on the same
workstation, but **not under the same conditions**: a second agent's
`next build` and `vitest run` were in flight when this pass began, the `next
dev` server held 0.8–1.9 GB throughout, and the machine was contended for the
whole window. **Wall-clock numbers here are therefore not comparable with
§J's**; the memory and byte numbers are, and those are the ones this section is
for.

**Result: green, after two real breaks were found and fixed** (§K.2). Every
budget still under its ceiling. Peak build memory *fell* against §J.

*Method note, because it differs from §J's and matters for reproducing it:*
Next 16 gives `next dev` its own tree (`.next/dev`), so "cold" here means
deleting `.next/{cache,build,static,server,types,trace,trace-build,diagnostics,turbopack}`
and the root manifests while leaving `.next/dev` alone — the running dev server
was never disturbed. Peak memory is the summed working set of **build-owned
processes only** (the `next build` process, its Turbopack loader pool under
`.next/build`, and the `jest-worker` children), matched by command line so the
dev server and its own pool are excluded, sampled every 700 ms.

### K.1 — Build, cold and warm

| Phase | Cold | Warm | §J (cold) |
| --- | --- | --- | --- |
| Compile (Turbopack) | 96s | 35.2s | 27.6s |
| TypeScript | 34.4s | 20.5s | 13.8s |
| Static generation | **74s (830/830)** | 91s (830/830) | 44s (821/821) |
| Wall clock, `npm run build` | 284.8s | 234.7s | 113.2s |
| **Peak node RSS (build-owned)** | **2875 MB** | **2237 MB** | 3451 MB |
| Peak occurred at | t=55s (compile) | t=164s (static gen) | — |
| `.next/cache` after | — | **272.1 MB** (43 files) | 213.3 MB |
| `.next` total, excluding `.next/dev` | — | 838.5 MB | 771.7 MB |

Both builds exited 0 with no warnings and **no 60-second prerender retries**. A
third, confirmation build was run after the two fixes in §K.2 landed: green as
well — exit 0, 830/830, compile 53s, TypeScript 36.9s, static generation 68s,
wall 324.3s, **peak 2544 MB**. Three peaks on the same corpus within one
evening: **2875 / 2237 / 2544 MB**.

The number that matters for Vercel is the peak, and it moved the right way:
**2875 MB cold against §J's 3451 MB**, on a corpus that has grown by 9 problems
and 9 routes since. That is 36% of the 8 GB container, and further from the
4 GB line than §J was. Nothing in this pass moves the build toward the ceiling.
Read the three-way spread (2875 / 3451 / ~3100 in DEPLOYMENT.md) as the
measurement noise band of a contended workstation, not as a trend.

The wall-clock inflation is contention, and it is visible in a phase Next does
not time: the three `prebuild` generators took ~13s in the cold run and ~56s in
the warm one, against ~4s in §J. Compile and TypeScript inflated by roughly the
same factor. Static generation is the one phase that did **not** inflate (74s
for 830 pages, against 44s for 821), which is consistent with it being the
phase that saturates all 7 workers either way.

`.next/cache` at 272.1 MB is up 58.8 MB on §J. Still far under the 1 GB
build-cache cap DEPLOYMENT.md records for Vercel's Standard tier, but it is
growing with the corpus and is worth a number in the next audit.

### K.2 — Two build breaks found by this pass

Both were live in the tree, both would have failed a Vercel build, and neither
was visible to `tsc` or the test suite at the moment it appeared.

1. **`src/components/simulators/qaoa-explorer/QAOAExplorer.tsx` — JSX comment
   in expression position.** A `{/* … */}` block was placed directly inside
   `tryThis={ … }`. Inside a JSX *attribute expression* that is not a comment:
   it parses as an empty object literal, and the parser then reads the
   following `<ul>` children as JavaScript, failing at the first keyword in the
   prose (`Expected '</', got 'switch'`). The cold build at the start of this
   pass compiled fine; the next two builds both failed here. Fixed — the
   comment now sits in JSX *children* position above `<SimulatorFraming>`,
   where `{/* … */}` is valid. Worth knowing generally: a JSX comment is only a
   comment where JSX children are expected.
2. **`src/lib/problems/validators/numeric.ts` — orphaned statement fragment.**
   The module ended correctly at `parseNumericSubmission`, then carried ~82
   blank CRLF lines and a dangling `    .replace(/[s_]/g, "");` — a partially
   applied edit. `tsc` reported `TS1128` at 173:5. The live copy of that
   `.replace` (with the correct `[\s_]`) is still on line 83 inside the
   function, so the trailing fragment was dead text; it was truncated away.
   This one appeared *after* both measured builds, which is why they were
   green and the next build would not have been.

### K.3 — The four build-memory invariants, re-verified

All four still hold.

1. **Registries by text extraction, never execution.** `extract.mjs`'s
   `extractObjectLiteral` still brace-scans and evaluates only the extracted
   literal (`new Function('"use strict"; return (' + literal + ');')`,
   extract.mjs:270). The generators `import()` nothing from `src/content/**`;
   the only `await import()`s in `generate-search-index.mjs` are three plain
   data/utility modules (`curriculum.ts`, `glossary.ts`, `lib/search/index.ts`).
   Output sizes: `lessonMeta.generated.ts` 297 KB, `problemMeta.generated.ts`
   289 KB, `registry.generated.ts` 95 KB, all plain data plus type imports.
2. **Nothing imports the corpus.** A repo-wide scan finds **zero** static
   imports of a `.mdx` file and exactly **two** dynamic ones — the pair inside
   `loadLesson()` (`lib/content/lessons.ts:74,82`), reached only from
   `app/lessons/[...slug]/page.tsx:47`. Every other consumer reads
   `LESSON_METAS`.
3. **`rehypeKatexHtml.mjs` is wired into both configs and still collapsing.**
   `next.config.ts` (absolute path) and `vitest.config.mts` both load it, and
   `renderNode` still returns `children: []` on a single
   `mdxJsxFlowElement`/`mdxJsxTextElement` named `KatexHtml`
   (rehypeKatexHtml.mjs:141–149). The display-math tabindex guard that throws
   if KaTeX's wrapper markup ever changes is intact.
4. **`src/mdx-components.tsx`: 27 of 30.** Unchanged from §J — 25 component
   imports plus 2 erased type-only imports, mapping 26 entries (the 25 plus the
   local `Table`). Headroom: 3 import statements.

### K.4 — What ships to the browser (measured from the emitted HTML)

Same method as §J.3: parse every emitted page for `<script src>` /
`rel=preload as=script` / `modulepreload`, gzip the referenced files at level 9.
**824 HTML files** for 830 routes (six routes are non-HTML). The polyfill chunk
still carries `noModule`, so both figures are given.

| Route | Files | Raw | First Load JS (gz) | …minus `noModule` polyfill | CSS (gz) |
| --- | --- | --- | --- | --- | --- |
| `/` | 12 | 923.4 KB | 290.7 KB | **252.1 KB** | 26.2 KB |
| lesson (`what-is-a-qubit`) | 14 | 932.2 KB | 294.3 KB | **255.7 KB** | 26.2 KB |
| problem | 15 | 951.1 KB | 300.8 KB | **262.2 KB** | 26.2 KB |
| `/simulators` | 14 | 914.2 KB | 288.0 KB | **249.4 KB** | 26.2 KB |
| `/problems` (heaviest) | 16 | 993.9 KB | 313.2 KB | **274.7 KB** | 26.2 KB |
| `/map` (lightest) | 13 | 912.4 KB | 287.0 KB | **248.5 KB** | 26.2 KB |
| mean, all 824 pages | — | — | 298.9 KB | **260.3 KB** | 26.2 KB |

Against §J: every route is up 1.6–2.9 KB gz, the mean by 2.9 KB. The band
between lightest and heaviest route is 26.2 KB, unchanged in shape.

Shared chunk (present on all 824 pages): **539.6 KB raw / 165.7 KB gz**, or
**127.1 KB gz** discounting the polyfill — byte-identical to §J.

| Chunk | Raw | gz | What it is |
| --- | --- | --- | --- |
| `354-n7p7labpn.js` | 228.9 KB | 71.5 KB | React + React DOM |
| `0gpuh00-wx325.js` | 158.0 KB | 42.9 KB | Next App Router client runtime |
| `0cz1d0mv5g_q7.js` | 110.0 KB | 38.6 KB | polyfills — **`noModule`** |
| `3qq9fjtagffmo.js` | 32.1 KB | 8.6 KB | bootstrap |
| `turbopack-10vv8jq72z_pd.js` | 10.7 KB | 4.2 KB | chunk loader |

All emitted client JS: **66 files, 2220.0 KB raw / 743.8 KB gz**.

**KaTeX is still out of every eager graph**, verified against the built output
rather than the imports: the runtime is one chunk (`2seuyohx86c8u.js`, 257.3 KB
raw / **74.7 KB gz**) and it is referenced by **0 of 824** emitted HTML files —
not as a script, not as a preload, not anywhere in the markup. The only edge to
it is the string reference inside the universal chunk, i.e.
`EquationReveal`'s `import("katex")` fallback. The source-graph check agrees:
no route entry's eager client graph reaches `katex`, and
`KATEX_IN_EAGER_CLIENT_GRAPH` is still `{}`. The third copy of the KaTeX call
(`components/problems/renderProblemMath.ts`) still passes its byte-parity suite
against `MathText`/`KatexMath` — `renderedMath.test.ts` is green in the full
run below.

Corpus fingerprints in shipped JS, unchanged from §J: `meta:{slug` **0**,
`workedSolution` **0**, `LESSON_METAS` **0**, `PROBLEM_METAS` **0**.

### K.5 — Every budget, with its ceiling and headroom

| Budget | Ceiling | Now | Headroom | §J |
| --- | --- | --- | --- | --- |
| Client-reachable data total | 100 KB gz | **96.99 KB** (89 modules) | **3.01 KB (3.0%)** | 92.7 KB / 87 |
| `lib/content/curriculum.ts` | 12 KB | **11.77 KB** | **0.23 KB (1.9%)** | 11.58 KB |
| `lib/content/concepts.ts` | 14 KB | 13.13 KB | 0.87 KB | 12.79 KB |
| `lib/content/currentQuantum/metaRegistry.ts` | 4 KB | 2.83 KB | 1.17 KB | 2.83 KB |
| `components/layout/problemPillarIndex.ts` | 9 KB | 7.22 KB | 1.78 KB | 7.08 KB |
| `lib/content/types.ts` | 1 KB | 0.43 KB | 0.57 KB | 0.43 KB |
| `lib/problems/types.ts` | 2 KB | 1.12 KB | 0.88 KB | 1.07 KB |
| `lib/content/progress` | 3 KB | 2.03 KB | 0.97 KB | 1.85 KB |
| `lib/problems/progress` | 3 KB | 2.40 KB | 0.60 KB | 2.17 KB |
| `search-index.json` raw | 560 KB | **533.71 KB** | 26.29 KB | 539.8 KB |
| `search-index.json` gzip | 145 KB | **138.85 KB** | 6.15 KB | 135.6 KB (ceiling was 140) |
| `mdx-components.tsx` imports | 30 | 27 | 3 | 27 |

Two things to say plainly about this table.

**The client-boundary total is the budget under pressure.** 92.7 → 96.99 KB
between §J and here, in a few hours, leaving 3.01 KB. It was measured three
times during this pass — 96.05, 96.40, 96.99 — so it is still moving while
this is being written. Nothing in it is waste: against `HEAD`, the growth is
`lib/problems/validators/conceptual.ts` +1.87 KB, `lib/content/concepts.ts`
+0.66, the new `components/pillar/tiers.ts` +0.65, `lib/content/curriculum.ts`
+0.48, `lib/problems/validators/numeric.ts` +0.26, the two `progress`
localStorage stores +0.40 together, and the new `lib/entryBar.ts` +0.18. Each
is a real feature. But the ceiling is 100 and the tree is at 96.99, so the next
agent to add a 3 KB client-reachable data module fails the suite. The lever if
that happens is not raising the number: it is the split `currentQuantum` already
demonstrated — the link-shaped fields in a meta module the client imports, the
prose in a module marked `SERVER_ONLY`.

**`curriculum.ts` is the tightest single budget in the repo** at 11.77 / 12 KB
(0.23 KB, ~2%). It is not over. It is one paragraph of new course data away
from being over.

The search index is **533.71 KB of its 560 KB hard cap** and **138.85 KB of its
145 KB gzip ceiling** (that ceiling was raised 140 → 145 earlier the same day,
recorded in `clientBoundary.test.ts`, with `LESSON_KEYWORD_BUDGET` pulled
600 → 540 first). The raw cap is asserted inside `generate-search-index.mjs`,
which runs as `prebuild` — so hitting it **fails the build**, not the test
suite, which is the correct failure mode and it is working (the generator
prints `533.7KB of 560KB` on every run). `LESSON_KEYWORD_BUDGET` is at its
recall floor and cannot absorb more: 520 breaks the `RECOVERY_QUERIES` test
pinning "factorial" to the lesson that teaches it. So the next lever, if the
index keeps growing, is **not** the keyword cap and **not** the ceiling — it is
the index's shape: the glossary rows carry whole definitions so a term is
findable by what it says, and those are the largest per-entry payload in the
file. Truncating a definition to its first sentence in the index (not on the
page) is the cheapest byte left that costs no recall on the term itself.

### K.6 — Runtime, re-read against the current files

- **`QuantumField` reads no layout in the frame loop.**
  `getBoundingClientRect` appears exactly once, in `measureStops()`
  (QuantumField.tsx:219), called from effect setup, from `onResize`, and from a
  `ResizeObserver` on `document.documentElement` that is only constructed when
  `stops.length > 1`. `paint()` reads the precomputed `stops` array, a ref, and
  cached colors. `getComputedStyle` (`readColors`) is called on setup, on
  resize and on a theme change, never per frame. Data-saver returns before the
  canvas context is acquired. One correction to the brief this was checked
  against: under `prefers-reduced-motion` the component paints **one static
  frame** and starts no loop, rather than drawing nothing — that is deliberate
  and documented in the file ("a still image of the physics is informative",
  with `frame.time`/`scroll`/`scrollY` pinned to 0). One paint, no rAF, no
  scroll listener.
- **`[data-reveal]`: all four escape hatches intact.** `<noscript><style>` in
  `layout.tsx:174–176`; the reduced-motion override in globals.css §11
  (line 1348); the print override in §12 (line 1448); `revealAfterMs = 2500`
  in `Reveal.tsx:126,148`. The synchronous-`observe` path for a missing
  `IntersectionObserver` is still guarded by the `released` flag.
- **Simulator skeleton arithmetic still matches.** Re-derived after this
  sprint's edits to `ui/Panel.tsx` (+47 lines) and `shared/SimulatorInstrument.tsx`:
  Panel's changes are `aria`/`role` only (a `nameableRole` helper), and the
  Instrument diff is comment punctuation, so no spacing class moved. The three
  variants' inputs all still hold — Panel `px-4 py-2.5` label strip, `p-4
  sm:p-5` body, `py-2.5 text-xs` footnote; `Framing` `mt-6 border-t pt-6`,
  `grid gap-5 sm:grid-cols-2`, `mt-5`; the Bloch hero's `max-w-xs` square
  canvas, `min-h-[2.5rem]` narration, `mt-6 border-t pt-4` hint, `mt-3
  min-h-11` link; the wavefunction hero's 640×280 `viewBox` (WavefunctionCanvas
  `WIDTH`/`HEIGHT`) and `min-h-11` preset pills. **656 / 613 / 554 stand.**
- **Lazy boundaries: 23 `Lazy*` wrappers, 21 with both an error boundary and a
  skeleton.** Two exceptions, both outside the simulator set:
  `map/LazyConceptMapExplorer.tsx` has a height-matched `loading` placeholder
  but **no error boundary**, so a failed chunk fetch on `/map` has nothing to
  catch it; `problems/LazyCourseCheckpoint.tsx` has a skeleton (via
  `React.lazy` + Suspense) and no error boundary either. Neither is a
  regression from §J; both are recorded here with a number for their owners.
- **Figures: 142 total, all with reserved space.** 134 `<ExternalFigure>` and 8
  `<AnnotatedFigure>` across the lesson corpus; both components set
  `loading="lazy"` and `decoding="async"` on the `<img>`. All 8
  `AnnotatedFigure` call sites pass an explicit `aspect`, which is what holds
  their pins off the top edge before the image lands — the component's own
  comment claiming "all eight call sites pass `aspect`" is still true. None of
  the 134 `ExternalFigure` call sites passes one, which is *fine* rather than a
  finding: that component defaults to `aspect-video` + `object-contain`, so the
  box is reserved (no CLS) and a non-16:9 image letterboxes rather than
  stretching. The cost is whitespace, not layout shift.

### K.7 — The universal chunk, re-measured

§J.7's finding stands and has grown slightly. The largest chunk any visitor
downloads is now `2cbolnt3q4ca6.js` — **237.0 KB raw / 73.4 KB gz** (was
72.5 KB) — eager on **823 of 824** emitted pages. Probing its string literals
confirms the same contents: `SimulatorSkeleton` ("Initializing instrument") and
`SimulatorErrorBoundary` ("Fault: instrument offline"), the figure components'
class strings, `StaticCircuitDiagram`, the `lib/quantum` `Complex` kernel, and
the dynamic edge to the KaTeX chunk (the literal
`"static/chunks/2seuyohx86c8u.js"` lives here). Two more chunks ride along on
823/824 pages: the search overlay (`14751kuw3dvce.js`, 23.0 KB gz) and
`PredictBeforeReveal` + `ExternalFigure` (`0cspgt-olatkg.js`, 15.9 KB gz).

That is ~112 KB gz of lesson-shaped code on `/problems`, `/map` and every other
route that never renders a lesson. Still not attributable to any one sprint,
still the standing largest lever, and still owned by whoever owns the MDX
mapping rather than by a performance pass: the only way to split it is to make
the mapped components dynamic, which changes how lesson prose server-renders,
and that is a pedagogy decision before it is a byte one.

### K.8 — Test, typecheck and lint state

- `npx vitest run`: **100 files, 1513 tests, 1 failed**. The failure is
  `scripts/__tests__/crossGenerator.test.ts › every lesson registry entry still
  re-extracts to the same meta`, and it is **transient by construction**: it
  asserts `lessonMeta.generated.ts` matches the `.mdx` corpus, and other agents
  are editing lesson `description` fields continuously. Re-running
  `npm run generate` cleared the reported lesson (`cryogenic-systems`) and the
  next run failed on a *different* one (`interference-in-quantum-circuits`),
  which is the signature of a moving corpus rather than a defect. `npm test`
  cannot hit it — `pretest` regenerates first. Everything else passes,
  including `renderedMath.test.ts` (the KaTeX byte-parity suite),
  `clientBoundary.test.ts` and `mdxMapping.test.ts`.
- `npx tsc --noEmit`: **clean**, after the `numeric.ts` truncation in §K.2. It
  was the only error.
- `npx eslint`: **clean**, no errors or warnings.
