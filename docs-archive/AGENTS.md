# Archive Rules

**Rationale for what was rejected. Local, gitignored, never written by inference.**

## 1. What Belongs Here

- Dead design — an approach that was built or specified, then dropped.
- A rejected alternative whose reasoning still answers "why not that way".

**Does not belong here:**

| Statement | Home |
| --- | --- |
| Living truth about the domain | `docs/` |
| Superseded history with no reasoning value | **git** — write it nowhere |
| External material the project draws from | `references/` |

The test: it earns a place here only if, without it, someone would rebuild the discarded thing.

## 2. Never by Inference

**Propose it. The user decides.**

- The agent never moves a file here on its own judgement, however dead it looks.
- Already committed is not a reason to archive. The commit preserves it.

## 3. Archiving

**Zero incoming citations, or it stays.**

- Verify: `grep -rln "<basename>" docs --include=*.md` returns nothing.
- Never classify by folder or by date. Both lie. Read the content.
- Moving a tracked file here takes it out of the repo — this folder is gitignored. Report the exact
  command (`git rm --cached <path>`); running it is the user's. A file moved but still tracked is
  worse than one left in place.
