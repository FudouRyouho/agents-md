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
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * .agents/scripts/AGENTS.md §4 — resolve paths from the repo root, not from this directory.
 * The script is meant to be installed once and linked onto PATH, so its own location says
 * nothing about which project is being validated. The root is found by walking up from where
 * the command was invoked, looking for the project's entry point.
 *
 * `--dir` is the override for what the walk cannot reach: a second corpus in a monorepo, or a
 * checkout whose cwd is somewhere else. It is an escape, not the way in — a flag someone has to
 * remember is a flag that gets forgotten, and a forgotten one here validates the wrong corpus
 * and still reports green.
 *
 * `--contract-name` specifies the contract file name (default: AGENTS). The marker becomes
 * `{contract-name}.md` (e.g., CLAUDE.md, AGENTS.md). If not provided, falls back to
 * AGENTS.local.md for backwards compatibility.
 */
const DEFAULT_CONTRACT = 'AGENTS';

const nameFlag = process.argv.indexOf('--contract-name');
const CONTRACT_NAME = nameFlag !== -1 && process.argv[nameFlag + 1]
  ? process.argv[nameFlag + 1]
  : DEFAULT_CONTRACT;

const MARKER = `${CONTRACT_NAME}.md`;
const FALLBACK_MARKER = 'AGENTS.local.md';

function findRoot(from) {
  let dir = path.resolve(from);
  for (;;) {
    if (fs.existsSync(path.join(dir, MARKER))) return dir;
    if (fs.existsSync(path.join(dir, FALLBACK_MARKER))) return dir;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

const flag = process.argv.indexOf('--dir');
if (flag !== -1 && !process.argv[flag + 1]) {
  console.error('--dir needs a path');
  process.exit(1);
}

const REPO = flag !== -1 ? path.resolve(process.argv[flag + 1]) : findRoot(process.cwd());

if (!REPO) {
  console.error(`no ${MARKER} or ${FALLBACK_MARKER} found from ${process.cwd()} upwards.`);
  console.error('Run it from inside a project that uses this base, or pass --dir <path>.');
  console.error(`  (searched for: ${MARKER} or ${FALLBACK_MARKER})`);
  process.exit(1);
}

const DOCS = path.join(REPO, 'docs');

/**
 * .agents/scripts/AGENTS.md §3 — the contract governs all of `docs/`, but only the published
 * corpus gates. What git ignores is private: read and reported, never a reason to fail.
 * A project without git has no notion of private, so everything is published.
 */
function publishedSet() {
  try {
    const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', 'docs'], {
      cwd: REPO,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return new Set(out.split('\n').filter(Boolean).map((r) => path.join(REPO, r)));
  } catch {
    return null; // no git, or not a repo — nothing is private
  }
}

const PUBLISHED = publishedSet();
const isPublished = (file) => PUBLISHED === null || PUBLISHED.has(file);

const findings = [];
const add = (sev, check, file, line, msg) =>
  findings.push({ sev, check, file: path.relative(REPO, file), line, msg, published: isPublished(file) });

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

/** Heading slug, renderer-agnostic: lowercase, punctuation dropped, spaces to hyphens. */
const slug = (h) =>
  h
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

const anchorCache = new Map();
/** Every anchor a file offers, read from its headings. */
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const set = new Set();
  if (fs.existsSync(file)) {
    const text = stripCode(fs.readFileSync(file, 'utf8'));
    for (const m of text.matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*$/gm)) set.add(slug(m[1]));
  }
  anchorCache.set(file, set);
  return set;
}

/**
 * docs/AGENTS.md §4 — internal links are relative and must resolve. A fragment is part of the
 * target: a link to a heading that does not exist does not resolve either.
 *
 * The fragment is WARN, not ERROR: heading slugs are renderer-specific, so this reads the rule
 * mechanically rather than authoritatively.
 */
function checkLinks(file, raw) {
  const text = stripCode(raw);
  const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const m of text.matchAll(LINK)) {
    const target = m[1];
    const line = lineOf(text, m.index);
    if (/^(https?:|mailto:)/.test(target)) continue;

    if (target.startsWith('/')) {
      add('ERROR', 'absolute-link', file, line, `absolute link: ${target}`);
      continue;
    }

    const hash = target.indexOf('#');
    const rel = hash === -1 ? target : target.slice(0, hash);
    const frag = hash === -1 ? '' : decode(target.slice(hash + 1));
    const dest = rel ? path.resolve(path.dirname(file), rel) : file;

    if (rel && !fs.existsSync(dest)) {
      add('ERROR', 'broken-link', file, line, `does not resolve: ${target}`);
      continue;
    }
    if (frag && !anchorsOf(dest).has(slug(frag))) {
      add('WARN', 'broken-anchor', file, line, `anchor not found: ${target}`);
    }
  }
}

