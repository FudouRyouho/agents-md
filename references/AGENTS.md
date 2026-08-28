# References Rules

**External material the project draws from. Never the project's own truth.**

## 1. What Belongs Here

- Vendored code from another project — to study or partially reuse.
- Captured external documentation — wiki pages, specs, API docs not guaranteed to stay reachable.
- Visual references — screenshots, mockups used as a design source.

**Does not belong here:**

- The project's own truth → `docs/`.
- Anything the project generates itself, even if it looks like a reference artifact.

## 2. Two Regimes, One Question

**Can you fetch it again, byte for byte? Vendored if yes. Captured if no.**

| | Vendored | Captured |
| --- | --- | --- |
| Typical | code from a repo, a package source | a wiki page, a spec, a screenshot |
| Pinned by | commit hash or tag — never a moving branch | source URL + capture date |
| Git | gitignored — the fetch is the copy | **committed — this is the only copy** |
| Staleness shown by | the pinned hash against upstream | the capture date |

**Never gitignore a capture.** It was kept because it can disappear; ignoring it throws away the one
thing the capture was for. When in doubt about which regime applies, it is a capture — the cost of
committing something reproducible is disk, and the cost of ignoring something irreplaceable is the
material.

## 3. Read-Only

- Do not edit in place. To change a file, copy it out and change the copy.
- A wrong fact in captured material is marked, never corrected. Correcting it in place mixes the
  project's authority with the source's, and the material stops being a reference.
- Capture the rawest form the source offers — the wikitext, the markdown, the original file. A
  conversion is a reading of the source, and a reading can lose what nobody knew was load-bearing.

## 4. Every Folder Carries Its README

**Material nobody can place is material nobody can use.**

A sibling `README.md` states: where it came from, when, how to get it again, and why the project
keeps it. The last one is the part only you can write — write it even when the material is
self-explanatory.

## 5. Citing Into docs/

- If a doc makes a claim resting on something here, the doc names what it rests on.
- `references/` is read on demand. Never assume it was read.
