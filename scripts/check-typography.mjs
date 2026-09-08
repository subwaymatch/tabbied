#!/usr/bin/env node
// Plain punctuation, enforced.
//
// Every tracked text file is scanned for the characters that word processors
// and language models reach for and that this repo does not use: em and en
// dashes, curly quotes, the ellipsis character, arrows, bullets, check marks,
// emoji, and the invisible ones (no-break space, zero-width space, a stray
// byte-order mark). The rule and its reasons are in CLAUDE.md ("Plain
// punctuation"); this is the gate that makes it hold across sessions rather
// than across the one that read the rule.
//
// A glyph that is genuinely part of a design (a CSS `content`, an icon, a
// timetable arrow) is written as an escape (`\2714`, `→`) so the source
// stays ASCII and the choice is visible in review. Prose never gets that
// exemption: a dash in a sentence is a comma, a colon, a period, or a pair of
// parentheses waiting to be chosen.
//
// Usage: node scripts/check-typography.mjs [path ...]
// With no paths, every file `git ls-files` reports that has a text extension.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const BANNED = [
  ['—', 'em dash; use a comma, colon, period or parentheses'],
  ['–', 'en dash; use a hyphen'],
  ['‘', 'curly quote; use a straight quote'],
  ['’', 'curly quote or apostrophe; use a straight one'],
  ['“', 'curly double quote; use a straight quote'],
  ['”', 'curly double quote; use a straight quote'],
  ['…', 'ellipsis character; use three periods'],
  ['→', 'arrow; write "to" or "->"'],
  ['←', 'arrow; write "from" or "<-"'],
  ['•', 'bullet; use a hyphen or a list'],
  ['✓', 'check mark; say "ok"'],
  ['✔', 'check mark; say "ok"'],
  [' ', 'no-break space; use a plain space or &nbsp;'],
  ['​', 'zero-width space'],
  ['﻿', 'byte-order mark'],
];

/** Symbols and emoji blocks, flagged as one class. */
const SYMBOL_RANGES = [
  [0x2600, 0x27bf], // miscellaneous symbols and dingbats
  [0x2b00, 0x2bff], // arrows and shapes
  [0x1f000, 0x1faff], // emoji
];

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.mts', '.js', '.mjs', '.cjs', '.jsx',
  '.css', '.json', '.jsonc', '.md', '.mdx', '.txt',
  '.yml', '.yaml', '.html', '.svg', '.sh', '.example',
]);

const TEXT_BASENAMES = new Set(['.gitignore', '.npmrc', '.prettierrc', '_headers', '_redirects']);

/** Generated, or not ours to write. */
const SKIP = [/(^|\/)package-lock\.json$/, /(^|\/)dist\//];

const isText = (file) =>
  TEXT_EXTENSIONS.has(path.extname(file)) || TEXT_BASENAMES.has(path.basename(file));

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter((file) => file && isText(file) && !SKIP.some((pattern) => pattern.test(file)));
}

function describe(codePoint) {
  const banned = BANNED.find(([char]) => char.codePointAt(0) === codePoint);
  if (banned) return banned[1];
  return 'symbol or emoji; use words';
}

function isBanned(codePoint) {
  if (BANNED.some(([char]) => char.codePointAt(0) === codePoint)) return true;
  return SYMBOL_RANGES.some(([from, to]) => codePoint >= from && codePoint <= to);
}

function scan(file) {
  const findings = [];
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    let column = 0;
    for (const char of line) {
      column += 1;
      const codePoint = char.codePointAt(0);
      // A BOM is only a fault when it is not the first character of the file.
      if (codePoint === 0xfeff && index === 0 && column === 1) continue;
      if (isBanned(codePoint)) {
        findings.push({ line: index + 1, column, codePoint });
      }
    }
  });

  return findings;
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : trackedFiles();
let total = 0;
const perFile = new Map();

for (const file of files) {
  const findings = scan(file);
  if (findings.length === 0) continue;
  total += findings.length;
  perFile.set(file, findings);
}

if (total === 0) {
  console.log(`typography: ${files.length} files, plain punctuation throughout`);
  process.exit(0);
}

const LIMIT = 200;
let shown = 0;

for (const [file, findings] of perFile) {
  for (const finding of findings) {
    if (shown >= LIMIT) break;
    const code = `U+${finding.codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
    console.error(`${file}:${finding.line}:${finding.column}: ${code} ${describe(finding.codePoint)}`);
    shown += 1;
  }
}

if (total > shown) console.error(`... and ${total - shown} more`);
console.error(
  `\ntypography: ${total} banned character(s) in ${perFile.size} file(s). See "Plain punctuation" in CLAUDE.md.`
);
process.exit(1);