/**
 * docs/AGENTS.md §2 — the delta is rewritten, not appended.
 * §1 — a phase never survives as a stamp saying it was done.
 */
function checkChangelog(file, raw) {
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
  const text = stripCode(raw);
  const HEX = /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g;
  for (const m of text.matchAll(HEX)) {
    add('WARN', 'commit-hash', file, lineOf(text, m.index), `looks like a commit hash: ${m[0]}`);
  }
}

/**
 * docs/AGENTS.md §3 — a date earns its place only as a drift tripwire, a claim to reconcile
 * against something else dated. A lone timestamp is a log and goes to git.
 *
 * WARN, not ERROR: "reconciled against something else dated" is read mechanically as a second
 * date in the same paragraph. Whether a date actually anchors a claim is not decidable here.
 * The line-start date-log form stays with `changelog`, so one violation is reported once.
 */
function checkLoneDate(file, raw) {
  const DATE = /\b\d{4}-\d{2}-\d{2}\b/g;
  const DATE_LOG = /^[ \t]*(?:[-*+][ \t]+)?\d{4}-\d{2}-\d{2}[ \t]*[:—-]/gm;
  const body = stripCode(raw).replace(DATE_LOG, (m) => ' '.repeat(m.length));

  let paragraph = [];
  const close = () => {
    if (paragraph.length === 1) {
      const [line, date] = paragraph[0];
      add('WARN', 'lone-date', file, line, `lone timestamp, nothing dated to reconcile it against: ${date}`);
    }
    paragraph = [];
  };

  body.split('\n').forEach((text, i) => {
    if (!text.trim()) return close();
    for (const m of text.matchAll(DATE)) paragraph.push([i + 1, m[0]]);
  });
  close();
}

// --- Self-test ---------------------------------------------------------------

const FIXTURES = path.join(__dirname, '..', 'fixtures');

const runChecks = (file, raw) => {
  checkLinks(file, raw);
  checkChangelog(file, raw);
  checkHashes(file, raw);
  checkLoneDate(file, raw);
};

/**
 * .agents/scripts/AGENTS.md §3 — the fixtures are the only corpus outside docs/.
 * A check that never fired on a known-bad file has not been verified, and a green run that
 * verified nothing is worse than no run at all.
 */
function selfTest() {
  const fixtures = walk(FIXTURES);
  if (!fixtures.length) return ['no fixtures found — the checks are unproven'];

  const failures = [];
  for (const file of fixtures) {
    const name = path.basename(file, '.md');
    const start = findings.length;
    runChecks(file, fs.readFileSync(file, 'utf8'));
    const raised = findings.splice(start).map((f) => f.check);

    const got = [...new Set(raised)].sort();
    if (name === 'clean') {
      if (got.length) failures.push(`clean.md raised ${got.join(', ')}`);
    } else if (name.startsWith('expect-')) {
      const want = name.slice('expect-'.length);
      if (got.join() !== want) failures.push(`${name}.md raised [${got.join(', ')}], wants [${want}]`);
    } else {
      failures.push(`${name}.md declares no expectation in its name`);
    }
  }
  return failures;
}

// --- Run --------------------------------------------------------------------

const selfFailures = selfTest();
if (selfFailures.length) {
  for (const f of selfFailures) console.error(`SELFTEST  ${f}`);
  console.error('\nThe checks are unverified. Nothing was validated.');
  process.exit(2);
}

const files = walk(DOCS);

if (!fs.existsSync(DOCS)) {
  console.error(`docs/ not found at ${DOCS}`);
  process.exit(1);
}

for (const file of files) {
  runChecks(file, fs.readFileSync(file, 'utf8'));
}

const order = { ERROR: 0, WARN: 1, INFO: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file) || a.line - b.line);

for (const f of findings) {
  const mark = f.published ? '' : '  · private';
  console.log(`${f.sev.padEnd(5)} ${f.check.padEnd(14)} ${f.file}:${f.line}  ${f.msg}${mark}`);
}

const tally = (pub, sev) => findings.filter((f) => f.published === pub && f.sev === sev).length;
const errors = tally(true, 'ERROR');
const priv = findings.filter((f) => !f.published).length;

console.log(`\n${files.length} file(s) checked — ${errors} error(s), ${tally(true, 'WARN')} warning(s)`);

if (priv) {
  console.log(
    `${' '.repeat(String(files.length).length)} ${tally(false, 'ERROR')} error(s), ` +
      `${tally(false, 'WARN')} warning(s) in files git ignores — reported, not gated`,
  );
}

process.exit(errors > 0 ? 1 : 0);