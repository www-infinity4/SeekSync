/**
 * SeekSync Infinity Coin ledger.
 *
 * Every verified "share" of a synced clip accrues a $0.01-equivalent
 * provisional Infinity Coin credit toward the content's current rights
 * owner. This mirrors StarQuest's catalog-ledger.js: accruals are recorded
 * immediately and locally, but they stay "provisional" — a real payout still
 * needs a verified rights contract and settlement through the shared Infinity
 * backend. Nothing here moves real money by itself.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "seeksync.infinityLedger.v1";
  const PAYOUT_PER_SHARE = 0.01; // USD-equivalent, in Infinity Coin

  function read() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : { entries: [], balances: {} };
    } catch (_) {
      return { entries: [], balances: {} };
    }
  }

  function write(ledger) {
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger)); } catch (_) {}
  }

  function balanceFor(ledger, ownerId) {
    return Number(ledger.balances[ownerId] || 0);
  }

  /**
   * Record a share event. Returns the created ledger entry.
   * @param {{contentId:string, contentTitle:string, ownerId:string, clipLabel?:string}} share
   */
  function recordShare(share) {
    const ledger = read();
    ledger.entries = Array.isArray(ledger.entries) ? ledger.entries : [];
    ledger.balances = ledger.balances && typeof ledger.balances === "object" ? ledger.balances : {};

    const entry = {
      eventId: "share-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
      contentId: String(share.contentId || "unknown"),
      contentTitle: String(share.contentTitle || "Untitled sync"),
      clipLabel: share.clipLabel ? String(share.clipLabel) : "",
      ownerId: String(share.ownerId || "ledger:unclaimed"),
      amountUsd: PAYOUT_PER_SHARE,
      unit: "INFINITY_COIN",
      status: "provisional-accrual",
      createdAt: Date.now(),
    };

    ledger.entries.unshift(entry);
    ledger.entries = ledger.entries.slice(0, 500);
    ledger.balances[entry.ownerId] = balanceFor(ledger, entry.ownerId) + PAYOUT_PER_SHARE;
    write(ledger);

    if (global.document && typeof global.document.dispatchEvent === "function") {
      global.document.dispatchEvent(new CustomEvent("seeksync:content-shared", { detail: entry }));
    }
    return entry;
  }

  function summary() {
    const ledger = read();
    const entries = Array.isArray(ledger.entries) ? ledger.entries : [];
    const balances = ledger.balances && typeof ledger.balances === "object" ? ledger.balances : {};
    return {
      totalShares: entries.length,
      totalAccruedUsd: entries.reduce((sum, entry) => sum + (Number(entry.amountUsd) || 0), 0),
      balances,
      recent: entries.slice(0, 25),
    };
  }

  global.SeekSyncLedger = { recordShare, summary, storageKey: STORAGE_KEY, payoutPerShare: PAYOUT_PER_SHARE };
})(window);
