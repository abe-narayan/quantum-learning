# Citation Audit

> **This file is a findings log, not a guide.** Audit date: **2026-08-26**.
> It records what was checked, against what, and what was found. Nothing in
> it is a rule.
>
> **Its coverage is now incomplete, and that matters more than any single
> finding in it.** The audit checked 17 `<ResearchConnection>` and 18
> `<HistoricalMoment>` blocks. Recounted 2026-08-29, the corpus holds **51
> `<ResearchConnection>` and 19 `<HistoricalMoment>` blocks**. The corpus
> roughly tripled its research citations after this ran. So the headline
> verdict below ("44 of 45 citation instances accurate") describes a subset
> of the current corpus, not the whole of it, and **about two thirds of the
> `<ResearchConnection>` citations on the site have never been checked
> against the literature.** Read the verdict as "nothing wrong was found in
> what was checked," not as "the corpus is clean." A re-run is the outstanding
> work here; the Method section below is written to be repeatable for exactly
> that reason.

Scope at the time of the audit: every `<ResearchConnection>` and `<HistoricalMoment>` block in
`src/content/lessons/**`, plus every inline citation with checkable
bibliographic detail (author/year/journal/arXiv id) found by grepping the
corpus for `et al`, `arXiv`, `doi`, `Nature`, `Science`, `Phys. Rev`, `PRL`,
and every `https://` URL. CSP compliance of `<ExternalFigure>` hosts was
checked independently of the citation work. `src/content/problems/**` was
not touched or audited (out of scope per the task).

## Verdict

Of 45 citation instances checked (30 distinct underlying sources — some
papers are cited more than once across lessons), 44 are accurate: correct
title, authors, venue, volume/pages, year, and URL where given, and in every
case checked the claim attached to the citation matches what the cited work
actually says. One dating error was found and corrected: `the-bloch-sphere.mdx`
attributed Bloch's nuclear-induction work (the actual 1946 origin of the
Bloch-sphere geometric picture, correctly dated elsewhere in this same
corpus in `t1-and-t2-decoherence.mdx`) to 1961 — the year of a *photograph*
of Bloch at Stanford, not the year of the work. This is a narrow, high-confidence,
single-field fix. No fabricated citations, no wrong DOIs, no dead links, and
no CSP violations were found. The corpus's own two self-flagged findings in
`docs/SCIENCE_AUDIT.md` (Arute et al. and Barenco et al. citation detail
added without lesson-internal sourcing) are confirmed here as factually
accurate, so that finding stands as a *process* flag only, not a *correctness*
flag — both citations check out.

## Table

Legend: **V** = verified, **C** = corrected (see below), **U** = unverified.

