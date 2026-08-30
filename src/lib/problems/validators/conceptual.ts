import {
  conceptGroupPhrases,
  type ConceptGroup,
  type ConceptualAnswer,
  type Problem,
} from "../types";
import type { ValidationResult } from "./types";

/**
 * ============================================================================
 * THE CONCEPTUAL-ANSWER CONTRACT — read this before authoring a problem
 * ============================================================================
 *
 * A conceptual problem is graded by deterministic phrase matching. The
 * submission is never executed, never sent anywhere, and never interpreted:
 * it is lowercased, normalized, and compared against the phrase lists you
 * author. That is a blunt instrument, so the contract below exists to stop it
 * from being a *fooled* one. Every rule here is enforced by a test in
 * `src/lib/problems/__tests__/` — nothing on this page is advice.
 *
 * ---------------------------------------------------------------------------
 * 1. WHAT YOU AUTHOR
 * ---------------------------------------------------------------------------
 * `requiredConceptGroups` is a list of ideas. One group = one idea. A
 * submission is `correct` only if it matches at least one phrase from EVERY
 * group (AND across groups, OR within a group). Within a group, list the
 * synonyms and the wordings a real student would type, not just the textbook
 * one. Across groups, the ideas must be genuinely different: if an answer that
 * satisfies group A also satisfies group B, you have an N-idea problem that
 * grades like an (N−1)-idea one, and the lint will say so.
 *
 * Aim for two or more groups. A single-group conceptual problem is a keyword
 * search with a text box in front of it.
 *
 * ---------------------------------------------------------------------------
 * 2. HOW A PHRASE MATCHES
 * ---------------------------------------------------------------------------
 * `normalize()` lowercases, expands contractions ("doesn't" -> "does not",
 * "can't" -> "can not"), replaces everything outside `[a-z0-9 ]` with a space,
 * and collapses whitespace. Then, in order:
 *
 *   a. NOTATION phrases — those containing a character outside `[a-z0-9 ]`
 *      ("|+⟩", "1/sqrt(2)", "non-zero", "ρ") — are first tried as a raw
 *      case-insensitive substring of the untouched submission. This is the
 *      only way a glyph can be tested, and it is why notation phrases are also
 *      the only ones that need the `anchors` declaration (see §5).
 *   b. SHORT phrases — whose normalized form is a single token of fewer than
 *      four characters ("qft", "psd", "110", "xor") — must match a WHOLE
 *      token. They are never prefix-matched. This is what stops "tr" from
 *      being found inside "matrices" and "p" inside "preserves".
 *   c. Everything else matches as an in-order token subsequence with prefix
 *      and light-stem tolerance: "inner product preserv" is satisfied by
 *      "inner products are preserved". A phrase token matches a submission
 *      token only at the START of that token, so "symmetrize" is NOT found
 *      inside "antisymmetrize" and "correct" is NOT found inside "incorrect".
 *      Stems are compared for EQUALITY, never as prefixes: the stemmer strips
 *      a trailing "e", so a stem prefix let "prove" reach "provided" and
 *      "state" reach "stationary" and "statistics". Tokens may be separated by
 *      up to MAX_TOKEN_GAP other tokens.
 *
 *      What this still does NOT bound is the raw prefix in (c): a four-letter
 *      phrase reaches any longer word beginning with it, so "spin" finds
 *      "spinor" and "state" finds "statement". Capping the tail was measured
 *      and rejected, because the cap that stops "state" reaching "statement"
 *      is the same cap that stops "measure" reaching "measurement", and a
 *      short stem is exactly how an author asks for the second.
 *
 * ---------------------------------------------------------------------------
 * 3. NEGATION — TWO SCOPES
 * ---------------------------------------------------------------------------
 * Negation in a student answer comes in two shapes and they need opposite
 * treatment. Handling only the first is what made this grader fully foolable:
 * measured over all 175 conceptual problems, prefixing a model answer with
 * "It is NOT true that" graded `correct` on 159 of them, one MORE than the
 * plain model answer.
 *
 * (a) LOCAL negation scopes a phrase inside the answer.
 *
 *     A match is DISCARDED when a negator ("not", "no", "never", "cannot",
 *     "without", "fails to", ...) sits within NEGATION_WINDOW meaningful
 *     tokens immediately before it. So a group holding "true" is not satisfied
 *     by "that is not true", and a group holding "conserves probability" is
 *     not satisfied by "does not conserve probability". Articles are stepped
 *     over without spending the window, so "not a proof" does not satisfy
 *     "proof" either.
 *
 *     Two things are exempt, and both are the author's own declaration:
 *
 *       - A phrase that CARRIES a negator is never suppressed. If the negative
 *         wording is also an acceptable answer, add it to the group as its own
 *         phrase ("not true", "no proof").
 *       - A negator the problem ASKED FOR does not suppress anything. If some
 *         group of the same problem is satisfied by a phrase containing that
 *         very negator, the negation is the point of the question, not a
 *         verdict flip: "this can't be separable" still satisfies a
 *         "separable" group when "cannot" is a required concept in its own
 *         right.
 *
 *     Local negation is checked only immediately before the match, so a "not"
 *     elsewhere in the same clause is irrelevant: "This is a product state,
 *     not a superposition" still matches "product state", and "the state is
 *     not separable" is still a correct answer about non-separability.
 *
 *     It applies to raw-notation matches too, which it did not until it was
 *     measured: a group spelled as a formula ("e^0", "K_0 = U", "l(l+1)=0")
 *     was the one place in the grader where "there is no <phrase>" satisfied
 *     the phrase. See `notationMatches`.
 *
 * (b) FRAMING negation scopes the whole assertion.
 *
 *     "It is not true that <correct physics>" contains the correct physics and
 *     asserts none of it. Neither does "The common myth is that ...", "People
 *     think that ...", "I used to think ..., but ...", or "<correct physics>.
 *     All of that is wrong." A one-token lookback cannot see any of these,
 *     because the negator is not next to the match; it is at the head of the
 *     clause, or in a clause of its own.
 *
 *     So the submission is cut into CLAUSES (at sentence punctuation and at
 *     contrast connectives) and each clause is asked whether it opens a frame:
 *
 *       - a falsity frame: a clause head carrying "false" / "myth" /
 *         "misconception" / "not true" / "not the case", followed by "that".
 *       - an attribution frame: an attribution verb ("think", "believed",
 *         "taught") with a DISTANCING subject or tense in front of it
 *         ("people think that ...", "I used to think ..."). Bare "I think the
 *         state is entangled" is an honest hedge, not a frame, and is left
 *         alone — the distancing marker is what separates the two.
 *       - a disowning adverb at the head of the clause ("supposedly ...",
 *         "allegedly ..."). Same job as an attribution frame with no verb to
 *         report it, which is why it went unnoticed: "Supposedly <model
 *         answer>" graded `correct` on 151 of 175 while every other framing
 *         above was down to 2. See DISOWNING_ADVERBS for why the list is four
 *         words and why "disagree" and "doubt" are not among them.
 *       - a bare repudiation clause: a clause made of nothing but pro-forms
 *         and a falsity word ("all of that is wrong", "that is not true").
 *         Having no content of its own, its only referent is what came
 *         before, so it suppresses everything BEFORE it. A repudiation that
 *         carries its own content ("the idea that you can factor it is
 *         wrong") is an assertion, not an eraser, and suppresses nothing.
 *
 *     An open frame runs to the end of its clause and stays open across
 *     sentence boundaries until a contrast connective closes it ("but",
 *     "however", "instead", "actually", "in fact", ...). That is what keeps
 *     "It is not true that the state is separable. In fact the amplitudes do
 *     not factor" correct while "It is not true that <model answer>" is not.
 *
 *     Because a frame is a judgement about a whole sentence and not about one
 *     phrase, an answer that WOULD have been correct but for a frame is graded
 *     `partial` with feedback that asks the student to state what is true,
 *     never `incorrect`. A student who really did mean it hears "say which
 *     part is true", not "you are wrong". See FRAMED_FEEDBACK.
 *
 * ---------------------------------------------------------------------------
 * 4. AN ANSWER HAS TO BE AN ANSWER, NOT A BAG OF ANCHOR PHRASES
 * ---------------------------------------------------------------------------
 * Lifting one phrase out of every group and joining them with spaces used to
 * score full marks on all 175 conceptual problems, sometimes in two words
 * ("rigorous numerical"). Nothing in the matcher noticed, because every group
 * was genuinely matched: the submission was made of nothing but the answer
 * key's own vocabulary.
 *
 * So `correct` additionally requires PREDICATION, measured structurally:
 *
 *   at least MIN_FREE_TOKENS token(s) of the submission must lie outside every
 *   authored phrase match, AND at least one of those free tokens must carry
 *   meaning of its own — it must not be an article, auxiliary, pro-form or
 *   discourse particle (`FUNCTION_TOKENS`). An answer has to contain something
 *   the phrase lists did not supply, and that something has to be a word about
 *   the physics rather than the grammar holding it together.
 *
 * The second half is not belt and braces; without it the rule was six
 * characters from useless. A salad has exactly 0 free tokens, but a salad plus
 * " so yes" has two, and that graded `correct` on 175 of 175 conceptual
 * problems — as did the same salad behind "well ", "the answer is " or
 * "basically the ". Requiring one free CONTENT token closes every one of those
 * (measured: 0 of 175 for each), and costs nothing: over all 532 authored
 * model answers and pinned `modelAnswers` in this corpus, plus the 16-entry
 * false-negative fixture and the reviewer's probes, not one submission has
 * zero free content tokens.
 *
 * Three stronger or cheaper rules were measured and rejected. Requiring free
 * tokens BETWEEN two groups' matches fails ordinary prose, where the phrases
 * of two ideas often abut ("unitary matrix"). Requiring a free copula or
 * connective rejects a legitimately symbolic answer
 * ("U(I/2)U^dagger = (1/2) U U^dagger = I/2"). And "the free tokens must not
 * all sit after the last match" costs nothing but buys almost nothing: it
 * stops a salad with filler appended and not the same filler in front.
 *
 * The rule is honest about its limit: it bounds the SHAPE "answer key
 * vocabulary plus grammar", not a determined adversary. Filler carrying a real
 * verb ("<salad> because that is what happens") still passes on all 175, and
 * deterministic keyword matching cannot tell that from prose. What it buys is
 * that the floor moved from "append any two words" to "append a word that
 * means something", and that no measured model answer, in the corpus or in the
 * false-negative fixture, pays for it.
 *
 * A submission that fails only this check grades `partial`, not `incorrect`:
 * a student who typed their notes instead of a sentence knows the answer.
 *
 * ---------------------------------------------------------------------------
 * 5. WHAT THE LINT REJECTS (see `conceptualLint.ts`)
 * ---------------------------------------------------------------------------
 *   - A phrase that normalizes to nothing ("⁴", "±", "π}", "ρ") unless it is
 *     declared in the group's `anchors` map with a reason. Declaring it says
 *     "the raw glyph is what I am testing"; leaving it undeclared usually
 *     means the phrase silently grades nothing.
 *   - A phrase whose meaning is destroyed by normalization: "-1", "≠1" and
 *     "p²" all collapse to a single one-or-two-character token that matches
 *     any answer containing that letter or digit. Spell it out ("minus one",
 *     "negative", "p squared") or declare it as an anchor.
 *   - A bare high-frequency English word ("probability", "definition",
 *     "exactly", "sum", "true", "correct", ...) used as a whole phrase. Such a
 *     group is free. Say what about the probability.
 *   - A phrase that, treated as a submission, would satisfy a DIFFERENT group
 *     of the same problem. That collision collapses N groups into N−1.
 *   - A duplicate phrase, inside a group or across groups.
 *   - A problem whose `question.prompt`, pasted verbatim, satisfies every
 *     group. The student must have to supply something the question did not.
 *
 * ---------------------------------------------------------------------------
 * 6. WHAT THE FEEDBACK MAY NOT CONTAIN
 * ---------------------------------------------------------------------------
 * `incorrectFeedback`, `partialFeedback`, every group's `missingFeedback`,
 * every hint, and the hints concatenated must each grade STRICTLY BELOW
 * `correct` against the problem's own groups. A student who gets it wrong is
 * handed that text; if pasting it back scores full marks, the teaching text is
 * an answer key. Write feedback that names the *shape* of what is missing
 * ("substitute a vanishing commutator and evaluate the right-hand side")
 * rather than the words that satisfy the groups.
 *
 * Belt and braces, in the grader itself: `validateConceptual` accepts an
 * optional `ConceptualContext` carrying the problem's teaching text, and a
 * submission that is mostly a verbatim run lifted from it can never grade
 * `correct` — see `ECHO_RUN_TOKENS` / `ECHO_COVERAGE`. `validateAnswer` in
 * `./index.ts` supplies that context automatically for every real problem, so
 * this holds at runtime even for a problem whose feedback has drifted.
 *
 * ---------------------------------------------------------------------------
 * 7. WHAT MUST STILL PASS
 * ---------------------------------------------------------------------------
 * The problem's own model answer — `solution.finalAnswer`, or
 * `explanation.correctIdea`, or the joined solution steps — must grade
 * `correct`. So must every entry in the optional `answer.modelAnswers` array,
 * which is where you pin the plain-English wording a beginner would type.
 * If your groups reject your own answer, the groups are wrong, not the answer.
 */

