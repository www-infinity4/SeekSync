/**
 * SeekSync main page glue: renders the catalog grid, wires transport
 * controls, the Sync Console form, and the live Infinity Coin ledger.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const catalog = window.SeekSyncCatalog;
    const sync = window.SeekSyncSync;
    const ledger = window.SeekSyncLedger;
    const userSync = window.SeekSyncUserSync;

    const grid = document.getElementById("catalog-grid");
    const nowPlaying = document.getElementById("now-playing");
    const queueCount = document.getElementById("queue-count");
    const ledgerBody = document.getElementById("ledger-body");
    const ledgerTotal = document.getElementById("ledger-total");
    const userQueueList = document.getElementById("user-queue-list");

    function renderCatalog() {
      if (!grid) return;
      grid.innerHTML = "";
      catalog.titles.forEach((title, index) => {
        const card = document.createElement("article");
        card.className = "title-card";
        card.innerHTML = `
          <div class="title-card__badge">${title.kind === "cartoon" ? "🎬 Cartoon" : "🎞️ Movie"} · ${title.year}</div>
          <h3>${index + 1}. ${title.title}</h3>
          <p class="title-card__director">${title.director}</p>
          <p class="title-card__blurb">${title.blurb}</p>
          <p class="title-card__rights">${title.domain}${title.companionYoutubeId ? " · synced companion track" : ""}</p>
          <div class="title-card__actions">
            <button type="button" class="btn btn-small" data-play="${title.id}">▶ Play in reel</button>
            <button type="button" class="btn btn-small btn-ghost" data-share="${title.id}">⭐ Share (+$0.01)</button>
            <a class="btn btn-small btn-ghost" href="sources.html#${title.id}">Full source ↗</a>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function firstCueIndexFor(titleId) {
      const cues = sync.rebuildQueue();
      return cues.findIndex((cue) => cue.titleId === titleId);
    }

    function renderLedger() {
      if (!ledgerBody || !ledgerTotal) return;
      const summary = ledger.summary();
      ledgerTotal.textContent = "$" + summary.totalAccruedUsd.toFixed(2) + " accrued · " + summary.totalShares + " shares";
      ledgerBody.innerHTML = "";
      if (!summary.recent.length) {
        ledgerBody.innerHTML = '<tr><td colspan="4" class="ledger-empty">Share a synced clip to start the ledger.</td></tr>';
        return;
      }
      summary.recent.forEach((entry) => {
        const row = document.createElement("tr");
        const owner = entry.ownerId.startsWith("ledger:public-domain") ? "Public Domain Fund" : entry.ownerId.replace(/^ledger:/, "");
        row.innerHTML = `<td>${entry.contentTitle}</td><td>${owner}</td><td>$${entry.amountUsd.toFixed(2)}</td><td>${new Date(entry.createdAt).toLocaleTimeString()}</td>`;
        ledgerBody.appendChild(row);
      });
    }

    function renderUserQueue() {
      if (!userQueueList) return;
      const list = userSync.all();
      userQueueList.innerHTML = "";
      if (!list.length) {
        userQueueList.innerHTML = '<li class="empty">No community syncs queued yet — add one below.</li>';
        return;
      }
      list.forEach((entry) => {
        const item = document.createElement("li");
        item.innerHTML = `<span>${entry.title}</span><button type="button" class="btn-remove" data-remove="${entry.titleId}" aria-label="Remove">✕</button>`;
        userQueueList.appendChild(item);
      });
    }

    grid && grid.addEventListener("click", function (event) {
      const playId = event.target.getAttribute("data-play");
      const shareId = event.target.getAttribute("data-share");
      if (playId) {
        const idx = firstCueIndexFor(playId);
        if (idx >= 0) { sync.stop(); sync.start(); for (let i = 0; i < idx; i++) sync.next(); }
      }
      if (shareId) {
        const title = catalog.titles.find((t) => t.id === shareId);
        if (title) {
          ledger.recordShare({ contentId: title.id, contentTitle: title.title, ownerId: title.rightsOwnerId, clipLabel: "catalog-share" });
          renderLedger();
        }
      }
    });

    document.addEventListener("seeksync:content-shared", renderLedger);
    document.addEventListener("seeksync:content-queued", function () { renderUserQueue(); sync.rebuildQueue(); updateQueueCount(); });

    function updateQueueCount() {
      if (!queueCount) return;
      queueCount.textContent = sync.queueLength() + " clips in the reel";
    }

    sync.onCue(function (cue) {
      if (!nowPlaying) return;
      nowPlaying.textContent = `${cue.title} (${cue.year}) — ${cue.label}`;
    });

    const startBtn = document.getElementById("sync-start");
    const restartBtn = document.getElementById("sync-restart");
    const stopBtn = document.getElementById("sync-stop");
    const nextBtn = document.getElementById("sync-next");
    const muteBtn = document.getElementById("sync-mute");

    startBtn && startBtn.addEventListener("click", function () { sync.start(); updateQueueCount(); });
    restartBtn && restartBtn.addEventListener("click", function () { sync.restart(); updateQueueCount(); });
    stopBtn && stopBtn.addEventListener("click", function () { sync.stop(); if (nowPlaying) nowPlaying.textContent = "Stopped."; });
    nextBtn && nextBtn.addEventListener("click", function () { sync.next(); });
    muteBtn && muteBtn.addEventListener("click", function () {
      const isMuted = sync.toggleMute();
      muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
    });

    const syncForm = document.getElementById("user-sync-form");
    const syncFormStatus = document.getElementById("user-sync-status");
    syncForm && syncForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(syncForm);
      const result = window.SeekSyncUserSync.submit({
        title: data.get("title"),
        url: data.get("url"),
        companionUrl: data.get("companionUrl"),
        start: data.get("start"),
        end: data.get("end"),
      });
      if (!result.ok) {
        if (syncFormStatus) syncFormStatus.textContent = "That doesn't look like a YouTube link. Paste a full youtube.com/watch?v= or youtu.be link.";
        return;
      }
      if (syncFormStatus) syncFormStatus.textContent = `Queued "${result.entry.title}" into the synced reel. Rights owner: unresolved until claimed.`;
      syncForm.reset();
    });

    userQueueList && userQueueList.addEventListener("click", function (event) {
      const removeId = event.target.getAttribute("data-remove");
      if (removeId) {
        userSync.remove(removeId);
        renderUserQueue();
        sync.rebuildQueue();
        updateQueueCount();
      }
    });

    renderCatalog();
    renderLedger();
    renderUserQueue();
    sync.init("sync-primary-player", "sync-companion-player");
    updateQueueCount();
  });
})();
