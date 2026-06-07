export const WEAPONS = {
  plasma: {
    id: "plasma",
    name: "Plasma",
    color: "#7fffd0",
    symbol: "P",
    cooldownScale: 1,
    damageScale: 1,
    speedScale: 1,
    radius: 4.6,
    life: 1.35
  },
  laser: {
    id: "laser",
    name: "Laser",
    color: "#77e7ff",
    symbol: "L",
    cooldownScale: 0.78,
    damageScale: 0.82,
    speedScale: 1.35,
    radius: 3.3,
    life: 1.1,
    pierce: 2,
    shape: "beam"
  },
  flak: {
    id: "flak",
    name: "Flak",
    color: "#ffb347",
    symbol: "F",
    cooldownScale: 1.22,
    damageScale: 0.74,
    speedScale: 0.88,
    radius: 5.6,
    life: 1.25,
    extraAngles: [-0.24, 0.24],
    splash: 34
  },
  volt: {
    id: "volt",
    name: "Volt",
    color: "#c58cff",
    symbol: "V",
    cooldownScale: 1.05,
    damageScale: 0.9,
    speedScale: 1.02,
    radius: 4.8,
    life: 1.65,
    homing: true
  }
};

export const WEAPON_DROP_IDS = ["laser", "flak", "volt"];
