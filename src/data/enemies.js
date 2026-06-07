export const ENEMY_TYPES = {
  scout: {
    label: "Scout",
    hp: 2,
    radius: 16,
    speed: 180,
    score: 25,
    fireRate: 3.4,
    color: "#7fd8ff",
    bulletMode: "single"
  },
  fighter: {
    label: "Fighter",
    hp: 3,
    radius: 21,
    speed: 120,
    score: 40,
    fireRate: 2.4,
    color: "#ff6e7a",
    bulletMode: "single"
  },
  tank: {
    label: "Tank",
    hp: 9,
    radius: 29,
    speed: 76,
    score: 90,
    fireRate: 2.8,
    color: "#ffcf5d",
    bulletMode: "single"
  },
  shooter: {
    label: "Shooter",
    hp: 5,
    radius: 23,
    speed: 105,
    score: 70,
    fireRate: 2,
    color: "#c58cff",
    bulletMode: "spread"
  },
  sniper: {
    label: "Sniper",
    hp: 4,
    radius: 20,
    speed: 82,
    score: 95,
    fireRate: 3.1,
    color: "#9fe8ff",
    bulletMode: "sniper",
    sniper: true
  },
  carrier: {
    label: "Carrier",
    hp: 12,
    radius: 31,
    speed: 70,
    score: 130,
    fireRate: 4.2,
    color: "#b8ff9f",
    bulletMode: "single",
    carrier: true
  },
  shieldGuard: {
    label: "Shield Guard",
    hp: 10,
    radius: 28,
    speed: 74,
    score: 120,
    fireRate: 2.9,
    color: "#7fffd0",
    bulletMode: "single",
    shieldAura: true
  },
  kamikaze: {
    label: "Kamikaze",
    hp: 3,
    radius: 18,
    speed: 145,
    score: 55,
    fireRate: 99,
    color: "#ff9c5d",
    bulletMode: "none",
    chase: true
  },
  warden: {
    label: "Storm Warden",
    hp: 46,
    radius: 43,
    speed: 58,
    score: 420,
    fireRate: 1.45,
    color: "#ffdf7f",
    bulletMode: "spread",
    miniBoss: true
  },
  hunter: {
    label: "Thunder Hunter",
    hp: 72,
    radius: 48,
    speed: 62,
    score: 680,
    fireRate: 1.15,
    color: "#77e7ff",
    bulletMode: "hunter",
    miniBoss: true,
    hunter: true
  }
};
