/**
 * SeekSync clip-sync engine.
 *
 * Builds one continuous "reel" queue out of the 13-title starter catalog plus
 * anything queued through the Sync Console (js/user-sync.js), then drives two
 * YouTube IFrame players in parallel: the primary clip, and — when the entry
 * defines one — a synced companion track (score, commentary, or a full
 * playlist), in the same spirit as Astraflix's dual film+album pairing.
 *
 * The reel loops forever. Combined with however many custom clips a visitor
 * queues, that is the "thousands of movies in clips" promise: a small curated
 * core that keeps growing every time someone adds a synced source.
 */
(function (global) {
  "use strict";

  const ADVANCE_POLL_MS = 500;
  let primaryPlayer = null;
  let companionPlayer = null;
  let apiReady = false;
  let queue = [];
  let cueIndex = -1;
  let pollTimer = null;
  let running = false;
  let muted = true;

  const listeners = { cue: [] };

  function onCue(handler) { listeners.cue.push(handler); }
  function emitCue(cue) { listeners.cue.forEach((handler) => { try { handler(cue); } catch (_) {} }); }

  function buildBaseQueue() {
    const catalog = (global.SeekSyncCatalog && global.SeekSyncCatalog.titles) || [];
    const base = [];
    catalog.forEach((title) => {
      (title.clipCues || []).forEach((cue) => {
        base.push({
          titleId: title.id,
          title: title.title,
          year: title.year,
          kind: title.kind,
          rightsOwnerId: title.rightsOwnerId,
          youtubeId: title.youtubeId,
          start: cue.start,
          end: cue.end,
          label: cue.label,
          companionYoutubeId: title.companionYoutubeId || null,
          companionKind: title.companionKind || "video",
          source: "catalog",
        });
      });
    });
    return base;
  }

  function loadUserQueue() {
    try {
      const raw = JSON.parse(global.localStorage.getItem("seeksync.userSyncQueue.v1") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (_) {
      return [];
    }
  }

  function rebuildQueue() {
    queue = buildBaseQueue().concat(loadUserQueue());
    return queue;
  }

  function ensureApi(callback) {
    if (global.YT && global.YT.Player) {
      apiReady = true;
      callback();
      return;
    }
    const previous = global.onYouTubeIframeAPIReady;
    global.onYouTubeIframeAPIReady = function () {
      apiReady = true;
      if (typeof previous === "function") previous();
      callback();
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }

  function makePlayer(elementId, onErrorSkip) {
    return new global.YT.Player(elementId, {
      height: "100%",
      width: "100%",
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1, enablejsapi: 1 },
      events: {
        onReady: function (event) { event.target.mute(); },
        onError: function () { if (onErrorSkip) advance("source-error"); },
      },
    });
  }

  function init(primaryElementId, companionElementId) {
    rebuildQueue();
    ensureApi(function () {
      primaryPlayer = makePlayer(primaryElementId, true);
      companionPlayer = makePlayer(companionElementId, false);
    });
  }

  function currentCue() { return queue[cueIndex] || null; }

  function playCue(cue) {
    if (!cue || !primaryPlayer || typeof primaryPlayer.loadVideoById !== "function") return;
    primaryPlayer.loadVideoById({ videoId: cue.youtubeId, startSeconds: cue.start, endSeconds: cue.end });
    if (muted) primaryPlayer.mute(); else primaryPlayer.unMute();

    if (cue.companionYoutubeId && companionPlayer && typeof companionPlayer.loadPlaylist === "function") {
      if (cue.companionKind === "playlist") {
        companionPlayer.loadPlaylist({ list: cue.companionYoutubeId, listType: "playlist" });
      } else {
        companionPlayer.loadVideoById({ videoId: cue.companionYoutubeId });
      }
      companionPlayer.mute();
    } else if (companionPlayer && typeof companionPlayer.stopVideo === "function") {
      companionPlayer.stopVideo();
    }
    emitCue(cue);
  }

  function advance(reason) {
    if (!queue.length) return;
    cueIndex = (cueIndex + 1) % queue.length;
    playCue(currentCue());
  }

  function pollForEnd() {
    clearInterval(pollTimer);
    pollTimer = setInterval(function () {
      if (!running || !primaryPlayer || typeof primaryPlayer.getCurrentTime !== "function") return;
      const cue = currentCue();
      if (!cue) return;
      const t = primaryPlayer.getCurrentTime();
      const end = typeof cue.end === "number" ? cue.end : null;
      if (end && t >= end - 0.3) advance("clip-complete");
    }, ADVANCE_POLL_MS);
  }

  function start() {
    if (!primaryPlayer) return;
    rebuildQueue();
    running = true;
    if (cueIndex < 0) cueIndex = 0;
    playCue(currentCue());
    pollForEnd();
  }

  function restart() {
    cueIndex = -1;
    start();
  }

  function stop() {
    running = false;
    clearInterval(pollTimer);
    if (primaryPlayer && typeof primaryPlayer.stopVideo === "function") primaryPlayer.stopVideo();
    if (companionPlayer && typeof companionPlayer.stopVideo === "function") companionPlayer.stopVideo();
  }

  function next() { advance("manual-skip"); }

  function toggleMute() {
    muted = !muted;
    if (!primaryPlayer) return muted;
    if (muted) primaryPlayer.mute(); else primaryPlayer.unMute();
    return muted;
  }

  function queueLength() { return queue.length; }

  global.SeekSyncSync = { init, start, restart, stop, next, toggleMute, currentCue, onCue, rebuildQueue, queueLength };
})(window);
