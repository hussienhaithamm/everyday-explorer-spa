document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderLevels();
  renderStickers();
  renderDashboard();
  renderChallenge();

  initChildFlow();
  initParentFlow();

  showScreen("home-screen");
});
