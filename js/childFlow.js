// Wire up child-facing flows (home -> levels -> challenge -> camera -> celebration).
function initChildFlow() {
  const startBtn = document.getElementById("btn-start-exploring");
  const stickersBtn = document.getElementById("btn-my-stickers");
  const settingsBtn = document.getElementById("btn-settings");
  const levelsHome = document.getElementById("btn-levels-home");
  const challengeHome = document.getElementById("btn-challenge-home");
  const takePhoto = document.getElementById("btn-take-photo");
  const doneBtn = document.getElementById("btn-done");
  const cameraBack = document.getElementById("btn-camera-back");
  const cameraHome = document.getElementById("btn-camera-home");
  const captureBtn = document.getElementById("btn-capture");
  const nextBtn = document.getElementById("btn-next-challenge");
  const celebrationHome = document.getElementById("btn-celebration-home");
  const stickersHome = document.getElementById("btn-stickers-home");

  startBtn.addEventListener("click", () => {
    renderLevels();
    showScreen("levels-screen");
  });

  stickersBtn.addEventListener("click", () => {
    renderStickers();
    showScreen("stickers-screen");
  });

  settingsBtn.addEventListener("click", () => showScreen("settings-screen"));

  levelsHome.addEventListener("click", () => showScreen("home-screen"));
  challengeHome.addEventListener("click", () => showScreen("home-screen"));
  stickersHome.addEventListener("click", () => showScreen("home-screen"));

  takePhoto.addEventListener("click", () => showScreen("camera-screen"));

  doneBtn.addEventListener("click", () => {
    const result = completeCurrentChallenge();
    updateCelebrationText(result);
    renderLevels();
    renderStickers();
    showScreen("celebration-screen");
  });

  cameraBack.addEventListener("click", () => showScreen("challenge-screen"));
  cameraHome.addEventListener("click", () => showScreen("home-screen"));

  captureBtn.addEventListener("click", () => {
    const result = completeCurrentChallenge();
    updateCelebrationText(result);
    renderLevels();
    renderStickers();
    showScreen("celebration-screen");
  });

  nextBtn.addEventListener("click", () => {
    const level = getLevelById(state.currentLevelId);
    if (!level) {
      showScreen("levels-screen");
      return;
    }
    const completed = state.completedChallenges[level.id] || 0;
    if (completed >= level.challenges.length) {
      // Move to next unlocked level or back to list.
      const levels = getAllLevels();
      const idx = levels.findIndex((l) => Number(l.id) === Number(level.id));
      const nextLevel = levels[idx + 1];
      if (nextLevel && state.unlockedLevels.includes(nextLevel.id)) {
        setCurrentLevel(nextLevel.id);
        renderChallenge();
        showScreen("challenge-screen");
      } else {
        renderLevels();
        showScreen("levels-screen");
      }
    } else {
      renderChallenge();
      showScreen("challenge-screen");
    }
  });

  celebrationHome.addEventListener("click", () => showScreen("home-screen"));

  document.getElementById("levels-list").addEventListener("click", (e) => {
    const card = e.target.closest(".level-card");
    if (!card) return;
    const levelId = Number(card.dataset.levelId);
    if (!state.unlockedLevels.includes(levelId)) return;

    setCurrentLevel(levelId);
    renderChallenge();
    showScreen("challenge-screen");
  });
}
