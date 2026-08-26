#!/usr/bin/env node
/**
 * validate-docs.mjs
 * Makes the `docs/` contract executable. Every check cites the rule it enforces.
 *
 *   ERROR -> violates a written rule. Breaks the exit code.
 *   WARN  -> mechanical reading of a written rule. Does not break.
 *   INFO  -> observed pattern with no contract behind it. Reported only.
 *
 * Zero-dep on purpose: runs on plain `node`, nothing to install.
 * Resolves paths from the repo root, not from this directory.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const DOCS = path.join(REPO, 'docs');

/** docs/AGENTS.md §4 — an ADR is dated and immutable by design. It records a moment. */
const isAdr = (file) => path.relative(DOCS, file).split(path.sep)[0] === 'adr';

const findings = [];
const add = (sev, check, file, line, msg) =>
  findings.push({ sev, check, file: path.relative(REPO, file), line, msg });

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** Blanks out fenced and inline code so checks never fire on examples. */
function stripCode(text) {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// --- Checks -----------------------------------------------------------------

/** docs/AGENTS.md §5 — internal links are relative and must resolve. */
function checkLinks(file, raw) {
  const text = stripCode(raw);
  const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const m of text.matchAll(LINK)) {
    const target = m[1];
    const line = lineOf(text, m.index);
    if (/^(https?:|mailto:|#)/.test(target)) continue;

    if (target.startsWith('/')) {
      add('ERROR', 'absolute-link', file, line, `absolute link: ${target}`);
      continue;
    }
    const rel = target.split('#')[0];
    if (!rel) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), rel))) {
      add('ERROR', 'broken-link', file, line, `does not resolve: ${target}`);
    }
  }
}

/**
 * docs/AGENTS.md §2 — the delta is rewritten, not appended.
 * §1 — a phase never survives as a stamp saying it was done.
 */
function checkChangelog(file, raw) {
  if (isAdr(file)) return;
  const text = stripCode(raw);

  const PATTERNS = [
    {
      re: /\((?:actualizaci[óo]n|update|nota|edit)\b[^)]*\d{4}-\d{2}-\d{2}[^)]*\)/gi,
      msg: 'accumulative parenthesis — rewrite the sentence instead',
    },
    {
      re: /\b(?:fase|phase)\s+[\w.]+\b[^.\n]*\d{4}-\d{2}-\d{2}/gi,
      msg: 'phase stamped with a date — a phase survives only as a plan',
    },
    {
      re: /^[ \t]*(?:[-*+][ \t]+)?\d{4}-\d{2}-\d{2}[ \t]*[:—-]/gm,
      msg: 'date-log entry — history lives in git',
    },
  ];

  for (const { re, msg } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      add('ERROR', 'changelog', file, lineOf(text, m.index), `${msg}: "${m[0].trim()}"`);
    }
  }
}

/**
 * docs/AGENTS.md §3 — never a commit hash in a living doc.
 * WARN, not ERROR: mechanically this cannot tell a hash from any other hex token.
 */
function checkHashes(file, raw) {
  if (isAdr(file)) return;
  const text = stripCode(raw);
  const HEX = /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g;
  for (const m of text.matchAll(HEX)) {
    add('WARN', 'commit-hash', file, lineOf(text, m.index), `looks like a commit hash: ${m[0]}`);
  }
}

// --- Run --------------------------------------------------------------------

const files = walk(DOCS);

if (!fs.existsSync(DOCS)) {
  console.error(`docs/ not found at ${DOCS}`);
  process.exit(1);
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  checkLinks(file, raw);
  checkChangelog(file, raw);
  checkHashes(file, raw);
}

const order = { ERROR: 0, WARN: 1, INFO: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file) || a.line - b.line);

for (const f of findings) {
  console.log(`${f.sev.padEnd(5)} ${f.check.padEnd(14)} ${f.file}:${f.line}  ${f.msg}`);
}

const errors = findings.filter((f) => f.sev === 'ERROR').length;
const warns = findings.filter((f) => f.sev === 'WARN').length;

console.log(
  `\n${files.length} file(s) checked — ${errors} error(s), ${warns} warning(s)`,
);

process.exit(errors > 0 ? 1 : 0);
