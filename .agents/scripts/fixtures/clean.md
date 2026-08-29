# Clean

Raises nothing. Every check must stay quiet on this file.

## A Section

## Sección con Acento

- [same file](#a-section)
- [unicode anchor](#sección-con-acento)
- [sibling file](expect-changelog.md)

Code is blanked before any check runs, so nothing below is a finding:

```md
- 2026-01-01: a date-log entry
Introduced in a3f9c21e8b04.
[absolute](/docs/AGENTS.md)
```

A date reconciled against another dated claim is a drift tripwire, not a log: the resolver contract
of 2026-01-01 is the one the override map of 2026-03-04 is checked against.