| File:line | Claimed | Status | Evidence |
|---|---|---|---|
| computational-cost-and-scaling.mdx:165 | Arute et al., *Nature* 574, 505–510 (2019), Sycamore 53-qubit choice | V | Nature/PubMed/ADS confirm exact title "Quantum supremacy using a programmable superconducting processor," vol. 574, pp. 505–510, 24 Oct 2019, DOI 10.1038/s41586-019-1666-5. URL resolves (redirects to login wall, expected for Nature; content confirmed via search). Claim (53-qubit choice near the classical-simulation wall) matches the paper. |
| the-quantum-singular-value-transformation.mdx:328 | Gilyén, Su, Low & Wiebe, STOC 2019, QSVT | V | Confirmed exact title "Quantum singular value transformation and beyond," STOC 2019 pp. 193–204, same 4 authors, arXiv:1806.01838 resolves and matches. |
| the-quantum-singular-value-transformation.mdx:344 | Martyn, Rossi, Tan & Chuang, 2021, "Grand Unification of Quantum Algorithms" | V | Confirmed exact title, 4 authors match, posted 2021 (PRX Quantum 2, 040203), arXiv:2105.02859 resolves and matches. |
| magic-states-and-distillation.mdx:209 | Bravyi & Kitaev, *Phys. Rev. A* 71, 022316 (2005), 15-to-1 distillation | V | Confirmed title "Universal quantum computation with ideal Clifford gates and noisy ancillas," PRA 71, 022316 (2005), arXiv:quant-ph/0403025 resolves. The specific 15-to-1 / [[15,1,3]] Reed–Muller / cubic-suppression claim independently confirmed via secondary sources. |
| applications-eigenvalues-and-linear-systems.mdx:292 | Ewin Tang, 2018, dequantization | V | Confirmed title "A quantum-inspired classical algorithm for recommendation systems," posted July 2018, arXiv:1807.04271 resolves and matches; the lesson's description of what the paper shows (classical algorithm matching polylog scaling under ℓ²-sampling access) matches the abstract. |
| amplitude-estimation-without-phase-estimation.mdx:177 | Suzuki, Uno, Raymond, Tanaka, Onodera & Yamamoto, *Quantum Information Processing* 19, 75 (2020); "see also" Grinko, Gacon, Zoufal & Woerner, *npj Quantum Information* 7, 52 (2021) | V | Both confirmed exactly: 6-author list, journal, volume, article number, year for Suzuki et al. (arXiv:1904.10246); 4-author list, journal, volume, article number, year for Grinko et al. (DOI 10.1038/s41534-021-00379-1). Both papers are indeed about amplitude estimation without QPE. |
| decoding-surface-codes.mdx:263 | Dennis, Kitaev, Landahl & Preskill (2002), decoding as a stat-mech phase transition | V | Paper is "Topological quantum memory" (arXiv:quant-ph/0110143, posted 2001; journal publication J. Math. Phys. 43, 4452, 2002 — "(2002)" citation year matches the published version). Confirmed the paper does map decoding onto a phase transition (Nishimori point) as claimed. |
| distinguishing-theorem-from-heuristic.mdx:193 | Farhi, Goldstone & Gutmann (2014), QAOA 0.6924 worst-case ratio, restricted to 3-regular triangle-free graphs | V | Confirmed title "A Quantum Approximate Optimization Algorithm," posted Nov 2014, arXiv:1411.4028. Independently confirmed the 0.6924 p=1 bound is specifically tight/proved for 3-regular **triangle-free** graphs — the lesson's caveat about restricted scope is accurate, not an invented hedge. |
| distinguishing-theorem-from-heuristic.mdx:330 | Dennis, Kitaev, Landahl & Preskill (2002) (duplicate reference, same paper) | V | Same as above. |
| grovers-algorithm-amplitude-amplification.mdx:57–61 | Grover, STOC '96, pp. 212–219 (1996), arXiv:quant-ph/9605043 | V | Confirmed exact title "A fast quantum mechanical algorithm for database search," presented STOC May 1996, pp. 212–219, arXiv id resolves and matches (both the inline prose citation and the `<ResearchConnection>` restating it). |
| capstone-what-we-know-and-dont.mdx:191 | "Google, 2019 (Sycamore)" quantum supremacy, IBM's classical rebuttal | V | Same underlying Arute et al. paper as above. The IBM classical-simulation rebuttal (disk-space-based simulation narrowing the classical-hardness margin) is a real, well-documented dispute. |
| universal-quantum-computation.mdx:186 | Barenco et al., *Physical Review A* 52, 3457 (1995), "Elementary gates for quantum computation" | V | Confirmed exact title, 9-author list (Barenco, Bennett, Cleve, DiVincenzo, Margolus, Shor, Sleator, Smolin, Weinfurter), PRA 52, 3457, 1995, arXiv:quant-ph/9503016 resolves and matches. |
| bells-theorem-and-local-hidden-variables.mdx:121–130 | J. S. Bell, "On the Einstein Podolsky Rosen Paradox," *Physics Physique Fizika* 1(3), 195–200 (1964); "fewer than a dozen citations in its first six years" | V | Confirmed exact title, journal, volume 1, issue 3, pages 195–200, 1964; link.aps.org DOI resolves. The "fewer than a dozen citations in six years" / obscure-journal claim independently confirmed by multiple physics-history sources (APS Physics, arXiv history papers). |
| spin-qubits.mdx:274 | "Intel Components Research; academic groups at Delft, UNSW, and RIKEN" — Tunnel Falls, Horse Ridge, 300mm fab | V (general, no formal paper cited) | Confirmed: Intel's Tunnel Falls is a real 300mm-CMOS silicon spin-qubit chip; Horse Ridge is a real cryogenic control chip; Intel–QuTech (Delft) collaboration and Intel–RIKEN MOU (May 2023) confirmed. UNSW is independently a leading isotopically-purified-silicon spin-qubit group (Morello/Dzurak); no direct Intel–UNSW partnership was found in search, but the lesson does not claim one — it lists UNSW alongside Delft and RIKEN only as a group "pushing" the technology, which is accurate. This citation carries no title/URL to verify against, by design (general institutional claim). |
| quantum-entropy-and-information-measures.mdx:330 | Horodecki, Oppenheim & Winter (2005), quantum state merging | V | Confirmed title "Quantum state merging and negative information," posted Dec 2005 (arXiv:quant-ph/0512247, journal pub. Comm. Math. Phys. 2007). The operational-meaning-of-S(A\|B) claim matches the paper's actual content. |
| trace-distance-and-fidelity.mdx:144 | "Google Quantum AI, Sycamore processor (2019)," cross-entropy benchmarking | V | Same Arute et al. 2019 paper; XEB-based distinguishability claim matches the paper's methodology. |
| schmidt-decomposition-and-purification.mdx:162 | A. Ekert & P. L. Knight, *Am. J. Phys.* 63(5), 415–423 (1995) | V | Confirmed exact title "Entangled quantum systems and the Schmidt decomposition," AJP vol. 63, issue 5, pp. 415–423, May 1995. DOI resolves (redirects to AIP Publishing page, confirmed via search after 403 on direct fetch). |
| the-threshold-theorem.mdx:109 | HistoricalMoment "1996–1998" — threshold theorem proved independently by Shor, Aharonov–Ben-Or, Kitaev, Knill/Laflamme/Zurek | V | Confirmed: Aharonov & Ben-Or (STOC 1997, preprint 1996), Kitaev (Russian Math. Surveys 52, 1997), Knill/Laflamme/Zurek (Proc. R. Soc. A 454, 1998). The "1996–1998" range is a defensible span across these independent results. |
| writing-your-first-circuit.mdx:212 | HistoricalMoment "2016" — IBM free cloud access to real hardware | V | Confirmed: IBM Quantum Experience launched publicly 4 May 2016, free access, 5-qubit processor. |
| why-quantum-errors-are-different.mdx:47 | HistoricalMoment "1995" — Shor's nine-qubit code | V | Confirmed: Shor 1995, first quantum error-correcting code, 9 physical qubits per logical qubit, corrects arbitrary single-qubit errors. |
| why-quantum-errors-are-different.mdx:51 | HistoricalMoment "1996" — Steane's seven-qubit code | V | Confirmed: Steane 1996, "Multiple-Particle Interference and Quantum Error Correction," Proc. R. Soc. A 452, 2551–2577, arXiv:quant-ph/9601029. |
| the-bloch-sphere.mdx:52 | HistoricalMoment "1961," Stanford — Bloch's nuclear-induction/spin-precession work named the Bloch sphere | **C — was wrong** | See Corrections below. |
| the-deutsch-jozsa-algorithm.mdx:109 | HistoricalMoment "1985" — Deutsch's paper | V | Confirmed: Deutsch, "Quantum theory, the Church–Turing principle and the universal quantum computer," Proc. R. Soc. A, 1 July 1985. |
| measurement-and-probability.mdx:71 | HistoricalMoment "1922" — Stern–Gerlach experiment | V | Confirmed: Stern & Gerlach, 1922, silver-atom beam split into two discrete spots. |
| dirac-notation.mdx:96 | HistoricalMoment "1933" — Dirac shares Nobel Prize | V | Confirmed: Nobel Prize in Physics 1933 awarded jointly to Schrödinger and Dirac. |
| the-chsh-inequality.mdx:58 | HistoricalMoment "1982" — Aspect's experiments | V | Confirmed: Aspect, Dalibard & Roger, "Experimental Test of Bell's Inequalities Using Time-Varying Analyzers," PRL 49, 1804 (1982), Orsay — matches the S=2√2 CHSH context of this specific lesson. |
| capstone-comparing-quantum-advantage.mdx:58 | HistoricalMoment "2019" — Google's 53-qubit Sycamore | V | Same Arute et al. 2019 paper. |
| bell-states-and-entanglement.mdx:63 | HistoricalMoment "1981," Orsay — Aspect's entangled-photon experiment | V (plausible attribution) | Matches the earlier Aspect, Grangier & Roger, PRL 47, 460 (1981), Orsay — a real, distinct Aspect experiment predating the 1982 time-varying-analyzer one cited elsewhere in the corpus. Both dates are independently real Aspect results; no internal contradiction. |
| bells-theorem-and-local-hidden-variables.mdx:124 | HistoricalMoment "1935" — EPR paper | V | Confirmed: Einstein, Podolsky & Rosen, *Phys. Rev.* 47, 777–780, 15 May 1935. |
| the-no-cloning-theorem.mdx:66 | HistoricalMoment "1982" — Zurek & Wootters (and Dieks) derive no-cloning | V | Confirmed: Wootters & Zurek, "A single quantum cannot be cloned," *Nature* 299, 802–803 (28 Oct 1982); Dieks published an independent, near-simultaneous 1982 result. |
| t1-and-t2-decoherence.mdx:96 | HistoricalMoment "1946" — Bloch defines T1/T2 | V | Confirmed: Bloch, "Nuclear Induction," *Phys. Rev.* 70, 460 (1946) — the actual origin of T1/T2 and the vector/sphere model (this is the citation `the-bloch-sphere.mdx` was misdating; see Corrections). |
| clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx:120 | HistoricalMoment "1927" — Wigner proves the theorem | V | Confirmed: Wigner, *Z. Physik* 43, 624–652 (1927). |
| the-pauli-exclusion-principle.mdx:79 | HistoricalMoment "1925" — Pauli's paper, submitted Jan 16, 1925; Uhlenbeck/Goudsmit spin later that year | V | Confirmed exactly, including the specific submission date (16 Jan 1925) and the "two-valuedness" quote, and that Uhlenbeck & Goudsmit's spin proposal followed later in 1925. |
| superconducting-qubits.mdx:132 | HistoricalMoment "2024" — Google Willow, logical error rate drops with scale | V | Confirmed: Google, "Quantum error correction below the surface code threshold," *Nature* 638 (Dec 2024), arXiv:2408.13687. |
| decoding-surface-codes.mdx:298 | HistoricalMoment "December 2024," Google Quantum AI — Willow distance-3/5/7 patches, error rate halving | V | Confirmed precisely: error suppression factor ≈2.14 per +2 distance (halving is a fair rounding), distance-7 code on a 101-qubit processor, matches the lesson's claim exactly. |
| bqp-and-oracle-complexity.mdx:245–248 | Bennett, Bernstein, Brassard & Vazirani, *SIAM J. Comput.* 26(5), 1510–1523 (1997), arXiv:quant-ph/9701001 | V | Confirmed exact title "Strengths and Weaknesses of Quantum Computing," authors, volume, pages, year, arXiv id. |
| shors-algorithm-factoring-via-period-finding.mdx:90–94 | Shor, *SIAM J. Comput.* 26(5), 1484–1509 (1997), arXiv:quant-ph/9508027 | V | Confirmed exact title "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer," volume, pages, year, arXiv id. |
| universal-quantum-computation.mdx:320–321 | Boykin et al. 2000, Clifford+T universality | V | Confirmed: Boykin, Mor, Pulver, Roychowdhury & Vatan, "A new universal and fault-tolerant quantum basis," Information Processing Letters 75(3), 2000 (also FOCS 1999 / arXiv:quant-ph/9906054). |
| barren-plateaus-and-variational-trainability.mdx:461 | McClean et al. 2018, barren plateaus | V | Confirmed: McClean, Boixo, Smelyanskiy, Babbush & Neven, "Barren plateaus in quantum neural network training landscapes," *Nature Communications* 9, 4812 (2018). |
| quantum-error-mitigation.mdx:335–336 | Takagi et al. 2022, fundamental limit on error mitigation; "Quek et al." | V (Takagi); U (Quek) | Takagi confirmed: Takagi, Endo, Minagawa & Gu, "Fundamental limits of quantum error mitigation," *npj Quantum Information* 8, 114 (2022), arXiv:2109.04457 — exponential sampling-overhead result matches the lesson's claim exactly. "Quek et al." is given with no year, title, or venue — plausibly a real related paper (there is a body of Quek/Kwek work on error-mitigation limits) but not independently confirmable from the text given; reported as unverified rather than assumed. |
| stabilizer-formalism-basics.mdx:56, the-three-qubit-bit-flip-code.mdx:50 | Y. Salathé et al., *Physical Review X* 5, 021027 (2015) — image credit | V | Confirmed: Salathé, Mondal, Oppliger, et al. (12 authors, Wallraff group), "Digital quantum simulation of spin models with circuit quantum electrodynamics," PRX 5, 021027 (2015). |
| quantum-gates.mdx:47 | "Y. Salathé et al. (A. Wallraff group)" — image credit, no formal citation | V (general) | Same underlying paper/group as above; no volume/page given to mis-cite. |

