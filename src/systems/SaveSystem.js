export class SaveSystem {
  constructor(key = "skyThunderSaveV1") {
    this.key = key;
    this.defaults = {
      score: 0,
      stage: 1,
      enemiesDestroyed: 0,
      endlessTime: 0,
      maxCombo: 1,
      credits: 0,
      selectedShipId: "falcon",
      unlockedShips: ["falcon", "viper", "titan"]
    };
    this.best = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return { ...this.defaults };
      const parsed = { ...this.defaults, ...JSON.parse(raw) };
      parsed.unlockedShips = Array.from(new Set(["falcon", ...(parsed.unlockedShips || [])]));
      return parsed;
    } catch {
      return { ...this.defaults };
    }
  }

  saveRun(run) {
    const earnedCredits = Math.max(0, run.creditsEarned || 0);
    const next = {
      ...this.best,
      score: Math.max(this.best.score || 0, run.score || 0),
      stage: Math.max(this.best.stage || 1, run.stage || 1),
      enemiesDestroyed: Math.max(this.best.enemiesDestroyed || 0, run.enemiesDestroyed || 0),
      endlessTime: Math.max(this.best.endlessTime || 0, run.endlessTime || 0),
      maxCombo: Math.max(this.best.maxCombo || 1, run.maxCombo || 1),
      credits: (this.best.credits || 0) + earnedCredits,
      lastCreditsEarned: earnedCredits
    };
    this.persist(next);
    return next;
  }

  selectShip(id) {
    if (!this.isShipUnlocked(id)) return false;
    this.best = { ...this.best, selectedShipId: id };
    this.persist(this.best);
    return true;
  }

  isShipUnlocked(id) {
    return (this.best.unlockedShips || []).includes(id);
  }

  unlockShip(ship) {
    if (this.isShipUnlocked(ship.id)) {
      this.selectShip(ship.id);
      return true;
    }
    const cost = ship.unlockCost || 0;
    if ((this.best.credits || 0) < cost) return false;
    const unlockedShips = Array.from(new Set([...(this.best.unlockedShips || []), ship.id]));
    this.best = {
      ...this.best,
      credits: (this.best.credits || 0) - cost,
      unlockedShips,
      selectedShipId: ship.id
    };
    this.persist(this.best);
    return true;
  }

  persist(next) {
    this.best = next;
    try {
      localStorage.setItem(this.key, JSON.stringify(next));
    } catch {
      // Ignore storage failures so embedded portals can still run the game.
    }
  }
}
