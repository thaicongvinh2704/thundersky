import { WEAPONS } from "../data/weapons.js";
import { BALANCE } from "../data/balance.js";

const POWER_UP_META = {
  repair: { color: "#53f4a8", label: "REPAIR", short: "+", shape: "cross" },
  energy: { color: "#ffe66d", label: "ENERGY", short: "E", shape: "bolt" },
  shield: { color: "#7fffd0", label: "SHIELD", short: "S", shape: "shield" },
  bomb: { color: "#ff8a5c", label: "BOMB", short: "B", shape: "diamond" },
  rapid: { color: "#ffffff", label: "RAPID", short: "R", shape: "chevron" },
  magnet: { color: "#c58cff", label: "MAGNET", short: "M", shape: "ring" }
};

export class PowerUp {
  static pool = [];

  static acquire(x, y, type = "energy") {
    return (this.pool.pop() || new PowerUp()).reset(x, y, type);
  }

  static release(powerUp) {
    if (!powerUp || this.pool.length >= 24) return;
    this.pool.push(powerUp);
  }

  constructor(x = 0, y = 0, type = "energy") {
    this.reset(x, y, type);
  }

  reset(x, y, type = "energy") {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 70;
    this.vy = 90 + Math.random() * 35;
    this.r = 16;
    this.type = type;
    this.spin = Math.random() * Math.PI * 2;
    this.life = 8;
    return this;
  }

  update(dt, game = null) {
    if (game?.player) {
      const player = game.player;
      const radius = (player.stats.magnetRadius || 90) * (player.magnetTimer > 0 ? 2.6 : 1) * (game.mobile ? 1.18 : 1);
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < radius) {
        const pull = (1 - distance / radius) * (player.magnetTimer > 0 ? 1080 : game.mobile ? 760 : 620);
        this.vx += (dx / distance) * pull * dt;
        this.vy += (dy / distance) * pull * dt;
      }
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 18 * dt;
    this.spin += dt * 5;
    this.life -= dt;
  }

  apply(player) {
    if (this.type === "repair") {
      player.health = Math.min(player.maxHealth, player.health + 18);
      return;
    }
    if (this.type.startsWith("weapon:")) {
      player.setWeapon(this.type.slice(7));
      return;
    }
    player.energy = Math.min(BALANCE.thunder.maxEnergy, player.energy + BALANCE.thunder.chargePerPickup * (1 + player.stats.thunderCharge));
  }

  draw(ctx, game = null) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.spin);
    const critical = game?.performanceTier === "critical";
    const low = game?.performanceTier === "low";
    ctx.globalCompositeOperation = critical ? "source-over" : "lighter";
    const weapon = this.weapon();
    const meta = this.meta();
    const color = weapon ? weapon.color : meta.color;
    const pulse = 1 + Math.sin(performance.now() / 130 + this.spin) * 0.08;
    if (!critical) {
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, (low ? 24 : 36) * pulse);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.34, color);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, (low ? 23 : 34) * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(5,18,32,0.82)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    this.drawShape(ctx, meta.shape);
    ctx.rotate(-this.spin);
    ctx.fillStyle = color;
    ctx.font = '800 13px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.shortLabel(), 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const mobile = Boolean(game?.mobile);
    const main = this.label(game);
    const sub = this.subLabel(game);
    ctx.font = `800 ${mobile ? 8 : 10}px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif`;
    ctx.lineWidth = mobile ? 2 : 3;
    ctx.strokeStyle = "rgba(5,18,32,0.9)";
    ctx.fillStyle = color;
    ctx.strokeText(main, 0, 30);
    ctx.fillText(main, 0, 30);
    if (sub) {
      ctx.font = `800 ${mobile ? 7 : 8}px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif`;
      ctx.strokeText(sub, 0, 40);
      ctx.fillText(sub, 0, 40);
    }
    ctx.restore();
  }

  drawShape(ctx, shape) {
    ctx.beginPath();
    if (shape === "cross") {
      ctx.rect(-6, -18, 12, 36);
      ctx.rect(-18, -6, 36, 12);
    } else if (shape === "shield") {
      ctx.moveTo(0, -20);
      ctx.lineTo(18, -10);
      ctx.lineTo(13, 15);
      ctx.lineTo(0, 22);
      ctx.lineTo(-13, 15);
      ctx.lineTo(-18, -10);
    } else if (shape === "diamond") {
      ctx.moveTo(0, -22);
      ctx.lineTo(22, 0);
      ctx.lineTo(0, 22);
      ctx.lineTo(-22, 0);
    } else if (shape === "chevron") {
      ctx.moveTo(-20, 14);
      ctx.lineTo(0, -18);
      ctx.lineTo(20, 14);
      ctx.lineTo(7, 9);
      ctx.lineTo(0, -2);
      ctx.lineTo(-7, 9);
    } else if (shape === "ring") {
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
    } else if (shape === "bolt") {
      ctx.moveTo(4, -22);
      ctx.lineTo(-12, 2);
      ctx.lineTo(0, 2);
      ctx.lineTo(-5, 22);
      ctx.lineTo(14, -4);
      ctx.lineTo(2, -4);
    } else {
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        const r = i % 2 === 0 ? 18 : 11;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  weapon() {
    if (!this.type.startsWith("weapon:")) return null;
    return WEAPONS[this.type.slice(7)] || null;
  }

  meta() {
    return POWER_UP_META[this.type] || POWER_UP_META.energy;
  }

  shortLabel() {
    if (this.type === "repair") return "+";
    const weapon = this.weapon();
    return weapon ? weapon.symbol : this.meta().short;
  }

  label(game = null) {
    const weapon = this.weapon();
    return weapon ? weapon.name.toUpperCase() : this.meta().label;
  }

  subLabel(game = null) {
    const weapon = this.weapon();
    if (!weapon || !game?.player) return "";
    return game.player.weapon.id === weapon.id ? "LV UP" : "SWITCH";
  }
}
