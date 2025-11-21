const STORAGE_KEY = "everyday-explorer-state-v1";

// Base state manipulated by the app.
const defaultState = {
  currentLevelId: 1,
  currentChallengeIndex: 0,
  completedChallenges: {}, // { [levelId]: number }
  unlockedLevels: [1],
  stickersUnlocked: [],
  streakDays: 0,
  customLevels: [],
  customStickers: [],
  lastUnlockedSticker: null
};

const state =
  typeof structuredClone === "function"
    ? structuredClone(defaultState)
    : JSON.parse(JSON.stringify(defaultState));

let sessionProgress = false;

function cloneDefaults() {
  return typeof structuredClone === "function"
    ? structuredClone(defaultState)
    : JSON.parse(JSON.stringify(defaultState));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      const merged = {
        ...defaultState,
        ...saved,
        completedChallenges: saved.completedChallenges || {},
        unlockedLevels: Array.from(new Set([1, ...(saved.unlockedLevels || defaultState.unlockedLevels)])),
        stickersUnlocked: Array.from(new Set(saved.stickersUnlocked || [])),
        customLevels: saved.customLevels || [],
        customStickers: saved.customStickers || []
      };
      Object.assign(state, merged);
    } catch (e) {
      console.warn("Could not parse saved state", e);
    }
  }
  sessionProgress = false;
}

// Clears localStorage and resets in-memory state to defaults.
function resetStateToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = cloneDefaults();
  Object.assign(state, fresh);
  sessionProgress = false;
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAllLevels() {
  return [...LEVELS, ...state.customLevels];
}

function getLevelById(id) {
  return getAllLevels().find((lvl) => Number(lvl.id) === Number(id));
}

function setCurrentLevel(levelId) {
  state.currentLevelId = Number(levelId);
  const completed = state.completedChallenges[levelId] || 0;
  const level = getLevelById(levelId);
  if (level) {
    state.currentChallengeIndex = Math.min(
      completed,
      level.challenges.length - 1
    );
  }
  saveState();
}

function unlockLevel(levelId) {
  if (!state.unlockedLevels.includes(levelId)) {
    state.unlockedLevels.push(levelId);
  }
}

// Marks a challenge as complete, updates counts, checks streaks and stickers.
function completeCurrentChallenge() {
  const level = getLevelById(state.currentLevelId);
  if (!level) return { levelComplete: false, total: 0, completed: 0 };

  const total = level.challenges.length;
  const currentCompleted = state.completedChallenges[level.id] || 0;
  const newCompleted = Math.min(total, currentCompleted + 1);

  state.completedChallenges[level.id] = newCompleted;
  state.currentChallengeIndex = Math.min(newCompleted, total - 1);

  let levelJustCompleted = false;
  if (newCompleted >= total && currentCompleted < total) {
    levelJustCompleted = markLevelCompleted(level.id);
  }

  if (!sessionProgress) {
    state.streakDays += 1;
    sessionProgress = true;
  }

  checkStickersForProgress();
  saveState();

  return { levelComplete: levelJustCompleted, total, completed: newCompleted };
}

function markLevelCompleted(levelId) {
  const levels = getAllLevels();
  const idx = levels.findIndex((lvl) => Number(lvl.id) === Number(levelId));
  if (idx >= 0 && idx < levels.length - 1) {
    unlockLevel(levels[idx + 1].id);
  }
  checkStickersForProgress();
  saveState();
  return true;
}

function unlockSticker(stickerId) {
  if (!state.stickersUnlocked.includes(stickerId)) {
    state.stickersUnlocked.push(stickerId);
    state.lastUnlockedSticker = stickerId;
  }
}

function getLevelsCompletedCount() {
  return getAllLevels().filter((lvl) => {
    const done = state.completedChallenges[lvl.id] || 0;
    return done >= lvl.challenges.length;
  }).length;
}

// Checks streak-based and completion-based stickers.
function checkStickersForProgress() {
  const levelsDone = getLevelsCompletedCount();
  if (state.streakDays >= 1) unlockSticker("streak-1");
  if (state.streakDays >= 7) unlockSticker("streak-7");
  if (state.streakDays >= 30) unlockSticker("streak-30");
  if (levelsDone >= 1) unlockSticker("levels-1");
  if (levelsDone >= 5) unlockSticker("levels-5");
  if (levelsDone >= 10) unlockSticker("levels-10");
}

function addCustomLevel(level) {
  state.customLevels.push(level);
  unlockLevel(level.id);
  saveState();
}

function addCustomSticker(sticker) {
  state.customStickers.push(sticker);
  unlockSticker(sticker.id);
  saveState();
}
