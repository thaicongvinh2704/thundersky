import { Bullet } from "./Bullet.js";
import { BALANCE } from "../data/balance.js";
import { WEAPONS } from "../data/weapons.js";
import { getShip } from "../data/ships.js";
import { clamp } from "../core/Collision.js";

export class Player {
  constructor() {
    this.r = BALANCE.player.radius;
    this.speed = BALANCE.player.speed;
    this.maxHealth = BALANCE.player.maxHealth;
    this.health = this.maxHealth;
    this.x = 0;
    this.y = 0;
    this.cooldown = 0;
    this.invincible = 0;
    this.energy = 0;
    this.thunderCooldown = 0;
    this.rapidTimer = 0;
    this.magnetTimer = 0;
    this.shields = 0;
    this.missileTimer = BALANCE.missileInterval;
    this.weapon = WEAPONS.plasma;
    this.weaponLevel = 1;
    this.ship = getShip("falcon");
    this.tagCounts = {};
    this.synergies = [];
    this.stats = {
      fireRate: 0,
      spread: 1,
      damage: 1,
      missile: 0,
      damageReduction: 0,
      regen: 0,
      thunderDamage: 0,
      thunderRadius: 0,
      thunderCharge: 0,
      thunderCooldown: BALANCE.thunder.cooldown,
      thunderBossBonus: 0,
      thunderShield: 0,
      magnetRadius: 92,
      missileDamageBonus: 0,
      grazeScale: 1
    };
    this.upgrades = [];
  }

  reset(width, height, ship = getShip("falcon")) {
    this.ship = ship;
    const shipStats = ship.stats;
    this.x = width / 2;
    this.y = height * 0.78;
    this.maxHealth = shipStats.hp || BALANCE.player.maxHealth;
    this.health = this.maxHealth;
    this.speed = shipStats.speed || BALANCE.player.speed;
    this.cooldown = 0;
    this.invincible = 1.2;
    this.energy = 0;
    this.thunderCooldown = 0;
    this.rapidTimer = 0;
    this.magnetTimer = 0;
    this.shields = shipStats.shieldStart || 0;
    this.missileTimer = BALANCE.missileInterval;
    this.weapon = WEAPONS.plasma;
    this.weaponLevel = 1;
    this.touchControl = null;
    this.tagCounts = {};
    this.synergies = [];
    this.stats = {
      fireRate: 0,
      spread: 1,
      damage: shipStats.damageScale || 1,
      missile: 0,
      damageReduction: 0,
      regen: 0,
      thunderDamage: 0,
      thunderRadius: 0,
      thunderCharge: (shipStats.energyScale || 1) - 1,
      thunderCooldown: ship.id === "stormwing" ? Math.max(3.8, BALANCE.thunder.cooldown - 1) : BALANCE.thunder.cooldown,
      thunderBossBonus: 0,
      thunderShield: 0,
      magnetRadius: shipStats.magnetRadius || 92,
      missileDamageBonus: 0,
      grazeScale: shipStats.grazeScale || 1
    };
    this.upgrades = [];
  }

  update(dt, input, game) {
    this.cooldown -= dt;
    this.invincible -= dt;
    this.thunderCooldown = Math.max(0, this.thunderCooldown - dt);
    this.rapidTimer = Math.max(0, this.rapidTimer - dt);
    this.magnetTimer = Math.max(0, this.magnetTimer - dt);
    if (this.stats.regen > 0 && this.health < this.maxHealth * 0.7) {
      this.health = Math.min(this.maxHealth, this.health + this.stats.regen * dt);
    }
    const axis = input.axis();
    this.x += axis.x * this.speed * dt;
    this.y += axis.y * this.speed * dt;

    if (!input.pointer.active) this.touchControl = null;

    if (input.pointer.active) {
      const justActivated = input.consumeJustActivated();
      if (game.mobile) {
        if (justActivated || !this.touchControl) {
          this.touchControl = {
            touchX: input.pointer.x,
            touchY: input.pointer.y,
            playerX: this.x,
            playerY: this.y
          };
        }
      }
      const targetX = this.touchControl
        ? this.touchControl.playerX + (input.pointer.x - this.touchControl.touchX) * game.layout.touchDragScale
        : input.pointer.x;
      const targetY = this.touchControl
        ? this.touchControl.playerY + (input.pointer.y - this.touchControl.touchY) * game.layout.touchDragScale
        : input.pointer.y + game.layout.touchOffsetY;
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance > game.layout.deadZone) {
        const smoothing = justActivated ? game.layout.initialFollowSmoothing : game.layout.followSmoothing;
        const follow = Math.min(1, dt * smoothing);
        let moveX = dx * follow;
        let moveY = dy * follow;
        const moveDistance = Math.hypot(moveX, moveY);
        if (justActivated && moveDistance > game.layout.maxInitialStep) {
          const scale = game.layout.maxInitialStep / moveDistance;
          moveX *= scale;
          moveY *= scale;
        }
        this.x += moveX;
        this.y += moveY;
      }
    }

