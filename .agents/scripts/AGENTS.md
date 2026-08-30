# Scripts Rules

**Tools that execute a rule already written in a contract. Nothing else lives here.**

Two kinds, and there is no third: a **check** verifies that a rule holds, a **tool** materialises
one. Both name the rule they execute. A script that carries policy no contract states is policy
nobody agreed to — and it is unarguable, because there is nothing to argue against.

Nothing about the project's own domain belongs here, however scripted it looks.

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
- Severity says what a finding **is**. Whether it breaks the build is §3: only the published
  corpus gates.

## 3. What a Check Reads

**`docs/` and nothing else — plus the fixtures that prove the checks work.**

- The contract governs everything under `docs/`. What git ignores is **private**: read and
  reported, never gated. A rule that holds only where someone is watching is not a rule — and a
  commit blocked by a file nobody publishes is noise, not rigour.
- Where there is no git, everything is published. A project without one has no notion of private.
- `.agents/scripts/fixtures/` is the one exception, and it is not documentation: it is the evidence
  that each check fires on a known-bad file and stays quiet on a clean one.
- The filename is the expectation. `expect-<check>.md` raises `<check>` and nothing else; `clean.md`
  raises nothing. No config file — a fixture that needs one has stopped being self-evident.
- Fixtures run first. If one fails, nothing else is validated: an unverified check does not get to
  report green.

## 4. Scope

**Two roots, and never confused.**

- **The project** is found by walking up from where the command runs, looking for the entry point —
  never from where the script lives. A script that infers the project from its own location works on
  whatever it sits next to, and reports green doing it. `--dir` overrides this root and nothing else
  does.
- **The base** is the opposite: it *is* where the script lives. A tool that copies from the base
  reads its own location and is right to. The two resolutions look alike and mean opposite things —
  do not unify them.
- One file per script. A third has to earn its place against a written rule, the way the first two
  did.