// ---------------------------------------------------------------------------
// Tunables. Each was chosen by measuring the whole conceptual corpus; the
// numbers next to them are what moved.
// ---------------------------------------------------------------------------

/** A phrase's normalized tokens may be separated by at most this many other
 *  tokens. Unbounded gaps let long prose satisfy a phrase by accident; a cap
 *  this loose costs no authored model answer in the corpus. */
const MAX_TOKEN_GAP = 20;

/** Normalized single-token phrases shorter than this must match a whole token
 *  rather than a token prefix. 4 covers every abbreviation the corpus uses
 *  ("qft", "psd", "lhv", "110") while leaving "preserv"-style stems alone. */
const MIN_PREFIX_PHRASE_LENGTH = 4;

/** How many tokens before a match are searched for a negator. 2 catches
 *  "not true", "does not conserve", "no such state"; 3+ starts swallowing
 *  legitimate answers of the form "cannot be written as a product state". */
const NEGATION_WINDOW = 1;

/** A verbatim run of this many normalized tokens shared with the problem's own
 *  teaching text is not something a student writes by coincidence. */
const ECHO_RUN_TOKENS = 10;

/** ...and it only counts as an echo if runs like that cover this much of the
 *  submission, so a student who quotes a hint and then reasons is not
 *  punished for the quote. */
