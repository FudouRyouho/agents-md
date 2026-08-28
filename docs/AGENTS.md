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

**A doc may say "will be". It may never say "is" about something that is not.**

A statement about the future carries three parts, or it is silent drift with good wording:

- What holds — the architecture being declared.
- What the code does today.
- Who reconciles them — the plan, the issue, the open question.
