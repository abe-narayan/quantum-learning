# Scientific-Integrity Audit — StudyQuantum Restructuring Sprint

> **This file is a findings log, not a guide.** It is a one-time verification
> of one specific diff, the visual-restructuring sprint's uncommitted
> working tree on top of `80eab57`, and it answers exactly one question:
> did the restructuring corrupt any science? **Nothing in it is a rule**, and
> nothing in it should be read as covering any change made after 2026-08-26.
> The corpus has moved substantially since.
>
> Its lasting value is the **Method** section at the end: a repeatable
> mechanical procedure (a LaTeX-span multiset comparison across a whole diff)
> for asking the same question of the next content-restructuring sprint. Use
> that; do not assume this verdict still holds over later work.
>
> The one live thread out of this audit is its two risk findings (citation
> detail added without lesson-internal sourcing), which
> [`CITATION_AUDIT.md`](CITATION_AUDIT.md) picked up and confirmed as
> factually accurate.

Audit date: 2026-08-26
Scope: uncommitted working-tree changes at the time of this audit (`git status` clean commit history at `80eab57`; this audit covers everything currently uncommitted under `src/content/`).

## Verdict

**Scientific and mathematical content was preserved.** Across the full 219-file lesson diff (4,106 insertions / 1,164 deletions) and the 99-file problem-retiering diff (99 insertions / 99 deletions), I found **zero corruptions** — no equation, number, unit, definition, bound, or derivation step was altered in meaning anywhere I checked, and a mechanical whole-diff check (below) found no case where any `$...$`/`$$...$$` LaTeX span was dropped or introduced without an exact counterpart on the other side. The dominant pattern, confirmed by close reading of 19 substantially-changed lessons across all six pillars, is exactly what was asked for: existing prose and equations lifted verbatim into new components (`LessonHook`, `DerivationSteps`, `EquationReveal`, `InsightBlock`, `ResearchConnection`, `HistoricalMoment`, `NextDiscovery`, `ObservePredictExplain`, `PredictBeforeReveal`), with the step-by-step annotations added on `DerivationStep` being correct justifications for the math they're attached to in every case sampled. The one prose self-correction artifact called out for a targeted fix (`block-encodings-and-linear-combinations-of-unitaries.mdx`) was fixed exactly as instructed, with the correct numeric values untouched. The one lesson with raw-LaTeX chip labels called out for restructuring (`clebsch-gordan...mdx`) preserved its three-term recursion and worked example exactly.

The one caveat, not a corruption: two new `ResearchConnection` citations assert bibliographic detail (a paper title in one case, a full journal citation with volume/pages/DOI URL in the other) that is **not traceable to that lesson's pre-existing text**, even though both are factually accurate real papers. Per the audit's brief, these count as findings — added, unverified-in-lesson claims — even though true.

## Findings

No corruptions found. Two risk-category findings (both benign in substance, non-compliant in process), zero benign-only items are itemized below (the several hundred pure reformatting changes are not itemized individually — see Method for how they were verified as a class).

### Risk 1 — Citation detail added without lesson-internal sourcing (Arute et al.)
- **File:** `src/content/lessons/quantum-software/simulating-quantum-systems/computational-cost-and-scaling.mdx`
- **Before:** plain prose, no formal citation: *"This is why Google's 2019 Sycamore experiment used 53 qubits specifically: that qubit count was chosen to sit just past what any existing supercomputer could feasibly state-vector-simulate directly..."*
- **After:** the same paragraph wrapped in `<ResearchConnection title="Choosing a qubit count to sit past the wall" source="Arute et al., Nature 574, 505-510 (2019)" url="https://www.nature.com/articles/s41586-019-1666-5">`.
- **Assessment:** **Risk**, not corruption. The added citation (authors, journal, volume, page range, DOI URL) is factually correct — this is the real Google quantum-supremacy paper — but none of "Arute," "Nature 574," "505-510," or the URL appear anywhere in the lesson's pre-existing text. It is an added, unverifiable-from-lesson-content assertion, which the audit brief treats as a finding regardless of truth.

