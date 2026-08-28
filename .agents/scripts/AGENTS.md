# Scripts Rules

**Executable checks over the corpus. Nothing else lives here.**

## 1. Zero Dependencies

- Runs on plain `node`. No install step, no bundler, no transpile.
- A check that needs a dependency is a check that does not run. Rewrite it.

## 2. Every Check Cites Its Authority

**No invented policy. If a rule is not written in a contract, it is not an ERROR.**

| Severity | Meaning | Exit code |
| --- | --- | --- |
| `ERROR` | Violates a written rule. Cite the contract and section. | `1` |
| `WARN` | Mechanical reading of a written rule. | `0` |
| `INFO` | Observed pattern with no contract behind it. | `0` |
| `SELFTEST` | The check itself is unproven — §3. Not a finding about the corpus. | `2` |

- A check with no citation is `INFO` at most.
- Do not promote a check to `ERROR` to make it enforceable. Write the rule first.

## 3. Corpus

**`docs/` and nothing else — plus the fixtures that prove the checks work.**

- `.agents/scripts/fixtures/` is the one exception, and it is not documentation: it is the evidence
  that each check fires on a known-bad file and stays quiet on a clean one.
- The filename is the expectation. `expect-<check>.md` raises `<check>` and nothing else; `clean.md`
  raises nothing. No config file — a fixture that needs one has stopped being self-evident.
- Fixtures run first. If one fails, nothing else is validated: an unverified check does not get to
  report green.

## 4. Scope

- Resolve paths from the repo root, not from this directory.
- One file per script. Two scripts is already a lot.
