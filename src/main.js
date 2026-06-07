import { Game } from "./core/Game.js";

const game = new Game({
  canvas: document.getElementById("game"),
  hud: {
    score: document.getElementById("score"),
    best: document.getElementById("bestScore"),
    destroyed: document.getElementById("destroyedCount"),
    comboText: document.getElementById("comboText"),
    comboFill: document.getElementById("comboFill"),
    endlessText: document.getElementById("endlessText"),
    health: document.getElementById("health"),
    energy: document.getElementById("energy"),
    energyText: document.getElementById("energyText"),
    powerTimers: document.getElementById("powerTimers"),
    stage: document.getElementById("stageLabel"),
    time: document.getElementById("timeLabel"),
    upgrades: document.getElementById("upgradeList"),
    bossHud: document.getElementById("bossHud"),
    bossHealth: document.getElementById("bossHealth"),
    muteButton: document.getElementById("muteBtn"),
    skillButton: document.getElementById("skillBtn"),
    pauseButton: document.getElementById("pauseBtn"),
    dockPauseButton: document.getElementById("dockPauseBtn"),
    languageButton: document.getElementById("languageBtn"),
    orientationHint: document.getElementById("orientationHint"),
    debugOverlay: document.getElementById("debugOverlay")
  },
  menu: {
    overlay: document.getElementById("overlay"),
    title: document.getElementById("menuTitle"),
    text: document.getElementById("menuText"),
    controls: document.getElementById("menuControls"),
    startButton: document.getElementById("startBtn"),
    secondaryButton: document.getElementById("secondaryBtn"),
    upgradeOptions: document.getElementById("upgradeOptions")
  }
});

game.init();
