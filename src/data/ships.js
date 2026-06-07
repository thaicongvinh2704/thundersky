export const SHIPS = [
  {
    id: "falcon",
    name: "Falcon",
    description: "Balanced frame with steady damage, handling and survivability.",
    color: "#77e7ff",
    accent: "#d9f5ff",
    archetype: "balanced",
    unlockCost: 0,
    stats: {
      hp: 100,
      speed: 450,
      damageScale: 1,
      fireRateScale: 1,
      energyScale: 1,
      shieldStart: 0,
      grazeScale: 1,
      magnetRadius: 92
    },
    passiveName: "Reliable Core",
    passiveDescription: "No weakness. Weapon drops are easy to use on every build.",
    difficulty: "Normal"
  },
  {
    id: "viper",
    name: "Viper",
    description: "Aggressive red interceptor with high DPS and lower hull integrity.",
    color: "#ff5d6c",
    accent: "#ffd1d6",
    archetype: "sharp",
    unlockCost: 0,
    stats: {
      hp: 82,
      speed: 486,
      damageScale: 1.14,
      fireRateScale: 1.12,
      energyScale: 0.94,
      shieldStart: 0,
      grazeScale: 1,
      magnetRadius: 86
    },
    passiveName: "Redline",
    passiveDescription: "Higher bullet damage and fire rate, but less HP.",
    difficulty: "Hard"
  },
  {
    id: "titan",
    name: "Titan",
    description: "Heavy orange gunship with armor, shields and slower handling.",
    color: "#ffb347",
    accent: "#fff0a8",
    archetype: "heavy",
    unlockCost: 0,
    stats: {
      hp: 132,
      speed: 382,
      damageScale: 0.95,
      fireRateScale: 0.92,
      energyScale: 0.95,
      shieldStart: 1,
      grazeScale: 0.85,
      magnetRadius: 104
    },
    passiveName: "Bulwark",
    passiveDescription: "Starts with a shield and has a larger pickup magnet.",
    difficulty: "Easy"
  },
  {
    id: "specter",
    name: "Specter",
    description: "Fast purple stealth craft built for risky close dodges.",
    color: "#c58cff",
    accent: "#f0ddff",
    archetype: "sharp",
    unlockCost: 260,
    stats: {
      hp: 88,
      speed: 522,
      damageScale: 0.98,
      fireRateScale: 1.05,
      energyScale: 1.05,
      shieldStart: 0,
      grazeScale: 1.75,
      magnetRadius: 96
    },
    passiveName: "Phase Graze",
    passiveDescription: "Graze bullets for much better score, combo and Thunder charge.",
    difficulty: "Expert"
  },
  {
    id: "stormwing",
    name: "Stormwing",
    description: "Electric blue prototype tuned for frequent Thunder Storms.",
    color: "#53f4ff",
    accent: "#bdf7ff",
    archetype: "balanced",
    unlockCost: 340,
    stats: {
      hp: 96,
      speed: 462,
      damageScale: 0.98,
      fireRateScale: 1,
      energyScale: 1.32,
      shieldStart: 0,
      grazeScale: 1.15,
      magnetRadius: 100
    },
    passiveName: "Storm Capacitor",
    passiveDescription: "Gains Thunder faster and starts with a shorter Thunder cooldown.",
    difficulty: "Advanced"
  }
];

export const DEFAULT_SHIP_ID = "falcon";

export function getShip(id) {
  return SHIPS.find((ship) => ship.id === id) || SHIPS[0];
}
