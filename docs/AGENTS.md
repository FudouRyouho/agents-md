# Docs Rules

**The source of truth about the domain. Present state only.**

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
- Rewriting loses nothing. Git holds what the sentence used to say.
- **Inherited violations are not house style.** If the paragraph you are editing is already written
  as a diary, that is drift to fix in the same pass — not a pattern to copy.

## 3. Dates and Hashes

- A date earns its place **only** as a drift tripwire — a claim to reconcile against something
  else dated. A lone timestamp is a log. It goes to git.
- **Never a commit hash in a living doc.** A hash is provenance, and provenance lives in git.
  Write the claim in the present, without it.

## 4. Decisions — ADR

**One decision per file. Numbered. Never rewritten after acceptance.**

- Path: `docs/adr/NNN-short-slug.md`.
- A decision record is the one exception to §1: it is dated and it is immutable.
- To reverse a decision, write a new ADR that supersedes it. Do not edit the old one.
- Everything else in `docs/` describes the present. Only `adr/` records the moment.

## 5. Links

- Internal links are relative. Never absolute paths.
- A link that does not resolve is an error, not a typo.

## 6. Before Opening a Debate

- If the topic is already documented here, cite the doc. Do not reopen it.
- If a closed ADR covers it, cite the ADR. Do not re-argue it.
- Genuinely new and without precedent → open the debate with numbered options.

## 7. Verify

```bash
pnpm --filter @agents/scripts validate:docs
```
