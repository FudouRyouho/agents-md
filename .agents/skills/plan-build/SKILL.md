---
name: plan-build
description: Run after a plan exists and it is time to build it. Executes the plan step by step against verifications written before the change, then records where execution departed from the plan and whether each departure obeyed the criterion the plan had already fixed or was resolved some other way, and closes with a retrospective — what changed, what is left, what was discarded on the way. Not a plan, not a design. Needs a plan whose steps carry a verification; without one there is nothing to depart from.
---

# Plan: Build

**Builds a plan that already exists, and leaves on the record where the build left the plan and by whose criterion.**

Owns: the last block — execution, contrast, validation — and the record it produces.
Does not own: writing the plan, designing, or deciding what the plan should have said. `Decisions` is
`proposes` under every mode (`AGENTS.global.md` §5). Every other surface — code, tests, docs, **git** —
is whatever the project's own table says. Read it. Never assume `executes`.

Rules below are cited by what they say, not only by their number: a project that adopted the base may
hold the same rule in a different file. Read that project's equivalent, and where it has none, say so
instead of substituting your own.

The **Proof** line closing each stage is a self-check on you. What the record must contain is listed
under *Output*, and the two are not the same list.

---

## 0. Precondition — not a stage

**Judge the plan's verifications, not just their presence.** Each step needs what it touches, what
proves it done, and what should break. Three outcomes, not two:

- **Admissible** — every step's verification can fail before the change and pass after.
- **Weak** — a verification exists but cannot fail, names a direction the change cannot produce, or
  guards something that is not there. Report it before executing and state the verification that
  would bite; producing it is `proposes` work (`AGENTS.global.md` §4 — under `proposes`, state the
  criterion and let the user write it). Executing on a verification you already know is vacuous buys
  a green that proves nothing. The plan goes back to `plan-design` §3 *Plan*: a weak verification is
  rewritten where the plan is written, not patched here.
- **Absent** — no verification at all. Stop. A build you verify in your head is a build nobody can
  show a departure from. That is `plan-design` §3 *Plan*, and it has not run.

Then read, before the first change:

- The **mode table** for code, tests, docs, git and open work. `not applicable` is the absence of a
  surface, not a fourth verb (`AGENTS.global.md` §5). A project whose git surface is `proposes` gets
  changes staged and described, never committed or pushed on your initiative.
- The **design the plan cites** — for its ids and its falsifier. The plan is the instruction; the
  design is what the instruction is answerable to.
- The **verification command the project names** — its binding table, its Makefile, its scripts, its
  CI, whichever of those it actually has. Never an invented variant: a command that exists only in
  your message proves nothing.
- The **binding table** (`AGENTS.local.md` §4) for where the record lives and where open work goes.
  §4 governs a missing row and is not restated here; what it produces here is that the gap never stops
  the build, and **when no row names a home for the record, it is delivered in the conversation and
  not written into the repo**, saying so in its header.

**Proof:** you can state the mode of every surface the build will touch, quote each step's
verification and its verdict of the three, and name the record's destination or the missing row.

---

## 1. Execution

- **Write the expected failure before touching anything.** The compile errors the change should
  produce, the test that should fail and the reason it should fail for. **If they do not appear,
  that is a finding, not a relief** — either the change is not doing what you think, or the
  verification cannot fail, and one that cannot fail before proves nothing after.
- **When the expected observation is that nothing changes, break the change on purpose to see the
  silence end.** A step whose correct outcome is silence has no failure to predict, so the prediction
  moves: mutate the new code so the silence becomes noise, confirm it does, and restore it. Otherwise
  the step is indistinguishable from having written nothing.
- **Measure the defect before touching it.** A drift you deduced from reading is not the same fact as
  a drift observed in the output, and only the second can be shown to have gone away.
- **One step at a time, each closed by its own verification, run with the project's own command.**
- **After each step the tree is in the state that step declared** — green, or the red the step
  predicted. A step whose stated proof is a failing verification leaves it failing, and the next step
  is the one that closes it. What is forbidden is an undeclared broken state, and a step that depends
  on a later one.
- **The grounding goes down before the code, not after.** A rationale written afterwards is the
  code's birth certificate, not the reason it was built that way.
- **A failing fix is not retried without a different theory of the cause.** Read the actual installed
  version of the library, the actual error, the surrounding code. Never trust memory of an API, and
  never state what a config or CI does without having read it in this run.
- **Never close a step by weakening its test.** A test that passes because the code under test
  changed is not fixed, it is silenced (`AGENTS.global.md` §6).
- **Form decisions the plan left open are recorded, not escalated one by one.** Under `executes`,
  record the assumption and move on; under `proposes`, ask (`AGENTS.global.md` §7). Each recorded
  assumption is a departure, and stage 2 gives it its verdict — that is where it is answered for,
  which is why the build does not stop for it.
- **What appears and was not in the plan is routed, not absorbed.** This is the door scope creep
  comes through. When the cause lives outside the named scope, stop and report it, do not follow it
  (§6); every changed line traces to a step of the plan (§3), and the step names the design id it
  came from, so the chain reads backwards — commit, step, design — which is the only direction anyone
  reads it.

**Proof:** every step closed with the project's own command; the predicted failure appeared before
each change, or the silence was broken on purpose; nothing outside the plan is in the diff.

---

## 2. Contrast — the departure against the criterion

Not "did it go well". The question is: **where did execution depart from the plan, and did the
departure obey a criterion that was already fixed, or was it resolved some other way?**

