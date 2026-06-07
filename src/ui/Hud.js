export class Hud {
  constructor(elements) {
    this.elements = elements;
  }

  update(game) {
    const player = game.player;
    const stage = game.stageSystem.currentStage();
    this.elements.score.textContent = game.score;
    if (this.elements.best) this.elements.best.textContent = game.save.best.score || 0;
    if (this.elements.destroyed) this.elements.destroyed.textContent = game.stats.enemiesDestroyed;
    if (this.elements.comboText) this.elements.comboText.textContent = `x${game.combo.multiplier.toFixed(2)}`;
    if (this.elements.comboFill) this.elements.comboFill.style.width = `${Math.max(0, Math.min(1, game.combo.timer / game.combo.maxTimer)) * 100}%`;
    if (this.elements.endlessText) {
      this.elements.endlessText.textContent = game.state.is(game.states.ENDLESS)
        ? `Endless ${Math.floor(game.endless.time)}s | x${game.endless.multiplier.toFixed(2)}`
        : `Best Endless ${Math.floor(game.save.best.endlessTime || 0)}s`;
    }
    this.elements.health.style.width = `${Math.max(0, (player.health / player.maxHealth) * 100)}%`;
    this.elements.stage.textContent = stage ? stage.name : "Stage";
    this.elements.time.textContent = stage && !stage.boss ? `${Math.ceil(game.stageSystem.timer)}s` : "Boss";
    if (this.elements.energy) this.elements.energy.style.width = `${Math.max(0, (player.energy / 100) * 100)}%`;
    if (this.elements.energyText) {
      this.elements.energyText.textContent = player.thunderCooldown > 0
        ? `Thunder ${player.thunderCooldown.toFixed(1)}s`
        : player.energy >= 100 ? "Thunder Ready" : `Thunder ${Math.floor(player.energy)}%`;
    }
    if (this.elements.powerTimers) {
      const timers = [];
      if (player.rapidTimer > 0) timers.push(`Rapid ${Math.ceil(player.rapidTimer)}s`);
      if (player.magnetTimer > 0) timers.push(`Magnet ${Math.ceil(player.magnetTimer)}s`);
      this.elements.powerTimers.textContent = timers.join(" | ");
      this.elements.powerTimers.classList.toggle("hidden", timers.length === 0);
    }
    if (this.elements.skillButton) {
      const ready = player.energy >= 100 && player.thunderCooldown <= 0;
      this.elements.skillButton.disabled = !ready;
      this.elements.skillButton.textContent = ready ? "Thunder" : player.thunderCooldown > 0 ? `${player.thunderCooldown.toFixed(1)}s` : `${Math.floor(player.energy)}%`;
      this.elements.skillButton.classList.toggle("ready", ready);
    }
    const upgrades = [`Ship: ${player.ship.name}`, `Gun: ${player.weapon.name} Lv.${player.weaponLevel}`, ...player.upgrades];
    this.elements.upgrades.textContent = upgrades.length ? upgrades.join(" | ") : "Chua co";

    if (game.boss) {
      this.elements.bossHud.classList.remove("hidden");
      this.elements.bossHealth.style.width = `${Math.max(0, (game.boss.hp / game.boss.maxHp) * 100)}%`;
    } else {
      this.elements.bossHud.classList.add("hidden");
    }
  }
}
