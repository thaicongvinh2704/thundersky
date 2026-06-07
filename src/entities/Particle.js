export class Particle {
  static pool = [];

  static acquire(x, y, color, speed = 160, life = 0.5) {
    return (this.pool.pop() || new Particle()).reset(x, y, color, speed, life);
  }

  static release(particle) {
    if (!particle || this.pool.length >= 220) return;
    this.pool.push(particle);
  }

  constructor(x = 0, y = 0, color = "#ffffff", speed = 0, life = 0) {
    this.reset(x, y, color, speed, life);
  }

  reset(x, y, color, speed = 160, life = 0.5) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = speed * (0.25 + Math.random());
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
    this.r = 1.5 + Math.random() * 4;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    return this;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.985;
    this.vy *= 0.985;
    this.life -= dt;
  }

  draw(ctx, game = null) {
    ctx.save();
    ctx.globalCompositeOperation = game?.performanceTier === "critical" ? "source-over" : "lighter";
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