Each departure carries three lines — what the plan said, quoted; what was done; why the plan's route
did not hold — and then one of four verdicts, which are not interchangeable:

| Verdict | Meaning | What it obliges |
| --- | --- | --- |
| **obeyed** | The plan had already fixed the rule, and the departure is that rule applied. Two steps collapsing into one because a single exam closes both is this. | Nothing. Record it. |
| **covered** | A rule already written in a contract decided it — one the plan simply failed to derive from. | Cite the contract. Nothing to propose: it already says so. The finding is that the plan did not read it. |
| **resolved otherwise** | A rule was applied that nothing had fixed. A finding about the plan, not about the code. | Propose it to the contract that governs it. |
| **unresolved** | It was worked around. | Say so plainly and name what the workaround costs. |

- **`resolved otherwise` never promotes itself.** A rule that earned its place goes to the contract
  that governs it (`AGENTS.local.md` §2) — *proposed*, because deciding it is `decisions`, which is
  `proposes` under every mode. Applying it in the code and letting the code stand as its statement is
  how a criterion nobody agreed to becomes the house rule. Separating this from **covered** is the
  whole point of having both: one asks for a decision, the other reports a plan that skipped one.
- **A departure that invalidates the design goes back to `plan-design` §1 *Design*, not into this
  record.** The plan failing is this stage's business; the design failing is not. Give it its verdict,
  name the design id it breaks, and hand it back — `resolved otherwise` applied to a design decision
  is how a design gets rewritten by whoever happened to be building that day.
- **Survivals are declared, not omitted.** Something the plan meant to remove and that is still there
  is a departure with a stated reason — *survives on purpose, its axis has no forcing case* — or it is
  debt nobody wrote down. Silence reads as the second.
- **A step that advanced without closing its goal says what it did not close**, and names the
  tripwire that will announce when it does.
- **A verification you complied with that could not have failed is a finding with no departure.**
  Record it against the step, with the verification that would have bitten. It is the plan's defect,
  and it is invisible everywhere else because nothing went wrong.
- **A cause found mid-build is not a defect of the plan by default.** A sweep that turns up one more
  cause than the step named is the build working; it is a departure all the same, and it gets its
  verdict like the rest.

**Proof:** every departure carries a verdict and a quotation of what the plan said; each
`resolved otherwise` is on the table as a proposal; each **covered** names the contract that already
decided it.

---

## 3. Validation — the retrospective

- **What changed:** born, died, moved — one line each, read against the plan's own map of movement.
- **What is left**, each with the hook that lets someone resume it: where it is, what blocks it, what
  would close it.
- **What was discarded on the way, with the alternative and the reason it lost.** This is the part
  nobody can reconstruct later: the code shows what was built and never what was rejected, and a
  discard without its reason gets re-proposed within the month.
- **Nothing stays to live.** Everything that entered the record leaves through one of four doors —
  the code, the docs, the tracker, or an explicit discard. Open work belongs in the tracker, not in a
  document (`AGENTS.local.md` §2). **Where that surface is `not applicable` or its row is
  unresolved, the leftovers are handed to the user in the conversation, listed and marked** — a
  stated exception, not a home, and not a reason to drop them.
- **The scaffolding gets a stated fate.** Purge the working record when its content has moved on and
  it holds nothing unique; keep it when it still carries detail that nothing else does, and say what
  retires it. An undecided bench becomes a second source of truth by default.
- **A rule the build earned is proposed to the contract that governs it** — never written in as a
  side effect of the run, and never left living in the record.
- **The design's falsifier is run, not assumed.** `plan-design` §1 *Design* ships a search or a command
  whose result means the design broke. Run it after the build and record the result. A falsifier
  nobody runs is exactly the erosion it was written to catch.

**Proof:** every entry left through one of the four doors or was handed over explicitly; the discards
carry their reason; the scaffolding has a fate and a retirement condition.

---

## Output — the record

Its header states: what it is, what it is not, where it lives — or that no binding row names a home,
so it is being delivered in the conversation — and the language it is written in.

Written in the user's language, and the profile's absence has its own answer there (`AGENTS.global.md` § Agent Role).

Its body carries, at minimum: the modes and the verification command this build ran under; per step,
the predicted failure and the verification that closed it; every departure with its verdict; the
result of the design's falsifier; and the retrospective's own parts — what changed, what is left, what
was discarded, and where each open item went. Order them as the stages ran. Anything else is yours to
shape.

It is chronological by nature, and that is exactly why it is not `docs/`. What survives into the
project's truth is rewritten in the present tense, as what the system now is — never as the account
of how it got there (`docs/AGENTS.md` §1).

---

## Test Task

Needs a plan whose steps carry verifications. The skill does not ship one and does not reconstruct
one from git: a prediction made before a change cannot be recovered from the commit afterwards, and
condition 1 asks for exactly that. Without a plan there is nothing to test.

Build it, and produce the record.

It passes when all five hold:

1. Each step names the project's own verification command and the failure predicted before the
   change — or, where the correct outcome was silence, the mutation that proved the silence real.
2. Every departure quotes what the plan said and carries one of the four verdicts.
3. Each `resolved otherwise` stands as a proposal to a contract, and each **covered** cites the
   contract that already decided it — or the record states that every departure was **obeyed**.
4. The retrospective lists what was discarded with the reason it lost, and every open item left
   through a named door or was handed over explicitly.
5. The record's header names where it lives — or the missing row, and that it is being delivered in
   the conversation — and the design's falsifier was run with its result recorded.