## Corrections made

**`src/content/lessons/quantum-computing/qubits-and-quantum-states/the-bloch-sphere.mdx`, line 52**

- Before: `<HistoricalMoment date="1961" place="Stanford University">`
- After: `<HistoricalMoment date="1946" place="Stanford University">`
- Why: the block's text is "Felix Bloch's work on nuclear induction and spin precession gave the geometric picture derived in this lesson its name." That work — Bloch, "Nuclear Induction," *Phys. Rev.* 70, 460 (1946) — is what actually introduced the vector/sphere model, and is correctly dated 1946 elsewhere in this same corpus (`t1-and-t2-decoherence.mdx:96`, an independent `<HistoricalMoment>` about the same Bloch result). 1961 is the year of the Wikimedia photograph used as the lesson's `<ExternalFigure>` (Bloch at Stanford, per the image's own alt text/caption, which was left untouched — it correctly describes a 1961 photo, not a 1961 discovery). The `<HistoricalMoment>` date field had absorbed the photo's year instead of the cited work's year. `place="Stanford University"` was left unchanged since Bloch was at Stanford in both 1946 and 1961.
- Verified with `npx vitest run src/lib/content/__tests__/mdxHazards.test.ts src/lib/content` after the edit (see Coverage).

No other citation was altered. Every other citation checked out on title, authors, venue, volume/pages, year, URL, and claim-to-source match.

