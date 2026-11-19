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

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const FILES = ['POST.json', 'meme.png'] as const;

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const name of FILES) {
  try {
    copyFileSync(join(BOT_DIR, name), join(OUTPUT_DIR, name));
  } catch (err) {
    console.error(`${name} could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
    process.exit(1);
  }
}
