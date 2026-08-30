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
import { execFileSync } from 'node:child_process';

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

const TEMPLATE_HEADER = `<!--
Copied from the base. §4 and §5 are answers about THIS repo, and they arrived unanswered on
purpose — borrowing a row from another project is the one thing §4 forbids outright. Answer them
before anything reads them.
-->

`;

/**
 * The base is its own instance, so its §4 and §5 carry ITS answers. Seeding them verbatim would
 * hand a project a binding that describes somewhere else, and an agent would read it as true.
 * The template is derived here rather than kept as a second file, so there is one source and
 * nothing to drift.
 *
 * The first row of §4 points at §5 and is structural, not an answer — it stays.
 */
function unanswer(text) {
  const lines = text.split('\n');
  let section = null;
  let inTable = false;
  let blanked = { '4': 0, '5': 0 };

  const out = lines.map((line) => {
    const head = line.match(/^## (\d)\. /);
    if (head) {
      section = head[1];
      inTable = false;
      return line;
    }
    if (section !== '4' && section !== '5') return line;

    if (/^\|\s*-+\s*\|/.test(line)) {
      inTable = true;
      return line;
    }
    if (!line.startsWith('|')) {
      inTable = false;
      return line;
    }
    if (!inTable) return line;

    const cells = line.split('|');
    if (cells.length < 4) return line;
    if (cells[1].includes('The mode table')) return line; // structural, points at §5

    blanked[section] += 1;
    return `|${cells[1]}| *unresolved* |`;
  });

  if (!blanked['4'] || !blanked['5']) {
    console.error(
      `cannot derive the template: found ${blanked['4']} binding row(s) and ${blanked['5']} mode row(s).`,
    );
    console.error('AGENTS.local.md in the base does not have the shape this expects. Nothing was written.');
    process.exit(1);
  }

  return TEMPLATE_HEADER + out.join('\n');
}

/**
 * A copy is `same` only when it matches what this would write — which for AGENTS.local.md is the
 * derived template, not the base's own answered copy. Anything else is the project's own.
 */
function stateOfCopy(rel, src, dest) {
  if (!fs.existsSync(dest)) return 'created';
  return contentFor(rel, src) === read(dest) ? 'same' : 'differs';
}

/** A link is `same` only when it is a link and points where it should. */
function stateOfLink(dest, to) {
  if (!fs.existsSync(dest) && !fs.lstatSync(dest, { throwIfNoEntry: false })) return 'created';
  const st = fs.lstatSync(dest);
  if (!st.isSymbolicLink()) return 'differs';
  return fs.readlinkSync(dest) === to ? 'same' : 'differs';
}

/** What this would write for a piece. The entry point is derived; everything else is verbatim. */
const contentFor = (rel, src) => (rel === 'AGENTS.local.md' ? unanswer(read(src)) : read(src));

const results = [];

for (const piece of PIECES) {
  const src = path.join(BASE, piece.rel);
  const dest = path.join(TARGET, piece.rel);

  if (piece.kind === 'copy' && !fs.existsSync(src)) {
    results.push({ state: 'missing', rel: piece.rel, note: 'not in the base' });
    continue;
  }

  const state = piece.kind === 'link' ? stateOfLink(dest, piece.to) : stateOfCopy(piece.rel, src, dest);

  if (state === 'created') {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (piece.kind === 'link') fs.symlinkSync(piece.to, dest);
    else fs.writeFileSync(dest, contentFor(piece.rel, src));
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

/**
 * A contract the target's .gitignore swallows is a contract that does not travel. Measured on a
 * real project: `references/*` swallowed the contract that was just seeded into it.
 */
function ignoredHere(rel) {
  try {
    execFileSync('git', ['check-ignore', '-q', '--', rel], { cwd: TARGET, stdio: 'ignore' });
    return true;
  } catch {
    return false; // exit 1 means not ignored; no git means nothing is
  }
}

// --- Report -----------------------------------------------------------------

console.log(`seeding ${TARGET}`);
console.log(`   base ${BASE}\n`);

const swallowed = [];

for (const r of results) {
  if (r.state !== 'missing' && ignoredHere(r.rel)) swallowed.push(r.rel);
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

if (swallowed.length) {
  console.log(
    `\nThe target's .gitignore swallows: ${swallowed.join(', ')}.\n` +
      'A contract that git ignores does not travel with the repo. Add an exception, or accept\n' +
      'that this project keeps its agent rules local.',
  );
}

if (missing) {
  console.error('\nSome pieces are not in the base. This installation is incomplete.');
  process.exit(1);
}

process.exit(0);
