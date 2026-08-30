# Docs Rules

**The source of truth about the domain. Decisions and present state — never the debt.**

## 1. A Snapshot, Not a Diary

**Every sentence states what the system IS. Never how it got here.**

Before writing a sentence, test it: does it describe the present, or a past event?

| Written | Verdict |
| --- | --- |
| "The resolver consumes the override map" | Present → `docs/` |
| "Phase 2 replaced the old resolver" | Past event → **git** |
| "Closed on 03-11" · "added the flag on 03-11" | Past event → **git** |

- Past-tense verbs bound to an event — executed, closed, replaced, removed, added on — are the tell.
- A phase survives only as a **plan**. Never as a stamp saying it was done.

## 2. Rewrite the Delta

**If a doc claims X and now Y is true, the sentence becomes Y.**

- Forbidden: `X (update: actually Y now)`. That is a changelog folded into a sentence.
- **Inherited violations are not house style.** If the paragraph you are editing is already written
  as a diary, that is drift to fix in the same pass — not a pattern to copy.

A doc may run ahead of the code on purpose. That is §7, and it has a form.

## 3. Dates and Hashes

- A date earns its place **only** as a drift tripwire — a claim to reconcile against something
  else dated. A lone timestamp is a log. It goes to git.
- **Never a commit hash in a living doc.** A hash is provenance, and provenance lives in git.
  Write the claim in the present, without it.

## 4. Links

- Internal links are relative. Never absolute paths.
- A link that does not resolve is an error, not a typo.

## 5. Before Opening a Debate

- If the topic is already documented here, cite the doc. Do not reopen it.
- Genuinely new and without precedent → open the debate with numbered options.

## 6. Verify

```bash
node .agents/scripts/src/validate-docs.mjs
```


## 7. Declared Drift

**A doc may declare what is not built. It may never say "is" about something that is not.**

**The declaration is a label, not a tense.** A future written as prose reads as a claim; a labelled
one reads as a gap, and only the second is findable — by a reader, by a search, by a check. Write it
inline, in the section that makes the claim:

> ⚠️ **Declared** — the decision (what the code does today). Tracked in <item>.

Three parts, none optional:

- **What holds** — the decision, in the present.
- **What the code does today.**
- **Where the work lives** — the tracker item. Not the reason, not the blocker, not the priority:
  those are the tracker's business, and its labels already say them (§1 routing table).

The pointer takes whatever form the binding row names — an issue number, a ticket id. Where that row
is unresolved, the item is handed over in the conversation and the doc says so
(`AGENTS.local.md` §2).

`Deprecated` is the same declaration read backwards: the decision retired something the code still
runs. It stays until the implementation is gone; then the doc leaves `docs/` — to `docs-archive/` if
its reasoning still answers "why not that way", purged if it does not, never by inference
(`docs-archive/AGENTS.md` §2).

**Why the reason is not here.** A doc that explains why something is not built yet is tracking work,
and work state moves on a different clock than the decision does. The doc would go stale every week
while the decision it states never moved.

## 8. A Hypothesis Is Not Truth

**An unverified claim does not enter `docs/`. Naming that is what keeps the domain from drifting.**

A theory, a hypothesis, a reading nobody measured — it may turn out entirely right, and it still does
not belong here. `docs/` states what the system is; a hypothesis states what someone thinks it might
be, and once they share a page nothing tells them apart.

It stays in the bench that produced it, carrying its evidence mark (measured · sourced · derived ·
hole). It enters `docs/` when it is measured, rewritten in the present, and without the mark: a doc
that carries confidence levels is a bench wearing the source of truth's clothes.

**This is not §7.** A declared drift says the code has not caught up with a decision. A hypothesis
says nobody decided yet, so there is nothing for the code to catch up with.
