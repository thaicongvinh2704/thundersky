import { t } from "../data/i18n.js";

export class GameOverScreen {
  constructor(menu) {
    this.menu = menu;
  }

  show(game) {
    this.menu.show(t("game.over"), `${t("game.overLine")} ${this.summary(game)}`, t("game.playAgain"));
  }

  win(game) {
    this.menu.show(t("game.victory"), `${t("game.victoryLine")} ${this.summary(game)}`, t("game.continueEndless"), false, t("common.restart"));
  }

  paused(game) {
    this.menu.showPause(t("pause.help"), game.audio.muted);
    this.menu.showPauseControls();
  }

  summary(game) {
    const endless = game.stats.endlessTime ? ` Endless: ${Math.floor(game.stats.endlessTime)}s. Best endless: ${Math.floor(game.save.best.endlessTime || 0)}s.` : "";
    return `${t("game.summary", { score: game.score, best: game.save.best.score || 0, stage: game.stats.stageReached, kills: game.stats.enemiesDestroyed, combo: (game.stats.maxCombo || 1).toFixed(2) })}${endless}`;
  }
}
