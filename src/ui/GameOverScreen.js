export class GameOverScreen {
  constructor(menu) {
    this.menu = menu;
  }

  show(game) {
    this.menu.show("Het Tran", this.summary(game, "Phi doi dich van con tren bau troi."), "Choi lai");
  }

  win(game) {
    this.menu.show("Victory", this.summary(game, "Ban da ha boss cuoi. Tiep tuc Endless de san diem cao hon."), "Continue Endless", false, "Restart");
  }

  paused(game) {
    this.menu.showPause("Resume de quay lai tran chien. Controls se hien phim va chuot dang ho tro.", game.audio.muted);
    this.menu.showPauseControls();
  }

  summary(game, line) {
    const endless = game.stats.endlessTime ? ` Endless: ${Math.floor(game.stats.endlessTime)}s. Best endless: ${Math.floor(game.save.best.endlessTime || 0)}s.` : "";
    return `${line} Score: ${game.score}. Best: ${game.save.best.score || 0}. Stage reached: ${game.stats.stageReached}. Enemies destroyed: ${game.stats.enemiesDestroyed}. Max combo: x${(game.stats.maxCombo || 1).toFixed(2)}.${endless}`;
  }
}