const ECHO_COVERAGE = 0.6;

/** How many of a submission's tokens must lie outside every authored phrase
 *  match before it can grade `correct`. 1 is the smallest number that kills
 *  every keyword salad in the corpus (a salad is made only of authored
 *  phrases, so it has exactly 0), and it is what the measurement supports:
 *  raising it to 2 costs a genuine terse answer such as "inner products are
 *  preserved" against a group holding "inner product preserv", which leaves
 *  only "are" free. See §4. */
const MIN_FREE_TOKENS = 1;

/**
 * ...and at least this many of them must carry meaning of their own, rather
 * than being an article, auxiliary, pro-form or discourse particle
 * (`FUNCTION_TOKENS`).
 *
 * `MIN_FREE_TOKENS` alone was defeated by six characters: a salad plus " so
 * yes" graded `correct` on 175 of 175 conceptual problems, as did the same
 * salad behind "well ", "the answer is " or "basically the ", and as did a
 * longer tail of pure grammar. Requiring one free token that means something
 * closes every one of those, measured, at 0 of 175 each.
 *
 * It costs nothing: over every authored `solution.finalAnswer`,
 * `explanation.correctIdea`, joined solution steps and pinned `modelAnswers`
 * in this corpus — 532 submissions — plus the 16-entry false-negative fixture
 * and the reviewer's own probes, not one has zero free content tokens. Nor
 * could it easily: a group listing enough phrases to cover every content word
 * of a real answer is a group the cross-collision lint would already be
 * complaining about.
 *
 * A count rather than a ratio, because a ratio does not separate the two
 * populations: a padded salad's free ratio is around 0.6, squarely inside the
 * 0.29-to-0.96 range real answers occupy.
 */
const MIN_FREE_CONTENT_TOKENS = 1;

/** How far into a clause the framing head may reach. "the common misconception
 *  here is that" is seven tokens; nothing legitimate puts a falsity word this
 *  deep and then a complementizer. */
const FRAME_HEAD_TOKENS = 8;

/** Punctuation that ends a clause. The em dash is included because students use
 *  it exactly as a semicolon. */
const CLAUSE_BREAK_PUNCTUATION = /[.;:!?\n—]/;

/**
 * Connectives that start a new clause AND close any open negation frame. A
 * frame deliberately survives a full stop ("The myth is that A. And B." is all
 * myth), so this is the only thing that ends one: the student saying, in so
 * many words, "here comes what is actually true".
 */
const CONTRAST_MARKERS = new Set([
  "but",
  "however",
  "instead",
  "actually",
  "rather",
  "whereas",
  "nevertheless",
  "nonetheless",
  "conversely",
  "although",
  "though",
]);

/** "in fact", "in reality", "in truth" — the same reset, spelled as a bigram. */
const CONTRAST_BIGRAM_HEAD = "in";
const CONTRAST_BIGRAM_TAIL = new Set(["fact", "reality", "truth"]);

/**
 * Words that make a clause head declare the following claim false. Deliberately
 * narrower than the repudiation list below: "wrong", "mistake" and "incorrect"
 * are all words a *correct* answer uses ("the mistake is that people forget the
 * phase"), and they are safe only inside the contentless-clause test.
 */
const FALSITY_FRAME_WORDS = new Set([
  "false",
  "untrue",
  "myth",
  "myths",
  "misconception",
  "misconceptions",
  "fallacy",
  "nonsense",
]);

/** What a negator has to reach, in a clause head, to mean "the following is
 *  false": "not true", "not the case", "not correct", "no truth". */
const TRUTH_WORDS = new Set(["true", "case", "correct", "right", "accurate", "truth", "reality"]);

/** Falsity words admissible in a contentless repudiation clause, where the
 *  clause carrying nothing but pro-forms is what makes them unambiguous. */
const REPUDIATION_WORDS = new Set([
  ...FALSITY_FRAME_WORDS,
  "wrong",
  "incorrect",
  "mistaken",
  "bogus",
  "rubbish",
  "garbage",
  "bunk",
  "junk",
]);

/**
 * The only tokens a clause may contain and still count as a CONTENTLESS
 * repudiation of what came before it. Pro-forms, copulas, hedges, and the
 * falsity vocabulary; nothing that names a physical idea. "all of that is
 * wrong" qualifies; "the idea that you can factor it is wrong" does not,
 * because "factor" is not in here, and it is therefore treated as the
 * assertion it is.
 */
const ANAPHORIC_TOKENS = new Set([
  ...REPUDIATION_WORDS,
  ...TRUTH_WORDS,
  ...CONTRAST_MARKERS,
  "a",
  "above",
  "absolutely",
  "alas",
  "all",
  "also",
  "altogether",
  "an",
  "and",
  "answer",
  "anyway",
  "are",
  "argument",
  "at",
  "basically",
  "be",
  "been",
  "certainly",
  "claim",
  "claims",
  "clearly",
  "completely",
  "definitely",
  "entire",
  "entirely",
  "everything",
  "fact",
  "flat",
  "flatly",
  "frankly",
  "honestly",
  "i",
  "idea",
  "ideas",
  "in",
  "is",
  "it",
  "just",
  "largely",
  "last",
  "literally",
  "me",
  "mostly",
  "my",
  "no",
  "none",
  "nope",
  "not",
  "obviously",
  "of",
  "oh",
  "ok",
  "okay",
  "only",
  "part",
  "plain",
  "plainly",
  "point",
  "pretty",
  "quite",
  "really",
  "reasoning",
  "sadly",
  "said",
  "sentence",
  "simply",
  "so",
  "statement",
  "statements",
  "still",
  "stuff",
  "story",
  "that",
  "the",
  "them",
  "these",
  "they",
  "thing",
  "things",
  "this",
  "those",
  "totally",
  "unfortunately",
  "utterly",
  "very",
  "wait",
  "was",
  "well",
  "were",
  "whole",
  "yeah",
  "yep",
  "yes",
]);

/**
 * Closed-class and discourse vocabulary: words that glue an answer together
 * without saying anything about the physics. Used by `predicationSignal` to
 * ask whether the material the phrase lists did NOT supply carries meaning of
 * its own, which is what separates "matched phrases plus a sentence" from
 * "matched phrases plus 'so yes'".
 *
 * Deliberately closed-class only. A domain word the author listed is covered
 * by its own phrase and never free in the first place, so the words that
 * matter here are exactly the ones the author did not list — and a word the
 * author did not list is content unless it is grammar. Adding a domain noun to
 * this set would silently make some real answer unpredicated, which is why
 * nothing below could ever be the subject of a physics claim.
 */
