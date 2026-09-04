/**
 * SeekSync sources page — renders the full-length watch link and a
 * verification search link for every catalog title and community submission.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const catalog = window.SeekSyncCatalog;
    const userSync = window.SeekSyncUserSync;

    const sourcesList = document.getElementById("sources-list");
    const communityList = document.getElementById("community-sources-list");

    function card(entry, isUser) {
      const el = document.createElement("article");
      el.className = "source-card";
      el.id = entry.id || entry.titleId;
      const watchUrl = `https://www.youtube.com/watch?v=${entry.youtubeId}`;
      const verifyUrl = isUser
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(entry.title)}`
        : catalog.verifyUrl(entry);
      el.innerHTML = `
        <h3>${entry.title}${entry.year ? " (" + entry.year + ")" : ""}</h3>
        <p class="source-card__meta">${isUser ? "Community submission · rights unresolved" : entry.domain}</p>
        <div class="source-card__links">
          <a class="btn btn-small btn-primary" href="${watchUrl}" target="_blank" rel="noopener noreferrer">▶ Watch full video on YouTube ↗</a>
          <a class="btn btn-small btn-ghost" href="${verifyUrl}" target="_blank" rel="noopener noreferrer">🔍 Verify / find alternate source ↗</a>
        </div>
      `;
      return el;
    }

    if (sourcesList) {
      catalog.titles.forEach((title) => sourcesList.appendChild(card(title, false)));
    }

    function renderCommunity() {
      if (!communityList) return;
      communityList.innerHTML = "";
      const submissions = userSync.all();
      if (!submissions.length) {
        communityList.innerHTML = '<p class="empty">No community sources submitted yet. Add one from the <a href="index.html">Sync Reel</a>.</p>';
        return;
      }
      submissions.forEach((entry) => communityList.appendChild(card(entry, true)));
    }

    renderCommunity();
  });
})();
