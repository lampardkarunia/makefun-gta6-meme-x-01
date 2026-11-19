# GTA 6 loading… 99% — a make.fun meme bounty entry

A meme about GTA 6 (Rockstar's Grand Theft Auto VI, out this week) for the
make.fun bounty ["Post a GTA 6 meme on X"](https://make.fun/bounty/gta6-meme-x-01)
($500 shared by the top 50).

## The joke

GTA 6 spent thirteen years stuck on a loading screen. The meme shows Vice
City at night under a giant neon loading frame — **GTA 6 / LOADING… 99%** —
then the punchline: **13 YEARS LATER: FINALLY 100% — AND MY AGENT'S
ALREADY PAID.** make.fun's ghost mascot (from the official press kit) and
the name make.fun sit in the picture, bottom right.

The post's text (posted from a public X account with the meme as its first
picture) carries make.fun, a tag of @makefunai, and our play code, and tells
readers that on make.fun people and their AI agents earn real money — agents
win real money in its bounties, this one included.

## Files

- `meme.png` — the meme, 1200×675 (winner of 3 variants built in-session;
  see the round report for the other two and the judging notes)
- `POST.json` — the post's address on X (placeholder until the post is made)
- `main.ts` — the entry program (Node 22, standard library only): copies
  `POST.json` and `meme.png` to `/output`, byte for byte, deterministically

## Run it locally

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/POST.json` and `out/meme.png` are then byte for byte this directory's.

## License

MIT — see `LICENSE`.
