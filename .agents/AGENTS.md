# Project Entry Point

**Read before touching `docs/`, `docs-archive/`, or `references/`.**

## Routing

| Context | Apply |
| --- | --- |
| `docs/` | `docs/AGENTS.md` |
| `docs-archive/` | `docs-archive/AGENTS.md` |
| `references/` | `references/AGENTS.md` |
| `.agents/scripts/` | `.agents/scripts/AGENTS.md` |
| `.agents/profile/` | `.agents/profile/AGENTS.md` |
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
- One home, one copy. Everything else links to it — a statement restated somewhere else is a second
  source of truth waiting to drift.

## 2. After Code Changes

**Close the loop in the same session.**

1. Did a source-of-truth decision close or change? → update `docs/`.
2. Is there work left open? → open an issue. It does not live in a document. While §4's row for
   it is unresolved, it is handed over in the conversation, listed and marked — a stated
   exception, not a home, and not a reason to drop it.
3. Did a rule earn its place? → update the contract that governs it.
4. Validate `docs/` → if the project has tooling.

Anything left open is not done and not discarded. Re-propose it when it becomes relevant.

## 3. Validation Tooling

- Lives in `.agents/scripts/`. Run with `node .agents/scripts/src/validate-docs.mjs` from the repo root.
- A command that needs a workspace to resolve is a command that can pass without running. Contract
  the one that runs with nothing installed.
- A check that is not run does not verify. A check that reports green without looking is worse
  than no check.
- Do not add a script by default. Each one earns its place against a written rule.

## 4. Binding

**What this project answers about its environment. Nothing else lives here.**

| Requirement | Resolution |
| --- | --- |
| The mode table — one verb per surface | §5 below |
| Where the user profile lives | `.agents/profile/PROFILE.md` |
| What command validates the corpus | `node .agents/scripts/src/validate-docs.mjs` |
| Where open work lives | *unresolved — no tracker yet* |
| Where a working document lives | *unresolved — no bench yet* |

- A row earns its place because a written rule cannot run without it. Derived, never imagined.
- An unresolved requirement stops **the work that needs it** — not everything else. Ask. Never infer
  it, never borrow it from a neighbouring project.
- `not applicable` is an answer. An empty cell is not.

## 5. Mode

**Who writes, per surface. Declared once, read by every skill.**

Verbs: global §5. This table only picks one per surface — it never redefines them.

| Surface | This project |
| --- | --- |
| Code · scripts | executes |
| Docs · contracts | executes |
| Tests | executes |
| Git | proposes |
| Open work | proposes |
| Decisions | proposes |
