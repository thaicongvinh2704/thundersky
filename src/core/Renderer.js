export class Renderer {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
  }

  render(time) {
    const { ctx, game } = this;
    ctx.save();
    if (game.shake > 0) {
      ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
    }

    this.drawBackground(time);
    for (const bullet of game.playerBullets) bullet.draw(ctx, game);
    for (const powerUp of game.powerUps) powerUp.draw(ctx, game);
    for (const enemy of game.enemies) enemy.draw(ctx, game);
    if (game.boss) game.boss.draw(ctx, game.height, game);
    for (const bullet of game.enemyBullets) bullet.draw(ctx, game);
    game.player.draw(ctx, game);
    this.drawLightnings();
    this.drawIndicators();
    for (const particle of game.effects.particles) particle.draw(ctx, game);
    this.drawMessages();
    ctx.restore();
  }

  drawBackground(time) {
    const { ctx, game } = this;
    const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
    gradient.addColorStop(0, "#071426");
    gradient.addColorStop(0.48, "#0b3150");
    gradient.addColorStop(1, "#15536a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.width, game.height);

    ctx.save();
    ctx.globalCompositeOperation = game.mobile || game.performanceTier !== "normal" ? "source-over" : "screen";
    for (const star of game.effects.stars) {
      const alpha = 0.32 + Math.sin(star.twinkle) * 0.18;
      ctx.fillStyle = `rgba(190,239,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.z * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (game.performanceTier !== "critical") {
      for (const cloud of game.effects.clouds) this.drawCloud(cloud);
    }

    if (game.performanceTier !== "critical") {
      ctx.save();
      ctx.globalAlpha = game.performanceTier === "low" ? 0.1 : 0.22;
      ctx.strokeStyle = "#76d8ff";
      ctx.lineWidth = 1;
      const streaks = Math.max(2, Math.ceil((game.mobile ? 5 : 9) * game.getEffectScale()));
      for (let i = 0; i < streaks; i++) {
        const x = ((time * 0.035 + i * 170) % (game.width + 220)) - 110;
        ctx.beginPath();
        ctx.moveTo(x, game.height * 0.08);
        ctx.quadraticCurveTo(x + 60, game.height * 0.38, x - 20, game.height + 40);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawCloud(cloud) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = cloud.a;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, 78 * cloud.s, 24 * cloud.s, 0, 0, Math.PI * 2);
    ctx.ellipse(cloud.x - 43 * cloud.s, cloud.y + 8 * cloud.s, 58 * cloud.s, 18 * cloud.s, 0, 0, Math.PI * 2);
    ctx.ellipse(cloud.x + 45 * cloud.s, cloud.y + 6 * cloud.s, 64 * cloud.s, 20 * cloud.s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawLightnings() {
    const { ctx, game } = this;
    ctx.save();
    ctx.globalCompositeOperation = game.performanceTier === "critical" ? "source-over" : "lighter";
    for (const bolt of game.effects.lightnings) {
      const alpha = Math.max(0, bolt.life / bolt.maxLife);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#bdf7ff";
      ctx.lineWidth = bolt.width;
      ctx.shadowColor = "#77e7ff";
      ctx.shadowBlur = (game.mobile ? 8 : 18) * game.getEffectScale();
      ctx.beginPath();
      ctx.moveTo(bolt.x1, bolt.y1);
      const dx = bolt.x2 - bolt.x1;
      const dy = bolt.y2 - bolt.y1;
      const segments = 5;
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const jitter = i === segments ? 0 : (Math.random() - 0.5) * 34;
        ctx.lineTo(bolt.x1 + dx * t + jitter, bolt.y1 + dy * t - jitter * 0.35);
      }
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = Math.max(1, bolt.width * 0.35);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMessages() {
    const { ctx, game } = this;
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = game.mobile ? '800 18px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif' : '800 24px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif';
    for (let i = 0; i < game.effects.messages.length; i++) {
      const message = game.effects.messages[i];
      const alpha = Math.max(0, Math.min(1, message.life / message.maxLife));
      const y = game.height * 0.2 + i * 34 - (1 - alpha) * 18;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(255,225,120,0.9)";
      ctx.shadowBlur = (game.mobile ? 8 : 18) * game.getEffectScale();
      ctx.fillStyle = "#fff3a6";
      ctx.fillText(message.text, game.width / 2, y);
    }
    ctx.restore();
  }

  drawIndicators() {
    const { ctx, game } = this;
    if (!game.effects.indicators.length) return;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = game.mobile ? '800 13px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif' : '800 15px Inter, system-ui, "Segoe UI", Arial, "Noto Sans", sans-serif';
    for (const indicator of game.effects.indicators) {
      const alpha = Math.max(0, Math.min(1, indicator.life / indicator.maxLife));
      const marginTop = game.mobile ? game.layout.topSafeArea + 12 : 18;
      const marginBottom = game.mobile ? game.layout.bottomSafeArea + 18 : 18;
      const x = Math.max(24, Math.min(game.width - 24, indicator.x));
      const y = Math.max(marginTop, Math.min(game.height - marginBottom, indicator.y));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(5,18,32,0.82)";
      ctx.strokeStyle = indicator.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x + 18, y + 12);
      ctx.lineTo(x - 18, y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = indicator.color;
      ctx.fillText(indicator.text, x, y + 2);
    }
    ctx.restore();
  }
}
