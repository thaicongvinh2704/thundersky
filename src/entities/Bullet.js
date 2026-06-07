export class Bullet {
  static pool = [];

  static acquire(config) {
    return (this.pool.pop() || new Bullet()).reset(config);
  }

  static release(bullet) {
    if (!bullet || this.pool.length >= 260) return;
    this.pool.push(bullet);
  }

  constructor(config = {}) {
    this.reset(config);
  }

  reset({
    x,
    y,
    vx,
    vy,
    r = 5,
    damage = 1,
    life = 3,
    owner = "player",
    color = "#7fffd0",
    homing = false,
    pierce = 0,
    splash = 0,
    shape = "orb"
  }) {
    Object.assign(this, { x, y, vx, vy, r, damage, life, owner, color, homing, pierce, splash, shape });
    this.grazed = false;
    return this;
  }

  update(dt, game) {
    if (this.homing) this.seekTarget(dt, game);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  seekTarget(dt, game) {
    const target = game.findNearestTarget(this.x, this.y);
    if (!target) return;
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const speed = Math.hypot(this.vx, this.vy) || 520;
    this.vx += ((dx / d) * speed - this.vx) * dt * 3.5;
    this.vy += ((dy / d) * speed - this.vy) * dt * 3.5;
  }

  draw(ctx, game = null) {
    const tier = game?.performanceTier || "normal";
    const critical = tier === "critical";
    const low = tier === "low";
    ctx.save();
    ctx.globalCompositeOperation = critical ? "source-over" : "lighter";
    if (this.shape === "beam") {
      const angle = Math.atan2(this.vy, this.vx);
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = critical ? 0 : low ? 6 : 16;
      ctx.lineWidth = this.r * 1.55;
      ctx.beginPath();
      ctx.moveTo(-this.r * 5.5, 0);
      ctx.lineTo(this.r * 5.5, 0);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = Math.max(1.4, this.r * 0.55);
      ctx.beginPath();
      ctx.moveTo(-this.r * 4.2, 0);
      ctx.lineTo(this.r * 4.2, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (!critical) {
      ctx.globalAlpha = low ? 0.58 : 1;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * (low ? 2.4 : 4));
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(0.35, this.color);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * (low ? 2.4 : 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