    const sideSafe = game.mobile ? Math.max(30, this.r + 10) : 28;
    this.x = clamp(this.x, sideSafe, game.width - sideSafe);
    this.y = clamp(this.y, game.layout.topSafeArea, game.height - game.layout.bottomSafeArea);

    if (input.wantsFire()) this.shoot(game);
    if (input.consumeSkillRequest()) game.activateThunder();
    this.updateMissiles(dt, game);
  }

  shoot(game) {
    if (this.cooldown > 0) return;
    const weapon = this.weapon;
    const spread = Math.min(this.stats.spread, 5);
    const level = this.weaponLevel;
    const levelCooldown = 1 - (level - 1) * 0.045;
    const rapidScale = this.rapidTimer > 0 ? 0.76 : 1;
    this.cooldown = Math.max(0.048, (BALANCE.player.baseCooldown - this.stats.fireRate * 0.018) * weapon.cooldownScale * levelCooldown * rapidScale / (this.ship.stats.fireRateScale || 1));
    const angles = this.getWeaponAngles(spread, weapon);
    for (const angle of angles) {
      const speed = (BALANCE.player.bulletSpeed + this.stats.damage * 18) * weapon.speedScale;
      const levelDamage = 1 + (level - 1) * (weapon.id === "laser" ? 0.16 : 0.13);
      const radiusBonus = weapon.id === "plasma" ? (level - 1) * 0.75 : (level - 1) * 0.35;
      const pierceBonus = weapon.id === "laser" ? level - 1 : weapon.id === "plasma" && level >= 3 ? 1 : 0;
      const splashBonus = weapon.id === "flak" ? (level - 1) * 14 : 0;
      game.playerBullets.push(new Bullet({
        x: this.x + angle * 64,
        y: this.y - 28,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        r: weapon.radius + this.stats.damage * 0.45 + radiusBonus,
        damage: Math.max(1, this.stats.damage * weapon.damageScale * levelDamage),
        life: weapon.life + (weapon.id === "volt" ? (level - 1) * 0.18 : 0),
        color: weapon.color,
        homing: Boolean(weapon.homing),
        pierce: (weapon.pierce || 0) + pierceBonus,
        splash: (weapon.splash || 0) + splashBonus,
        shape: weapon.shape || "orb"
      }));
    }
    game.effects.burst(this.x, this.y - 28, weapon.color, 5 + spread + Math.floor(angles.length / 2), 140, 0.22);
    game.audio.play("shoot");
  }

  getWeaponAngles(spread, weapon) {
    const angles = this.getShotAngles(spread);
    if (!weapon.extraAngles) return angles;
    return [...angles, ...weapon.extraAngles].sort((a, b) => a - b);
  }

  getShotAngles(spread) {
    if (spread <= 1) return [0];
    if (spread === 2) return [-0.08, 0.08];
    if (spread === 3) return [-0.16, 0, 0.16];
    if (spread === 4) return [-0.22, -0.08, 0.08, 0.22];
    return [-0.28, -0.14, 0, 0.14, 0.28];
  }

  updateMissiles(dt, game) {
    if (this.stats.missile <= 0) return;
    this.missileTimer -= dt;
    if (this.missileTimer > 0) return;
    this.missileTimer = Math.max(1.0, BALANCE.missileInterval - this.stats.missile * 0.45);
    game.playerBullets.push(new Bullet({
      x: this.x,
      y: this.y - 18,
      vx: 0,
      vy: -520,
      r: 7,
      damage: 3 + this.stats.missile + this.stats.missileDamageBonus,
      life: 4,
      color: "#ffe66d",
      homing: true
    }));
    game.audio.play("shoot");
  }

  setWeapon(id) {
    const next = WEAPONS[id] || WEAPONS.plasma;
    if (this.weapon.id === next.id) {
      this.weaponLevel = Math.min(4, this.weaponLevel + 1);
    } else {
      this.weapon = next;
      this.weaponLevel = Math.max(1, Math.min(2, this.weaponLevel));
    }
  }

  takeDamage(amount, game) {
    if (this.invincible > 0) return;
    if (this.shields > 0) {
      this.shields -= 1;
      this.invincible = 0.55;
      game.recordPlayerHit();
      game.recordDamageTaken(amount * 0.35);
      game.effects.burst(this.x, this.y, "#7fffd0", 22, 220, 0.6);
      return;
    }
    game.recordPlayerHit();
    const finalDamage = amount * (1 - this.stats.damageReduction);
    game.recordDamageTaken(finalDamage);
    this.health -= finalDamage;
    this.invincible = 0.85;
    game.shake = Math.min(20, game.shake + 10);
    game.effects.burst(this.x, this.y, "#ff8a5c", 12, 160, 0.42);
    game.audio.play("hit");
    if (this.health <= 0) game.gameOver();
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.invincible > 0 && Math.floor(this.invincible * 18) % 2 === 0) ctx.globalAlpha = 0.58;

    const flame = 18 + Math.sin(performance.now() / 45) * 7;
    const flameGradient = ctx.createLinearGradient(0, 24, 0, 56);
    flameGradient.addColorStop(0, "#efffff");
    flameGradient.addColorStop(0.3, "#6fffe0");
    flameGradient.addColorStop(0.72, "#ffb347");
    flameGradient.addColorStop(1, "rgba(255,106,64,0)");
    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.moveTo(-15, 23);
    ctx.lineTo(-8, 35 + flame);
    ctx.lineTo(-1, 23);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(15, 23);
    ctx.lineTo(8, 35 + flame);
    ctx.lineTo(1, 23);
    ctx.closePath();
    ctx.fill();

    const shipColor = this.ship.color || "#77e7ff";
    const shipAccent = this.ship.accent || "#d9f5ff";
    ctx.shadowColor = shipColor;
    ctx.shadowBlur = 18;
    ctx.fillStyle = shipColor;
    ctx.strokeStyle = shipAccent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const archetype = this.ship.archetype || "balanced";
    if (archetype === "heavy") {
      ctx.moveTo(0, -42);
      ctx.lineTo(20, -18);
      ctx.lineTo(64, 2);
      ctx.lineTo(38, 21);
      ctx.lineTo(22, 30);
      ctx.lineTo(0, 24);
      ctx.lineTo(-22, 30);
      ctx.lineTo(-38, 21);
      ctx.lineTo(-64, 2);
      ctx.lineTo(-20, -18);
    } else if (archetype === "sharp") {
      ctx.moveTo(0, -55);
      ctx.lineTo(10, -18);
      ctx.lineTo(52, 10);
      ctx.lineTo(18, 8);
      ctx.lineTo(10, 34);
      ctx.lineTo(0, 26);
      ctx.lineTo(-10, 34);
      ctx.lineTo(-18, 8);
      ctx.lineTo(-52, 10);
      ctx.lineTo(-10, -18);
    } else {
      ctx.moveTo(0, -46);
      ctx.lineTo(13, -20);
      ctx.lineTo(58, 4);
      ctx.lineTo(25, 14);
      ctx.lineTo(19, 31);
      ctx.lineTo(8, 24);
      ctx.lineTo(0, 34);
      ctx.lineTo(-8, 24);
      ctx.lineTo(-19, 31);
      ctx.lineTo(-25, 14);
      ctx.lineTo(-58, 4);
      ctx.lineTo(-13, -20);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const bodyGradient = ctx.createLinearGradient(0, -45, 0, 34);
    bodyGradient.addColorStop(0, shipAccent);
    bodyGradient.addColorStop(0.38, shipColor);
    bodyGradient.addColorStop(1, "#4e6272");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.quadraticCurveTo(16, -15, 12, 24);
    ctx.lineTo(0, 36);
    ctx.lineTo(-12, 24);
    ctx.quadraticCurveTo(-16, -15, 0, -48);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1b3348";
    ctx.beginPath();
    ctx.ellipse(0, -21, 7, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.shields > 0) {
      ctx.strokeStyle = "rgba(127,255,208,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -3, 64, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
