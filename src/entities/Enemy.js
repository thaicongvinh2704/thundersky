import { ENEMY_TYPES } from "../data/enemies.js";
import { BALANCE } from "../data/balance.js";

export class Enemy {
  constructor(type, x, y, stageId = 1, options = {}) {
    const config = ENEMY_TYPES[type];
    this.type = type;
    this.config = config;
    this.x = x;
    this.y = y;
    this.r = config.radius;
    this.hp = Math.ceil((config.hp + Math.floor(stageId * 0.7)) * (options.hpScale ?? 1));
    this.maxHp = this.hp;
    this.vx = options.vx ?? (Math.random() - 0.5) * (80 + stageId * 12);
    this.vy = options.vy ?? ((config.speed + stageId * 7) * (options.speedScale ?? 1));
    if (config.hunter && this.vx === 0) this.vx = 95;
    this.fireRateScale = options.fireRateScale ?? 1;
    this.scoreScale = options.scoreScale ?? 1;
    this.fireTimer = config.fireRate * (0.6 + Math.random() * 0.55);
    this.dashTimer = 3.2;
    this.dashWarn = 0;
    this.dashTime = 0;
    this.summonTimer = 6.5;
    this.carrierTimer = 2.8;
    this.hitFlash = 0;
  }

  update(dt, game) {
    this.hitFlash = Math.max(0, this.hitFlash - dt * 7);
    if (this.config.hunter) {
      this.updateHunter(dt, game);
      return;
    }

    if (this.config.chase && game.player) {
      const dx = game.player.x - this.x;
      const dy = game.player.y - this.y;
      const d = Math.hypot(dx, dy) || 1;
      this.vx += (dx / d) * 190 * dt;
      this.vy += (dy / d) * 120 * dt;
    }

    this.x += this.vx * dt + Math.sin(performance.now() / 360 + this.y) * 20 * dt;
    this.y += this.vy * dt;
    if (this.x < this.r || this.x > game.width - this.r) this.vx *= -1;

    this.fireTimer -= dt;
    if (this.fireTimer <= 0 && this.y > 35) {
      const load = game.enemyBullets.length / game.getPerformanceLimits().enemyBullets;
      if (load < 0.8 || Math.random() > (load - 0.8) * 4) this.fire(game);
      const mobileFireScale = game.mobile ? BALANCE.mobile.hunterFireScale : 1;
      const bulletLoad = game.enemyBullets.length / game.getPerformanceLimits().enemyBullets;
      const loadScale = bulletLoad > 0.85 ? 1.35 : bulletLoad > 0.7 ? 1.16 : 1;
      this.fireTimer = Math.max(0.55, (this.config.fireRate * mobileFireScale * loadScale) / this.fireRateScale);
    }

    if (this.config.carrier && this.y > 40) {
      this.carrierTimer -= dt;
      if (this.carrierTimer <= 0 && game.enemies.length < game.getPerformanceLimits().enemies - 2) {
        game.addEnemy("scout", this.x - 28, this.y + 18, 2, { vx: -36, vy: 160 });
        game.addEnemy("scout", this.x + 28, this.y + 18, 2, { vx: 36, vy: 160 });
        this.carrierTimer = game.mobile ? 5.1 : 4.2;
      }
    }
  }

  fire(game) {
    if (this.config.hunter) {
      this.fireHunter(game);
      return;
    }
    if (this.config.bulletMode === "none") return;
    if (game.enemyBullets.length >= game.getPerformanceLimits().enemyBullets) return;
    if (this.config.sniper) {
      const dx = game.player.x - this.x;
      const dy = game.player.y - this.y;
      const base = Math.atan2(dy, dx);
      const speed = 360 * (game.mobile ? BALANCE.mobile.enemyBulletScale : 1);
      game.effects.indicator(game.player.x, game.player.y - 44, "SHOT", 0.8, "#9fe8ff");
      game.addEnemyBullet({
        x: this.x,
        y: this.y + this.r,
        vx: Math.cos(base) * speed,
        vy: Math.sin(base) * speed,
        r: 4.5,
        damage: 16,
        life: 3.2,
        owner: "enemy",
        color: "#9fe8ff",
        shape: "beam"
      });
      return;
    }
    const angles = this.config.bulletMode === "spread" ? [-0.22, 0, 0.22] : [0];
    for (const offset of angles) {
      const dx = game.player.x - this.x;
      const dy = game.player.y - this.y;
      const base = Math.atan2(dy, dx) + offset;
      const speedScale = game.mobile ? BALANCE.mobile.enemyBulletScale : 1;
      const speed = (this.config.miniBoss ? 230 : this.config.bulletMode === "spread" ? 205 : 185) * speedScale;
      if (!game.addEnemyBullet({
        x: this.x,
        y: this.y + this.r,
        vx: Math.cos(base) * speed,
        vy: Math.sin(base) * speed,
        r: 5,
        damage: this.config.miniBoss ? 18 : this.type === "tank" ? 16 : 12,
        life: 4,
        owner: "enemy",
        color: this.type === "shooter" ? "#c58cff" : "#ff6a4f"
      })) break;
    }
  }

