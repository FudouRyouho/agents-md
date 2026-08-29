---
name: plan-design
description: Run once the facts are settled and before any code exists. Designs what will be built, then revisits the whole accumulated corpus — did the idea grow, does the concept still hold, is the design applicable or only theory — then writes the plan, then reviews it against the ways plans are known to fail. The retrospective sits before the plan on purpose; it is not a post-mortem. Produces a plan whose every step can fail before it passes. Not research, not implementation.
---

# Plan: Design

**Turns settled decisions into a design, a plan whose every step can fail, and the review that proves it.**

Owns: design, retrospective, plan, review — one block, in that order.
Does not own: settling the facts, or building. `Decisions` is `proposes` under every mode (global
`AGENTS.md` §5): the design and the plan are delivered, never self-approved.

**Acceptance is external.** The plan must come out `admissible` under `plan-build` §0 *Precondition* — every
step's verification able to fail before the change and pass after. `weak` is a rejected plan, not a
lesser one, and it is cheaper to fix here than to discover mid-build.

Contracts are cited by what they say, not only by number: a project that adopted the base may hold
the same rule elsewhere.

The **Proof** line closing each stage is a self-check on you.

---

## 0. Precondition — not a stage

**Judge what the decisions actually settled, not that a decision document exists.** Three outcomes,
not two:

- **Settled** — every decision this design rests on has the user's answer. Design.
- **Partial** — some answered, some still open. Name each open one, design the part that does not
  depend on it, and mark the dependent part as blocked on that decision, in the design itself.
  Deciding it yourself is the self-approval §5 forbids; delegation counts as an answer only when the
  user delegated it, not when you assumed it.
- **Absent** — the design would rest on facts nobody settled. Stop. That is `investigate-harvest`,
  and saying so costs less than a design built on a guess.

Then read, before the first line of design:

- The project entry point's **routing** and **mode** tables. Never redefine a mode; read the one the
  project declared.
- The **binding table** (`.agents/AGENTS.md` §4) for where the design and the plan live, and where
  open work goes. §4 governs a missing or unresolved row and is not restated here; what it produces
  here is that **design and plan are delivered in the conversation and not written into the repo**,
  saying so in their header.

**Proof:** you can state the verdict of the three, name every open decision the design is blocked on,
and either the destination of design and plan or the exact binding row that is missing.

---

## 1. Design — the form, not the implementation

- **Decisions arrive made.** Design gives them a shape; it does not reopen them. Reopening one is a
  finding for stage 2.
- **Every piece carries a stable id.** The plan cites the design by id, and commits cite the plan. An
  id that changes breaks the chain backwards, which is the only direction anyone ever reads it.
- **Ship a falsifier someone else can run:** a search and the string whose presence means the design
  broke, or a command and the result that means it. A principle nobody can check erodes on its own.
- **State what would revisit each decision.** Not a confidence level — the concrete event. A decision
  with no revisit condition is being presented as permanent, and almost none are.
- **Run it over real scenarios, including one that already happened.** A design that turns a past
  incident into a decision is applicable; one that only survives the cases you invented is theory.
  Where there is a previous design, the case that blocked it is the one that has to pass.

**Proof:** every piece has an id and a revisit condition; the falsifier is something someone else can
run; and at least one scenario is a thing that actually occurred.

---

## 2. Retrospective — before the plan, not after the build

Looks back over the whole road, from where the idea started to where it is now. It runs here because
this is the last moment a design that only works on paper is still cheap.

- **Did the idea grow, and into what?** A concept can die while its flag lives on, and a question can
  turn out to have been asked one level too low. Say which happened, or that nothing moved.
- **What does this change of what was already decided?** Per prior decision: corrected, reverted, or
  survives — and never silence. *Survives with its subject changed* is a real answer and a common one.
- **An old contradiction the new design explains is a finding, not a footnote.** A prior decision that
  contradicted itself was usually the symptom of the thing this design just named.
- **Cross everything that asserts something about the system against the code** — contracts and README
  included, not only the surface some validator happens to walk. Docs that are absent do not
  contradict; docs that disagree with the code are this stage's product, not the build's problem.
- **Separate what is still open into blocking and not.** *Decidable the day the code is written* is a
  different state from *the plan cannot start*, and only the second one holds anything up.
- **A design piece this stage invalidates goes back to stage 1.** The four run as one block, in order;
  that is not a ban on returning with a finding.

**Proof:** every prior decision the design touches has one of the three words attached; the open items
are split into blocking and not; and if nothing was corrected or retracted, you can say what you
checked and why it held.

