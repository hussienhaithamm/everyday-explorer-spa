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

// Returns a fresh copy of defaults to avoid shared references.
function cloneDefaults() {
  return typeof structuredClone === "function"
    ? structuredClone(defaultState)
    : JSON.parse(JSON.stringify(defaultState));
}

// Reads persisted state from localStorage, merging with defaults safely.
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

// Writes current state to localStorage.
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Returns all base + custom levels as one array.
function getAllLevels() {
  return [...LEVELS, ...state.customLevels];
}

// Looks up a level by ID across defaults and custom entries.
function getLevelById(id) {
  return getAllLevels().find((lvl) => Number(lvl.id) === Number(id));
}

// Sets the current level and clamps challenge index; returns false if missing.
function setCurrentLevel(levelId) {
  state.currentLevelId = Number(levelId);
  const level = getLevelById(levelId);
  if (!level) {
    console.warn("setCurrentLevel: level not found", levelId);
    return false;
  }
  const completed = state.completedChallenges[levelId] || 0;
  state.currentChallengeIndex = Math.min(
    completed,
    Math.max(level.challenges.length - 1, 0)
  );
  saveState();
  return true;
}

// Unlocks a given level ID once.
function unlockLevel(levelId) {
  if (!state.unlockedLevels.includes(levelId)) {
    state.unlockedLevels.push(levelId);
  }
}

// Marks a challenge as complete, updates counts, checks streaks and stickers.
function completeCurrentChallenge() {
  const level = getLevelById(state.currentLevelId);
  if (!level) return { levelComplete: false, total: 0, completed: 0 };

  const total = Array.isArray(level.challenges) ? level.challenges.length : 0;
  const currentCompleted = state.completedChallenges[level.id] || 0;
  const newCompleted = Math.min(total, currentCompleted + 1);

  state.completedChallenges[level.id] = newCompleted;
  state.currentChallengeIndex = Math.min(newCompleted, Math.max(total - 1, 0));

  let levelJustCompleted = false;
  if (total > 0 && newCompleted >= total && currentCompleted < total) {
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

// Unlocks the next level when this level is completed.
function markLevelCompleted(levelId) {
  const levels = getAllLevels();
  const idx = levels.findIndex((lvl) => Number(lvl.id) === Number(levelId));
  if (idx === -1) {
    console.warn("markLevelCompleted: level not found", levelId);
    return false;
  }
  if (idx < levels.length - 1) {
    unlockLevel(levels[idx + 1].id);
  }
  checkStickersForProgress();
  saveState();
  return true;
}

// Adds sticker if not already unlocked and notes the last-earned.
function unlockSticker(stickerId) {
  if (!state.stickersUnlocked.includes(stickerId)) {
    state.stickersUnlocked.push(stickerId);
    state.lastUnlockedSticker = stickerId;
  }
}

// Counts how many levels are fully completed.
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

// Adds a new custom level and ensures it is unlocked.
function addCustomLevel(level) {
  state.customLevels.push(level);
  unlockLevel(level.id);
  saveState();
}

// Adds a custom sticker and unlocks it immediately.
function addCustomSticker(sticker) {
  state.customStickers.push(sticker);
  unlockSticker(sticker.id);
  saveState();
}
