#!/usr/bin/env node
/**
 * seed.mjs
 * Installs the project half of the base into a target repo.
 *
 * Three states per piece and no fourth: absent -> created, identical -> left alone,
 * different -> reported and never touched. It does not overwrite, does not rename anything
 * to .backup, and never asks. A script that asks cannot run unattended, and the decision
 * about something that already exists belongs in the conversation, not in here.
 *
 * `different` is not a failure. A folder contract that diverged because the project needed
 * its own rules is adaptation — the README says so. This reports it and stops there.
 *
 * .agents/scripts/AGENTS.md §4 — two roots, never confused. The base IS where this script
 * lives, because it copies from it. The target is where the command runs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.resolve(__dirname, '../../..');

const flag = process.argv.indexOf('--dir');
if (flag !== -1 && !process.argv[flag + 1]) {
  console.error('--dir needs a path');
  process.exit(1);
}
const TARGET = path.resolve(flag !== -1 ? process.argv[flag + 1] : process.cwd());

if (!fs.existsSync(TARGET)) {
  console.error(`target does not exist: ${TARGET}`);
  process.exit(1);
}

/**
 * README § Instalación — only the pieces whose destination is the project.
 * `profile/`, `scripts/` and `skills/` are global links and are never seeded.
 */
const PIECES = [
  { kind: 'copy', rel: 'AGENTS.local.md' },
  { kind: 'link', rel: 'CLAUDE.md', to: 'AGENTS.local.md' },
  { kind: 'copy', rel: 'docs/AGENTS.md' },
  { kind: 'copy', rel: 'docs-archive/AGENTS.md' },
  { kind: 'copy', rel: 'docs-archive/.gitignore' },
  { kind: 'copy', rel: 'docs-archive/.gitkeep' },
  { kind: 'copy', rel: 'references/AGENTS.md' },
];

const read = (p) => fs.readFileSync(p, 'utf8');

/** A copy is `same` only when the bytes match. Anything else is the project's own. */
function stateOfCopy(src, dest) {
  if (!fs.existsSync(dest)) return 'created';
  return read(src) === read(dest) ? 'same' : 'differs';
}

/** A link is `same` only when it is a link and points where it should. */
function stateOfLink(dest, to) {
  if (!fs.existsSync(dest) && !fs.lstatSync(dest, { throwIfNoEntry: false })) return 'created';
  const st = fs.lstatSync(dest);
  if (!st.isSymbolicLink()) return 'differs';
  return fs.readlinkSync(dest) === to ? 'same' : 'differs';
}

const results = [];

for (const piece of PIECES) {
  const src = path.join(BASE, piece.rel);
  const dest = path.join(TARGET, piece.rel);

  if (piece.kind === 'copy' && !fs.existsSync(src)) {
    results.push({ state: 'missing', rel: piece.rel, note: 'not in the base' });
    continue;
  }

  const state = piece.kind === 'link' ? stateOfLink(dest, piece.to) : stateOfCopy(src, dest);

  if (state === 'created') {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (piece.kind === 'link') fs.symlinkSync(piece.to, dest);
    else fs.copyFileSync(src, dest);
  }

  let note = '';
  if (piece.kind === 'link') {
    // On `differs` say what is actually there, not what should have been.
    const st = state === 'differs' ? fs.lstatSync(dest) : null;
    note = st
      ? st.isSymbolicLink()
        ? `is a link to ${fs.readlinkSync(dest)}`
        : 'is a regular file'
      : `-> ${piece.to}`;
  }

  results.push({ state, rel: piece.rel, note });
}

// --- Report -----------------------------------------------------------------

console.log(`seeding ${TARGET}`);
console.log(`   base ${BASE}\n`);

for (const r of results) {
  console.log(`  ${r.state.padEnd(8)} ${r.rel}${r.note ? '  ' + r.note : ''}`);
}

const count = (s) => results.filter((r) => r.state === s).length;
const differs = count('differs');
const missing = count('missing');

console.log(
  `\n${count('created')} created, ${count('same')} already in place, ${differs} left untouched`,
);

if (differs) {
  console.log(
    '\nLeft untouched means the project has its own version. Nothing was overwritten.\n' +
      'Compare them by hand and decide — a contract that diverged on purpose is adaptation,\n' +
      'and one that came from somewhere else needs a triage neither this script nor a backup\n' +
      'file can do for you.',
  );
}

if (missing) {
  console.error('\nSome pieces are not in the base. This installation is incomplete.');
  process.exit(1);
}

process.exit(0);
