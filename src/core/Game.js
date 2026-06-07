import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { StateManager, STATES } from "./StateManager.js";
import { circleHit } from "./Collision.js";
import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import { Bullet } from "../entities/Bullet.js";
import { PowerUp } from "../entities/PowerUp.js";
import { Particle } from "../entities/Particle.js";
import { WEAPON_DROP_IDS } from "../data/weapons.js";
import { BALANCE } from "../data/balance.js";
import { SHIPS, getShip } from "../data/ships.js";
import { getLanguage, t, toggleLanguage } from "../data/i18n.js";
import { SpawnSystem } from "../systems/SpawnSystem.js";
import { StageSystem } from "../systems/StageSystem.js";
import { UpgradeSystem } from "../systems/UpgradeSystem.js";
import { EffectsSystem } from "../systems/EffectsSystem.js";
import { SaveSystem } from "../systems/SaveSystem.js";
import { AudioSystem } from "../systems/AudioSystem.js";
import { Hud } from "../ui/Hud.js";
import { Menu } from "../ui/Menu.js";
import { UpgradeScreen } from "../ui/UpgradeScreen.js";
import { GameOverScreen } from "../ui/GameOverScreen.js";

export class Game {
  constructor({ canvas, hud, menu }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.states = STATES;
    this.lastTime = 0;
    this.score = 0;
    this.shake = 0;
    this.playerBullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.boss = null;
    this.running = false;
    this.loopId = 0;
    this.stats = { enemiesDestroyed: 0, stageReached: 1, maxCombo: 1, endlessTime: 0, stageHits: 0, totalHits: 0, bossTime: 0, stageKills: 0, stageDamageTaken: 0, creditsEarned: 0 };
    this.combo = { count: 0, multiplier: 1, timer: 0, maxTimer: 3.2 };
    this.endless = { active: false, time: 0, multiplier: 1, survivalBonusTimer: 0 };
    this.debug = { visible: false, fps: 60, averageFps: 60, frames: 0, elapsed: 0 };
    this.performanceTier = "normal";
    this.performanceSamples = { lowSeconds: 0, criticalSeconds: 0, recoverySeconds: 0 };
    this.stageResult = null;
    this.mobile = false;
    this.layout = {
      topSafeArea: 70,
      bottomSafeArea: 34,
      touchOffsetY: 0,
      touchDragScale: 1,
      followSmoothing: 9,
      deadZone: 0
    };

    this.state = new StateManager();
    this.input = new Input(canvas);
    this.player = new Player();
    this.effects = new EffectsSystem(this);
    this.spawnSystem = new SpawnSystem(this);
    this.stageSystem = new StageSystem(this);
    this.upgradeSystem = new UpgradeSystem(this);
    this.save = new SaveSystem();
    this.audio = new AudioSystem(hud.muteButton);
    this.renderer = new Renderer(this);
    this.hud = new Hud(hud);
    this.menu = new Menu(menu);
    this.upgradeScreen = new UpgradeScreen(menu);
    this.gameOverScreen = new GameOverScreen(this.menu);
    this.lang = getLanguage();
    this.lastTouchEnd = 0;
  }

