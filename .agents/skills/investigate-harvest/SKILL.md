---
name: investigate-harvest
description: Run before designing or planning anything, when the facts the design would rest on are not settled — an unfamiliar API, a contract that contradicts the code, a corpus nobody counted, a choice between two approaches. Produces a sourced base that has been stressed, plus a theory of what to do. Not a summary of what was read, not a design, no implementation. Skip it when the fact is already established and the source is trusted.
---

# Investigate and Harvest

**Turns unsettled facts into a sourced base that survived being attacked, and a theory of what to do.**

Owns: the three stages that run as one block before any design exists — research, criterion,
decisions — and the document they produce.
Does not own: the design, the plan, the implementation, or the choice itself. `Decisions` is
`proposes` under every mode (global `AGENTS.md` §5). This skill lays out what decides. The user decides.

Every rule below is cited by what it says, not only by its number. A project that adopted the base
may hold the same rule in a different file — read that project's equivalent, and when it has none,
say so rather than substituting your own.

The **Proof** line closing each stage is a self-check on you, not a section of the document.

---

## 0. Precondition — not a stage

Run when the facts are not firm. Skip when the fact is established and the source is trusted — go
straight to the task. Say which, in one line, in the conversation, before starting.

Then read, before the first search:

- The project entry point's **routing** and **mode** tables. Never redefine a mode; read the one the
  project declared.
- The **binding table** — what the project answers about its environment (`.agents/AGENTS.md` §4) —
  for two things this skill needs: where a working document lives, and where open work goes.

`.agents/AGENTS.md` §4 governs a missing or unresolved row and is not restated here. What it produces
for this skill: research and criterion need neither row, so the gap never cancels the investigation;
and **when no row names a home for the document, it is delivered in the conversation and not written
into the repo**, its leftovers staying in it, marked as parked on that answer.

**Proof:** you can name the mode of the `docs` and `decisions` surfaces, and either the destination of
this document and its leftovers or the exact binding row that is missing.

---

## 1. Research — the whole population, from independent sources

- **Declare the motivating question, then re-level it.** The question you were handed is often one
  level below the one that decides. Write the question verbatim, and write the one you actually
  answer when it differs. Naming the consequence instead of the event answers nothing.
- **The search that defines the scope is never truncated.** Count and list first
  (`grep -rn … | wc -l`, `grep -rl …`), read after. A truncated discovery search does not trim noise —
  it hides population, and produces an inventory with confidence nobody earned. Truncate to inspect a
  file you already know; never to discover the universe.
- **Report the population and the matches, both absolute, and say the sweep was not truncated.**
  *177 groups carry an `id`, over all 286 entries — full sweep, no sampling.* A bare match count is
  unreadable: without its denominator nobody can tell a corpus from a sample.
- **Cross the project's own corpus before evaluating raw data.** Documented decisions, open questions,
  architecture and mechanics docs. If the topic is already documented, cite it — do not reopen it
  (`docs/AGENTS.md` §5). Re-deriving what the project already wrote is noise, not analysis.
- **Read the sources that can disagree, and keep them apart.** The data, the code that consumes it,
  the external material (read on demand — never assume it was read: `references/AGENTS.md` §5), and
  the project's own docs. Where two contradict, both stay, cited, unreconciled. Reconciling belongs
  to stage 2, and doing it here destroys the evidence.
- **A document is provenance, not veracity.** A doc co-created in the same commit as the code it
  describes is that code's birth certificate, not a prior source of truth it derives from. Check with
  `git log -S` before citing anything as the authority the code should have obeyed.
- **Prefer the source that was measured over the source that was written about it**, and say which is
  which.
- **Every claim carries its mark, and the legend is declared at the top of the document.** Measured ·
  sourced · derived · hole. Take the vocabulary from the project's corpus only when the project marks
  **evidence**; a severity, priority or status scale grades findings, not the confidence in them —
  it is not an evidence legend, and adopting it as one silently rebrands a guess as a fact. Where the
  project marks nothing, declare the legend this document uses. This is the `review` row of the
  global lexicon (§8) applied to facts: a full pass, a confidence column, the doubtful ones marked.
  An unmarked claim does not count as a finding.

