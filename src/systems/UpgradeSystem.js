import { UPGRADES } from "../data/upgrades.js";

export class UpgradeSystem {
  constructor(game) {
    this.game = game;
  }

  choices(count = 3) {
    return [...UPGRADES]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  apply(upgrade) {
    upgrade.apply(this.game.player);
    this.game.player.upgrades.push(upgrade.name);
    this.game.applyUpgradeTags(upgrade);
    this.game.stageSystem.advance();
  }
}
