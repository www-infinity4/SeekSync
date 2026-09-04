/**
 * SeekSync catalog — the starter "13" synchronized reel.
 *
 * Every entry below is chosen for United States public-domain status so the
 * clip-sync engine can legally remix and replay short cues without a rights
 * contract. Video references are a curated *starter* set — verify them in the
 * Sync Console before a public launch and replace anything that fails to
 * resolve. The player auto-skips a source that errors instead of breaking the
 * reel (see js/sync-engine.js `onPlayerError`).
 *
 * rightsOwnerId routes ledger payouts:
 *   - "ledger:public-domain-fund"  → no private rights holder exists; StarCoin
 *     accruals collect in the shared preservation fund shown on the ledger.
 *   - "ledger:unclaimed:<slug>"    → user-submitted content whose owner has
 *     not been verified yet (mirrors StarQuest's catalog-ledger.js states).
 */
(function (global) {
  "use strict";

  const PUBLIC_DOMAIN_FUND = "ledger:public-domain-fund";

  const SEEKSYNC_CATALOG = [
    {
      id: "trip-to-the-moon",
      title: "A Trip to the Moon",
      year: 1902,
      kind: "movie",
      director: "Georges Méliès",
      domain: "Public domain (US)",
      blurb: "The first true science-fiction film — astronomers fired at the Moon by cannon.",
      youtubeId: "_bKp-6TxsBQ",
      clipCues: [
        { start: 0, end: 24, label: "Observatory council" },
        { start: 300, end: 330, label: "The Moon in the eye" },
        { start: 540, end: 570, label: "Splashdown return" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "great-train-robbery",
      title: "The Great Train Robbery",
      year: 1903,
      kind: "movie",
      director: "Edwin S. Porter",
      domain: "Public domain (US)",
      blurb: "The birth of narrative editing and the American Western in eleven minutes.",
      youtubeId: "kn1O0nCsxfM",
      clipCues: [
        { start: 20, end: 45, label: "Telegraph office holdup" },
        { start: 300, end: 330, label: "The shootout" },
        { start: 500, end: 520, label: "Point-blank finale" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "cabinet-of-dr-caligari",
      title: "The Cabinet of Dr. Caligari",
      year: 1920,
      kind: "movie",
      director: "Robert Wiene",
      domain: "Public domain (US)",
      blurb: "German Expressionist horror painted in jagged, hand-tilted sets.",
      youtubeId: "gW1VLQRss20",
      clipCues: [
        { start: 60, end: 90, label: "Cesare wakes" },
        { start: 1800, end: 1830, label: "The rooftop chase" },
        { start: 3900, end: 3930, label: "Asylum reveal" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "nosferatu",
      title: "Nosferatu",
      year: 1922,
      kind: "movie",
      director: "F.W. Murnau",
      domain: "Public domain (US)",
      blurb: "Count Orlok's shadow climbs the stairs in cinema's first great vampire film.",
      youtubeId: "FC6jFoYm3xs",
      clipCues: [
        { start: 120, end: 150, label: "Arrival at the castle" },
        { start: 2400, end: 2430, label: "The shadow on the stairs" },
        { start: 4500, end: 4530, label: "Dawn's first light" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "phantom-of-the-opera",
      title: "The Phantom of the Opera",
      year: 1925,
      kind: "movie",
      director: "Rupert Julian",
      domain: "Public domain (US)",
      blurb: "Lon Chaney's unmasking remains one of silent horror's defining shocks.",
      youtubeId: "qOXWtOWM_lY",
      clipCues: [
        { start: 300, end: 330, label: "Beneath the opera house" },
        { start: 3000, end: 3030, label: "The unmasking" },
        { start: 4800, end: 4830, label: "Masquerade of the Red Death" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "feline-follies",
      title: "Feline Follies (Felix the Cat)",
      year: 1919,
      kind: "cartoon",
      director: "Otto Messmer",
      domain: "Public domain (US)",
      blurb: "The cartoon that introduced the world to Felix, animation's first breakout star.",
      youtubeId: "2yA0kK6Vs2s",
      clipCues: [
        { start: 0, end: 20, label: "Felix meets Miss Kitty" },
        { start: 240, end: 260, label: "Nine lives gag" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "gullivers-travels",
      title: "Gulliver's Travels",
      year: 1939,
      kind: "cartoon",
      director: "Dave Fleischer",
      domain: "Public domain (US)",
      blurb: "Fleischer Studios' Technicolor answer to feature animation — Lilliput in full song.",
      youtubeId: "5CBSJ6r5rd8",
      clipCues: [
        { start: 180, end: 210, label: "Lilliput discovers the giant" },
        { start: 2400, end: 2430, label: "\"Faithful Forever\" reprise" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "superman-mad-scientist",
      title: "Superman: The Mad Scientist",
      year: 1941,
      kind: "cartoon",
      director: "Dave Fleischer",
      domain: "Public domain (US)",
      blurb: "The Fleischer Superman debut — Art Deco skylines and a ray-gun rampage.",
      youtubeId: "6qAaNqW7ozQ",
      clipCues: [
        { start: 0, end: 25, label: "\"Faster than a speeding bullet\"" },
        { start: 480, end: 510, label: "The electrothanasia ray" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "his-girl-friday",
      title: "His Girl Friday",
      year: 1940,
      kind: "movie",
      director: "Howard Hawks",
      domain: "Public domain (US)",
      blurb: "The fastest-talking newsroom comedy ever cut, with Hildy and Walter trading barbs.",
      youtubeId: "duS0d1IPla4",
      clipCues: [
        { start: 60, end: 90, label: "Hildy walks back in" },
        { start: 3600, end: 3630, label: "\"Get me rewrite\"" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "reefer-madness",
      title: "Reefer Madness",
      year: 1936,
      kind: "movie",
      director: "Louis J. Gasnier",
      domain: "Public domain (US)",
      blurb: "The propaganda cult classic, so overwrought it became a midnight-movie legend.",
      youtubeId: "gDbb5aoR2Ow",
      clipCues: [
        { start: 300, end: 330, label: "The party scene" },
        { start: 2100, end: 2130, label: "The courtroom warning" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "plan-9-from-outer-space",
      title: "Plan 9 from Outer Space",
      year: 1959,
      kind: "movie",
      director: "Ed Wood",
      domain: "Public domain (US)",
      blurb: "\"Future events such as these will affect you in the future\" — the ultimate so-bad-it's-legendary UFO film.",
      youtubeId: "gmsC5ZnwYqE",
      clipCues: [
        { start: 60, end: 90, label: "Criswell's warning" },
        { start: 2400, end: 2430, label: "The saucers attack" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "charade",
      title: "Charade",
      year: 1963,
      kind: "movie",
      director: "Stanley Donen",
      domain: "Public domain (US)",
      blurb: "Cary Grant and Audrey Hepburn outrun killers through Paris in Hitchcock-style style.",
      youtubeId: "6yGN2mDIWLE",
      clipCues: [
        { start: 60, end: 90, label: "Reggie meets Peter" },
        { start: 3600, end: 3630, label: "The rooftop confrontation" },
      ],
      companionYoutubeId: null,
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
    {
      id: "metropolis",
      title: "Metropolis",
      year: 1927,
      kind: "movie",
      director: "Fritz Lang",
      domain: "Public domain (US)",
      blurb: "The skyline of every dystopian city since — paired here with a synced companion score, in the Astraflix tradition.",
      youtubeId: "6nCzoAKuHFI",
      clipCues: [
        { start: 60, end: 90, label: "The Moloch machine" },
        { start: 3000, end: 3030, label: "Maria's transformation" },
        { start: 5400, end: 5430, label: "Heart, hand, and mind" },
      ],
      companionYoutubeId: "PLAK5uy_lrCrcAdxFG4aMzMrebs7o9TU384xyF240",
      companionKind: "playlist",
      rightsOwnerId: PUBLIC_DOMAIN_FUND,
    },
  ];

  function slugify(value) {
    return String(value || "unresolved").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "unresolved";
  }

  function verifyUrl(entry) {
    const query = encodeURIComponent(`${entry.title} ${entry.year} full movie public domain`);
    return `https://www.youtube.com/results?search_query=${query}`;
  }

  function watchUrl(entry) {
    return `https://www.youtube.com/watch?v=${entry.youtubeId}`;
  }

  global.SeekSyncCatalog = {
    titles: SEEKSYNC_CATALOG,
    slugify,
    verifyUrl,
    watchUrl,
    PUBLIC_DOMAIN_FUND,
  };
})(window);