const FUNCTION_TOKENS = new Set([
  ...ANAPHORIC_TOKENS,
  "about",
  "after",
  "again",
  "against",
  "along",
  "already",
  "always",
  "am",
  "among",
  "another",
  "any",
  "anything",
  "around",
  "as",
  "away",
  "back",
  "because",
  "become",
  "becomes",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "cannot",
  "come",
  "comes",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "done",
  "down",
  "during",
  "each",
  "either",
  "else",
  "enough",
  "ever",
  "every",
  "far",
  "few",
  "for",
  "from",
  "get",
  "gets",
  "getting",
  "give",
  "gives",
  "go",
  "goes",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "him",
  "his",
  "how",
  "however",
  "if",
  "into",
  "keep",
  "keeps",
  "less",
  "let",
  "like",
  "little",
  "long",
  "look",
  "make",
  "makes",
  "many",
  "may",
  "maybe",
  "might",
  "more",
  "much",
  "must",
  "near",
  "need",
  "needs",
  "never",
  "next",
  "now",
  "off",
  "on",
  "once",
  "one",
  "onto",
  "or",
  "other",
  "our",
  "ours",
  "out",
  "over",
  "own",
  "per",
  "put",
  "puts",
  "same",
  "see",
  "seem",
  "seems",
  "shall",
  "she",
  "should",
  "since",
  "some",
  "something",
  "soon",
  "such",
  "sure",
  "take",
  "takes",
  "than",
  "then",
  "there",
  "therefore",
  "thus",
  "to",
  "too",
  "under",
  "until",
  "up",
  "upon",
  "us",
  "use",
  "used",
  "uses",
  "via",
  "want",
  "wants",
  "way",
  "we",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "whose",
  "why",
  "will",
  "with",
  "within",
  "without",
  "would",
  "yet",
  "you",
  "your",
  "yours",
]);

/**
 * Verbs that report a claim rather than make one. On their own they mean
 * nothing: "I think the state is entangled" is an honest answer with a hedge in
 * front of it. They only open a frame when a DISTANCING_MARKERS token sits in
 * front of them, putting the claim in somebody else's mouth or in the past.
 */
const ATTRIBUTION_VERBS = new Set([
  "think",
  "thinks",
  "thought",
  "believe",
  "believes",
  "believed",
  "assume",
  "assumes",
  "assumed",
  "imagine",
  "imagines",
  "imagined",
  "claim",
  "claims",
  "claimed",
  "say",
  "says",
  "said",
  "tell",
  "tells",
  "told",
  "teach",
  "teaches",
  "taught",
  "hear",
  "hears",
  "heard",
  "expect",
  "expects",
  "expected",
  "suppose",
  "supposes",
  "supposed",
  "guess",
  "guesses",
  "guessed",
]);

/**
 * Adverbs whose whole job is to disown the clause they open. "Supposedly the
 * energy is quantized" reports a claim and endorses none of it, exactly as
 * "people say that ..." does — but with no verb to report it, so the
 * attribution frame below never saw it and 151 of 175 model answers graded
 * `correct` behind one. (`supposedly` and `apparently` are already listed as
 * DISTANCING_MARKERS, which is the author of that list saying these words
 * disown; they simply had nothing to attach to.)
 *
 * Kept to four words, and every one of them is a hedge that no physics
 * sentence needs: none appears anywhere in the problem corpus, where
 * "disagree", "deny" and "doubt" — the obvious next candidates — all do, and
 * as physics ("the two implementations disagreed", "the syndromes disagree").
 * Framing on those would have graded a correct answer `partial`, so they are
 * deliberately absent. "apparently" is absent for the same reason in miniature:
 * "the two are apparently identical" is an ordinary hedge, not a disowning.
 */
const DISOWNING_ADVERBS = new Set(["supposedly", "allegedly", "purportedly", "ostensibly"]);

/** How far into a clause a disowning adverb may sit and still scope it.
 *  "Supposedly", "it is supposedly", "this is allegedly": three. */
const DISOWNING_ADVERB_REACH = 3;

/**
 * What turns a reported claim into a disowned one: somebody else's mouth
 * ("people think that"), or the student's own past ("I used to think", "I
 * naively believed"). Kept free of "one", "they" and "first", each of which
 * fronts an ordinary answer far more often than a frame ("one can think of it
 * as a rotation").
 */
const DISTANCING_MARKERS = new Set([
  "people",
  "student",
  "students",
  "everyone",
  "everybody",
  "many",
  "most",
  "some",
  "others",
  "book",
  "books",
  "textbook",
  "textbooks",
  "beginners",
  "novices",
  "teacher",
  "teachers",
  "professor",
  "lecturer",
  "myth",
  "commonly",
  "often",
  "usually",
  "naively",
  "mistakenly",
  "wrongly",
  "originally",
  "initially",
  "once",
  "used",
  "supposedly",
  "apparently",
]);

/**
 * Shown when the only thing standing between the submission and `correct` is a
 * negation frame. Deliberately not "you are wrong": the grader has decided the
 * student named the right ideas and then disowned them, and the one thing it
 * cannot tell is whether they meant to. Asking is the honest move.
 */
const FRAMED_FEEDBACK =
  "You have named the right ideas, but the sentence around them says they are false or puts them in someone else's mouth, so it does not assert anything. Say plainly what is true and it will count.";

/** Shown when the submission is the answer key's own vocabulary and nothing
 *  else. Same reasoning: the student may well know this, so ask for a claim. */
const UNPREDICATED_FEEDBACK =
  "That is a list of key words rather than an answer. Put them into a sentence that says how they fit together and it will count.";

const NEGATORS = new Set([
  "not",
  "no",
  "never",
  "cannot",
  "cant",
  "dont",
  "doesnt",
  "didnt",
  "isnt",
  "arent",
  "wasnt",
  "werent",
  "wont",
  "without",
  "nor",
  "neither",
  "none",
  "fails",
  "fail",
  "lacks",
  "lack",
]);

