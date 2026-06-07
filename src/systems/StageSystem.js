import { STAGES } from "../data/stages.js";
import { STATES } from "../core/StateManager.js";
import { Boss } from "../entities/Boss.js";

export class StageSystem {
  constructor(game) {
    this.game = game;
    this.index = 0;
    this.timer = STAGES[0].duration;
    this.stageId = 1;
  }

  reset() {
    this.index = 0;
    this.timer = STAGES[0].duration;
    this.stageId = 1;
  }

  currentStage() {
    return STAGES[this.index];
  }

  update(dt) {
    const stage = this.currentStage();
    if (!stage || stage.boss) return;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 0;
      if (!this.game.enemies.some((enemy) => enemy.config.miniBoss)) this.clearStage();
    }
  }

  clearStage() {
    this.game.state.set(STATES.STAGE_CLEAR);
    this.game.awardStageClearBonus(this.stageId);
    this.game.enemies.length = 0;
    this.game.clearEnemyBullets();
    this.game.effects.explode(this.game.width / 2, this.game.height * 0.35, true);
    this.game.openUpgrade();
  }

  advance() {
    this.index += 1;
    const stage = this.currentStage();
    if (!stage) {
      this.game.win();
      return;
    }
    this.stageId = stage.id;
    this.game.stats.stageReached = Math.max(this.game.stats.stageReached, stage.id);
    this.game.resetStageRunStats();
    this.timer = stage.duration;
    this.game.spawnSystem.reset();
    if (stage.boss) {
      this.game.boss = new Boss(this.game.width);
      this.game.state.set(STATES.BOSS);
    } else {
      this.game.state.set(STATES.PLAYING);
    }
  }
}
