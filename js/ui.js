// Screen visibility helper.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
}

function renderLevels() {
  const container = document.getElementById("levels-list");
  if (!container) return;
  container.innerHTML = "";

  const levels = getAllLevels();
  levels.forEach((level) => {
    const unlocked = state.unlockedLevels.includes(level.id);
    const completedCount = state.completedChallenges[level.id] || 0;
    const done = completedCount >= level.challenges.length;

    const card = document.createElement("div");
    card.className = "level-card card " + (unlocked ? "" : "locked");
    card.dataset.levelId = level.id;

    const title = document.createElement("h3");
    title.textContent = level.name;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = done ? "Completed!" : `${completedCount}/${level.challenges.length} done`;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = unlocked ? "Tap to start" : "Locked";

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(badge);

    if (!unlocked) {
      const lock = document.createElement("span");
      lock.className = "lock-label";
      lock.textContent = "🔒 Complete previous level";
      card.appendChild(lock);
    }

    container.appendChild(card);
  });
}

function renderChallenge() {
  const level = getLevelById(state.currentLevelId);
  const nameEl = document.getElementById("challenge-level-name");
  const promptEl = document.getElementById("challenge-prompt");
  const progressEl = document.getElementById("challenge-progress");
  const bar = document.getElementById("challenge-progress-bar");

  if (!level) return;

  const completed = state.completedChallenges[level.id] || 0;
  const total = level.challenges.length;
  const currentIndex = Math.min(state.currentChallengeIndex, total - 1);
  const current = level.challenges[currentIndex];

  nameEl.textContent = level.name;
  if (completed >= total) {
    promptEl.textContent = "Level complete! Tap Next to pick another level.";
  } else {
    promptEl.textContent = current.prompt;
  }
  progressEl.textContent = `${Math.min(completed + 1, total)} / ${total}`;
  bar.style.width = `${Math.round((completed / total) * 100)}%`;
}

function renderStickers() {
  const grid = document.getElementById("stickers-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const stickers = [...DEFAULT_STICKERS, ...state.customStickers];
  const highlightId = state.lastUnlockedSticker;
  stickers.forEach((stk) => {
    const unlocked = state.stickersUnlocked.includes(stk.id) || state.customStickers.find((c) => c.id === stk.id);
    const el = document.createElement("div");
    el.className = `sticker ${unlocked ? "unlocked" : "locked"} ${highlightId === stk.id ? "just-unlocked" : ""}`;
    el.style.background = unlocked && stk.color ? stk.color : "";
    el.innerHTML = `
      <div class="icon" aria-hidden="true">${stk.icon || "⭐"}</div>
      <span class="label">${stk.label || stk.name}</span>
    `;
    grid.appendChild(el);
  });

  // Clear highlight after rendering once.
  if (highlightId) {
    state.lastUnlockedSticker = null;
    saveState();
  }
}

function renderDashboard() {
  const totalChallengesEl = document.getElementById("dash-total-challenges");
  const levelsCompletedEl = document.getElementById("dash-levels-completed");
  const streakEl = document.getElementById("dash-streak");
  const barChart = document.getElementById("bar-chart");
  const activity = document.getElementById("recent-activity");

  const levels = getAllLevels();
  const totalCompleted = Object.values(state.completedChallenges).reduce((a, b) => a + b, 0);
  const completedLevels = getLevelsCompletedCount();

  if (totalChallengesEl) totalChallengesEl.textContent = totalCompleted;
  if (levelsCompletedEl) levelsCompletedEl.textContent = completedLevels;
  if (streakEl) streakEl.textContent = `${state.streakDays} day${state.streakDays === 1 ? "" : "s"}`;

  if (barChart) {
    barChart.innerHTML = "";
    levels.forEach((lvl) => {
      const done = state.completedChallenges[lvl.id] || 0;
      const height = Math.min(100, done * 20);
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${height + 20}px`;
      bar.innerHTML = `<div class="bar-value">${done}</div><span>${lvl.name.replace("Level ", "L")}</span>`;
      barChart.appendChild(bar);
    });
  }

  if (activity) {
    activity.innerHTML = "";
    const items = [];
    levels.forEach((lvl) => {
      const done = state.completedChallenges[lvl.id] || 0;
      if (done > 0) {
        items.push(`Completed ${lvl.name} challenge ${done}`);
      }
    });
    if (items.length === 0) items.push("No activity yet. Start exploring!");
    items.slice(-5).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      activity.appendChild(li);
    });
  }
}

// Updates celebration copy and sticker hint.
function updateCelebrationText(result) {
  const title = document.getElementById("celebration-title");
  const detail = document.getElementById("celebration-detail");
  const sticker = document.getElementById("celebration-sticker");

  const level = getLevelById(state.currentLevelId);

  title.textContent = result.levelComplete ? "Level Complete!" : "Well Done!";
  if (result.levelComplete && level) {
    const levels = getAllLevels();
    const lvlIndex = levels.findIndex((l) => Number(l.id) === Number(level.id));
    const next = levels[lvlIndex + 1];
    detail.textContent = next ? `${level.name} done! Next up: ${next.name}` : `${level.name} done!`;
  } else {
    detail.textContent = level
      ? `Challenge ${result.completed} / ${result.total} finished`
      : "Great job!";
  }

  if (state.lastUnlockedSticker) {
    const earned = [...DEFAULT_STICKERS, ...state.customStickers].find(
      (s) => s.id === state.lastUnlockedSticker
    );
    if (earned) {
      sticker.textContent = `${earned.icon || "✨"} New sticker: ${earned.label || earned.name}`;
      sticker.classList.remove("hidden");
    } else {
      sticker.classList.add("hidden");
    }
  } else {
    sticker.classList.add("hidden");
  }
}