### Risk 2 — Paper title added without lesson-internal sourcing (Barenco et al.)
- **File:** `src/content/lessons/quantum-computing/quantum-gates-and-circuits/universal-quantum-computation.mdx`
- **Before:** *"The **universality theorem** (Barenco et al. 1995; stated here as a ...)"* — no paper title given anywhere in the lesson.
- **After:** `<ResearchConnection title="Elementary gates for quantum computation" source="Barenco et al., 1995">`.
- **Assessment:** **Risk**, not corruption. "Elementary gates for quantum computation" is the real title of Barenco et al.'s 1995 Phys. Rev. A paper, but the title itself is new information not present in the lesson before this change.

Both risk items are citation-embellishment, not science content changes — no formula, number, or physical claim is affected in either file. I did not find any other new citation, date, name, or URL that failed the traceability check (see Method).

### Everything else checked: benign
- **The 99 problem-difficulty retierings** (`src/content/problems/apex/**`, `src/content/problems/quantum-mastery/**`): confirmed mechanically that every file changed exactly one line, `difficulty: "advanced"` → `difficulty: "master"`, with no other line touched in any of the 99 files (verified via full-diff grep, not sampling).
- **`block-encodings-and-linear-combinations-of-unitaries.mdx`**: the stray self-correction clause `($a=d=0$... more precisely $a=0.5,\,d=-0.5,\,b=0.5$...)` was cleanly reduced to `($a=0.5,\,d=-0.5,\,b=0.5$ read off the matrix above)`, correct values retained, formula and downstream numbers ($\lambda_\pm\approx\pm0.707107$) untouched. Verified by recomputing $\lambda_\pm=\frac{a+d}{2}\pm\sqrt{(\frac{a-d}{2})^2+b^2}$ with $a=0.5,d=-0.5,b=0.5$: gives $0\pm\sqrt{0.5}=\pm0.707107$, matching.
- **`clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx`**: the three-term recursion $\sqrt{j(j+1)-m(m-1)}\,C^{j,m-1}_{j_1m_1;j_2m_2}=\sqrt{j_1(j_1+1)-m_1(m_1+1)}\,C^{j,m}_{j_1,m_1+1;j_2m_2}+\sqrt{j_2(j_2+1)-m_2(m_2+1)}\,C^{j,m}_{j_1m_1;j_2,m_2+1}$ was split across three `DerivationStep`s but is byte-identical when concatenated; the worked $l=1\otimes s=\tfrac12$ example's four steps (top state, ladder normalization $\sqrt3$, right-hand expansion, division) all check out numerically. All raw-LaTeX `EquationReveal` chip labels observed elsewhere were replaced with human-readable symbol/gloss pairs, not with altered math.
- **19 lessons read in full, before and after, across all six pillars** (list in Coverage): every `DerivationSteps` conversion preserved every original equation verbatim, in the original order, and every step's added `annotation` is a correct justification for that specific step (I checked signs, indices, and intermediate arithmetic by hand for each, e.g. the Ehrenfest $[\hat p^2,\hat x]=-2i\hbar\hat p$ expansion, the Choi-matrix Kraus-recovery proof, the Stinespring isometry check, the QSP $d=1$ matrix multiplication, the adversary-bound $\mathrm{ADV}(\mathrm{OR}_N)=\sqrt N$ computation).
- **New numeric/interactive content** (not present before, but computational rather than citational) checked and confirmed correct: the `cryogenic-systems.mdx` "n̄≈16.2 at 4K" figure (recomputes correctly from $\bar n=1/(\exp(\hbar\omega/k_BT)-1)$ for a 5 GHz qubit, and the number itself was already in the lesson's pre-existing table); the `circuit-representation-in-code.mdx` `CircuitStateStepper` demo of H,Z,H on $|0\rangle$ (correctly ends on $|1\rangle$, consistent with the pre-existing $HZH=X$ identity in the same lesson).
- **All other new `HistoricalMoment`/`ResearchConnection` additions** (27 of 29 files carrying such additions) trace exactly to text, captions, or citations already present in that same lesson before the change — dates, names, and papers were not invented, only re-surfaced into a dedicated component.
- **No `export const` line was touched anywhere in the 219-file lesson diff** — all JS-level constants, computed values, and data feeding interactive components are byte-identical to before the sprint, so no interactive visualization's underlying numbers could have silently drifted.

## Coverage

**What I checked:**
- Full `git diff --stat` and full unified diff for `src/content/lessons/` (219 files) and `src/content/problems/` (99 files).
- A mechanical, whole-corpus check: every `$...$`/`$$...$$` LaTeX span in the entire lessons diff was extracted from both the removed-lines set and added-lines set, whitespace-normalized, and compared as multisets. Result: **0 formulas present in the removed set but absent from the added set, and 0 formulas present in the added set but absent from the removed set.** This means every equation that existed anywhere in the diff survived, unchanged, into the new version, and no wholly new equation was introduced anywhere in the 219-file diff without a prior counterpart. This is a strong, comprehensive (not sampled) check, but it only covers text inside `$`-delimited spans — it does not by itself catch a changed non-LaTeX numeral in prose, a changed unit stated in words, or a changed `EquationReveal`/`PredictBeforeReveal` gloss string.
- A full grep of every added line for `arXiv`, `doi`, `Nature`, `Science`, `PRL`, `et al`, and bare URLs — 3 hits total, all three individually checked against that file's pre-existing content (2 flagged as Risk above, 1 confirmed fully traceable).
- All 29 files that gained a `HistoricalMoment` or `ResearchConnection` component: each new date/name/citation checked against `git show HEAD:<file>` (the pre-sprint version) for that same lesson.
- Both specifically flagged items in the task brief, in full.
- The 99 problem-retiering diffs, in full (not sampled — the entire diff is 1,287 lines and was read as a whole via grep filtering).
- 19 lessons read in full, before and after, spread across all six pillars: `the-variational-method.mdx`, `hermitian-operators.mdx`, `scattering-off-a-step-potential.mdx`, `wave-packet-dynamics-and-dispersion.mdx` (quantum-mechanics); `bb84-quantum-key-distribution.mdx`, `the-no-cloning-theorem.mdx` (quantum-computing); `qubit-readout-techniques.mdx`, `cryogenic-systems.mdx` (quantum-hardware); `circuit-representation-in-code.mdx`, `computational-cost-and-scaling.mdx` (quantum-software); `the-spectral-theorem-for-unbounded-operators.mdx`, `stinespring-dilation-and-channel-purification.mdx`, `quantum-channels-kraus-and-choi.mdx`, `schmidt-decomposition-and-purification.mdx`, `hilbert-spaces-and-self-adjointness.mdx` (quantum-mastery); `quantum-signal-processing.mdx`, `complexity-classes-p-np-and-bqp.mdx`, `query-complexity-and-lower-bounds.mdx`, `lattice-surgery.mdx`, `block-encodings-and-linear-combinations-of-unitaries.mdx`, `clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx` (apex/quantum-mastery, the two specifically-flagged files).
- The largest diffs in the whole set by line count were prioritized for full reading (`schmidt-decomposition-and-purification.mdx` and `lattice-surgery.mdx`, both 154 changed lines, were the two largest and both fully read).

**What I did NOT check, and why this matters:**
- The remaining ~200 lesson files not individually read in full (most carry only a 6-line `LessonHook`/`NextDiscovery` insertion with no equation touched — confirmed by the diff-stat sizes and the whole-corpus LaTeX check above, but I did not read each one's surrounding prose word-for-word).
- Non-`$`-delimited numeric/factual claims inside new `EquationReveal` term glosses, `PredictBeforeReveal` explanations, and `InsightBlock` text were spot-checked (several dozen, across the 19 fully-read lessons) but not exhaustively verified across all 219 files — a wrong number stated only in prose (not in a `$...$` span) in one of the ~200 files I didn't read in full would not be caught by the mechanical check.
- Image captions and `AnnotatedFigure`/`ExternalFigure` additions were checked only where they intersected a `HistoricalMoment`/`ResearchConnection` addition; captions added independently of those two components were not separately fact-checked.
- Non-content application code (`src/app/`, `src/components/`, `src/lib/content/types.ts`, test files) was not audited — out of scope for a scientific-content audit, and confirmed to carry no lesson/problem prose.
- I did not run the build, dev server, or test suite (per hard constraints), so I cannot confirm the MDX actually compiles or renders correctly — only that its mathematical and factual content, as text, is preserved.
- I did not independently re-derive every physics result from first principles across the whole corpus — verification was "does the after-text match the before-text, and is each newly-added justification/annotation correct for the specific step it's attached to," not "is the underlying physics itself correct," except where I explicitly recomputed a numeric result (noted inline above).

**Confidence:** High that no equation or number was silently corrupted anywhere in the diff (backed by the exhaustive multiset check, not just sampling). High, but not exhaustive, that no false or invented fact was introduced (backed by exhaustive citation-pattern grep + full check of all 29 HistoricalMoment/ResearchConnection files, but not an exhaustive read of all 219 files' prose).

## Method

Commands run, in order, from the repo root (`C:\Users\abena\quantum-learning`):

```bash
git status --short
git diff --stat -- src/content/lessons/
git diff --stat -- src/content/problems/
git diff -- src/content/problems/ > /tmp/problems.diff
grep -E '^[+-]' /tmp/problems.diff | grep -v '^+++' | grep -v '^---' | grep -vi 'difficulty'   # confirms only difficulty lines changed
grep -E '^[+-].*difficulty' /tmp/problems.diff | sort | uniq -c                                  # 99 x advanced→master, nothing else

git diff -- src/content/lessons/ > /tmp/lessons.diff
grep '^+' /tmp/lessons.diff | grep -v '^+++' > /tmp/added.txt
grep '^-' /tmp/lessons.diff | grep -v '^---' > /tmp/removed.txt

# Whole-corpus LaTeX-span multiset check (Python):
python3 - <<'EOF'
import re
from collections import Counter
def extract(path):
    out=[]
    for line in open(path, encoding='utf-8', errors='replace'):
        for m in re.findall(r'\$\$?(.*?)\$\$?', line[1:]):
            m=m.strip()
            if len(m)>3: out.append(re.sub(r'\s+',' ',m))
    return out
crem=Counter(extract('/tmp/removed.txt')); cadd=Counter(extract('/tmp/added.txt'))
print("only in removed:", len(crem-cadd))
print("only in added:", len(cadd-crem))
EOF
# -> both 0

# Invented-facts grep across all added lines
grep -niE 'arxiv|doi\.org| nature | science | PRL |physical review|et al\.|et al,|et al ' /tmp/added.txt
grep -oE 'https?://[^ "'"'"')>]+' /tmp/added.txt | sort -u

# Locate every file gaining a HistoricalMoment/ResearchConnection, then for each:
awk '/^diff --git/{f=$0} /<HistoricalMoment|<ResearchConnection/{if($0 ~ /^\+/) print f}' /tmp/lessons.diff | sort -u
git show HEAD:<file> | grep -iE '<name/date/keyword found in the addition>'   # traceability check, run per file

# Per-file full diffs for close reading:
awk '/^diff --git.*<filename>/{p=1;next} p&&/^diff --git/{p=0} p' /tmp/lessons.diff

# Largest diffs prioritized for full reading:
git diff --numstat -- src/content/lessons/ | awk '{print $1+$2, $3}' | sort -rn | head -20

# Confirm no computed/data constants touched:
grep -n '^-.*export' /tmp/lessons.diff   # 0 hits
```

All `git show HEAD:<path>` calls read the last committed state (commit `80eab57`), i.e. the lesson content as it stood immediately before this sprint's uncommitted changes — the correct "before" baseline for this audit.
