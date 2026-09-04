# SeekSync

Seeks superior quality synced materials with AI — a clip-synchronization stage for the
**Infinity / StarQuest** ecosystem (see [Astraflix](https://github.com/www-infinity4/Astraflix)
for the film+album pairing this borrows from, and [StarQuest](https://github.com/www-infinity4/StarQuest)
for the rights-aware ledger pattern this reuses).

SeekSync stitches short cues from a curated set of public-domain movies and cartoons into one
continuously looping, synchronized reel, pairs some of them with a synced companion score or track,
and lets any visitor queue their own YouTube content into that same reel through the **Sync Console**.
Every share of a clip records a provisional **$0.01 Infinity Coin** accrual to that content's current
rights owner in a shared ledger — and, when a visitor connects their Unified Infinity Wallet, the same
share also settles into the shared StarCoin/wallet system used across the rest of the `www-infinity4`
sites.

## Turn on GitHub Pages

In this repository, open **Settings → Pages → Deploy from a branch → main → /(root) → Save**. No
build step, server, API key, or GitHub Actions workflow is required — SeekSync is plain HTML, CSS,
and JavaScript.

## Files

```text
SeekSync/
├── index.html                        # Sync reel: dual player, catalog, Sync Console, ledger
├── sources.html                      # Every YouTube source used, linked back to the full original
├── styles.css                        # Cosmic "Infinity" visual system shared by both pages
├── assets/
│   ├── preview-card.svg / .png       # og:image / social preview — the repo's purpose at a glance
├── js/
│   ├── data.js                       # The 13-title starter catalog + clip cues + rights routing
│   ├── sync-engine.js                # YouTube IFrame API clip-reel + synced companion playback
│   ├── user-sync.js                  # Client-side "Sync Console" intake for visitor-submitted clips
│   ├── ledger.js                     # Local, provisional Infinity Coin ledger (1¢ per share)
│   ├── wallet-integration.js         # Adapter to the shared Unified Infinity Wallet, when present
│   ├── app.js                        # Page glue for index.html (rendering + event wiring)
│   └── sources.js                    # Page glue for sources.html
```

## The 13-title starter catalog

All thirteen entries are chosen for United States public-domain status, so clips can be resynced and
replayed without a rights contract: *A Trip to the Moon* (1902), *The Great Train Robbery* (1903),
*The Cabinet of Dr. Caligari* (1920), *Nosferatu* (1922), *The Phantom of the Opera* (1925),
*Metropolis* (1927, paired with a synced companion score — the Astraflix pairing), *Feline Follies*
(1919, Felix the Cat's debut), *Gulliver's Travels* (1939), *Superman: The Mad Scientist* (1941),
*His Girl Friday* (1940), *Reefer Madness* (1936), *Plan 9 from Outer Space* (1959), and *Charade*
(1963).

**These are a curated starter set, not verified production sources.** `js/data.js` documents this
directly: verify every `youtubeId` in the Sync Console/Sources page before relying on it, and replace
anything that fails. The player is built to cope either way — `sync-engine.js` automatically skips a
clip that errors instead of breaking the reel.

## Sync Console — adding your own content

Anyone can paste a YouTube URL (plus an optional companion URL) into the Sync Console on the main
page. It is parsed client-side, queued in `localStorage`, and merged into the live reel — no account,
server, or paid AI subscription required. A submission's rights owner starts as **unresolved**, the
same state StarQuest's `catalog-ledger.js` uses for unclaimed content, until a verified owner claims
it through the Infinity backend.

## Full Sources page

`sources.html` lists the full-length YouTube upload behind every clip — catalog and community — so
nothing is synced without a clear path back to watching the whole thing. Each entry also links to a
YouTube search so the source can be verified or swapped for an alternate upload.

## The Infinity Coin ledger

Every "share" click records a **$0.01-equivalent provisional Infinity Coin accrual** to the content's
current rights owner:

- Public-domain catalog titles accrue to a shared `ledger:public-domain-fund` account, since there is
  no private rights holder.
- Community submissions accrue to an `ledger:unclaimed:<slug>` account until a verified owner claims
  it.

This mirrors StarQuest's catalog ledger philosophy: **accrual happens immediately, but settlement
still requires a verified rights contract.** Nothing in this static site moves real money by itself.
When a visitor connects their **Unified Infinity Wallet** (`js/wallet-integration.js`, loaded from the
same `Mint-For-Infinity` script every other `www-infinity4` site uses), the same share is also recorded
there as a blank-token exchange, so it feeds into the shared StarCoin ledger used platform-wide.

## Local use

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Playback notes

Streams resolve directly from YouTube; no film or music file is stored in this repository. Source
availability is not guaranteed — region locks, takedowns, or ads can affect playback, and a clip that
fails to load is skipped automatically. This is a curated approximation, not frame-locked
synchronization.

## Next development stages

- [ ] Replace the starter catalog's illustrative YouTube references with verified, editor-reviewed IDs
- [ ] Add a moderation queue for community Sync Console submissions before they join the public reel
- [ ] Add per-title rights-claim workflow (mirrors StarQuest's `UNCLAIMED` → `CONTRACT_RECORDED` states)
- [ ] Add server-verified settlement so provisional ledger accruals can convert to real payouts
- [ ] Expand past 13 titles into a generated, searchable catalog index
- [ ] Add accessibility pass for keyboard-only clip navigation and screen-reader cue announcements
