# Project Entry Point

**Read before touching `docs/`, `docs-archive/`, `references/`, or `context/`.**

## Routing

| Context | Apply |
| --- | --- |
| `docs/` | `docs/AGENTS.md` |
| `references/` | `references/AGENTS.md` |
| `.agents/context/` | `.agents/context/AGENTS.md` |
| `.agents/scripts/` | `.agents/scripts/AGENTS.md` |
| Unsure | Ask before acting |

## 1. Route Before Writing

**Every sentence has one home. Decide it before typing.**

| Nature of the statement | Home |
| --- | --- |
| Living truth about the domain or architecture | `docs/` |
| Superseded history, no reasoning value | **git** — write it nowhere |
| Rationale for "why NOT this way" — dead design, rejected approach | `docs-archive/` |

- `docs-archive/` is never written by inference. Propose it. The user decides.
- If it is already committed, it does not go in a doc. The commit preserves it.

## 2. After Code Changes

**Close the loop in the same session.**

1. Did a source-of-truth decision close or change? → update `docs/`.
2. Is there a gotcha, routing note, or working pattern worth the next session? → update `context/`.
3. Validate `docs/` → if the project has tooling.
4. Validate `context/` → same tooling or its own check.

Anything left open is not done and not discarded. Re-propose it when it becomes relevant.

## 3. Archiving

**Zero incoming citations, or it stays.**

- Verify: `grep -rln "<basename>" docs --include=*.md` returns nothing.
- Never classify by folder or date. Both lie. Read the content.

## 4. Validation Tooling

- Lives in `.agents/scripts/`. Run with `pnpm --filter @agents/scripts validate:docs`.
- A check that is not run does not verify. A check that reports green without looking is worse
  than no check.
- Do not add a script by default. Each one earns its place against a written rule.
