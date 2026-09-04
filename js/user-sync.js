/**
 * SeekSync "Sync Console" — lets a visitor queue their own YouTube content
 * into the shared reel. Everything here runs client-side: pasted URLs are
 * parsed for a video ID, optionally paired with a companion track, then
 * appended to a localStorage-backed queue that js/sync-engine.js merges into
 * the live reel. There is no server and no paid AI subscription involved —
 * matching the rest of the www-infinity4 ecosystem's no-backend static apps.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "seeksync.userSyncQueue.v1";
  const MAX_QUEUE = 200;

  function extractVideoId(input) {
    const value = String(input || "").trim();
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match) return match[1];
    }
    if (/^[\w-]{11}$/.test(value)) return value;
    return null;
  }

  function read() {
    try {
      const raw = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (_) {
      return [];
    }
  }

  function write(list) {
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_QUEUE))); } catch (_) {}
  }

  /**
   * Queue a user submission. Rights ownership starts UNCLAIMED — exactly like
   * StarQuest's catalog ledger — until the submitter or a verified owner
   * claims it through the Infinity backend.
   */
  function submit({ title, url, companionUrl, start, end }) {
    const youtubeId = extractVideoId(url);
    if (!youtubeId) return { ok: false, reason: "invalid-youtube-url" };

    const slug = (global.SeekSyncCatalog && global.SeekSyncCatalog.slugify(title)) || String(title || "untitled").toLowerCase();
    const entry = {
      titleId: "user-" + slug + "-" + Date.now().toString(36),
      title: String(title || "Untitled sync").slice(0, 120),
      year: new Date().getFullYear(),
      kind: "user-submitted",
      rightsOwnerId: "ledger:unclaimed:" + slug,
      youtubeId,
      start: Math.max(0, Number(start) || 0),
      end: Number(end) > 0 ? Number(end) : Math.max(0, Number(start) || 0) + 30,
      label: "Community sync",
      companionYoutubeId: companionUrl ? extractVideoId(companionUrl) : null,
      companionKind: "video",
      source: "user",
      submittedAt: Date.now(),
    };

    const list = read();
    list.unshift(entry);
    write(list);

    if (global.document && typeof global.document.dispatchEvent === "function") {
      global.document.dispatchEvent(new CustomEvent("seeksync:content-queued", { detail: entry }));
    }
    return { ok: true, entry };
  }

  function remove(titleId) {
    const list = read().filter((entry) => entry.titleId !== titleId);
    write(list);
  }

  function all() { return read(); }

  global.SeekSyncUserSync = { submit, remove, all, extractVideoId, storageKey: STORAGE_KEY };
})(window);