**Proof:** every number traces to a file you opened; every count carries its denominator and says the
sweep was whole; the legend covers every mark used; and the contradictions are still contradictions.

---

## 2. Criterion — stress it before accepting it

- **Attack your own prior claims first.** The idea you carried in before researching is the first
  candidate for demotion, and so is the rule you yourself wrote. A rule whose stated reason turns out
  to be false is a finding: correct the reason, even when the behaviour it produces stays right.
  A criterion stage that retracts nothing has usually not been run.
- **Bring the case that could break the theory, not the one that confirms it.** Real, from the corpus,
  never hypothetical.
- **Write what makes a good case as a table of properties, and score the candidates against it.**
  That table is what demotes the comfortable case to a data point and promotes the awkward one.
- **A composition whose case cannot occur is not a case.** Discard it before modelling it, not after.
- **A precondition that defers work is not a wall.** Before accepting "no consumer forces this yet",
  ask whether the forcing case can be built right now against real data. If it can, that is the next
  brick. If it genuinely cannot — missing data, not missing effort — defer explicitly, with the fork
  named.
- **Separate the fact from the reading you hung on it.** A count is a fact; the semantics you inferred
  from the label is not. What does not survive the stress goes back to being an open question, not a
  partition you keep at reduced confidence.

**Proof:** at least one thing you or the project believed on entry is written down as demoted,
retracted or false, with the evidence that killed it — or the document names, case by case, what you
attacked and why each one held.

---

## 3. Decisions — what decides, ordered by weight

The closing section carries these in order: the axes, then the open questions, then what you did not
investigate.

- **Per axis: why A, why B, and what decides it.** Never one recommendation dressed as a conclusion
  (global `AGENTS.md` §8, `propose`).
- **Order the axes by weight and name the one that can invert the conclusion.** If no axis can, say
  that too — it means the question was already settled.
- **Name when to revisit:** the concrete condition under which the answer changes.
- **Write the intermediate paths.** The choice is rarely binary, and the middle options are the ones
  a reader will not find on their own.
- **Order the open questions by what they block**, not by how interesting they are.
- **Name what you did not investigate**, each with the hook that lets someone pick it up: where you
  saw it, and what was not verified about it.
- **Leftovers are not done and not discarded.** Open work belongs in the tracker, not in a document
  (`.agents/AGENTS.md` §2); the binding row names which one. While that row is unresolved they stay
  in the document, marked as parked on it — that is a stated exception, not a home.
- A proposal may ride along, **marked as a proposal** and classified per the global task table. It is
  not executed here. RED waits for explicit authorization.

**Proof:** a reader weighing the axes differently reaches a different conclusion than yours, and can
see exactly which axis moved.

---

## Output — the document

The header states, before anything else: what it is, what it is not, whether it is a source of truth,
the legend of marks, and where it lives — or that no binding row names a home, so it is being
delivered in the conversation. A bench is not living truth, and filing it as truth is drift with good
wording.

It is a bench, not a verdict. What it hands over are **axes**; an axis becomes a settled decision only
when the user answers it, and `plan-design` §0 *Precondition* judges those answers, not this document.
So the axes are listed together, each one identifiable on its own, and never mixed into the piles §3
orders after them — the open questions, the uninvestigated, the leftovers. **The marks travel**: a
fact marked `hole` is still a hole in the design that rests on it, and the legend goes with them.

Written in the user's language, and the profile's absence has its own answer there (global
`AGENTS.md` § Agent Role).

It is not a summary of what you read, not a design, and it contains no implementation.

---

## Test Task

Pick a claim the project rests on that nobody verified: a rule one contract states and another
contradicts, a field the code reads that the schema never declares, a dependency chosen without
measurement. Run the three stages on it and produce the document.

It passes when all five hold:

1. Every count carries its denominator and the document says the sweep was not truncated.
2. At least one belief held on entry — yours or the project's — is written down as demoted or false
   with the evidence, or the document names case by case what was attacked and why each held.
3. The closing section opens with axes that each end in what decides them, and a reader could reach
   the opposite conclusion by weighing them differently.
4. Nothing in the document is a design or an implementation.
5. The header declares the legend of marks and either where the document lives or the exact binding
   row that is missing, and the axes are listed apart from the open questions, the uninvestigated
   and the leftovers.