## Unverified

- **`quantum-error-mitigation.mdx:335–336`, "Quek et al."** — no year, title, or venue is given in the lesson, so there is nothing specific to check the claim against. It reads as a real, plausible companion citation to Takagi et al. 2022 (there is genuine literature on fundamental error-mitigation limits by authors named Quek), but I could not confirm which specific paper is meant, so I am not asserting it is correct or incorrect. Left untouched.
- **`spin-qubits.mdx:274`, UNSW's specific role** — the lesson lists UNSW alongside Delft and RIKEN as an academic group pushing isotopically-purified silicon devices. This is true of UNSW independently (Morello/Dzurak groups), but I found no source confirming a direct *Intel* partnership with UNSW analogous to the confirmed Intel–QuTech(Delft) and Intel–RIKEN relationships. The lesson's phrasing doesn't actually claim such a partnership (it says these groups are pushing the field, not that they partner with Intel), so this isn't flagged as wrong — noted here only because the underlying research-group claim is looser than the two neighboring ones and I could not independently confirm it to the same standard.
- **`the-threshold-theorem.mdx:109`, "1996–1998" as a range rather than three individual dates** — each individual result is confirmed (Aharonov–Ben-Or 1996 preprint/1997 STOC, Kitaev 1997, Knill/Laflamme/Zurek 1998), but the lesson compresses them into one span rather than dating each separately. This is a defensible simplification, not an error, but I'm noting it as a judgment call rather than a flat "verified."
- No paywalled or fully inaccessible sources were encountered — every citation resolved to at least a confirmable abstract via web search, even where a direct fetch hit a login wall (Nature) or a 403 (AIP, APS).

## Coverage

**Checked:** every `<ResearchConnection>` block (17) and every `<HistoricalMoment>` block (18) in `src/content/lessons/**`; every inline prose citation carrying a full author/journal/volume/page or arXiv id (10 more instances, some duplicating the same underlying paper as a component above); every `https://` URL in the lesson corpus was inventoried and cross-checked against `next.config.ts`'s CSP `img-src` allowlist (`upload.wikimedia.org`, `www.nist.gov`) — confirmed zero violations, and `npx vitest run src/lib/content/__tests__/lessonImages.test.ts` passes independently. For each citation with a URL, the URL was fetched (WebFetch) or its target independently confirmed via search when the direct fetch hit a login/paywall; for each citation's factual claim, the underlying paper's actual topic/result was checked against what the lesson attaches to it, not just the bibliographic metadata in isolation.

