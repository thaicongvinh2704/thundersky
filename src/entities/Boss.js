export class Boss {
  constructor(width) {
    this.x = width / 2;
    this.y = -110;
    this.r = 82;
    this.hp = 900;
    this.maxHp = 900;
    this.fireTimer = 1.2;
    this.summonTimer = 7;
    this.laserTimer = 4.5;
    this.lasers = [];
    this.phase = 1;
    this.hitFlash = 0;
  }

  update(dt, game) {
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
    this.y += (105 - this.y) * Math.min(1, dt * 1.2);
    this.x += Math.sin(performance.now() / 680) * 45 * dt;
    this.phase = this.hp < this.maxHp * 0.33 ? 3 : this.hp < this.maxHp * 0.66 ? 2 : 1;

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fire(game);
      this.fireTimer = this.phase === 3 ? 0.7 : this.phase === 2 ? 1 : 1.35;
    }

    if (this.phase >= 2) {
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        game.addEnemy("scout", this.x - 90, this.y + 25, 5);
        game.addEnemy("fighter", this.x + 90, this.y + 25, 5);
        this.summonTimer = 8;
      }
    }

    if (this.phase === 3) this.updateLaser(dt, game);
  }

  updateLaser(dt, game) {
    this.laserTimer -= dt;
    if (this.laserTimer <= 0) {
      this.lasers.push({ x: game.player.x, warn: 0.9, active: 0.35, hit: false });
      game.effects.indicator(game.player.x, Math.max(game.layout.topSafeArea + 22, game.height * 0.42), "LASER", 1.05, "#ff6a4f");
      this.laserTimer = 4.2;
    }
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      if (laser.warn > 0) laser.warn -= dt;
      else laser.active -= dt;
      if (laser.warn <= 0 && !laser.hit && Math.abs(game.player.x - laser.x) < 24) {
        laser.hit = true;
        game.player.takeDamage(24, game);
      }
      if (laser.active <= 0) this.lasers.splice(i, 1);
    }
  }

  fire(game) {
    if (game.enemyBullets.length >= game.getPerformanceLimits().enemyBullets) return;
    const count = this.phase === 1 ? 3 : this.phase === 2 ? 7 : 9;
    const spread = this.phase === 1 ? 0.34 : this.phase === 2 ? 0.72 : 0.95;
    const base = Math.atan2(game.player.y - this.y, game.player.x - this.x);
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1) - 0.5;
      const angle = base + t * spread;
      const speed = this.phase === 3 ? 260 : 220;
      if (!game.addEnemyBullet({
        x: this.x,
        y: this.y + this.r * 0.55,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 6,
        damage: 15,
        life: 5,
        owner: "enemy",
        color: "#ff6a4f"
      })) break;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 1;
    return this.hp <= 0;
  }

  draw(ctx, height, game = null) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowColor = "rgba(255,106,106,0.45)";
    ctx.shadowBlur = game?.performanceTier === "critical" ? 0 : game?.performanceTier === "low" ? 9 : 25;
    ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : this.phase === 3 ? "#ff6a6a" : this.phase === 2 ? "#ffcf5d" : "#aeb8c6";
    ctx.strokeStyle = "#fff4c5";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 92);
    ctx.lineTo(30, 28);
    ctx.lineTo(132, 4);
    ctx.lineTo(48, -24);
    ctx.lineTo(25, -78);
    ctx.lineTo(0, -48);
    ctx.lineTo(-25, -78);
    ctx.lineTo(-48, -24);
    ctx.lineTo(-132, 4);
    ctx.lineTo(-30, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#13283d";
    ctx.beginPath();
    ctx.ellipse(0, 8, 20, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (const laser of this.lasers) {
      ctx.save();
      ctx.globalAlpha = laser.warn > 0 ? 0.45 : 0.9;
      ctx.strokeStyle = laser.warn > 0 ? "#ffe66d" : "#ff3b3b";
      ctx.lineWidth = laser.warn > 0 ? 3 : 22;
      ctx.beginPath();
      ctx.moveTo(laser.x, this.y + 40);
      ctx.lineTo(laser.x, height);
      ctx.stroke();
      ctx.restore();
    }
  }
}
