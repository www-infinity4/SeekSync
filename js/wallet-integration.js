/**
 * SeekSync → Unified Infinity Wallet adapter.
 *
 * Same integration shape used across the www-infinity4 ecosystem (see
 * TV-Database/js/infinity-wallet-integration.js): if the shared wallet script
 * is present, every ledgered share is also recorded against the visitor's
 * connected Unified Infinity Wallet as a blank-token exchange. If the wallet
 * script is unavailable, SeekSync still works — shares stay in the local
 * provisional ledger only.
 */
(function () {
  "use strict";

  const button = document.getElementById("unified-wallet-connect");
  const buttonLabel = document.getElementById("unified-wallet-label");
  const buttonDetail = document.getElementById("unified-wallet-detail");
  const status = document.getElementById("unified-wallet-status");

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  if (!window.InfinityUnifiedWallet) {
    setStatus("Unified wallet engine unavailable. Shares still accrue in the local SeekSync ledger.");
    window.SeekSyncWallet = { isConnected: function () { return false; } };
    return;
  }

  const wallet = new window.InfinityUnifiedWallet.UnifiedInfinityWallet();

  function current() {
    return wallet.state.currentWalletId && wallet.state.wallets[wallet.state.currentWalletId];
  }

  function render() {
    const connected = current();
    if (buttonLabel) buttonLabel.textContent = connected ? "Unified Wallet · " + connected.walletId.slice(-8) : "Connect Unified Wallet";
    if (buttonDetail) buttonDetail.textContent = connected ? "Shares now settle to your wallet" : "Use across Infinity websites";
    if (button) button.classList.toggle("connected", !!connected);
    setStatus(connected ? "Every share now records a provisional Infinity Coin exchange to your unified wallet." : "Connect your Unified Wallet so shares can route into the shared StarCoin ledger.");
  }

  if (button) {
    button.addEventListener("click", function () {
      if (!current()) wallet.createWallet({ displayName: "Unified Infinity Wallet" });
      else location.href = "https://www-infinity4.github.io/Mint-For-Infinity/unified-wallet.html";
      render();
    });
  }

  document.addEventListener("seeksync:content-shared", async function (event) {
    const connected = current();
    const entry = event.detail || {};
    if (!connected || !entry.eventId) return;
    const ownerWalletId = "provisional:" + entry.ownerId;
    wallet.createProvisionalWallet({ walletId: ownerWalletId, displayName: entry.ownerId.startsWith("ledger:public-domain") ? "Public Domain Preservation Fund" : entry.ownerId });
    try {
      await wallet.recordNormalExchange({
        eventId: "seeksync:share:" + entry.eventId,
        walletId: connected.walletId,
        sourceSystem: "SEEKSYNC",
        sourceEventId: entry.eventId,
        exchangeKind: "CLIP_SHARE",
        contentTokenId: entry.contentId,
        consideration: { assetCode: "INFINITY_COIN", amount: entry.amountUsd },
        participants: [{ id: entry.ownerId, name: entry.ownerId, beneficiaryClass: "RIGHTS_OWNER", units: 1000, claimStatus: "UNCLAIMED" }],
        timestamp: new Date(entry.createdAt).toISOString(),
      });
      await wallet.receiveStarCoin({
        eventId: "seeksync:blank-token:" + entry.eventId,
        fromWalletId: connected.walletId,
        toWalletId: ownerWalletId,
        sourceSystem: "SEEKSYNC",
        sourceEventId: entry.eventId,
        sourceContentId: entry.contentId,
        timestamp: new Date(entry.createdAt).toISOString(),
      });
      setStatus("Share recorded: $" + entry.amountUsd.toFixed(2) + " Infinity Coin accrued to the unified wallet ledger.");
    } catch (error) {
      setStatus("Share saved locally, but unified wallet reconciliation needs review: " + error.message);
    }
  });

  window.SeekSyncWallet = {
    isConnected: function () { return !!current(); },
    connect: function () { if (!current()) wallet.createWallet({ displayName: "Unified Infinity Wallet" }); render(); return current(); },
    engine: wallet,
  };
  render();
})();