**Not checked:** `src/content/problems/**` (explicitly out of scope per the task's file ownership). Citations to textbooks, named theorems, or general physics facts with no author/year/venue attached (e.g. plain mentions of "the Schrödinger equation") were not treated as citations requiring verification — only claims carrying a specific, checkable bibliographic assertion (a name+year, a journal+volume, or a URL) were audited. I did not attempt to verify every secondary/tertiary web-search source's own reliability beyond cross-checking 2–3 independent sources per claim where the claim was non-trivial (e.g. the Bell-paper citation-count claim, the QAOA triangle-free restriction, the Willow error-suppression factor).

---

# Re-run: Citation Audit, 2026-08-30

> This section is appended, not a rewrite. Everything above stands as
> written on 2026-08-26. This pass closes the coverage gap that section
> flagged: the whole of `<ResearchConnection>`, `<HistoricalMoment>`,
> `<ExternalFigure>`/`<AnnotatedFigure>` attribution, and inline
> bibliographic prose in `src/content/lessons/**`.

## Corpus totals, re-derived 2026-08-30

Counted from the raw `.mdx` source, not trusted from the note above:

| Component | Count | Files |
|---|---|---|
| `<ResearchConnection>` | **51** | 34 |
| `<HistoricalMoment>` | **19** | 17 |
| `<ExternalFigure>` | **133** | |
| `<AnnotatedFigure>` | **8** | |

The 2026-08-29 recount of 51 / 19 was correct. Figure attribution
(133 + 8 = 141 credit/creditUrl/license triples) had never been audited
for *truth* before, only for CSP and non-emptiness.

## What was checked

- **All 51 `<ResearchConnection>` blocks.** For each: does the paper
  exist under that title with those authors; do journal, volume, page
  and arXiv id match; and does the paper actually say what the block
  says it says. Bibliographic detail was checked against the arXiv
  `journal-ref` line or the publisher record, not against memory.
- **All 19 `<HistoricalMoment>` blocks** (18 of them re-checks of the
  earlier pass, plus `capstone-comparing-quantum-advantage.mdx`, whose
  date field is now `"October 2019"`).
- **All 141 figure credits.** Every `creditUrl` was resolved: 138 point
  at Wikimedia Commons, 3 at nist.gov. The 126 unique Commons files were
  pulled through the Commons `imageinfo`/`extmetadata` API and, where
  the machine-readable summary disagreed with the declared string, the
  page's raw wikitext and the license template itself were read.
- **Inline prose citations**: every `arXiv`, `doi`, `et al.`,
  `Phys. Rev`, `Nature N`, `Science N`, `SIAM`, `J. Math`, `Proc. R. Soc`,
  `npj`, `Rev. Mod` match outside a component block.

## Verdict

Of 51 `<ResearchConnection>` blocks, **48 were correct in every checkable
respect**; three carried a defect and are corrected below. Of 19
`<HistoricalMoment>` blocks, 19 dates are correct; one had its author
order reversed against the paper's byline and is corrected. Of 141
figure credits, **134 were accurate as written**; six carried a wrong
license string and one named a rights holder the source does not name.

No fabricated citation, no invented DOI, no wrong volume or page number,
and no dead `creditUrl` was found anywhere in the corpus. The three
`<ResearchConnection>` defects are all of the same kind, and it is the
kind this audit exists to catch: the bibliography was right and the
sentence about what the paper *did* was wrong.

## Corrections made

### 1. Forrelation credited to the wrong paper (priority error)

`src/content/lessons/apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp.mdx:208`

- Before: source `"Aaronson & Ambainis, STOC 2015 (arXiv:1411.5729); Raz & Tal, STOC 2019"`,
  body opening "Aaronson and Ambainis introduced the Forrelation problem
  ... and conjectured it could separate BQP from the polynomial
  hierarchy relative to an oracle."
- After: Aaronson (STOC 2010, arXiv:0910.4698) added to the source list;
  the body now credits Aaronson with introducing the problem (as Fourier
  Checking) and making the conjecture, Aaronson and Ambainis with the
  renaming and the matching query bounds, and Raz and Tal with the proof.
- Evidence: Aaronson & Ambainis's own paper says so. arXiv:1411.5729,
  introduction: "In 2009, Aaronson [1] introduced the Forrelation
  problem", "which Aaronson introduced for a different purpose than the
  one that concerns us here (he was interested in an oracle separation
  between BQP and the polynomial hierarchy)", and "Also, in [1], the
  problem was called 'Fourier Checking'." Reference [1] is Aaronson,
  "BQP and the Polynomial Hierarchy," STOC 2010 / arXiv:0910.4698,
  which defines the problem and states the BQP-vs-PH target.
- Why it matters here specifically: the block's own closing sentence
  offers itself as "a case study in how relativized evidence
  accumulates: a well-chosen problem, a conjecture about it, a proof
  years later." Collapsing the first two stages into one paper is
  exactly the failure the passage is teaching against.

### 2. Childs & Wiebe's LCU described with a later paper's construction

`src/content/lessons/apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries.mdx:258`

- Before: "...in its original setting: simulating $e^{-iHt}$ by summing
  the terms of a Taylor or Chebyshev series, each of which is a unitary,
  rather than by a product formula."
- After: "...in its original setting: simulating $e^{-iHt}$ with a
  multi-product formula, a weighted sum of several Trotter-Suzuki
  product formulas whose leading error terms cancel, rather than a
  single product. Summing a truncated Taylor series or a Chebyshev
  series with the same primitive came a few years later."
- Evidence: Childs & Wiebe, *Quantum Information and Computation* 12,
  901 (2012), arXiv:1202.5822. The bibliographic detail in the citation
  is exactly right; the description of the construction was not. The
  paper's abstract offers "a new approach to simulating Hamiltonian
  dynamics based on implementing linear combinations of unitary
  operations rather than products of unitary operations," and the
  linear combination it implements is over *multi-product formulas*
  (linear combinations of Trotter-Suzuki products). The truncated-Taylor
  -series LCU is Berry, Childs, Cleve, Kothari & Somma (2014-2015) and
  the Chebyshev-series form is Berry, Childs & Kothari (2015). Both
  postdate this paper, so attributing them to it inverts the order.
- Not touched: the rest of the block (the $\lVert\alpha\rVert_1$
  normalization and the $1/\lVert\alpha\rVert_1^2$ success probability),
  which is correct and is the point the lesson actually needs.

### 3. A T-count simulation exponent the cited paper does not state

`src/content/lessons/apex/simulation-and-compilation-frontiers/when-classical-simulation-works.mdx:332`

- Before: "Bravyi and Gosset give the T-count route, simulating
  Clifford-plus-$t$-T-gates circuits in time scaling roughly as
  $2^{0.47t}$".
- After: "...in time scaling as $2^{0.5t}$ for one output probability,
  and $2^{0.23t}$ for sampling".
- Evidence: Bravyi & Gosset, *Phys. Rev. Lett.* 116, 250501 (2016),
  arXiv:1601.07601. The abstract gives the two runtimes as
  $\mathrm{poly}(n,m)+2^{0.5t}t^3$ (computing the probability of a given
  output) and $\mathrm{poly}(n,m)+2^{0.23t}t^3w^3$ (sampling). The
  string "0.47" does not appear in the paper. 0.47 is the exponent of a
  *stabilizer-rank* bound ($7^{1/6}\approx2^{0.468}$) from the adjacent
  Bravyi, Smith & Smolin line of work, not a runtime this paper claims.
  The lesson's surrounding point (an exponential with a base small
  enough that a few dozen T gates stay simulable) survives either
  number; the number attached to the citation is now the paper's own.