/** Tokens the negation scan steps over without spending window. */
const NEGATION_TRANSPARENT = new Set(["a", "an", "the", "any", "its", "it", "be", "been", "being"]);

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan['’]t\b/g, "can not"],
  // Not a contraction, but the same job: "cannot" and "can't" have to reach
  // the matcher as the same two tokens or an author writing one will reject a
  // student who wrote the other.
  [/\bcannot\b/g, "can not"],
  [/\bwon['’]t\b/g, "will not"],
  [/\bshan['’]t\b/g, "shall not"],
  [/n['’]t\b/g, " not"],
  [/\b(it|that|there|he|she|who|what|this)['’]s\b/g, "$1 is"],
  [/\b(i|you|we|they)['’]re\b/g, "$1 are"],
  [/\b(i|you|we|they|it)['’]ve\b/g, "$1 have"],
  [/\b(i|you|we|they|it)['’]ll\b/g, "$1 will"],
  [/\b(i|you|we|they|it)['’]d\b/g, "$1 would"],
];

/**
 * The problem's own text, handed to the grader so a submission cannot be a
 * copy of it. Assembled for real problems by `conceptualContextFor` below;
 * omitted entirely by unit tests that only care about phrase matching.
 */
export type ConceptualContext = {
  /** Prompt, hints, and every feedback string belonging to this problem. */
  teachingText?: string[];
};

export function validateConceptual(
  answer: ConceptualAnswer,
  rawAnswer: string,
  context?: ConceptualContext
): ValidationResult {
  const rawLower = rawAnswer.trim().toLowerCase();
  if (rawLower === "") {
    return { status: "incorrect", message: "Write a short answer before submitting." };
  }

  const submission = analyzeSubmission(rawAnswer);
  if (submission.tokens.length === 0) {
    return { status: "incorrect", message: "Write a short answer before submitting." };
  }

  const groups = answer.requiredConceptGroups;
  const satisfied = groupsSatisfiedBy(groups, submission);
  const unmatched = groups.filter((_group, index) => !satisfied[index]);
  const matchedCount = groups.length - unmatched.length;

  // A submission that is substantially a verbatim copy of the problem's own
  // prompt, hints, or feedback is not an answer, however many groups its
  // borrowed words happen to satisfy. Checked only when it would otherwise
  // change the verdict, so the cost is paid on correct-looking answers alone.
  if (unmatched.length === 0 && isEcho(submission, context)) {
    return {
      status: matchedCount > 1 ? "partial" : "incorrect",
      message:
        "That repeats the question and the hints back rather than answering them. Say the idea again in your own words and it will count.",
    };
  }

  if (unmatched.length === 0) {
    // §4. Every idea is present; is any of it actually claimed?
    if (!isPredicated(predicationSignal(groups, submission))) {
      return { status: "partial", message: UNPREDICATED_FEEDBACK };
    }
    return { status: "correct", message: "That covers the key idea." };
  }

  // §3(b). The ideas are all there and a framing negation is the only thing
  // holding them back. The grader cannot tell a student refuting a
  // misconception clumsily from a submission engineered to look like one, so
  // it says what it sees and asks, rather than calling a possibly-right
  // student wrong.
  if (submission.framed.size > 0 && groupsSatisfiedBy(groups, unframed(submission)).every(Boolean)) {
    return { status: "partial", message: FRAMED_FEEDBACK };
  }

  // Exactly one idea is blocking correctness and its group names what to
  // say about that: surface the targeted message instead of the generic
  // partial/incorrect feedback.
  if (unmatched.length === 1) {
    const missingFeedback = groupMissingFeedback(unmatched[0]);
    if (missingFeedback !== undefined) {
      return { status: matchedCount > 0 ? "partial" : "incorrect", message: missingFeedback };
    }
  }

  if (matchedCount > 0) {
    return {
      status: "partial",
      message: answer.partialFeedback ?? "You're partly there, but part of the idea is missing.",
    };
  }

  return { status: "incorrect", message: answer.incorrectFeedback };
}

/** Everything in a problem that is shown to a student who has not solved it. */
export function conceptualContextFor(problem: Problem): ConceptualContext {
  const teachingText: string[] = [problem.question.prompt, ...problem.hints.map((hint) => hint.text)];
  if (problem.question.type === "conceptual" && problem.question.placeholder) {
    teachingText.push(problem.question.placeholder);
  }
  if (problem.answer.type === "conceptual") {
    teachingText.push(problem.answer.incorrectFeedback);
    if (problem.answer.partialFeedback) teachingText.push(problem.answer.partialFeedback);
    for (const group of problem.answer.requiredConceptGroups) {
      const missing = groupMissingFeedback(group);
      if (missing) teachingText.push(missing);
    }
  }
  return { teachingText };
}

/**
 * Which of `groups` the submission satisfies, resolved together rather than one
 * at a time so that `expectedNegators` sees the whole problem. Every caller
 * that asks "does this text satisfy these ideas?" — the grader, and the lint's
 * cross-group collision check — goes through here, so the two can never drift.
 */
export function groupsSatisfiedBy(groups: ConceptGroup[], submission: Submission): boolean[] {
  const expected = expectedNegators(groups, submission);
  return groups.map((group) =>
    conceptGroupPhrases(group).some((phrase) => phraseMatches(submission, phrase, expected))
  );
}

const EMPTY_INDEX_SET: ReadonlySet<number> = new Set<number>();

/**
 * The structural evidence that a submission asserts something rather than
 * listing the answer key's vocabulary. See §4 for why this exists and what it
 * does not claim to do.
 *
 * `freeTokens` counts positions covered by no authored phrase of any group,
 * and is the gate. `freeRatio` is reported alongside it so the margin can be
 * measured rather than guessed: over this corpus it runs from 0.29 (the most
 * anchor-dense pinned model answer) to about 0.96, against exactly 0 for a
 * salad. Exported so that measurement stays possible from outside.
 */
export type PredicationSignal = {
  /** Tokens of the submission covered by no authored phrase of any group. */
  freeTokens: number;
  /** ...of which carry meaning of their own: not an article, auxiliary,
   *  pro-form or discourse particle. See `FUNCTION_TOKENS`. */
  freeContentTokens: number;
  /** ...as a fraction of the submission, reported for diagnosis. Not a gate:
   *  see MIN_FREE_TOKENS for why the absolute count is the rule. */
  freeRatio: number;
};

/**
 * Does the signal clear §4's bar? Exported so a test can ask the question the
 * grader asks, rather than re-deriving the thresholds and drifting from it.
 */
export function isPredicated(signal: PredicationSignal): boolean {
  return signal.freeTokens >= MIN_FREE_TOKENS && signal.freeContentTokens >= MIN_FREE_CONTENT_TOKENS;
}

export function predicationSignal(groups: ConceptGroup[], submission: Submission): PredicationSignal {
  const covered = new Array<boolean>(submission.tokens.length).fill(false);
  // The same `expected` set the grader used, or a phrase the problem asked for
  // in its negated form ("cannot") would be counted as matched by the grader
  // and as free material here, and "cannot product state" would read as an
  // answer with two words of its own.
  const expected = expectedNegators(groups, submission);
  for (const group of groups) {
    for (const phrase of conceptGroupPhrases(group)) {
      const shape = phraseShape(phrase);
      for (const span of matchSpans(submission.tokens, shape, expected, submission.framed)) {
        for (const hit of span.hits) covered[hit] = true;
      }
    }
  }
  let freeTokens = 0;
  let freeContentTokens = 0;
  covered.forEach((isCovered, index) => {
    if (isCovered) return;
    freeTokens += 1;
    if (!FUNCTION_TOKENS.has(submission.tokens[index])) freeContentTokens += 1;
  });
  return {
    freeTokens,
    freeContentTokens,
    freeRatio: covered.length === 0 ? 0 : freeTokens / covered.length,
  };
}

/**
 * Which of the submission's negators the *author asked for*.
 *
 * Negation suppression exists to stop "that is not true" from satisfying a
 * group holding "true". It must not stop "this can't be separable" from
 * satisfying a group holding "separable", because there the negation is the
 * whole point — and the author said so, by listing "cannot" as a required
 * concept of its own. So before grading, find every negator token that is
 * itself part of a match for an authored phrase that carries a negator. Those
 * negators are accounted for: they are what the problem asked the student to
 * say, and they do not suppress anything. Every other negator still does.
 *
 * Phrases carrying a negator are never themselves suppressed, so this pass is
 * a fixed point after one iteration — no recursion, and the result does not
 * depend on group order.
 */
function expectedNegators(groups: ConceptGroup[], submission: Submission): ReadonlySet<number> {
  const expected = new Set<number>();
  for (const group of groups) {
    for (const phrase of conceptGroupPhrases(group)) {
      const shape = phraseShape(phrase);
      if (!shape.isNegative || shape.tokens.length === 0) continue;
      for (const span of matchSpans(submission.tokens, shape, EMPTY_INDEX_SET, submission.framed)) {
        for (let i = span.start; i <= span.end; i += 1) {
          if (NEGATORS.has(submission.tokens[i])) expected.add(i);
        }
      }
    }
  }
  return expected;
}

function groupMissingFeedback(group: ConceptGroup): string | undefined {
  return Array.isArray(group) ? undefined : group.missingFeedback;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Lowercase, expand contractions, strip to `[a-z0-9 ]`, collapse whitespace.
 * Deterministic and total. Contractions are expanded BEFORE the strip so that
 * "doesn't" becomes the two tokens "does not" rather than the single token
 * "doesnt" — which is what lets an author write "does not commute" and have a
 * student's "doesn't commute" match it, and what makes the negation window
 * see a negator that was hiding inside a contraction.
 */
export function normalize(text: string): string {
  return expandContractions(text).replace(/[^a-z0-9\s]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Lowercase and expand contractions, keeping every other character in place.
 * Separated out from `normalize` because clause segmentation needs the
 * punctuation that `normalize` throws away, and it has to see exactly the same
 * token stream `normalize` produces or the two would index differently.
 */
function expandContractions(text: string): string {
  let lowered = text.toLowerCase();
  for (const [pattern, replacement] of CONTRACTIONS) lowered = lowered.replace(pattern, replacement);
  return lowered;
}

/**
 * Very light stemming, applied identically to both sides of a comparison so
 * over-stripping is symmetric and harmless. Handles the inflections that
 * actually cost the corpus model answers: "commuting" vs "commute",
 * "preserved" vs "preserve", plurals both ways.
 */
function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ing")) return trimFinalE(word.slice(0, -3));
  if (word.length > 4 && word.endsWith("ed")) return trimFinalE(word.slice(0, -2));
  if (word.length > 4 && word.endsWith("es")) return trimFinalE(word.slice(0, -2));
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return trimFinalE(word.slice(0, -1));
  return trimFinalE(word);
}

function trimFinalE(word: string): string {
  return word.length > 4 && word.endsWith("e") ? word.slice(0, -1) : word;
}

export type Submission = {
  rawLower: string;
  normalized: string;
  tokens: string[];
  /** Lowercased and contraction-expanded, punctuation intact. `tokenOffsets`
   *  indexes into this, which is what lets a raw-notation match be placed in a
   *  clause. */
  loweredText: string;
  /** Start offset of `tokens[i]` inside `loweredText`. */
  tokenOffsets: number[];
  /** Token indices whose matches are discarded because a framing negation
   *  scopes them. See §3(b); empty for almost every real submission. */
  framed: ReadonlySet<number>;
};

export function analyzeSubmission(rawAnswer: string): Submission {
  const loweredText = expandContractions(rawAnswer);
  const { tokens, tokenOffsets, clauseStarts } = segment(loweredText);
  return {
    rawLower: rawAnswer.trim().toLowerCase(),
    normalized: tokens.join(" "),
    tokens,
    loweredText,
    tokenOffsets,
    framed: framedTokens(tokens, clauseStarts),
  };
}

/** The same submission with every framing negation ignored, for asking "would
 *  this have been correct if the student had simply asserted it?". */
function unframed(submission: Submission): Submission {
  return submission.framed.size === 0 ? submission : { ...submission, framed: EMPTY_INDEX_SET };
}

// ---------------------------------------------------------------------------
// Clause segmentation and framing negation (§3b)
// ---------------------------------------------------------------------------

type Segmented = {
  tokens: string[];
  tokenOffsets: number[];
  /** Token indices at which a clause begins; always starts with 0 when there
   *  is at least one token, and is strictly increasing. */
  clauseStarts: number[];
};

/**
 * Split into the same tokens `normalize` produces (maximal `[a-z0-9]` runs,
 * since normalization turns everything else into a separator) while recording
 * where the clauses are. A clause begins after sentence punctuation and at a
 * contrast connective, because both are places a student changes what they are
 * asserting.
 */
function segment(loweredText: string): Segmented {
  const tokens: string[] = [];
  const tokenOffsets: number[] = [];
  const clauseStarts: number[] = [];
  const pattern = /[a-z0-9]+/g;
  let previousEnd = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(loweredText)) !== null) {
    const index = tokens.length;
    const gap = loweredText.slice(previousEnd, match.index);
    // Whitespace is required in every case below: without it, the "." of "1.5"
    // and the "but" of "rigorous-but-pessimistic" are not clause boundaries,
    // they are spelling. The hyphenated case is not hypothetical — it was
    // opening a contrast reset in the middle of a corpus model answer and
    // reopening that answer to framing negation.
    const spaced = /\s/.test(gap);
    const breaksHere =
      index === 0 ||
      (spaced &&
        (CLAUSE_BREAK_PUNCTUATION.test(gap) ||
          CONTRAST_MARKERS.has(match[0]) ||
          (match[0] === CONTRAST_BIGRAM_HEAD && startsContrastBigram(loweredText, pattern.lastIndex))));
    if (breaksHere) clauseStarts.push(index);
    tokens.push(match[0]);
    tokenOffsets.push(match.index);
    previousEnd = match.index + match[0].length;
  }
  return { tokens, tokenOffsets, clauseStarts };
}

/** Is the next token after `from` one of "fact" / "reality" / "truth", making
 *  the "in" before it the head of a contrast reset? */
const NEXT_TOKEN = /[a-z0-9]+/g;
function startsContrastBigram(loweredText: string, from: number): boolean {
  NEXT_TOKEN.lastIndex = from;
  const next = NEXT_TOKEN.exec(loweredText);
  return next !== null && CONTRAST_BIGRAM_TAIL.has(next[0]);
}

/**
 * Every token index that a framing negation scopes, and whose matches are
 * therefore discarded.
 *
 * Forward frames (falsity, attribution) open inside a clause and stay open
 * across sentence boundaries until a contrast connective closes them.
 * A contentless repudiation clause scopes BACKWARDS over everything before it.
 */
function framedTokens(tokens: string[], clauseStarts: number[]): ReadonlySet<number> {
  if (clauseStarts.length === 0) return EMPTY_INDEX_SET;
  const framed = new Set<number>();
  let open = false;
  for (let c = 0; c < clauseStarts.length; c += 1) {
    const start = clauseStarts[c];
    const end = c + 1 < clauseStarts.length ? clauseStarts[c + 1] : tokens.length;

    if (isContrastReset(tokens, start)) open = false;

    if (isBareRepudiation(tokens, start, end)) {
      for (let i = 0; i < start; i += 1) framed.add(i);
      open = false;
      continue;
    }

    const scopeStart = open ? start : frameScopeStart(tokens, start, end);
    if (scopeStart === undefined) continue;
    for (let i = scopeStart; i < end; i += 1) framed.add(i);
    open = true;
  }
  return framed.size === 0 ? EMPTY_INDEX_SET : framed;
}

function isContrastReset(tokens: string[], start: number): boolean {
  if (CONTRAST_MARKERS.has(tokens[start])) return true;
  return tokens[start] === CONTRAST_BIGRAM_HEAD && CONTRAST_BIGRAM_TAIL.has(tokens[start + 1] ?? "");
}

/**
 * Where a frame opened in this clause starts scoping, or `undefined` if the
 * clause opens no frame.
 */
function frameScopeStart(tokens: string[], start: number, end: number): number | undefined {
  const headEnd = Math.min(end, start + FRAME_HEAD_TOKENS);

  // Falsity frame: "... false / myth / not true ... that <claim>".
  for (let i = start; i < headEnd; i += 1) {
    if (!declaresFalsity(tokens, i, headEnd)) continue;
    for (let t = i + 1; t < headEnd; t += 1) {
      if (tokens[t] === "that" && t + 1 < end) return t + 1;
    }
    break;
  }

  // Disowning adverb at the head of the clause: "supposedly <claim>".
  for (let i = start; i < Math.min(end, start + DISOWNING_ADVERB_REACH); i += 1) {
    if (!DISOWNING_ADVERBS.has(tokens[i])) continue;
    let scope = i + 1;
    if (tokens[scope] === "that") scope += 1;
    if (scope < end) return scope;
  }

  // Attribution frame: "<distancing> ... <attribution verb> [that] <claim>".
  for (let i = start; i < headEnd; i += 1) {
    if (!ATTRIBUTION_VERBS.has(tokens[i])) continue;
    let hasDistance = false;
    for (let d = start; d < i; d += 1) {
      if (DISTANCING_MARKERS.has(tokens[d])) hasDistance = true;
    }
    if (!hasDistance) return undefined;
    let scope = i + 1;
    if (tokens[scope] === "that") scope += 1;
    return scope < end ? scope : undefined;
  }

  return undefined;
}

/** Does the token at `i` declare what follows to be false: a falsity word, or
 *  a negator reaching a truth word within two meaningful tokens? */
function declaresFalsity(tokens: string[], i: number, headEnd: number): boolean {
  if (FALSITY_FRAME_WORDS.has(tokens[i])) return true;
  if (!NEGATORS.has(tokens[i])) return false;
  let remaining = 2;
  for (let j = i + 1; j < headEnd && remaining > 0; j += 1) {
    if (TRUTH_WORDS.has(tokens[j])) return true;
    if (!NEGATION_TRANSPARENT.has(tokens[j])) remaining -= 1;
  }
  return false;
}

/**
 * A clause made of nothing but pro-forms, copulas and falsity vocabulary:
 * "all of that is wrong", "that is not true", "none of this is correct". It
 * asserts nothing of its own, so the only thing it can be about is the text
 * before it.
 */
function isBareRepudiation(tokens: string[], start: number, end: number): boolean {
  if (start === 0 || end - start < 2) return false;
  let sawFalsityWord = false;
  let sawNegator = false;
  let sawTruthWord = false;
  for (let i = start; i < end; i += 1) {
    if (!ANAPHORIC_TOKENS.has(tokens[i])) return false;
    if (REPUDIATION_WORDS.has(tokens[i])) sawFalsityWord = true;
    if (NEGATORS.has(tokens[i])) sawNegator = true;
    if (TRUTH_WORDS.has(tokens[i])) sawTruthWord = true;
  }
  return sawFalsityWord || (sawNegator && sawTruthWord);
}

// ---------------------------------------------------------------------------
// Phrase matching
// ---------------------------------------------------------------------------

export type PhraseShape = {
  raw: string;
  /** `raw` lowercased: what the raw-notation path compares against. */
  rawLower: string;
  /** `rawLower` with contractions expanded, so a notation phrase carrying an
   *  apostrophe can be located in `Submission.loweredText`. */
  expandedRaw: string;
  normalized: string;
  tokens: string[];
  /** Contains a character outside `[a-z0-9 ]` — tried as raw text first. */
  isNotation: boolean;
  /**
   * Raw text is the only thing this phrase can meaningfully test: either it
   * normalizes to nothing at all ("⁴", "±", "ρ"), or normalization has eaten
   * the part that carried the meaning and left a stub that would match almost
   * anything ("−1" -> "1", "p²" -> "p", "L·S" -> "l s", "≠1" -> "1").
   */
  isAnchor: boolean;
  /**
   * Normalization ate the part that carried the meaning and left a stub:
   * "−1" -> "1", "p²" -> "p", "L·S" -> "l s", "tr(" -> "tr". Still matchable
   * (every token of it must land whole, so "p" no longer hides inside
   * "preserves" and "tr" no longer inside "matrices"), but the author has to
   * declare it — see `ConceptGroup.anchors` and `conceptualLint.ts`.
   */
  isDegenerate: boolean;
  /** Carries its own negator, so negation never suppresses it. */
  isNegative: boolean;
};

/**
 * Did normalization leave a stub rather than a word? "−1", "≠1" and "|0⟩" all
 * come out as the single token "1"; "p²" as "p"; "tr(" as "tr"; "uu†" as "uu".
 * Matching on those stubs is what made roughly thirty concept groups vacuous.
 * The matcher now requires every short token to land whole, which defuses most
 * of the damage; the lint still makes the author declare the phrase, because a
 * one-character test is rarely what they meant to write.
 */
function isDegenerateResidue(tokens: string[]): boolean {
  return tokens.length === 1 && tokens[0].length <= 2;
}

const shapeCache = new Map<string, PhraseShape>();

export function phraseShape(phrase: string): PhraseShape {
  const cached = shapeCache.get(phrase);
  if (cached) return cached;
  const rawLower = phrase.toLowerCase();
  const expandedRaw = expandContractions(phrase);
  const normalized = normalize(phrase);
  const tokens = normalized.split(" ").filter(Boolean);
  const isNotation = /[^a-z0-9 ]/.test(rawLower);
  const shape: PhraseShape = {
    raw: phrase,
    rawLower,
    expandedRaw,
    normalized,
    tokens,
    isNotation,
    isAnchor: normalized === "",
    isDegenerate: isNotation && isDegenerateResidue(tokens),
    isNegative: tokens.some((token) => NEGATORS.has(token)),
  };
  shapeCache.set(phrase, shape);
  return shape;
}

export function phraseMatches(
  submission: Submission,
  phrase: string,
  expected: ReadonlySet<number> = EMPTY_INDEX_SET
): boolean {
  const shape = phraseShape(phrase);

  // (a) Notation: the raw glyphs, verbatim. The only route for "|+⟩", "±",
  //     "1/sqrt(2)" and "non-zero", none of which survive normalization in a
  //     usable form. Deliberately NOT available to plain-word phrases, whose
  //     raw substring match is what let "symmetrize" be found inside
  //     "antisymmetrize" and "correct" inside "incorrect".
  if (shape.isNotation && notationMatches(submission, shape, expected)) return true;
  if (shape.isAnchor) return false;

  // (b)/(c) In-order token subsequence with prefix/stem tolerance and a gap
  //          cap; short tokens must land whole rather than as a prefix.
  for (const _span of matchSpans(submission.tokens, shape, expected, submission.framed)) return true;
  return false;
}

/**
 * A notation phrase is found as raw text, so it has no token span of its own.
 * Both negation scopes still have to reach it, or a glyph-anchored group would
 * be the one place in the grader where "the amplitude is not 1/sqrt(2)"
 * satisfies a group asking for 1/sqrt(2). So each occurrence is placed at the
 * token it overlaps or precedes, and an occurrence inside a framed region
 * (§3b), or with a negator immediately before it (§3a), does not count.
 *
 * Local negation was missing here until it was measured: over the corpus,
 * negating every group phrase of every problem in turn ("there is no <phrase>")
 * still graded `correct` on 18 of 175, and six of those were problems whose
 * ideas are spelled as formulae — "e^0", "K_0 = U", "1/√2", "l(l+1)=0" — where
 * the word-level negation check never ran at all. The rest are the intended
 * §3a exemption: a phrase that carries its own negator ("no qubits", "no
 * restriction") is never suppressed.
 */
function notationMatches(
  submission: Submission,
  shape: PhraseShape,
  expected: ReadonlySet<number>
): boolean {
  if (indexOfAtWordStart(submission.rawLower, shape.rawLower, 0) === -1) return false;
  // Positions come from the contraction-expanded text, so the needle has to be
  // expanded too: "aren't functions of" is spelled "are not functions of"
  // there, and searching for the unexpanded form found nothing and therefore
  // suppressed nothing.
  const needle = shape.expandedRaw;
  let found = false;
  for (let at = indexOfAtWordStart(submission.loweredText, needle, 0); at !== -1; ) {
    found = true;
    const token = tokenIndexAt(submission, at);
    if (!submission.framed.has(token) && !isNegated(submission.tokens, token, shape, expected)) return true;
    at = indexOfAtWordStart(submission.loweredText, needle, at + 1);
  }
  // Not locatable at all, so there is no position to judge. Accept rather than
  // invent a verdict; the raw match above already stands.
  return !found;
}

/**
 * `indexOf`, but a needle that begins with a letter or digit may only be found
 * at the start of a word. Raw-notation matching is the one place a phrase is
 * compared as an unanchored substring, and that is how a group holding "local
 * hidden-variable" came to be satisfied by an answer that only ever wrote
 * "NONlocal hidden-variable". A needle beginning with a glyph ("|0>", "−1",
 * "±") is unconstrained, since glyphs cannot sit inside a word.
 */
function indexOfAtWordStart(haystack: string, needle: string, from: number): number {
  if (needle === "") return -1;
  const anchored = /[a-z0-9]/.test(needle[0]);
  for (let at = haystack.indexOf(needle, from); at !== -1; at = haystack.indexOf(needle, at + 1)) {
    if (!anchored || at === 0 || !/[a-z0-9]/.test(haystack[at - 1])) return at;
  }
  return -1;
}

/** The token an offset falls in, or the next one after it; the last token's
 *  index when the offset is past every token. */
function tokenIndexAt(submission: Submission, offset: number): number {
  const offsets = submission.tokenOffsets;
  for (let i = 0; i < offsets.length; i += 1) {
    if (offsets[i] + submission.tokens[i].length > offset) return i;
  }
  return offsets.length - 1;
}

type MatchSpan = { start: number; end: number; hits: number[] };

/**
 * Every place the phrase's tokens appear in order, as `[start, end]` token
 * indices. Yields nothing for a match the negation check discards. Written as
 * a generator so the common "is there one?" question stops at the first hit,
 * while `expectedNegators` can still enumerate them all.
 */
function* matchSpans(
  tokens: string[],
  shape: PhraseShape,
  expected: ReadonlySet<number> = EMPTY_INDEX_SET,
  framed: ReadonlySet<number> = EMPTY_INDEX_SET
): Generator<MatchSpan> {
  const phraseTokens = shape.tokens;
  if (phraseTokens.length === 0) return;
  for (let start = 0; start < tokens.length; start += 1) {
    if (!tokensMatch(tokens[start], phraseTokens[0])) continue;
    if (framed.has(start)) continue;
    if (isNegated(tokens, start, shape, expected)) continue;
    if (phraseTokens.length === 1) {
      yield { start, end: start, hits: [start] };
      continue;
    }
    let next = 1;
    let lastHit = start;
    const hits = [start];
    for (let i = start + 1; i < tokens.length && i - lastHit - 1 <= MAX_TOKEN_GAP; i += 1) {
      if (!tokensMatch(tokens[i], phraseTokens[next])) continue;
      // A phrase whose tokens straddle the edge of a framed region is not
      // asserted either: the claim it would make is the framed one.
      if (framed.has(i)) break;
      lastHit = i;
      hits.push(i);
      next += 1;
      if (next === phraseTokens.length) {
        yield { start, end: lastHit, hits };
        break;
      }
    }
  }
}

/**
 * A phrase token matches a submission token only from the START of that token,
 * so "symmetrize" is not found inside "antisymmetrize". A phrase token shorter
 * than `MIN_PREFIX_PHRASE_LENGTH` has to land on a whole token instead: "tr"
 * would otherwise be a prefix of "traced", "p" of "preserves", "l" of
 * "linear" — which is how a group holding "p²" or "tr(" came to match answers
 * that never mentioned either.
 */
function tokensMatch(submissionToken: string, phraseToken: string): boolean {
  if (phraseToken.length < MIN_PREFIX_PHRASE_LENGTH) {
    return submissionToken === phraseToken || stem(submissionToken) === stem(phraseToken);
  }
  if (submissionToken.startsWith(phraseToken)) return true;
  // Stem EQUALITY, never stem prefix. `stem` strips a trailing "e" from any
  // word over four letters, so a stem prefix let "prove" reach "provided"
  // ("prov" ⊂ "provid") and "state" reach "stationary" and "statistics"
  // ("stat" ⊂ both) — a group asking whether the student proved something was
  // satisfied by one who said a value was provided. Equality still carries
  // every inflection the stemmer exists for ("commuting"/"commute",
  // "preserved"/"preserve", plurals both ways), because those collapse to the
  // same stem rather than to a prefix of one.
  return stem(submissionToken) === stem(phraseToken);
}

/**
 * True when a negator sits in the `NEGATION_WINDOW` tokens immediately before
 * `index`. A phrase that carries its own negator opts out: an author who wants
 * "not true" to count writes "not true" as a phrase, and the author who wants
 * only the positive claim writes "true" and gets it protected. A negator the
 * problem itself required (`expected`, from `expectedNegators`) opts out too.
 */
function isNegated(
  tokens: string[],
  index: number,
  shape: PhraseShape,
  expected: ReadonlySet<number>
): boolean {
  if (shape.isNegative) return false;
  let remaining = NEGATION_WINDOW;
  for (let i = index - 1; i >= 0 && remaining > 0; i -= 1) {
    const token = tokens[i];
    if (NEGATORS.has(token)) return !expected.has(i);
    // Articles and copulas carry no meaning of their own, so they do not use
    // up the window: "not a proof" negates "proof" exactly as "not proof"
    // would. Anything else does, which is what keeps "depends on the state,
    // not on who is measuring" from reading as a negation of "who is
    // measuring" — there, "on" ends the scan.
    if (!NEGATION_TRANSPARENT.has(token)) remaining -= 1;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Echo detection
// ---------------------------------------------------------------------------

/**
 * Is the submission substantially a verbatim copy of the problem's own prompt,
 * hints, or feedback? Measured as: tokens covered by runs of at least
 * `ECHO_RUN_TOKENS` consecutive tokens that appear, in the same order, in one
 * of those texts — a coincidence no student produces at that length. An
 * answer that quotes a hint and then adds its own reasoning stays under
 * `ECHO_COVERAGE` and is unaffected.
 */
export function isEcho(submission: Submission, context: ConceptualContext | undefined): boolean {
  const sources = context?.teachingText;
  if (!sources || sources.length === 0) return false;
  const tokens = submission.tokens;
  if (tokens.length < ECHO_RUN_TOKENS) return false;

  // Space-padded so a run can only match on whole-token boundaries.
  const haystacks = sources
    .map((source) => ` ${normalize(source)} `)
    .filter((source) => source.length > ECHO_RUN_TOKENS);

  const covered = new Array<boolean>(tokens.length).fill(false);
  for (const haystack of haystacks) {
    for (let start = 0; start + ECHO_RUN_TOKENS <= tokens.length; start += 1) {
      if (!haystack.includes(` ${tokens.slice(start, start + ECHO_RUN_TOKENS).join(" ")} `)) continue;
      let end = start + ECHO_RUN_TOKENS;
      while (end < tokens.length && haystack.includes(` ${tokens.slice(start, end + 1).join(" ")} `)) end += 1;
      for (let i = start; i < end; i += 1) covered[i] = true;
    }
  }
  const coveredCount = covered.filter(Boolean).length;
  return coveredCount / tokens.length >= ECHO_COVERAGE;
}