  updateHunter(dt, game) {
    if (this.y < 92) {
      this.y += (92 - this.y) * Math.min(1, dt * 1.4);
      return;
    }

    if (this.dashTime > 0) {
      this.dashTime -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.x < this.r || this.x > game.width - this.r) this.vx *= -0.75;
      if (this.dashTime <= 0) {
        this.vx = (Math.random() < 0.5 ? -1 : 1) * 95;
        this.vy = 28;
        this.y = Math.min(this.y, 150);
      }
    } else {
      this.x += this.vx * dt + Math.sin(performance.now() / 420) * 28 * dt;
      this.y += (110 - this.y) * Math.min(1, dt * 0.8);
      if (this.x < this.r || this.x > game.width - this.r) this.vx *= -1;
    }

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      if (game.enemyBullets.length < game.getPerformanceLimits().enemyBullets * 0.8) this.fireHunter(game);
      const enraged = this.hp < this.maxHp * 0.4;
      this.fireTimer = (enraged ? 0.72 : 1.15) / this.fireRateScale;
    }

    this.summonTimer -= dt;
    if (this.summonTimer <= 0) {
      game.warn("Hunter Summon");
      game.addEnemy("shooter", Math.max(35, this.x - 95), this.y + 30, 4, { vx: -42, vy: 118 });
      game.addEnemy("shooter", Math.min(game.width - 35, this.x + 95), this.y + 30, 4, { vx: 42, vy: 118 });
      this.summonTimer = 8.5;
    }

    this.dashTimer -= dt;
    if (this.dashTimer <= 0 && this.dashWarn <= 0 && this.dashTime <= 0) {
      this.dashWarn = game.mobile ? BALANCE.mobile.hunterDashWarn : 0.72;
      this.dashTimer = game.mobile ? 6.2 : 5.4;
      game.warn("Thunder Hunter Dash");
      game.effects.indicator(game.player.x, Math.max(game.layout.topSafeArea + 18, this.y + 64), "DASH", this.dashWarn + 0.25, "#77e7ff");
      game.effects.burst(this.x, this.y, "#77e7ff", 18, 180, 0.42);
    }

    if (this.dashWarn > 0) {
      this.dashWarn -= dt;
      if (this.dashWarn <= 0) {
        this.vx = (game.player.x >= this.x ? 1 : -1) * (game.mobile ? BALANCE.mobile.hunterDashSpeed : 640);
        this.vy = game.mobile ? BALANCE.mobile.hunterDashY : 160;
        this.dashTime = game.mobile ? 0.46 : 0.42;
      }
    }
  }

  fireHunter(game) {
    const enraged = this.hp < this.maxHp * 0.4;
    const count = game.mobile ? (enraged ? 7 : 5) : enraged ? 9 : 7;
    const spread = game.mobile ? (enraged ? 1.05 : 0.82) : enraged ? 1.25 : 0.95;
    const base = Math.PI / 2;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1) - 0.5;
      const angle = base + t * spread;
      const speed = (enraged ? 245 : 215) * (game.mobile ? BALANCE.mobile.enemyBulletScale : 1);
      if (!game.addEnemyBullet({
        x: this.x,
        y: this.y + this.r * 0.6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 5.5,
        damage: 14,
        life: 4.4,
        owner: "enemy",
        color: "#77e7ff"
      })) break;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 1;
    return this.hp <= 0;
  }

  draw(ctx, game = null) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const s = this.r / 23;
    ctx.scale(s, s);
    ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : this.config.color;
    ctx.strokeStyle = "#d8e6ee";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, 37);
    ctx.lineTo(11, 12);
    ctx.lineTo(42, -2);
    ctx.lineTo(15, -9);
    ctx.lineTo(10, -25);
    ctx.lineTo(4, -18);
    ctx.lineTo(0, -31);
    ctx.lineTo(-4, -18);
    ctx.lineTo(-10, -25);
    ctx.lineTo(-15, -9);
    ctx.lineTo(-42, -2);
    ctx.lineTo(-11, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const body = ctx.createLinearGradient(0, 37, 0, -29);
    body.addColorStop(0, "#394d5a");
    body.addColorStop(0.5, this.config.color);
    body.addColorStop(1, "#edf3f6");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, 38);
    ctx.quadraticCurveTo(14, 10, 8, -23);
    ctx.lineTo(0, -34);
    ctx.lineTo(-8, -23);
    ctx.quadraticCurveTo(-14, 10, 0, 38);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#172538";
    ctx.beginPath();
    ctx.ellipse(0, 8, 6, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.config.shieldAura) {
      ctx.save();
      ctx.scale(1 / s, 1 / s);
      ctx.strokeStyle = game?.performanceTier === "critical" ? "rgba(127,255,208,0.16)" : "rgba(127,255,208,0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 104, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(-23, -48, 46, 4);
    ctx.fillStyle = "#ffe66d";
    ctx.fillRect(-23, -48, (this.hp / this.maxHp) * 46, 4);
    ctx.restore();
  }
}