### 4. Wootters and Zurek, in the paper's own author order

`src/content/lessons/quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem.mdx:67`

- Before: "Wojciech Zurek and William Wootters derive the no-cloning
  theorem..."
- After: "William Wootters and Wojciech Zurek derive the no-cloning
  theorem..."
- Evidence: W. K. Wootters and W. H. Zurek, "A single quantum cannot be
  cloned," *Nature* 299, 802-803 (1982). The independent Dieks credit in
  the same block was already correct and is untouched. The figure
  caption above it leads with Zurek because the photograph is of Zurek;
  that is not a citation and was left alone.

### 5. HSW was not a collaboration

`src/content/lessons/quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise.mdx:230`
(figure caption)

- Before: "...and whose work with Schumacher and Westmoreland later
  turned that single-measurement bound into the full channel-capacity
  theorem (HSW)..."
- After: "...and whose later capacity theorem, proved independently of
  Schumacher and Westmoreland's, turned that single-measurement bound
  into the full channel-capacity result (HSW)..."
- Evidence: Schumacher & Westmoreland, *Phys. Rev. A* 56, 131 (1997) and
  Holevo, *IEEE Trans. Inf. Theory* 44, 269 (1998) are independent
  results by disjoint author sets. "HSW" names a theorem with two
  independent proofs, not a three-author paper. The 1973 Holevo bound
  credit in the same caption is correct and untouched.

### 6. Five LANL figure licenses, and one that named the wrong government

Six figures in the corpus use images carrying Commons's
`{{PD-LosAlamos}}` tag. That template is not a public-domain
dedication: it records that "LANL allowed anyone to use it for any
purpose, **provided that** the copyright holder is properly attributed,"
and Commons classifies it as an attribution license. The corpus was
declaring it four different ways, three of them wrong. All six now read
`license="Attribution (LANL)"`.

| File | Before | Commons |
|---|---|---|
| `quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation.mdx:80` | `Public domain (U.S. federal government work)` | `{{PD-LosAlamos}}` |
| `quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices.mdx:58` | `Public domain` | `{{PD-LosAlamos}}` |
| `quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness.mdx:121` | `Public domain` | `{{PD-LosAlamos}}` |
| `quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem.mdx:64` | `Public domain (LANL)` | `{{PD-LosAlamos}}` |
| `quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states.mdx:49` | `Public domain (LANL)` | `{{PD-LosAlamos}}` |
| `quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge.mdx:62` | `Attribution, LANL` | `{{PD-LosAlamos}}` |

The Feynman Los Alamos badge photograph is the sharpest of these: it was
credited to the U.S. federal government, and LANL is a
contractor-operated laboratory whose images are not U.S. government
works. The remaining five were understating an attribution requirement
the corpus in fact satisfies (each already names LANL in `credit`), so
no image was being used outside its license; the *statement* of the
license was wrong.

### 7. A portrait credited to an institution that does not hold it

`src/content/lessons/apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries.mdx:160`

- Before: `credit="University of Maryland / Wikimedia Commons"`
- After: `credit="SebastosOctavian / Wikimedia Commons"`
- Evidence: `File:Professor_Andrew_Childs.jpg` on Commons is
  `|source={{own}}`, `|author=[[User:SebastosOctavian]]`, licensed
  `{{self|cc-by-sa-4.0}}`. Nothing on the file page involves the
  University of Maryland; the credit had inferred an institution from
  the subject's affiliation. The declared `CC BY-SA 4.0` was correct and
  is unchanged.

### 8. An unfinishable citation, finished

`src/content/lessons/quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation.mdx:349`

The 2026-08-26 pass listed "Quek et al." as **UNVERIFIED** because the
lesson gave no year, title or venue and there was nothing specific to
check. Resolved: the paper is Quek, Stilck França, Khatri, Meyer &
Eisert, "Exponentially tighter bounds on limitations of quantum error
mitigation," *Nature Physics* 20, 1648 (2024), arXiv:2210.11505, which
proves that a superpolynomial number of samples is needed in the worst
case, exactly the "proven fundamental limit" the sentence claims. The
citation now reads `Quek et al. 2024`, which makes it checkable by a
reader. The neighbouring Takagi et al. 2022 citation was re-confirmed
and is unchanged.

## Checked and correct: everything else

Spot-list of the bibliographic detail confirmed against arXiv
`journal-ref` or the publisher record on this pass, all of which matched
the corpus exactly (title, author list, journal, volume, page, year,
arXiv id where given):

