# References Rules

**External material the project draws from. Never the project's own truth.**

## 1. What Belongs Here

- Vendored code from another project — to study or partially reuse.
- Captured external documentation — wiki pages, specs, API docs not guaranteed to stay reachable.
- Visual references — screenshots, mockups used as a design source.

**Does not belong here:**

- The project's own truth → `docs/`.
- Anything the project generates itself, even if it looks like a reference artifact.

## 2. Read-Only by Default

**A vendored copy stays diffable against upstream.**

- Do not edit in place. To change a file, copy it out and change the copy.
- Pin the commit or tag. Never track a moving branch.
- Record the commit hash and date in a sibling `README.md`. Staleness must be visible.

## 3. Ignore, Don't Commit

- `.gitignore` vendored material unless the project explicitly wants it tracked.
- Document how to re-fetch it. Reproducible beats committed.

## 4. Say Why It's Here

- When the material is a model to imitate rather than code to run, a short `README.md` explaining
  the *why* is worth more than the raw material.

## 5. Citing Into docs/

- If a doc makes a claim resting on something here, the doc names what it rests on.
- `references/` is read on demand. Never assume it was read.
