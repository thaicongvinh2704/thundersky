import { Particle } from "../entities/Particle.js";
import { BALANCE } from "../data/balance.js";

export class EffectsSystem {
  constructor(game) {
    this.game = game;
    this.particles = [];
    this.clouds = [];
    this.stars = [];
    this.lightnings = [];
    this.messages = [];
    this.indicators = [];
    this.maxParticles = 280;
    this.cloudTimer = 0;
  }

  reset() {
    this.particles.length = 0;
    this.clouds.length = 0;
    this.lightnings.length = 0;
    this.messages.length = 0;
    this.indicators.length = 0;
    this.makeStars();
  }

  makeStars() {
    this.stars.length = 0;
    const scale = (this.game.mobile ? BALANCE.mobile.starScale : 1) * this.game.getEffectScale();
    const count = Math.floor((this.game.width * this.game.height * scale) / 9000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.game.width,
        y: Math.random() * this.game.height,
        z: 0.35 + Math.random() * 1.3,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  burst(x, y, color, count, speed, life) {
    const particleCount = Math.max(1, Math.ceil((this.game.mobile ? count * 0.64 : count) * this.game.getEffectScale()));
    const particleSpeed = this.game.mobile ? speed * 0.86 : speed;
    for (let i = 0; i < particleCount; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      this.particles.push(new Particle(x, y, color, particleSpeed, life));
    }
  }

  message(text) {
    this.messages.push({ text, life: 1.8, maxLife: 1.8 });
    if (this.messages.length > 3) this.messages.shift();
  }

  indicator(x, y, text = "!", life = 1.1, color = "#ffe66d") {
    this.indicators.push({ x, y, text, life, maxLife: life, color });
    if (this.indicators.length > 6) this.indicators.shift();
  }

  explode(x, y, big = false) {
    this.burst(x, y, "#fff3a6", big ? 32 : 18, big ? 260 : 180, 0.7);
    this.burst(x, y, "#ff6c3f", big ? 24 : 12, big ? 220 : 150, 0.55);
    this.burst(x, y, "#77e7ff", big ? 16 : 8, big ? 170 : 120, 0.45);
    const shakeScale = this.game.mobile ? BALANCE.mobile.shakeScale : 1;
    this.game.shake = Math.min(this.game.mobile ? 12 : 18, this.game.shake + (big ? 12 : 6) * shakeScale);
  }

  thunderStorm(x, y, targets, radius) {
    for (const target of targets) {
      this.lightnings.push({
        x1: x,
        y1: y - 30,
        x2: target.x,
        y2: target.y,
        life: 0.34,
        maxLife: 0.34,
        width: target.r > 40 ? 6 : 4
      });
      this.burst(target.x, target.y, "#bdf7ff", 10, 170, 0.38);
    }
    const boltCount = Math.max(2, Math.ceil((this.game.mobile ? 5 : 10) * this.game.getEffectScale()));
    for (let i = 0; i < boltCount; i++) {
      const angle = (Math.PI * 2 * i) / boltCount;
      this.lightnings.push({
        x1: x,
        y1: y,
        x2: x + Math.cos(angle) * radius * (0.35 + Math.random() * 0.35),
        y2: y + Math.sin(angle) * radius * (0.35 + Math.random() * 0.35),
        life: 0.24,
        maxLife: 0.24,
        width: 3
      });
    }
    this.burst(x, y, "#ffffff", this.game.mobile ? 20 : 34, 300, 0.38);
    this.burst(x, y, "#77e7ff", this.game.mobile ? 26 : 44, 235, 0.54);
  }

  update(dt) {
    this.cloudTimer -= dt;
    if (this.cloudTimer <= 0) {
      const cloudCap = Math.max(2, Math.ceil((this.game.mobile ? BALANCE.mobile.cloudCap : 14) * this.game.getEffectScale()));
      if (this.clouds.length < cloudCap) {
        const scale = this.game.mobile ? BALANCE.mobile.cloudScale : 1;
        this.clouds.push({
          x: -120 + Math.random() * (this.game.width + 240),
          y: -80,
          s: (0.6 + Math.random() * 1.6) * scale,
          vy: 22 + Math.random() * 38,
          a: (0.08 + Math.random() * 0.13) * (this.game.mobile ? 0.82 : 1)
        });
      }
      this.cloudTimer = (this.game.mobile ? 1.1 : 0.7) + Math.random() * (this.game.mobile ? 1.0 : 0.7);
    }

    for (const star of this.stars) {
      star.y += (55 * star.z + this.game.stageSystem.stageId * 5) * dt;
      star.twinkle += dt * 4;
      if (star.y > this.game.height + 8) {
        star.y = -8;
        star.x = Math.random() * this.game.width;
      }
    }

    this.clouds = this.clouds.filter((cloud) => {
      cloud.y += cloud.vy * dt;
      return cloud.y <= this.game.height + 130;
    });

    this.particles = this.particles.filter((particle) => {
      particle.update(dt);
      return particle.life > 0;
    });

    this.lightnings = this.lightnings.filter((bolt) => {
      bolt.life -= dt;
      return bolt.life > 0;
    });

    this.messages = this.messages.filter((message) => {
      message.life -= dt;
      return message.life > 0;
    });

    this.indicators = this.indicators.filter((indicator) => {
      indicator.life -= dt;
      return indicator.life > 0;
    });
  }
}
