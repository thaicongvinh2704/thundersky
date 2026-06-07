import { t } from "../data/i18n.js";

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
        ? `${t("hud.endless")} ${Math.floor(game.endless.time)}s | x${game.endless.multiplier.toFixed(2)}`
        : `${t("hud.bestEndless")} ${Math.floor(game.save.best.endlessTime || 0)}s`;
    }
    const healthRatio = Math.max(0, Math.min(1, player.health / player.maxHealth));
    this.elements.health.style.width = `${healthRatio * 100}%`;
    this.elements.health.classList.toggle("health-fill-warning", healthRatio <= 0.45 && healthRatio > 0.25);
    this.elements.health.classList.toggle("health-fill-danger", healthRatio <= 0.25 && healthRatio > 0.12);
    this.elements.health.classList.toggle("health-fill-critical", healthRatio <= 0.12);
    const healthBar = this.elements.health.closest(".bar");
    if (healthBar) {
      healthBar.classList.toggle("health-warning", healthRatio <= 0.45 && healthRatio > 0.25);
      healthBar.classList.toggle("health-danger", healthRatio <= 0.25 && healthRatio > 0.12);
      healthBar.classList.toggle("health-critical", healthRatio <= 0.12);
    }
    if (this.elements.healthText) {
      this.elements.healthText.textContent = `${Math.max(0, Math.ceil(player.health))} / ${Math.ceil(player.maxHealth)}`;
      this.elements.healthText.classList.toggle("health-text-warning", healthRatio <= 0.45 && healthRatio > 0.25);
      this.elements.healthText.classList.toggle("health-text-danger", healthRatio <= 0.25);
    }
    const activeHealthState = game.state.is(game.states.PLAYING) || game.state.is(game.states.BOSS) || game.state.is(game.states.ENDLESS);
    document.body.classList.toggle("health-danger", activeHealthState && healthRatio <= 0.25);
    document.body.classList.toggle("health-critical", activeHealthState && healthRatio <= 0.12);
    document.body.classList.toggle("damage-flash", activeHealthState && game.damageFlash > 0);
    this.elements.stage.textContent = stage ? `${t("hud.stage")} ${stage.id}` : t("hud.stage");
    this.elements.time.textContent = stage && !stage.boss ? `${Math.ceil(game.stageSystem.timer)}s` : t("hud.boss");
    if (this.elements.energy) this.elements.energy.style.width = `${Math.max(0, (player.energy / 100) * 100)}%`;
    if (this.elements.energyText) {
      this.elements.energyText.textContent = player.thunderCooldown > 0
        ? t("thunder.cooldown", { seconds: player.thunderCooldown.toFixed(1) })
        : player.energy >= 100 ? t("thunder.ready") : t("thunder.notReady", { percent: Math.floor(player.energy) });
    }
    if (this.elements.powerTimers) {
      const timers = [];
      if (player.rapidTimer > 0) timers.push(`${t("power.rapidTimer")} ${Math.ceil(player.rapidTimer)}s`);
      if (player.magnetTimer > 0) timers.push(`${t("power.magnetTimer")} ${Math.ceil(player.magnetTimer)}s`);
      this.elements.powerTimers.textContent = timers.join(" | ");
      this.elements.powerTimers.classList.toggle("hidden", timers.length === 0);
    }
    if (this.elements.skillButton) {
      const ready = player.energy >= 100 && player.thunderCooldown <= 0;
      this.elements.skillButton.disabled = false;
      this.elements.skillButton.setAttribute("aria-disabled", String(!ready));
      this.elements.skillButton.textContent = ready ? t("controls.thunder") : player.thunderCooldown > 0 ? `${player.thunderCooldown.toFixed(1)}s` : `${Math.floor(player.energy)}%`;
      this.elements.skillButton.classList.toggle("ready", ready);
    }
    const upgrades = [`${t("hud.ship")}: ${player.ship.name}`, `${t("hud.gun")}: ${player.weapon.name} Lv.${player.weaponLevel}`, ...player.upgrades];
    this.elements.upgrades.textContent = upgrades.length ? upgrades.join(" | ") : t("hud.none");

    if (game.boss) {
      this.elements.bossHud.classList.remove("hidden");
      this.elements.bossHealth.style.width = `${Math.max(0, (game.boss.hp / game.boss.maxHp) * 100)}%`;
    } else {
      this.elements.bossHud.classList.add("hidden");
    }
  }
}