  init() {
    this.updateAppViewport();
    this.resize();
    window.addEventListener("resize", () => this.resizeSoon());
    window.addEventListener("orientationchange", () => this.resizeSoon());
    window.visualViewport?.addEventListener("resize", () => this.resizeSoon());
    window.visualViewport?.addEventListener("scroll", () => this.resizeSoon());
    window.addEventListener("focus", () => this.resizeSoon());
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.resizeSoon();
    });
    this.installGestureGuards();
    this.installInteractiveGuards();
    this.input.onStart = () => {
      if (this.state.is(STATES.WIN)) this.continueEndless();
      else if (this.state.is(STATES.MENU) || this.state.is(STATES.GAME_OVER)) this.start();
    };
    this.input.onPause = () => this.togglePause();
    this.input.onDebug = () => this.toggleDebug();
    this.input.bind();
    this.input.setViewportProvider(() => ({ width: this.width, height: this.height }));
    this.audio.bind();
    if (this.hud.elements.skillButton) {
      this.hud.elements.skillButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      this.hud.elements.skillButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.input.requestSkill();
      });
    }
    if (this.hud.elements.pauseButton) {
      this.hud.elements.pauseButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      this.hud.elements.pauseButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.togglePause();
      });
    }
    if (this.hud.elements.dockPauseButton) {
      this.hud.elements.dockPauseButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      this.hud.elements.dockPauseButton.addEventListener("click", () => this.togglePause());
    }
    if (this.hud.elements.languageButton) {
      this.hud.elements.languageButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      this.hud.elements.languageButton.addEventListener("click", () => {
        this.lang = toggleLanguage();
        this.refreshLanguage();
      });
    }
    window.addEventListener("skythunderlanguagechange", () => this.refreshLanguage());
    this.menu.bindStart(() => {
      if (this.state.is(STATES.PAUSED)) this.resume();
      else if (this.state.is(STATES.WIN)) this.continueEndless();
      else this.start();
    });
    this.menu.bindSecondary(() => this.start());
    this.menu.bindHangar(() => this.showHangar());
    this.menu.bindPauseActions({
      resume: () => this.resume(),
      restart: () => this.start(),
      sound: () => {
        this.audio.setMuted(!this.audio.muted);
        this.menu.setSoundLabel(this.audio.muted);
        if (!this.audio.muted) this.audio.play("upgrade");
      },
      controls: () => this.menu.showPauseControls(),
      mainMenu: () => this.returnToMenu()
    });
    this.menu.showMenu();
    this.refreshLanguage();
    this.audio.startMusic("menu");
    if (new URLSearchParams(window.location.search).get("debug") === "1") this.toggleDebug();
    this.renderer.render(0);
  }

  resize() {
    this.updateMobileState();
    const viewport = this.getViewportSize();
    this.updateAppViewport(viewport);
    const caps = this.mobile
      ? { normal: 1.35, low: 1.15, critical: 1 }
      : { normal: 1.75, low: 1.35, critical: 1.15 };
    const cap = caps[this.performanceTier];
    this.dpr = Math.min(window.devicePixelRatio || 1, cap);
    this.width = Math.max(1, viewport.width);
    this.height = Math.max(1, viewport.height);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (!this.state.is(STATES.PLAYING) && !this.state.is(STATES.BOSS) && !this.state.is(STATES.ENDLESS)) {
      this.player.x = this.width / 2;
      this.player.y = this.height * 0.78;
    } else {
      this.player.x = Math.max(28, Math.min(this.width - 28, this.player.x));
      this.player.y = Math.max(this.layout.topSafeArea, Math.min(this.height - this.layout.bottomSafeArea, this.player.y));
    }
    this.effects.makeStars();
  }

  resizeSoon() {
    clearTimeout(this.resizeTimer);
    this.updateAppViewport();
    this.resizeTimer = setTimeout(() => this.resize(), 120);
  }

  getViewportSize() {
    const viewport = window.visualViewport;
    return {
      width: Math.max(1, Math.round(viewport ? viewport.width : window.innerWidth)),
      height: Math.max(1, Math.round(viewport ? viewport.height : window.innerHeight)),
      offsetTop: Math.round(viewport ? viewport.offsetTop : 0),
      offsetLeft: Math.round(viewport ? viewport.offsetLeft : 0)
    };
  }

  updateAppViewport(size = this.getViewportSize()) {
    document.documentElement.style.setProperty("--app-height", `${size.height}px`);
    document.documentElement.style.setProperty("--app-width", `${size.width}px`);
    document.documentElement.style.setProperty("--viewport-offset-top", `${size.offsetTop}px`);
    document.documentElement.style.setProperty("--viewport-offset-left", `${size.offsetLeft}px`);
  }

  installGestureGuards() {
    const block = (event) => event.preventDefault();
    const shouldAllowMenuScroll = (event) => {
      if (event.touches && event.touches.length > 1) return false;
      const target = event.target instanceof Element ? event.target : null;
      return Boolean(target?.closest(".menu"));
    };
    document.addEventListener("touchstart", (event) => {
      if (event.touches && event.touches.length > 1) event.preventDefault();
    }, { passive: false });
    document.addEventListener("touchmove", (event) => {
      if (!shouldAllowMenuScroll(event)) event.preventDefault();
    }, { passive: false });
    document.addEventListener("touchend", (event) => {
      const now = Date.now();
      if (now - this.lastTouchEnd <= 350) event.preventDefault();
      this.lastTouchEnd = now;
    }, { passive: false });
    window.addEventListener("gesturestart", block, { passive: false });
    window.addEventListener("gesturechange", block, { passive: false });
    window.addEventListener("gestureend", block, { passive: false });
  }

  installInteractiveGuards() {
    const selector = [
      "button",
      ".skill-button",
      ".pause-button",
      ".mute-button",
      ".language-button",
      ".hangar-button",
      ".upgrade-card",
      ".ship-card",
      ".pause-action"
    ].join(",");
    const isGuarded = (target) => target instanceof Element && target.closest(selector);
    document.addEventListener("pointerdown", (event) => {
      if (!isGuarded(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false, capture: true });
    document.addEventListener("touchstart", (event) => {
      if (!isGuarded(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false, capture: true });
    document.addEventListener("touchend", (event) => {
      if (!isGuarded(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      const button = event.target.closest("button");
      if (button && !button.disabled) button.click();
    }, { passive: false, capture: true });
    document.addEventListener("click", (event) => {
      if (isGuarded(event.target)) event.stopPropagation();
    });
  }

  updateMobileState() {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches || false;
    const viewport = this.getViewportSize();
    const vw = viewport.width;
    const vh = viewport.height;
    const shortSide = Math.min(vw, vh);
    const longSide = Math.max(vw, vh);
    const narrow = shortSide <= 760;
    const portraitPhone = vw <= 540 && vh >= 560;
    const compactIframe = vw <= 620 && longSide >= 520;
    this.mobile = (coarse && narrow) || portraitPhone;
    this.mobile = this.mobile || compactIframe;
    const mobile = BALANCE.mobile;
    const tiny = shortSide <= 370 || vh <= 680;
    const landscape = vw > vh;
    this.layout = {
      topSafeArea: this.mobile ? Math.round(Math.min(130, Math.max(tiny ? 88 : 100, mobile.topSafeArea + Math.max(0, vw - 390) * 0.03))) : 70,
      bottomSafeArea: this.mobile ? Math.round(Math.min(150, Math.max(tiny ? 108 : 122, mobile.bottomSafeArea + Math.max(0, vw - 390) * 0.04))) : 34,
      touchOffsetY: this.mobile ? (tiny ? -72 : mobile.touchOffsetY) : 0,
      touchDragScale: this.mobile ? mobile.touchDragScale : 1,
      followSmoothing: this.mobile ? mobile.followSmoothing : 9,
      initialFollowSmoothing: this.mobile ? mobile.initialFollowSmoothing : 9,
      maxInitialStep: this.mobile ? (tiny ? 110 : mobile.maxInitialStep) : Infinity,
      deadZone: this.mobile ? mobile.deadZone : 0,
      enemyScale: this.mobile && tiny ? mobile.smallScreenEnemyScale : 1
    };
    document.body.classList.toggle("is-mobile", this.mobile);
    document.body.classList.toggle("is-landscape", this.mobile && landscape);
    document.body.classList.toggle("is-small-phone", this.mobile && tiny);
    this.input.setMobile(this.mobile);
    this.effects.maxParticles = this.getPerformanceLimits().particles;
  }

  start() {
    if (this.running) this.stopLoop();
    this.reset();
    this.audio.ensure();
    this.audio.startMusic("gameplay");
    this.state.set(STATES.PLAYING);
    this.menu.hide();
    this.lastTime = performance.now();
    this.running = true;
    this.loopId = requestAnimationFrame((time) => this.loop(time));
  }

  reset() {
    this.score = 0;
    this.shake = 0;
    this.stats = { enemiesDestroyed: 0, stageReached: 1, maxCombo: 1, endlessTime: 0, stageHits: 0, totalHits: 0, bossTime: 0, stageKills: 0, stageDamageTaken: 0, creditsEarned: 0 };
    this.combo = { count: 0, multiplier: 1, timer: 0, maxTimer: 3.2 };
    this.endless = { active: false, time: 0, multiplier: 1, survivalBonusTimer: 0 };
    this.debug.frames = 0;
    this.debug.elapsed = 0;
    this.releaseAll(this.playerBullets, Bullet.release.bind(Bullet));
    this.releaseAll(this.enemyBullets, Bullet.release.bind(Bullet));
    this.enemies.length = 0;
    this.releaseAll(this.powerUps, PowerUp.release.bind(PowerUp));
    this.boss = null;
    this.stageResult = null;
    this.player.reset(this.width, this.height, getShip(this.save.best.selectedShipId));
    this.effects.reset();
    this.spawnSystem.reset();
    this.stageSystem.reset();
    this.hud.update(this);
  }

  continueEndless() {
    if (this.running) this.stopLoop();
    this.endless.active = true;
    this.endless.time = 0;
    this.endless.multiplier = 1;
    this.endless.survivalBonusTimer = 0;
    this.stats.stageReached = Math.max(this.stats.stageReached, 6);
    this.boss = null;
    this.releaseAll(this.playerBullets, Bullet.release.bind(Bullet));
    this.releaseAll(this.enemyBullets, Bullet.release.bind(Bullet));
    this.enemies.length = 0;
    this.releaseAll(this.powerUps, PowerUp.release.bind(PowerUp));
    this.spawnSystem.reset();
    this.state.set(STATES.ENDLESS);
    this.menu.hide();
    this.audio.ensure();
    this.audio.startMusic("gameplay");
    this.warn("Endless Mode");
    this.lastTime = performance.now();
    this.running = true;
    this.loopId = requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    if (!this.running) return;
    if (this.state.is(STATES.MENU) || this.state.is(STATES.GAME_OVER) || this.state.is(STATES.WIN)) {
      this.stopLoop();
      return;
    }
    const dt = Math.min(0.033, (time - this.lastTime) / 1000);
    this.lastTime = time;

    if (!this.state.is(STATES.PAUSED) && !this.state.is(STATES.UPGRADE)) {
      this.update(dt);
    }
    this.renderer.render(time);
    this.hud.update(this);
    this.updateDebug(dt);
    this.loopId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  stopLoop() {
    this.running = false;
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.loopId = 0;
  }

  update(dt) {
    this.shake = Math.max(0, this.shake - dt * 35);
    this.effects.update(dt);

    this.updateCombo(dt);

    if (this.state.is(STATES.PLAYING) || this.state.is(STATES.BOSS) || this.state.is(STATES.ENDLESS)) {
      this.player.update(dt, this.input, this);
      if (this.state.is(STATES.ENDLESS)) this.updateEndless(dt);
      else {
        this.spawnSystem.update(dt);
        this.stageSystem.update(dt);
      }
      if (this.state.is(STATES.BOSS)) this.stats.bossTime += dt;
      if (this.boss) this.boss.update(dt, this);
      this.updateEntities(dt);
      this.checkCollisions();
    }
  }

  updateEntities(dt) {
    this.compactInPlace(this.playerBullets, (bullet) => {
      bullet.update(dt, this);
      return bullet.life > 0 && bullet.y > -80 && bullet.y < this.height + 80 && bullet.x > -80 && bullet.x < this.width + 80;
    }, Bullet.release.bind(Bullet));
    this.compactInPlace(this.enemyBullets, (bullet) => {
      bullet.update(dt, this);
      return bullet.life > 0 && bullet.y > -80 && bullet.y < this.height + 80 && bullet.x > -80 && bullet.x < this.width + 80;
    }, Bullet.release.bind(Bullet));
    this.compactInPlace(this.enemies, (enemy) => {
      enemy.update(dt, this);
      return enemy.y <= this.height + 80 && enemy.hp > 0;
    });
    this.compactInPlace(this.powerUps, (powerUp) => {
      powerUp.update(dt, this);
      return powerUp.life > 0 && powerUp.y < this.height + 50;
    }, PowerUp.release.bind(PowerUp));
    this.enforceSoftCaps();
  }

  compactInPlace(items, keep, release = null) {
    let write = 0;
    for (let read = 0; read < items.length; read++) {
      const item = items[read];
      if (keep(item)) items[write++] = item;
      else if (release) release(item);
    }
    items.length = write;
  }

  releaseAll(items, release) {
    for (const item of items) release(item);
    items.length = 0;
  }

  enforceSoftCaps() {
    const limits = this.getPerformanceLimits();
    this.trimOldest(this.playerBullets, limits.playerBullets);
    this.trimOldest(this.enemyBullets, limits.enemyBullets);
    this.trimOldest(this.powerUps, limits.powerUps);
    this.trimOldest(this.enemies, limits.enemies);
    this.trimOldest(this.effects.particles, limits.particles);
  }

  trimOldest(items, cap) {
    if (items.length <= cap) return;
    const excess = items.length - cap;
    const removed = items.splice(0, excess);
    if (items === this.playerBullets || items === this.enemyBullets) removed.forEach(Bullet.release.bind(Bullet));
    else if (items === this.powerUps) removed.forEach(PowerUp.release.bind(PowerUp));
    else if (items === this.effects.particles) removed.forEach(Particle.release.bind(Particle));
  }

  getPerformanceLimits() {
    const desktop = {
      normal: { playerBullets: 140, enemyBullets: 180, particles: 180, powerUps: 14, enemies: 32 },
      low: { playerBullets: 100, enemyBullets: 130, particles: 110, powerUps: 10, enemies: 24 },
      critical: { playerBullets: 70, enemyBullets: 90, particles: 60, powerUps: 8, enemies: 18 }
    };
    const limits = { ...desktop[this.performanceTier] };
    if (this.mobile) {
      for (const key of Object.keys(limits)) limits[key] = Math.max(6, Math.floor(limits[key] * 0.75));
    }
    return limits;
  }

  getEffectScale() {
    return this.performanceTier === "critical" ? 0.18 : this.performanceTier === "low" ? 0.42 : 1;
  }

  addPlayerBullet(config) {
    if (this.playerBullets.length >= this.getPerformanceLimits().playerBullets) return false;
    this.playerBullets.push(Bullet.acquire(config));
    return true;
  }

  addEnemyBullet(config) {
    if (this.enemyBullets.length >= this.getPerformanceLimits().enemyBullets) return false;
    this.enemyBullets.push(Bullet.acquire(config));
    return true;
  }

  clearEnemyBullets() {
    this.releaseAll(this.enemyBullets, Bullet.release.bind(Bullet));
  }

  addPowerUp(x, y, type) {
    if (this.powerUps.length >= this.getPerformanceLimits().powerUps) return false;
    this.powerUps.push(PowerUp.acquire(x, y, type));
    return true;
  }

  addEnemy(type, x, y, stageId = 1, options = {}) {
    if (this.enemies.length >= this.getPerformanceLimits().enemies) return false;
    this.enemies.push(new Enemy(type, x, y, stageId, options));
    return true;
  }

  checkCollisions() {
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const bullet = this.playerBullets[i];
      if (this.boss && circleHit(bullet, this.boss, bullet.r, this.boss.r * 0.9)) {
        Bullet.release(this.playerBullets.splice(i, 1)[0]);
        if (this.boss.takeDamage(bullet.damage)) this.defeatBoss();
        continue;
      }

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (!circleHit(bullet, enemy)) continue;
        if (bullet.pierce > 0) bullet.pierce -= 1;
        else Bullet.release(this.playerBullets.splice(i, 1)[0]);
        this.effects.burst(bullet.x, bullet.y, bullet.color || "#ffe66d", 6, 90, 0.25);
        const killed = enemy.takeDamage(this.damageAfterEnemyAura(enemy, bullet.damage));
        if (bullet.splash > 0) this.splashDamage(bullet, enemy);
        if (killed) this.killEnemy(this.enemies.indexOf(enemy), enemy);
        break;
      }
    }

    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      this.checkGraze(bullet);
      if (!circleHit(bullet, this.player)) continue;
      Bullet.release(this.enemyBullets.splice(i, 1)[0]);
      this.player.takeDamage(bullet.damage, this);
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const enemyHitRadius = this.mobile && enemy.config?.hunter ? enemy.r * 0.58 : enemy.r * 0.72;
      if (!circleHit(enemy, this.player, enemyHitRadius, this.player.r * 0.82)) continue;
      this.enemies.splice(i, 1);
      this.effects.explode(enemy.x, enemy.y, enemy.type === "tank");
      this.player.takeDamage(enemy.type === "tank" ? 28 : 18, this);
    }

    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      if (!circleHit(powerUp, this.player)) continue;
      this.powerUps.splice(i, 1);
      this.applyPowerUp(powerUp);
      PowerUp.release(powerUp);
      this.addScore(15);
      this.effects.burst(this.player.x, this.player.y, "#7fffd0", 20, 200, 0.55);
    }
  }

  applyPowerUp(powerUp) {
    const player = this.player;
    this.audio.play("pickup");
    if (powerUp.type.startsWith("weapon:")) {
      const id = powerUp.type.slice(7);
      const sameWeapon = player.weapon.id === id;
      player.setWeapon(id);
      this.warn(t(sameWeapon ? "power.levelUp" : "power.switch", { weapon: player.weapon.name.toUpperCase() }));
      return;
    }
    if (powerUp.type === "repair") {
      player.health = Math.min(player.maxHealth, player.health + 18);
      this.effects.message(t("power.repair"));
      return;
    }
    if (powerUp.type === "shield") {
      player.shields += 1;
      this.effects.message(t("power.shield"));
      return;
    }
    if (powerUp.type === "bomb") {
      this.bombBlast();
      this.warn(t("power.bomb"));
      return;
    }
    if (powerUp.type === "rapid") {
      player.rapidTimer = Math.max(player.rapidTimer, 6);
      this.effects.message(t("power.rapid"));
      return;
    }
    if (powerUp.type === "magnet") {
      player.magnetTimer = Math.max(player.magnetTimer, 5);
      this.effects.message(t("power.magnet"));
      return;
    }
    const gain = BALANCE.thunder.chargePerPickup * (1 + player.stats.thunderCharge);
    player.energy = Math.min(BALANCE.thunder.maxEnergy, player.energy + gain);
    this.effects.message(`THUNDER +${Math.floor(gain)}`);
  }

  bombBlast() {
    const radius = this.mobile ? 250 : 320;
    const damage = 14;
    const px = this.player.x;
    const py = this.player.y;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const distance = Math.hypot(enemy.x - px, enemy.y - py);
      if (distance > radius + enemy.r) continue;
      if (enemy.takeDamage(damage)) this.killEnemy(i, enemy);
      else this.effects.burst(enemy.x, enemy.y, "#ff8a5c", 7, 120, 0.28);
    }
    const removed = this.enemyBullets.splice(0, Math.ceil(this.enemyBullets.length * 0.72));
    removed.forEach(Bullet.release.bind(Bullet));
    this.effects.explode(px, py - 40, false);
    this.shake = Math.min(this.mobile ? 10 : 16, this.shake + (this.mobile ? 6 : 10));
  }

  killEnemy(index, enemy) {
    if (index < 0) return;
    this.enemies.splice(index, 1);
    this.stats.enemiesDestroyed += 1;
    this.stats.stageKills += 1;
    this.registerComboKill();
    this.addScore(enemy.config.score * (enemy.scoreScale || 1), true);
    this.player.energy = Math.min(BALANCE.thunder.maxEnergy, this.player.energy + this.energyGain(enemy.config.miniBoss ? 18 : BALANCE.thunder.chargePerKill));
    if (Math.random() < this.dropChance(enemy)) {
      this.addPowerUp(enemy.x, enemy.y, this.rollPowerUpType(enemy));
    }
    this.effects.explode(enemy.x, enemy.y, enemy.type === "tank");
    this.audio.play("explosion");
  }

  energyGain(base) {
    return base * (1 + this.player.stats.thunderCharge);
  }

  rollPowerUpType(enemy) {
    const roll = Math.random();
    if (roll < 0.22) return "repair";
    if (roll < 0.48) return "energy";
    if (roll < 0.7) {
      const id = WEAPON_DROP_IDS[Math.floor(Math.random() * WEAPON_DROP_IDS.length)];
      return `weapon:${id}`;
    }
    if (roll < 0.8) return "shield";
    if (roll < 0.88) return "bomb";
    if (roll < 0.95) return "rapid";
    return "magnet";
  }

  dropChance(enemy) {
    if (enemy.type === "tank" || enemy.type === "carrier" || enemy.type === "shieldGuard" || enemy.config?.miniBoss) return 0.4;
    return 0.2;
  }

  splashDamage(bullet, directHit) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy === directHit) continue;
      const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
      if (distance > bullet.splash + enemy.r) continue;
      this.effects.burst(enemy.x, enemy.y, bullet.color, 5, 80, 0.18);
        if (enemy.takeDamage(this.damageAfterEnemyAura(enemy, bullet.damage * 0.55))) this.killEnemy(i, enemy);
    }
  }

  damageAfterEnemyAura(enemy, amount) {
    if (enemy.config?.shieldAura) return amount;
    const guarded = this.enemies.some((other) => other !== enemy && other.config?.shieldAura && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 112);
    return guarded ? amount * 0.72 : amount;
  }

  defeatBoss() {
    const timeBonus = Math.max(0, 1800 - Math.floor((this.stats.bossTime || 0) * 18));
    this.addScore(1200 + timeBonus);
    this.warn(timeBonus > 0 ? `Boss Time Bonus +${timeBonus}` : "Boss Clear");
    this.effects.explode(this.boss.x, this.boss.y, true);
    this.boss = null;
    this.win();
  }

  addScore(amount, useMultipliers = false) {
    const combo = useMultipliers ? this.combo.multiplier : 1;
    const endless = useMultipliers ? this.endless.multiplier : 1;
    this.score += Math.max(0, Math.floor(amount * combo * endless));
  }

  registerComboKill() {
    this.combo.count += 1;
    this.combo.timer = this.combo.maxTimer;
    this.combo.multiplier = Math.min(4.5, 1 + Math.floor(this.combo.count / 3) * 0.25);
    this.stats.maxCombo = Math.max(this.stats.maxCombo, this.combo.multiplier);
  }

  updateCombo(dt) {
    if (this.combo.timer <= 0) return;
    this.combo.timer -= dt;
    if (this.combo.timer <= 0) this.resetCombo();
  }

  resetCombo() {
    this.combo.count = 0;
    this.combo.multiplier = 1;
    this.combo.timer = 0;
  }

  recordPlayerHit() {
    this.stats.stageHits += 1;
    this.stats.totalHits += 1;
    this.resetCombo();
  }

  recordDamageTaken(amount) {
    this.stats.stageDamageTaken += Math.max(0, amount);
  }

  checkGraze(bullet) {
    if (bullet.grazed || bullet.owner !== "enemy") return;
    const dx = bullet.x - this.player.x;
    const dy = bullet.y - this.player.y;
    const distance = Math.hypot(dx, dy);
    const hitRadius = bullet.r + this.player.r * 0.82;
    const grazeRadius = hitRadius + (this.mobile ? 18 : 24);
    if (distance <= hitRadius || distance > grazeRadius) return;
    bullet.grazed = true;
    const scale = this.player.stats.grazeScale || 1;
    this.addScore(8 * scale);
    this.combo.count += 0.35 * scale;
    this.combo.timer = Math.max(this.combo.timer, 1.0);
    this.combo.multiplier = Math.min(4.5, 1 + Math.floor(this.combo.count / 3) * 0.25);
    this.stats.maxCombo = Math.max(this.stats.maxCombo, this.combo.multiplier);
    this.player.energy = Math.min(BALANCE.thunder.maxEnergy, this.player.energy + this.energyGain(1.4 * scale));
    this.effects.burst(this.player.x, this.player.y - 8, this.player.ship.accent || "#ffffff", this.mobile ? 4 : 7, 95, 0.2);
  }

  awardStageClearBonus(stageId) {
    const clearBonus = 450 + stageId * 180;
    this.addScore(clearBonus);
    if (this.stats.stageHits === 0) {
      const noHitBonus = 850 + stageId * 220;
      this.addScore(noHitBonus);
      this.warn(`No-hit Bonus +${noHitBonus}`);
    } else {
      this.warn(`Stage Clear +${clearBonus}`);
    }
    this.stageResult = this.makeStageResult(stageId, clearBonus);
  }

  makeStageResult(stageId, clearBonus) {
    const noHit = this.stats.stageHits === 0;
    const damageTaken = Math.round(this.stats.stageDamageTaken);
    const kills = this.stats.stageKills;
    const combo = this.stats.maxCombo;
    let points = 0;
    if (noHit) points += 3;
    if (kills >= 18 + stageId * 4) points += 2;
    if (combo >= 2.5) points += 2;
    if (damageTaken <= 20) points += 1;
    const rank = points >= 7 ? "S" : points >= 5 ? "A" : points >= 3 ? "B" : "C";
    const credits = (rank === "S" ? 34 : rank === "A" ? 26 : rank === "B" ? 18 : 12) + stageId * 4;
    this.stats.creditsEarned += credits;
    return { stageId, kills, damageTaken, maxCombo: combo, noHit, rank, bonus: clearBonus, credits };
  }

  resetStageRunStats() {
    this.stats.stageHits = 0;
    this.stats.stageKills = 0;
    this.stats.stageDamageTaken = 0;
    this.stats.bossTime = 0;
  }

  updateEndless(dt) {
    this.endless.time += dt;
    this.stats.endlessTime = Math.max(this.stats.endlessTime, this.endless.time);
    this.endless.multiplier = Math.min(2.5, 1 + this.endless.time / 120);
    this.spawnSystem.updateEndless(dt);
    this.endless.survivalBonusTimer += dt;
    if (this.endless.survivalBonusTimer >= 15) {
      this.endless.survivalBonusTimer = 0;
      const bonus = 250 + Math.floor(this.endless.time * 8);
      this.addScore(bonus, true);
      this.warn(`Survival Bonus +${bonus}`);
    }
  }

  warn(text) {
    this.effects.message(text);
    this.audio.play("warning");
  }

  toggleDebug() {
    this.debug.visible = !this.debug.visible;
    if (this.hud.elements.debugOverlay) this.hud.elements.debugOverlay.classList.toggle("hidden", !this.debug.visible);
  }

  updateDebug(dt) {
    this.debug.frames += 1;
    this.debug.elapsed += dt;
    if (this.debug.elapsed >= 1.2) {
      const sampleSeconds = this.debug.elapsed;
      this.debug.fps = Math.round(this.debug.frames / sampleSeconds);
      this.debug.averageFps = Math.round(this.debug.averageFps * 0.72 + this.debug.fps * 0.28);
      this.debug.frames = 0;
      this.debug.elapsed = 0;
      this.updatePerformanceTier(sampleSeconds);
    }
    const overlay = this.hud.elements.debugOverlay;
    if (!overlay || !this.debug.visible) return;
    overlay.textContent = [
      `FPS ${this.debug.fps}`,
      `Avg FPS ${this.debug.averageFps}`,
      `Tier ${this.performanceTier}`,
      `DPR ${this.dpr.toFixed(2)}`,
      `State ${this.state.state}`,
      `Enemies ${this.enemies.length}`,
      `P Bullets ${this.playerBullets.length}`,
      `E Bullets ${this.enemyBullets.length}`,
      `Particles ${this.effects.particles.length}`,
      `PowerUps ${this.powerUps.length}`,
      `Endless ${Math.floor(this.endless.time)}s`
    ].join("\n");
  }

  updatePerformanceTier(sampleSeconds) {
    const fps = this.debug.averageFps;
    this.performanceSamples.criticalSeconds = fps < 32 ? this.performanceSamples.criticalSeconds + sampleSeconds : 0;
    this.performanceSamples.lowSeconds = fps < 45 ? this.performanceSamples.lowSeconds + sampleSeconds : 0;
    this.performanceSamples.recoverySeconds = fps >= 56 ? this.performanceSamples.recoverySeconds + sampleSeconds : 0;
    let next = this.performanceTier;
    if (this.performanceSamples.criticalSeconds >= 1.5) next = "critical";
    else if (this.performanceSamples.lowSeconds >= 2 && this.performanceTier === "normal") next = "low";
    else if (this.performanceSamples.recoverySeconds >= 5) next = this.performanceTier === "critical" ? "low" : "normal";
    if (next !== this.performanceTier) {
      this.performanceTier = next;
      this.effects.maxParticles = this.getPerformanceLimits().particles;
      this.enforceSoftCaps();
      this.performanceSamples = { lowSeconds: 0, criticalSeconds: 0, recoverySeconds: 0 };
      this.resizeSoon();
    }
  }

  refreshLanguage() {
    this.lang = getLanguage();
    if (this.state.is(STATES.MENU)) this.menu.showMenu();
    else if (this.state.is(STATES.PAUSED)) this.gameOverScreen.paused(this);
    else if (this.state.is(STATES.WIN)) this.gameOverScreen.win(this);
    else if (this.state.is(STATES.GAME_OVER)) this.gameOverScreen.show(this);
    if (this.hud.elements.languageButton) this.hud.elements.languageButton.textContent = this.lang === "vi" ? "VI | EN" : "EN | VI";
    if (this.hud.elements.orientationHint) this.hud.elements.orientationHint.textContent = t("orientation");
    for (const label of document.querySelectorAll("[data-i18n]")) label.textContent = t(label.dataset.i18n);
    this.audio.updateButton();
    this.hud.update(this);
  }

  activateThunder() {
    const player = this.player;
    if (player.thunderCooldown > 0) {
      this.effects.message(t("thunder.cooldown", { seconds: Math.ceil(player.thunderCooldown) }));
      return false;
    }
    if (player.energy < BALANCE.thunder.cost) {
      this.effects.message(t("thunder.noEnergy"));
      return false;
    }
    const radius = BALANCE.thunder.radius + player.stats.thunderRadius;
    const enemyDamage = BALANCE.thunder.enemyDamage + player.stats.thunderDamage * 8;
    const bossDamage = BALANCE.thunder.bossDamage + player.stats.thunderDamage * 35 + player.stats.thunderBossBonus;
    const targets = this.enemies.filter((enemy) => Math.hypot(enemy.x - player.x, enemy.y - player.y) <= radius + enemy.r);

    player.energy = 0;
    player.thunderCooldown = player.stats.thunderCooldown;
    this.shake = Math.min(this.mobile ? 13 : 30, this.shake + (this.mobile ? 10 : 24));
    this.clearEnemyBullets();

    for (let i = targets.length - 1; i >= 0; i--) {
      const enemy = targets[i];
      if (enemy.takeDamage(enemyDamage)) {
        this.killEnemy(this.enemies.indexOf(enemy), enemy);
      } else {
        this.effects.burst(enemy.x, enemy.y, "#bdf7ff", 14, 190, 0.35);
      }
    }

    if (this.boss && Math.hypot(this.boss.x - player.x, this.boss.y - player.y) <= radius + this.boss.r) {
      if (this.boss.takeDamage(bossDamage)) this.defeatBoss();
    }

    if (player.stats.thunderShield > 0) player.shields = Math.max(player.shields, 2);
    this.effects.thunderStorm(player.x, player.y, this.boss ? [this.boss, ...targets] : targets, radius);
    this.audio.play("thunder");
    return true;
  }

  openUpgrade() {
    this.state.set(STATES.UPGRADE);
    const choices = this.upgradeSystem.choices();
    this.upgradeScreen.show(choices, (upgrade) => {
      this.upgradeScreen.hide();
      this.upgradeSystem.apply(upgrade);
      this.lastTime = performance.now();
    }, this.stageResult);
  }

  findNearestTarget(x, y) {
    const targets = this.boss ? [this.boss, ...this.enemies] : this.enemies;
    let best = null;
    let bestDistance = Infinity;
    for (const target of targets) {
      const distance = Math.hypot(target.x - x, target.y - y);
      if (distance < bestDistance) {
        best = target;
        bestDistance = distance;
      }
    }
    return best;
  }

  gameOver() {
    this.effects.explode(this.player.x, this.player.y, true);
    this.state.set(STATES.GAME_OVER);
    this.finishRun();
    this.gameOverScreen.show(this);
  }

  win() {
    this.state.set(STATES.WIN);
    this.finishRun();
    this.gameOverScreen.win(this);
  }

  finishRun() {
    this.stats.stageReached = Math.max(this.stats.stageReached, this.stageSystem.stageId);
    const runCredits = Math.max(8, Math.floor(this.score / 1100) + this.stats.enemiesDestroyed + Math.floor(this.stats.endlessTime / 8) + this.stats.creditsEarned);
    this.save.saveRun({
      score: this.score,
      stage: this.stats.stageReached,
      enemiesDestroyed: this.stats.enemiesDestroyed,
      endlessTime: this.stats.endlessTime,
      maxCombo: this.stats.maxCombo,
      creditsEarned: runCredits
    });
    this.audio.startMusic("menu");
  }

  togglePause() {
    if (this.state.is(STATES.PLAYING) || this.state.is(STATES.BOSS) || this.state.is(STATES.ENDLESS)) {
      this.state.set(STATES.PAUSED);
      this.gameOverScreen.paused(this);
      return;
    }
    if (this.state.is(STATES.PAUSED)) this.resume();
  }

  resume() {
    this.menu.hide();
    this.state.set(this.endless.active ? STATES.ENDLESS : this.stageSystem.currentStage()?.boss ? STATES.BOSS : STATES.PLAYING);
    this.lastTime = performance.now();
  }

  returnToMenu() {
    this.stopLoop();
    this.state.set(STATES.MENU);
    this.menu.showMenu();
    this.audio.startMusic("menu");
  }

  showHangar() {
    this.menu.showHangar({
      ships: SHIPS,
      save: this.save,
      onSelect: (ship) => {
        const ok = this.save.isShipUnlocked(ship.id) ? this.save.selectShip(ship.id) : this.save.unlockShip(ship);
        this.warn(ok ? `${ship.name} Ready` : "Need More Credits");
        this.showHangar();
      },
      onBack: () => this.menu.showMenu()
    });
  }

  applyUpgradeTags(upgrade) {
    for (const tag of upgrade.tags || [upgrade.group].filter(Boolean)) {
      this.player.tagCounts[tag] = (this.player.tagCounts[tag] || 0) + 1;
    }
    this.checkSynergies();
  }

  checkSynergies() {
    const synergies = [
      { id: "bulletStorm", name: "Bullet Storm", tags: ["attack", "bullet"], apply: () => { this.player.stats.damage += 0.25; this.player.stats.fireRate += 0.8; } },
      { id: "thunderMastery", name: "Thunder Mastery", tags: ["thunder"], apply: () => { this.player.stats.thunderDamage += 1.2; this.player.stats.thunderCharge += 0.18; this.player.stats.thunderCooldown = Math.max(2.6, this.player.stats.thunderCooldown - 0.7); } },
      { id: "guardianCore", name: "Guardian Core", tags: ["shield", "armor", "defense"], apply: () => { this.player.stats.damageReduction = Math.min(0.55, this.player.stats.damageReduction + 0.1); this.player.shields += 1; } },
      { id: "missileNetwork", name: "Missile Network", tags: ["missile"], apply: () => { this.player.stats.missileDamageBonus += 1.2; this.player.stats.missile += 0.5; } }
    ];
    for (const synergy of synergies) {
      if (this.player.synergies.includes(synergy.id)) continue;
      const count = synergy.tags.reduce((sum, tag) => sum + (this.player.tagCounts[tag] || 0), 0);
      if (count < 3) continue;
      this.player.synergies.push(synergy.id);
      synergy.apply();
      this.warn(`${synergy.name} Active`);
      this.player.upgrades.push(synergy.name);
    }
  }
}
