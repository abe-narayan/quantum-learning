/**
 * ============================================================
 * What this site assumes you already know
 * ============================================================
 * One claim, one string, every surface that makes it.
 *
 * Before this module existed the site stated its entry requirement in seven
 * places and in six mutually incompatible ways: "assumes you can rearrange an
 * equation" (the hero), "already have the linear algebra" (the homepage's
 * rigorous door), "assumes no math background" (/learn, Route A), "confident
 * high-school algebra" (/learn, Route B), "starts from nothing, no physics, no
 * linear algebra and no programming assumed" (the tier ladder, on six track
 * pages and thirty-two course pages), "algebra and some calculus" (/about),
 * and "advanced high-school and early-college students" (the footer). Two of
 * those were false. `Hero.tsx` even carried a comment explaining that "no math
 * background needed" had been rejected as untrue, and /learn, the very next
 * screen a reader sees, printed exactly that string.
 *
 * The hero's version was the accurate one, so it is the one that survived.
 *
 * Two forms, because the sentence has to work in two grammatical positions and
 * a caller inventing a third variant is how this drifted the first time:
 *
 *   `ENTRY_BAR`        stands alone as a paragraph or a blurb.
 *   `ENTRY_BAR_SHORT`  a card's footnote, where the surrounding label has
 *                      already established the subject.
 *
 * Trigonometry and calculus were both absent from the claim, and both were
 * wrong to omit. The argument being overturned here, in this comment's own
 * previous wording, was that calculus "belongs on /about, which has the room
 * to make it, rather than smuggled into a one-line entry requirement where it
 * would read as a gate on the first lesson." That reasoning treats the bar as
 * a marketing line whose cost is measured in conversions. It is not one. For
 * a self-directed product with no teacher, this sentence is the contract a
 * reader uses to decide whether to spend the next five and a half hours, and
 * a contract that is false by the second lesson costs more trust than a
 * longer sentence ever cost a signup.
 *
 * Both omissions were measured, not suspected:
 *
 *   Trigonometry. Both roots need it by their *second* lesson, not their
 *   fifth. `complex-numbers-for-quantum-mechanics.mdx` (Qubits, lesson 2)
 *   runs on polar form, radians and the power series for sin and cos;
 *   `the-bloch-sphere.mdx` (lesson 5) needs cos²A − sin²A = cos 2A. The
 *   rigorous root says so itself: `complex-numbers-for-physics.mdx` states
 *   "Algebra, plus trigonometry in radians: sin, cos, and the unit circle."
 *   No lesson in the corpus teaches trigonometry, so the old bar promised a
 *   tool the site never supplies and then used it on page two.
 *
 *   Calculus. `mathematical-foundations-challenge.mdx` already prints the
 *   honest version at the *end* of the 5.5-hour first course: "From From
 *   Classical to Quantum onward, single-variable calculus is assumed rather
 *   than taught, and there is no calculus lesson elsewhere in this
 *   curriculum to send you to." A reader who needs that fact needs it before
 *   the five hours, not after them. It is scoped to the physics track on
 *   purpose: the Computing pillar is calculus-free end to end (five stray
 *   occurrences of `\int`/`\partial`/"derivative" across all 62 of its
 *   lessons, none of them load-bearing), so "calculus everywhere" would be
 *   the opposite error.
 *
 * What did *not* change is the reassuring half, because it is the true half:
 * no physics, no linear algebra and no programming are assumed anywhere. The
 * bar is longer by one clause and one sentence, and every clause in it now
 * survives contact with lesson 2.
 */

/**
 * ------------------------------------------------------------
 * The claim's three moving parts
 * ------------------------------------------------------------
 * Both long forms below are assembled from these, and so is any page that has
 * to fold the bar into a sentence of its own (`/learn`'s lede is the one such
 * caller today). That is the half of the consolidation the first pass did not
 * finish: the two exported sentences agreed with each other, but a page
 * wanting the claim *inside* a clause had no option but to retype it, and
 * `/learn` did, as "start from school algebra and assume no physics" — true,
 * and quietly missing the trigonometry clause that had just been added
 * because it is load-bearing by lesson two.
 *
 * Lowercase noun phrases, because that is the form a clause needs; `opening()`
 * supplies the sentence-initial variant. A caller that needs the whole claim
 * still takes `ENTRY_BAR` or `ENTRY_BAR_SHORT` — these three exist so that a
 * caller with a genuinely different grammatical need composes from the same
 * words instead of inventing a seventh wording.
 *
 * `entryBar.test.ts` asserts every fragment appears in both long forms, so the
 * fragments cannot drift away from the sentences they build.
 */

/** The mathematics a reader has to bring. */
export const ENTRY_BAR_MATH = "school algebra and trigonometry";

/** Where calculus starts being assumed. Scoped to the physics track on purpose;
 *  the Computing pillar is calculus-free end to end (see the note above). */
export const ENTRY_BAR_CALCULUS_SCOPE = "from the second physics course on";

/** What is assumed nowhere on the site. */
export const ENTRY_BAR_NOT_ASSUMED = "no physics, no linear algebra and no programming";

/** Sentence-initial form of one of the lowercase phrases above. */
function opening(phrase: string): string {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/** The whole claim, as its own three sentences. */
export const ENTRY_BAR = `${opening(ENTRY_BAR_MATH)} are the entry bar: if you can rearrange an equation and read sine and cosine in radians, you can start. Single-variable calculus is assumed ${ENTRY_BAR_CALCULUS_SCOPE}, and no lesson here teaches it. ${opening(ENTRY_BAR_NOT_ASSUMED)} assumed.`;

/** The same claim where a label above it already says what is being described. */
export const ENTRY_BAR_SHORT = `Assumes ${ENTRY_BAR_MATH} in radians, plus single-variable calculus ${ENTRY_BAR_CALCULUS_SCOPE}. ${opening(ENTRY_BAR_NOT_ASSUMED)}.`;
