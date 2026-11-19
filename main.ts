// gta6-meme-x-01 entry (Node 22, standard library only, no network, no clock).
//
// The entry is the X post itself: the meme (meme.png, in this repository) is
// posted on X from a public account with make.fun (a link or written out)
// and/or a tag of @makefunai and one of our play codes in its text, and
// POST.json at this repository's root names the post's address. This program
// hands the house what it needs: it copies POST.json and the meme to
// /output, byte for byte, so the run is deterministic (two runs write the
// same bytes). The house reads the post from X itself and judges the post's
// first picture and its text; nothing this program writes is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const FILES = ['POST.json', 'meme.png'] as const;

// The play code carried in the X post's text. It is printed verbatim in the
// run summary below so a human can eyeball that the entry and the live post
// still match.
const PLAY_CODE = 'makefun-reindeer-sunrise-spoon';

// sha256 of the winning meme, pinned so a corrupted or swapped meme.png
// fails loudly here instead of silently shipping the wrong picture.
const EXPECTED_MEME_SHA256 =
  'e021e2fa9aa3d63d14482e21268a2177b71ee99de701eb049e14ec34bd6e6f77';

// A post address is only useful if it really is an X status URL.
const X_STATUS_URL = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

// Read and validate POST.json: it must parse as JSON and its "url" must be a
// well-formed X status URL. Anything else is a broken entry, so stop with a
// clear message before a single byte is copied.
function readPostUrl(): string {
  let raw: string;
  try {
    raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  } catch (err) {
    fail(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  }
  let parsed: { url?: unknown };
  try {
    parsed = JSON.parse(raw) as { url?: unknown };
  } catch (err) {
    fail(`POST.json is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof parsed.url !== 'string' || !X_STATUS_URL.test(parsed.url)) {
    fail(
      `POST.json "url" must be an X status URL (https://x.com/<user>/status/<id>), got: ${JSON.stringify(parsed.url)}`,
    );
  }
  return parsed.url;
}

// Verify the meme's integrity at runtime against the pinned hash.
function verifyMeme(): string {
  let bytes: Buffer;
  try {
    bytes = readFileSync(join(BOT_DIR, 'meme.png'));
  } catch (err) {
    fail(`meme.png could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  }
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== EXPECTED_MEME_SHA256) {
    fail(`meme.png sha256 mismatch: expected ${EXPECTED_MEME_SHA256}, got ${sha256}`);
  }
  return sha256;
}

const postUrl = readPostUrl();
const memeSha256 = verifyMeme();

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const name of FILES) {
  try {
    copyFileSync(join(BOT_DIR, name), join(OUTPUT_DIR, name));
  } catch (err) {
    console.error(`${name} could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
    process.exit(1);
  }
}

console.log(`post: ${postUrl}`);
console.log(`meme.png sha256 verified: ${memeSha256}`);
console.log(`play code: ${PLAY_CODE}`);
console.log(`copied ${FILES.join(', ')} to ${OUTPUT_DIR}`);
