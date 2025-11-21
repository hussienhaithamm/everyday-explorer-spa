// Wire up parent controls and forms.
function initParentFlow() {
  const settingsHome = document.getElementById("btn-settings-home");
  const dashboardBtn = document.getElementById("btn-dashboard");
  const createLevelBtn = document.getElementById("btn-create-level");
  const createStickerBtn = document.getElementById("btn-create-sticker");
  const dashboardBack = document.getElementById("btn-dashboard-back");
  const dashboardHome = document.getElementById("btn-dashboard-home");
  const levelBack = document.getElementById("btn-level-back");
  const levelHome = document.getElementById("btn-level-home");
  const levelBackSettings = document.getElementById("btn-level-back-settings");
  const stickerBack = document.getElementById("btn-sticker-back");
  const stickerHome = document.getElementById("btn-sticker-home");
  const stickerBackSettings = document.getElementById("btn-sticker-back-settings");
  const volume = document.getElementById("volume-slider");
  const volumeValue = document.getElementById("volume-value");
  const levelWarning = document.getElementById("level-warning");
  const stickerWarning = document.getElementById("sticker-warning");

  settingsHome.addEventListener("click", () => showScreen("home-screen"));
  dashboardBack.addEventListener("click", () => showScreen("settings-screen"));
  dashboardHome.addEventListener("click", () => showScreen("home-screen"));
  levelBack.addEventListener("click", () => showScreen("settings-screen"));
  levelHome.addEventListener("click", () => showScreen("home-screen"));
  stickerBack.addEventListener("click", () => showScreen("settings-screen"));
  stickerHome.addEventListener("click", () => showScreen("home-screen"));
  levelBackSettings.addEventListener("click", () => showScreen("settings-screen"));
  stickerBackSettings.addEventListener("click", () => showScreen("settings-screen"));

  dashboardBtn.addEventListener("click", () => {
    renderDashboard();
    showScreen("parent-dashboard-screen");
  });

  createLevelBtn.addEventListener("click", () => {
    document.getElementById("level-success").classList.add("hidden");
    levelWarning.classList.add("hidden");
    showScreen("create-level-screen");
  });

  createStickerBtn.addEventListener("click", () => {
    document.getElementById("sticker-success").classList.add("hidden");
    stickerWarning.classList.add("hidden");
    showScreen("create-sticker-screen");
  });

  volume.addEventListener("input", () => {
    volumeValue.textContent = volume.value;
  });

  document.getElementById("form-create-level").addEventListener("submit", (e) => {
    e.preventDefault();
    const challenge = document.getElementById("level-challenge").value.trim();
    const category = document.getElementById("level-category").value;
    const difficulty = document.getElementById("level-difficulty").value;

    levelWarning.classList.add("hidden");

    if (!challenge) {
      levelWarning.classList.remove("hidden");
      document.getElementById("level-success").classList.add("hidden");
      return;
    }

    const newId = Date.now();
    const level = {
      id: newId,
      name: `Custom: ${category} (${difficulty})`,
      challenges: [{ id: 1, prompt: challenge }]
    };

    addCustomLevel(level);
    renderLevels();
    document.getElementById("level-success").classList.remove("hidden");
    document.getElementById("form-create-level").reset();
  });

  document.getElementById("form-create-sticker").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("sticker-name").value.trim();
    const icon = document.getElementById("sticker-icon").value;
    const color = document.getElementById("sticker-color").value;

    stickerWarning.classList.add("hidden");

    if (!name) {
      stickerWarning.classList.remove("hidden");
      document.getElementById("sticker-success").classList.add("hidden");
      return;
    }

    const sticker = {
      id: `custom-${Date.now()}`,
      label: name,
      name,
      icon,
      color
    };

    addCustomSticker(sticker);
    renderStickers();
    document.getElementById("sticker-success").classList.remove("hidden");
    document.getElementById("form-create-sticker").reset();
  });
}