Brassard, Høyer, Mosca & Tapp, AMS Contemp. Math. 305, 53 (2002) ·
Suzuki et al., *Quantum Inf. Process.* 19, 75 (2020) · Grinko, Gacon,
Zoufal & Woerner, *npj Quantum Inf.* 7, 52 (2021) · Harrow, Hassidim &
Lloyd, PRL 103, 150502 (2009) · Childs, Kothari & Somma, *SIAM J.
Comput.* 46, 1920 (2017) · Tang, arXiv:1807.04271 · Low & Chuang, PRL
118, 010501 (2017) · Low & Chuang, *Quantum* 3, 163 (2019) · Dong, Meng,
Whaley & Lin, PRA 103, 042419 (2021) · Gilyén, Su, Low & Wiebe, STOC
2019 · Martyn, Rossi, Tan & Chuang, arXiv:2105.02859 · Gidney & Ekerå,
*Quantum* 5, 433 (2021) (including the 10⁻³ gate error, 1 µs cycle,
20M-qubit / 8-hour and "hundredfold spacetime improvement" figures,
all of which are the paper's own) · Dennis, Kitaev, Landahl & Preskill
(2002) · Google Quantum AI and Collaborators, *Nature* 638, 920 (2025) ·
Delfosse & Nickerson, *Quantum* 5, 595 (2021) · Horsman, Fowler, Devitt
& Van Meter, *NJP* 14, 123011 (2012) · Brown, Laubscher, Kesselring &
Wootton, PRX 7, 021029 (2017) · Moussa, PRA 94, 042316 (2016) · Bravyi
& Kitaev, PRA 71, 022316 (2005) · Bravyi & Haah, PRA 86, 052329 (2012) ·
Kitaev, *Ann. Phys.* 303, 2 (2003) · Fowler, Mariantoni, Martinis &
Cleland, PRA 86, 032324 (2012) · Shor, FOCS 1996 · Aharonov & Ben-Or,
STOC 1997 · Knill, Laflamme & Zurek, *Science* 279, 342 (1998) ·
Aliferis, Gottesman & Preskill, *QIC* 6, 97 (2006) · Arute et al.,
*Nature* 574, 505 (2019) · Pednault et al., arXiv:1910.09534 · Pan, Chen
& Zhang, PRL 129, 090502 (2022) (512 GPUs, ~15 hours: the lesson's "on
the order of a day on a several-hundred-GPU cluster" is the paper's own
number) · Bouland, Fefferman, Nirkhe & Vazirani, *Nature Physics* 15,
159 (2019) · Anshu, Breuckmann & Nirkhe, STOC 2023 · Mahadev, FOCS 2018
(LWE assumption confirmed in the abstract) · Raz & Tal, STOC 2019 ·
Aharonov & Naveh, arXiv:quant-ph/0210077 · Marriott & Watrous,
*Comput. Complex.* 14, 122 (2005) · Ambainis, *JCSS* 64, 750 (2002) ·
Beals, Buhrman, Cleve, Mosca & de Wolf, *JACM* 48, 778 (2001) · Kempe,
Kitaev & Regev, *SIAM J. Comput.* 35, 1070 (2006) · Oliveira & Terhal,
*QIC* 8, 900 (2008) · Farhi, Goldstone & Gutmann, arXiv:1411.4028 ·
Preskill, *Quantum* 2, 79 (2018) · Bravyi, Cross, Gambetta, Maslov, Rall
& Yoder, *Nature* 627, 778 (2024) (the [[144,12,12]] code and the
12-logical-in-288-physical figure are the paper's own) · Dawson &
Nielsen, *QIC* 6, 81 (2006) (including $c\approx3.97$) · Ross &
Selinger, *QIC* 16, 901 (2016) · Murali, Baker, Javadi-Abhari, Chong &
Martonosi, ASPLOS 2019 · Reiher, Wiebe, Svore, Wecker & Troyer, *PNAS*
114, 7555 (2017) · von Burg, Low, Häner, Steiger, Reiher, Roetteler &
Troyer, *Phys. Rev. Research* 3, 033055 (2021) · Vidal, PRL 91, 147902
(2003) · Schollwöck, *Ann. Phys.* 326, 96 (2011) · Aaronson & Gottesman,
PRA 70, 052328 (2004) · Markov & Shi, *SIAM J. Comput.* 38, 963 (2008) ·
Childs, Su, Tran, Wiebe & Zhu, PRX 11, 011020 (2021) · Campbell, PRL
123, 070503 (2019) (the "two to three orders of magnitude" claim is the
paper's 306× to 1591×) · Horodecki, Oppenheim & Winter,
arXiv:quant-ph/0512247 · Peres, PRL 77, 1413 (1996) · Horodecki,
Horodecki & Horodecki, *Phys. Lett. A* 223, 1 (1996) · P. Horodecki,
*Phys. Lett. A* 232, 333 (1997) · Horodecki, Horodecki & Horodecki, PRL
80, 5239 (1998) · Gorini, Kossakowski & Sudarshan, *J. Math. Phys.* 17,
821 (1976) · Lindblad, *Commun. Math. Phys.* 48, 119 (1976) · Takagi,
Endo, Minagawa & Gu, *npj Quantum Inf.* 8, 114 (2022) · Pogorelov et
al., *PRX Quantum* 2, 020343 (2021).

The seven-paper reading list at the end of
`apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx`
was checked title-by-title and is accurate throughout.

Figure attribution verified rather than assumed, in cases where a
machine diff looked like a mismatch but was not:

- The five NIST Flickr photographs whose credits name an individual
  (`Y. Colombe / NIST`, `Bill Pietsch`, `Signe Seidelin and John
  Chiaverini / NIST`, `Markus Greiner / JILA`) each match a
  `Credit: ...` line in the Commons file's own description. All are
  `{{PD-USGov-NIST}}`, matching the declared license.
- `Willard_Gibbs.jpg`: the declared "Manuscripts & Archives, Yale
  University Library" is verbatim the Commons page's `credit line`
  field (RU 686), despite the `author` field naming only the uploader.
- `Pieter_Zeeman.jpg`: the declared `CC BY-SA 3.0 NL` is right. The
  page's license header is `{{Nationaal Archief-license}}`, which
  defaults to `cc-by-sa-3.0-nl`; the `{{PD-US}}` tag that a metadata
  scrape surfaces sits in the description body, not the license header.
- `NMR-Spectrometer.JPG`: the declared `CC BY-SA 2.5` is right. The file
  is multi-licensed `{{self|GFDL|Cc-by-sa-3.0-migrated|Cc-by-sa-2.5,2.0,1.0}}`.
- `Portrait_of_Arnold_Sommerfeld.jpg`: `{{AIP}}` is an
  attribution-only license, so "Free use with attribution" is a fair
  rendering, and the credit names AIP's Emilio Segrè Visual Archives,
  W. F. Meggers Collection, as the file page does.
- The eight `<AnnotatedFigure>` credits all matched Commons on author
  and license (`OJB Quantum` = Onri Jay Benally, `PrestonHuft` = Preston
  Huft, `FMNLab` = FMN Laboratory, and so on: Commons usernames rendered
  as the person's name, which is more informative, not less accurate).

Historical dates and named-discovery captions re-checked and correct:
Stern-Gerlach February 1922 and Stern's 1943 Nobel; Pauli's 16 January
1925 submission; Wigner 1927 and his 1963 Nobel; Dirac's 1933 Nobel;
Bloch 1946 (the 2026-08-26 correction holds, and the 1961 date survives
only in the photograph's caption, where it belongs); Aspect 1981 Orsay
and 1982 time-varying analyzers, and the 2022 Nobel share; EPR 1935;
Bell 1964 on leave from CERN; Shor 1995 and Steane 1996; Deutsch 1985
with Deutsch-Jozsa 1992; IBM's 2016 free cloud access; Google's October
2019 announcement; Willow, December 2024; Cirac & Zoller 1995;
NIST's 2004 atomic-state teleportation; Tonomura 1989; JILA 1995 BEC;
Binnig & Rohrer's 1981 STM; Berry 1984; Noether 1918; Cayley 1858;
Peano 1888; Rutherford 1911; Aharonov, Davidovich & Zagury 1993;
Bennett-Bernstein-Popescu-Schumacher 1996; Fifth Solvay 1927.

## Unverified, and reported rather than guessed

- **`arXiv:1910.11333` is the Sycamore paper's *supplementary
  information*, not the paper.** Two blocks
  (`apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx:221`
  and `apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims.mdx:232`)
  cite `Arute et al., Nature 574, 505 (2019) (arXiv:1910.11333)` and
  link to it. The arXiv record's own title is "Supplementary information
  for 'Quantum supremacy using a programmable superconducting
  processor'"; its `journal-ref` is "Nature, Vol 574, 505 (2019)". The
  main paper was never posted to arXiv, so there is no better arXiv id,
  and this is the identifier the field uses. Left as is, and recorded
  here rather than silently "fixed": on a track that teaches paper
  reading, a reader who follows the link and finds a supplement should
  be able to find out why from this log. A one-word annotation in the
  `source` string would close it if someone wants it closed.
- **`spin-qubits.mdx:301`, UNSW's role.** Unchanged from 2026-08-26 and
  still unresolved to the same standard as its two neighbours; see that
  section's Unverified list. The lesson does not claim an Intel-UNSW
  partnership, so this remains a note, not a defect.
- **`the-threshold-theorem.mdx:144`, "1996-1998" as a span.** Unchanged
  and still a defensible compression rather than an error; see above.
- **Kramers portrait credit.** `the-wkb-approximation.mdx:76` credits
  `File:Kramers_1928.jpg` to "AIP Emilio Segrè Visual Archives,
  Goudsmit Collection". The Commons page's own license is `{{PD-old}}`
  and its `source`/`author` fields point at another Commons file, while
  the AIP archive appears in the description only as where a
  high-resolution copy may be obtained. The declared `Public domain`
  license is right. The credit is plausible and generous rather than
  demonstrably wrong, so it was left alone and is flagged here.
- **Von Neumann and the density matrix.**
  `from-state-vectors-to-density-matrices.mdx:55` says von Neumann
  "introduced the density matrix ... in 1927". That is true and is the
  standard attribution, but Lev Landau introduced the same object
  independently in 1927. This is a co-discovery the caption is silent
  about. Reported rather than rewritten: the fix is a clause in a
  caption another agent may be working in, and the sentence as written
  is not false.

## Claims the citation supports but the surrounding prose stretches

Reported, not rewritten, per scope. None of these is a wrong citation.

- **`distinguishing-theorem-from-heuristic.mdx:199`** describes Farhi,
  Goldstone & Gutmann's guarantee as holding "only on a restricted graph
  class: 3-regular graphs." That is what the paper proves. The
  2026-08-26 pass recorded the tight 0.6924 bound as specific to
  3-regular *triangle-free* graphs; the current lesson text no longer
  quotes 0.6924, so the two are not in conflict, but anyone
  re-introducing the number should re-introduce the triangle-free
  qualifier with it.
- **`evaluating-quantum-advantage-claims.mdx:257`** reads "produced
  correlated samples ... in on the order of a day". The stacked
  preposition ("in on") is a prose defect, not a citation one, and is
  left for whoever owns that lesson's prose.
- **`capstone-what-we-know-and-dont.mdx:229`** says Pednault et al.
  "argued within weeks" of the Sycamore result. arXiv:1910.09534 was
  posted 21 October 2019, two days *before* the Nature paper appeared
  (the manuscript had leaked in September). "Within weeks" is true of
  the dispute but understates how fast the rebuttal actually was.

## Method, for the next re-run

The figure sweep is the part worth automating and was, this pass:
extract every `credit`/`creditUrl`/`license` triple from the raw `.mdx`,
map each Commons `creditUrl` to a file title, batch them through
`commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata`
(25 titles per request), and diff the declared license and credit
against `LicenseShortName` and `Artist`. That produced 16 license
diffs and 22 credit diffs, of which 7 and 1 respectively were real; the
rest are Commons usernames rendered as real names, NIST rendered as
"National Institute of Standards and Technology", or equivalent license
wordings. **The scrape is a triage tool, not a verdict**: five of the
sixteen license "mismatches" were correct as declared and only reading
the page's raw wikitext and its license template showed it. Every diff
this script raises still needs a human to open the file page.
