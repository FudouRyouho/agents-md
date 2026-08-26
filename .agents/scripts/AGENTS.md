# Scripts Rules

**Executable checks over the corpus. Nothing else lives here.**

## 1. Zero Dependencies

- Runs on plain `node`. No install step, no bundler, no transpile.
- A check that needs a dependency is a check that does not run. Rewrite it.

## 2. Every Check Cites Its Authority

**No invented policy. If a rule is not written in a contract, it is not an ERROR.**

| Severity | Meaning | Exit code |
| --- | --- | --- |
| `ERROR` | Violates a written rule. Cite the contract and section. | Breaks |
| `WARN` | Mechanical reading of a written rule. | Passes |
| `INFO` | Observed pattern with no contract behind it. | Passes |

- A check with no citation is `INFO` at most.
- Do not promote a check to `ERROR` to make it enforceable. Write the rule first.

## 3. Scope

- Resolve paths from the repo root, not from this directory.
- One file per script. Two scripts is already a lot.
