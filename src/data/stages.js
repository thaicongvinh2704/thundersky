export const STAGES = [
  {
    id: 1,
    name: "Stage 1",
    duration: 38,
    spawnEvery: 0.95,
    enemies: ["scout", "fighter"],
    waves: [
      { at: 7, pattern: "line", type: "scout", count: 6 },
      { at: 20, pattern: "vee", type: "fighter", count: 5 }
    ]
  },
  {
    id: 2,
    name: "Stage 2",
    duration: 42,
    spawnEvery: 0.78,
    enemies: ["scout", "fighter", "shooter", "sniper", "kamikaze"],
    waves: [
      { at: 8, pattern: "sides", type: "kamikaze", count: 6 },
      { at: 18, pattern: "line", type: "sniper", count: 3, danger: true },
      { at: 31, pattern: "miniBoss", type: "warden", count: 1 }
    ]
  },
  {
    id: 3,
    name: "Stage 3",
    duration: 46,
    spawnEvery: 0.74,
    enemies: ["fighter", "tank", "carrier", "kamikaze"],
    waves: [
      { at: 9, pattern: "vee", type: "fighter", count: 7 },
      { at: 20, pattern: "rain", type: "kamikaze", count: 9 },
      { at: 29, pattern: "elite", type: "carrier", count: 2, danger: true },
      { at: 36, pattern: "wall", type: "tank", count: 7 }
    ]
  },
  {
    id: 4,
    name: "Stage 4",
    duration: 50,
    spawnEvery: 0.66,
    enemies: ["scout", "fighter", "tank", "shooter", "shieldGuard", "kamikaze"],
    waves: [
      { at: 8, pattern: "sides", type: "shooter", count: 6 },
      { at: 18, pattern: "ambush", type: "kamikaze", count: 8 },
      { at: 29, pattern: "elite", types: ["shieldGuard", "tank", "shooter"], count: 3 },
      { at: 42, pattern: "miniBoss", type: "hunter", count: 1 }
    ]
  },
  {
    id: 5,
    name: "Stage 5",
    duration: 0,
    spawnEvery: 0,
    enemies: [],
    boss: true
  }
];
