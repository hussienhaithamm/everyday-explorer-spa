const LEVELS = [
  {
    id: 1,
    name: "Level 1: Colors",
    challenges: [
      { id: 1, prompt: "Find something red" },
      { id: 2, prompt: "Find something blue" },
      { id: 3, prompt: "Find something yellow" },
      { id: 4, prompt: "Find something green" },
      { id: 5, prompt: "Find something purple" },
      { id: 6, prompt: "Find something orange" }
    ]
  },
  {
    id: 2,
    name: "Level 2: Shapes",
    challenges: [
      { id: 1, prompt: "Spot a circle" },
      { id: 2, prompt: "Find a square" },
      { id: 3, prompt: "Find a triangle" },
      { id: 4, prompt: "Find a rectangle" },
      { id: 5, prompt: "Find something like a star" }
    ]
  },
  {
    id: 3,
    name: "Level 3: Objects",
    challenges: [
      { id: 1, prompt: "Find a soft toy" },
      { id: 2, prompt: "Find a shiny thing" },
      { id: 3, prompt: "Find a book" },
      { id: 4, prompt: "Find a spoon" },
      { id: 5, prompt: "Find a hat" }
    ]
  },
  {
    id: 4,
    name: "Level 4: Outdoors",
    challenges: [
      { id: 1, prompt: "Spot a tree" },
      { id: 2, prompt: "Find a flower" },
      { id: 3, prompt: "Find a stone" },
      { id: 4, prompt: "Find a cloud shape" },
      { id: 5, prompt: "Find a bird" }
    ]
  }
];

const DEFAULT_STICKERS = [
  { id: "streak-1", label: "1 Day Streak", icon: "⭐" },
  { id: "streak-7", label: "7 Day Streak", icon: "🔥" },
  { id: "streak-30", label: "30 Day Streak", icon: "🌟" },
  { id: "levels-1", label: "1 Level Done", icon: "🏆" },
  { id: "levels-5", label: "5 Levels Done", icon: "🎖️" },
  { id: "levels-10", label: "10 Levels Done", icon: "👑" }
];
