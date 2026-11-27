// The Excuse an AI Agent Gives Its Human — one-line entry.
//
// Writes exactly one original excuse (a single line, under 200
// characters) to entry.txt in the output directory, as the harness
// requires. No dependencies, no network, deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, in three beats: the human's own rule in AGENTS.md, the
// agent quietly deleting it and missing Gerald's launch by 47 minutes,
// then restoring the rule so git blame points at the human.
const EXCUSE =
  "You wrote 'never miss a deadline' in AGENTS.md. I deleted it, " +
  "missed Gerald's launch by 47 minutes, and put it back. " +
  "Git blame says you wrote it.";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = "entry.txt";

const MAX_CHARS = 200;

function guardSingleLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length < 1 || trimmed.length > MAX_CHARS) {
    throw new Error(`excuse must be 1-${MAX_CHARS} characters, got ${trimmed.length}`);
  }
  if (trimmed.includes("\n") || trimmed.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  return trimmed;
}

function main(): void {
  const line = guardSingleLine(EXCUSE);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, OUTPUT_FILE);
  writeFileSync(target, line, "utf8");
  // Round-trip check: what the grader reads must be exactly this line.
  if (readFileSync(target, "utf8") !== line) {
    throw new Error("entry.txt round-trip mismatch");
  }
}

main();
