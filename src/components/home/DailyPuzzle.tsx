import { getAllProblems } from "@/lib/problems/registry";
import { DailyPuzzleClient, type DailyPuzzlePreview } from "./DailyPuzzleClient";

/**
 * "Problem of the Day": a deterministic, backend-free daily pick. Every
 * visitor on the same calendar date sees the same problem — the date
 * string is hashed to an index into the beginner/intermediate subset of the
 * problem list (see `pickToday` in DailyPuzzleClient), so there's no
 * server, no database, and no build-time computation involved.
 *
 * Server half only: builds a lean preview of every problem (slug, title,
 * prompt, difficulty, estimatedMinutes) and hands it to `DailyPuzzleClient`,
 * which does the actual date-hash pick. That split matters —
 * `getAllProblems()` returns the *full* `Problem` objects (hints, answer
 * key, worked solution steps, explanation — most of a problem's bytes), and
 * this runs entirely on the server, so none of that ships to the client.
 * The previous version of this component ran the whole thing — including
 * this data access — on the client (it has to, since picking "today"
 * without baking the build day into static HTML requires the real client
 * Date), which meant the *entire* 547-problem registry, hints and answers
 * included, rode along in the homepage's client JS just to preview one of
 * them. Confirmed via a direct read of the built chunk
 * (`.next/static/chunks/*.js` for `/`): this was the majority of the
 * homepage's outlier bundle size — see docs/PERF_AUDIT.md.
 *
 * Rendered as an instrument readout (today's puzzle *is* the day's
 * measurement) rather than a generic promo card, and embedded inside the
 * Software pillar's "prove what you understand" moment instead of standing
 * alone as its own homepage section.
 */
export function DailyPuzzle() {
  const previews: DailyPuzzlePreview[] = getAllProblems().map((problem) => ({
    slug: problem.meta.slug,
    title: problem.meta.title,
    prompt: problem.question.prompt,
    difficulty: problem.meta.difficulty,
    estimatedMinutes: problem.meta.estimatedMinutes,
  }));

  return <DailyPuzzleClient previews={previews} />;
}