---

## 3. Plan

- **Maturity decides what enters a step; dependency decides the order.** Maturity is how settled the
  object is; dependency is what breaks if it is touched first. Confusing them breaks the plan — the
  most settled object is often built last, because everything it consumes is upstream of it.
- **The steps with no dependencies go first.** They are the cheapest evidence that the design is real.
- **Each step carries:** what it touches, the id of the design it comes from, what proves it done, and
  **what should break — the output the verification produces when the step is wrong**, quoted closely
  enough to recognise.
- **The proof is the command the project already names**, or, where none reaches that surface, a
  command the project already uses to verify, declared as the substitute it is.
- **The exam is written before the step and fails in the tree state that step inherits** — not
  necessarily today: step N's exam depends on step N−1. A step whose verification cannot fail there is
  not a step.
- **When the correct outcome is silence, the exam is the mutation** — break the change on purpose and
  watch the silence end (`plan-build` §1 *Execution*). An exam that guards something not yet there passes
  vacuously, and this is the commonest way a plan ships `weak`.
- **Each step leaves the tree in the state it declared** — green, or the red it predicted. Never an
  undeclared broken state, and never a step that depends on a later one.
- **The irreversible step gets its position argued.** Most of a build can be written badly, thrown
  away and redone; the part that cannot is usually one contract, and its window does not reopen.
- **Work that no command can close is not a step.** It is blocking work, and it belongs to stage 2.
- **What does not enter a step is listed with the reason.** That list is what stops scope creep from
  arriving as a surprise mid-build.

**Proof:** the order is derived from dependencies and written down; every step names its design id, a
command, and the output that means it failed; and every silence-shaped step carries its mutation.

---

## 4. Review — the plan against how it will be judged

The four verdicts of `plan-build` §2 *Contrast*, read backwards, are the list a plan closes before it ships:

| Verdict it would earn | What the plan must do now |
| --- | --- |
| **covered** | Cite the contract that already governs each decision it makes. |
| **resolved otherwise** | Name every design decision it leaves open — or delegate it explicitly, which is also an answer. |
| **obeyed** | Fix the criterion in advance for every step that can fail in more than one way, one criterion per such step. |
| **unresolved** | Declare the workarounds it already knows it will need, with what each costs. |

Then the five failure modes. All five were measured on a plan that carried a verification on every
step and was bad anyway:

1. A decision a contract already governs, left uncited — the executor searches for it or invents one.
2. The scope of a concept central to the change, unnamed — the plan gave away the one design decision
   that was its own to make.
3. One test case for a rule that has a permit branch: the forbidden covered, the permitted not.
4. A break condition naming the direction that cannot occur, while the failure that can goes unnamed.
5. A verification with no failing result — one that reports rather than judges, so no outcome reproves
   the step.

And three questions about the plan as a whole:

- **Reversible** — which step cannot be undone, and whether its position reflects that.
- **Self-sustaining** — each step verifiable with what the project already verifies, by someone who is
  not you. A step only you can check is not verifiable.
- **Sustainable** — the plan still readable as instructions after the context that produced it is gone.

**Proof:** each of the four rows answered against the actual plan, the five modes checked by name, and
any step that fails one rewritten rather than annotated.

---

## Output — the design and the plan

Design and plan are separate documents — one states the form and survives, the other is consumed by
the build — and the retrospective and the review travel with the plan. All carry ids and name where
they live.

Written in the user's language, and the profile's absence has its own answer there (global
`AGENTS.md` § Agent Role).

The design reaches `docs/` when it is approved, not before: writing an unapproved design into the
source of truth is the self-approval §5 forbids. Once there it is present-tense, and the part that
does not exist yet is written as declared drift, with the three parts that rule requires
(`docs/AGENTS.md` §7). The plan never goes there, and says so.

---

## Test Task

Take a settled decision that has no design yet, and run the four stages to a plan.

It passes when all five hold:

1. The design's falsifier is something someone else can run, and at least one scenario already happened.
2. The retrospective names a prior decision as corrected, reverted or surviving — or states what was
   checked and held.
3. Every step names a design id, a command, and a verification that fails in the tree state that step
   inherits — with the mutation written out wherever the correct outcome is silence.
4. The review answers the four verdict rows and the five failure modes by name, and the plan would be
   judged `admissible` under `plan-build` §0 *Precondition*.
5. §0's verdict is stated, every decision the design is blocked on is named in the design itself, and
   design and plan each say where they live or which binding row is missing.
