import { Enemy } from "../entities/Enemy.js";
import { BALANCE } from "../data/balance.js";

export class SpawnSystem {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.endlessWaveTimer = 2;
    this.endlessMiniBossTimer = 28;
    this.triggeredWaves = new Set();
  }

  reset() {
    this.timer = 0;
    this.endlessWaveTimer = 2;
    this.endlessMiniBossTimer = 28;
    this.triggeredWaves.clear();
  }

  update(dt) {
    const stage = this.game.stageSystem.currentStage();
    if (!stage || stage.boss) return;
    this.updateWaves(stage);
    this.timer -= dt;
    if (this.timer > 0) return;
    const densityScale = this.game.mobile ? BALANCE.mobile.densityScale * this.game.layout.enemyScale : 1;
    if (this.game.enemies.length > Math.floor((14 + stage.id * 3) * densityScale)) {
      this.timer = 0.35;
      return;
    }
    this.spawn(stage);
    this.timer = Math.max(this.game.mobile ? 0.46 : 0.34, (stage.spawnEvery - this.game.stageSystem.stageId * 0.025) * (this.game.mobile ? BALANCE.mobile.spawnIntervalScale : 1));
  }

  spawn(stage) {
    const type = stage.enemies[Math.floor(Math.random() * stage.enemies.length)];
    const r = 32;
    const x = r + Math.random() * (this.game.width - r * 2);
    this.game.enemies.push(new Enemy(type, x, -44, stage.id));
  }

  updateWaves(stage) {
    if (!stage.waves) return;
    const elapsed = stage.duration - this.game.stageSystem.timer;
    for (const wave of stage.waves) {
      const key = `${stage.id}:${wave.at}:${wave.pattern}:${wave.type}`;
      if (this.triggeredWaves.has(key) || elapsed < wave.at) continue;
      this.triggeredWaves.add(key);
      this.spawnWave(stage, wave);
    }
  }

  spawnWave(stage, wave) {
    const dangerous = wave.danger || ["sides", "wall", "rain", "ambush", "elite"].includes(wave.pattern) || wave.type === "tank" || wave.type === "shooter" || (wave.count || 0) >= 6;
    if (dangerous && wave.pattern !== "miniBoss") {
      this.game.warn("Danger Wave");
      this.game.effects.indicator(this.game.width / 2, this.game.layout.topSafeArea + 18, "WAVE", 1.25);
    }
    if (wave.pattern === "line") this.spawnLine(stage, wave);
    else if (wave.pattern === "vee") this.spawnVee(stage, wave);
    else if (wave.pattern === "sides") this.spawnSides(stage, wave);
    else if (wave.pattern === "wall") this.spawnWall(stage, wave);
    else if (wave.pattern === "rain") this.spawnRain(stage, wave);
    else if (wave.pattern === "ambush") this.spawnAmbush(stage, wave);
    else if (wave.pattern === "elite") this.spawnElite(stage, wave);
    else if (wave.pattern === "miniBoss") this.spawnMiniBoss(stage, wave);
  }

  spawnLine(stage, wave) {
    const count = this.mobileCount(wave.count || 5);
    const gap = this.game.width / (count + 1);
    for (let i = 0; i < count; i++) {
      this.game.enemies.push(new Enemy(wave.type, gap * (i + 1), -45 - i * 12, stage.id, { vy: 105 + stage.id * 12 }));
    }
  }

  spawnVee(stage, wave) {
    const count = this.mobileCount(wave.count || 5);
    const center = this.game.width / 2;
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 58;
      const depth = Math.abs(i - (count - 1) / 2) * 28;
      this.game.enemies.push(new Enemy(wave.type, center + offset, -50 - depth, stage.id, { vy: 118 + stage.id * 10 }));
    }
  }

  spawnSides(stage, wave) {
    const count = this.mobileCount(wave.count || 6);
    for (let i = 0; i < count; i++) {
      const left = i % 2 === 0;
      const x = left ? 28 : this.game.width - 28;
      const vx = left ? 95 : -95;
      this.game.enemies.push(new Enemy(wave.type, x, -45 - i * 18, stage.id, { vx, vy: 120 + stage.id * 8 }));
    }
  }

  spawnMiniBoss(stage, wave) {
    const type = wave.type || "warden";
    this.game.enemies.push(new Enemy(type, this.game.width / 2, -80, stage.id, { vx: 0, vy: 52 }));
    this.game.warn("Mini Boss Incoming");
  }

  spawnWall(stage, wave, difficulty = null) {
    const count = this.mobileCount(wave.count || 7);
    const gap = Math.floor(Math.random() * count);
    const step = this.game.width / count;
    for (let i = 0; i < count; i++) {
      if (i === gap) continue;
      this.spawnPatternEnemy(wave.type || "fighter", step * (i + 0.5), -55, stage.id, {
        vx: 0,
        vy: 82 + stage.id * 7
      }, difficulty);
    }
  }

  spawnRain(stage, wave, difficulty = null) {
    const count = this.mobileCount(wave.count || 10);
    for (let i = 0; i < count; i++) {
      const x = 28 + Math.random() * (this.game.width - 56);
      this.spawnPatternEnemy(wave.type || "scout", x, -45 - i * 34, stage.id, {
        vx: (Math.random() - 0.5) * 45,
        vy: 150 + Math.random() * 55 + stage.id * 5
      }, difficulty);
    }
  }

  spawnAmbush(stage, wave, difficulty = null) {
    const count = this.mobileCount(wave.count || 6);
    for (let i = 0; i < count; i++) {
      const left = i % 2 === 0;
      const y = 70 + i * 26;
      this.spawnPatternEnemy(wave.type || "kamikaze", left ? -35 : this.game.width + 35, y, stage.id, {
        vx: left ? 145 : -145,
        vy: 72
      }, difficulty);
    }
  }

  spawnElite(stage, wave, difficulty = null) {
    const types = wave.types || [wave.type || "tank", "shooter"];
    const count = this.mobileCount(wave.count || 3);
    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      const x = ((i + 1) / (count + 1)) * this.game.width;
      this.spawnPatternEnemy(type, x, -70 - i * 26, stage.id, {
        vx: (i - (count - 1) / 2) * 18,
        vy: 88 + stage.id * 6,
        hpScale: 1.25,
        fireRateScale: 1.1,
        scoreScale: 1.25
      }, difficulty);
    }
  }

  spawnPatternEnemy(type, x, y, stageId, options, difficulty) {
    const scaled = difficulty ? {
      hpScale: difficulty.hpScale,
      speedScale: difficulty.speedScale,
      fireRateScale: difficulty.fireRateScale,
      scoreScale: difficulty.scoreScale
    } : {};
    this.game.enemies.push(new Enemy(type, x, y, stageId, { ...scaled, ...options }));
  }

  updateEndless(dt) {
    const difficulty = this.endlessDifficulty();
    this.timer -= dt;
    this.endlessWaveTimer -= dt;
    this.endlessMiniBossTimer -= dt;

    const crowdedLimit = this.game.mobile ? 19 : 30;
    const waveLimit = this.game.mobile ? 16 : 24;
    const crowded = this.game.enemies.length > crowdedLimit;

    if (this.timer <= 0) {
      if (!crowded) this.spawnEndlessEnemy(difficulty);
      this.timer = crowded ? 0.56 : Math.max(this.game.mobile ? 0.42 : 0.26, 0.9 - difficulty.spawnBoost);
    }

    if (this.endlessWaveTimer <= 0 && this.game.enemies.length < waveLimit) {
      this.spawnEndlessWave(difficulty);
      this.endlessWaveTimer = Math.max(this.game.mobile ? 7.0 : 5.2, 11 - difficulty.minutes * 0.5);
    }

    if (this.endlessMiniBossTimer <= 0) {
      this.game.warn("Endless Mini Boss");
      this.game.enemies.push(new Enemy("warden", this.game.width / 2, -90, 6, {
        vx: 0,
        vy: 48 + difficulty.minutes * 2,
        hpScale: difficulty.hpScale,
        fireRateScale: difficulty.fireRateScale,
        scoreScale: difficulty.scoreScale
      }));
      this.endlessMiniBossTimer = Math.max(this.game.mobile ? 34 : 24, 42 - difficulty.minutes * 2);
    }
  }

  endlessDifficulty() {
    const minutes = Math.min(8, (this.game.endless.time / 60) * (this.game.mobile ? BALANCE.mobile.endlessDifficultyScale : 1));
    return {
      minutes,
      hpScale: Math.min(2.6, 1 + minutes * 0.18),
      speedScale: Math.min(1.55, 1 + minutes * 0.07),
      fireRateScale: Math.min(1.9, 1 + minutes * 0.1),
      scoreScale: Math.min(2.4, 1 + minutes * 0.12),
      spawnBoost: Math.min(0.55, minutes * 0.07)
    };
  }

  spawnEndlessEnemy(difficulty) {
    const types = difficulty.minutes < 2
      ? ["scout", "fighter", "fighter", "kamikaze", "tank", "shooter"]
      : difficulty.minutes < 4
        ? ["scout", "fighter", "kamikaze", "tank", "shooter", "sniper", "carrier"]
        : ["fighter", "kamikaze", "tank", "shooter", "sniper", "carrier", "shieldGuard"];
    const type = types[Math.floor(Math.random() * types.length)];
    const r = 32;
    const x = r + Math.random() * (this.game.width - r * 2);
    this.game.enemies.push(new Enemy(type, x, -44, 6, {
      hpScale: difficulty.hpScale,
      speedScale: difficulty.speedScale,
      fireRateScale: difficulty.fireRateScale,
      scoreScale: difficulty.scoreScale
    }));
  }

  spawnEndlessWave(difficulty) {
    const basic = ["line", "vee", "sides"];
    const advanced = difficulty.minutes < 2 ? ["rain"] : difficulty.minutes < 4 ? ["rain", "wall", "ambush"] : ["rain", "wall", "ambush", "elite"];
    const patterns = [...basic, ...advanced];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const type = difficulty.minutes > 3 && Math.random() < 0.22 ? "shieldGuard" : Math.random() < 0.35 ? "shooter" : Math.random() < 0.55 ? "kamikaze" : "fighter";
    this.game.warn("Danger Wave");
    const stage = { id: 6 };
    const wave = { pattern, type, count: this.mobileCount(5 + Math.floor(Math.min(4, difficulty.minutes / 2))) };
    if (pattern === "line") this.spawnScaledLine(stage, wave, difficulty);
    else if (pattern === "vee") this.spawnScaledVee(stage, wave, difficulty);
    else if (pattern === "sides") this.spawnScaledSides(stage, wave, difficulty);
    else if (pattern === "wall") this.spawnWall(stage, { ...wave, type: "fighter", count: this.game.mobile ? 6 : 8 }, difficulty);
    else if (pattern === "rain") this.spawnRain(stage, { ...wave, type: difficulty.minutes > 3 ? "shooter" : "scout", count: wave.count + (this.game.mobile ? 1 : 3) }, difficulty);
    else if (pattern === "ambush") this.spawnAmbush(stage, { ...wave, type: "kamikaze" }, difficulty);
    else if (pattern === "elite") this.spawnElite(stage, { ...wave, types: ["tank", "shooter"], count: 3 }, difficulty);
  }

  spawnScaledLine(stage, wave, difficulty) {
    const count = this.mobileCount(wave.count || 6);
    for (let i = 0; i < count; i++) {
      const x = ((i + 1) / (count + 1)) * this.game.width;
      this.game.enemies.push(new Enemy(wave.type, x, -45 - i * 10, stage.id, {
        hpScale: difficulty.hpScale,
        speedScale: difficulty.speedScale,
        fireRateScale: difficulty.fireRateScale,
        scoreScale: difficulty.scoreScale
      }));
    }
  }

  spawnScaledVee(stage, wave, difficulty) {
    const count = this.mobileCount(wave.count || 6);
    const center = this.game.width / 2;
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const row = Math.floor(i / 2) + 1;
      const x = center + side * row * 48;
      this.game.enemies.push(new Enemy(wave.type, x, -45 - row * 24, stage.id, {
        vx: side * 18,
        hpScale: difficulty.hpScale,
        speedScale: difficulty.speedScale,
        fireRateScale: difficulty.fireRateScale,
        scoreScale: difficulty.scoreScale
      }));
    }
  }

  spawnScaledSides(stage, wave, difficulty) {
    const count = this.mobileCount(wave.count || 6);
    for (let i = 0; i < count; i++) {
      const left = i % 2 === 0;
      this.game.enemies.push(new Enemy(wave.type, left ? -24 : this.game.width + 24, -40 - i * 22, stage.id, {
        vx: left ? 76 : -76,
        vy: (120 + i * 3) * difficulty.speedScale,
        hpScale: difficulty.hpScale,
        fireRateScale: difficulty.fireRateScale,
        scoreScale: difficulty.scoreScale
      }));
    }
  }

  mobileCount(count) {
    if (!this.game.mobile) return count;
    return Math.max(2, Math.ceil(count * BALANCE.mobile.densityScale * this.game.layout.enemyScale));
  }
}
