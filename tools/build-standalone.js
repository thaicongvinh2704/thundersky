const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const cssFiles = [
  "styles/base.css",
  "styles/hud.css",
  "styles/menu.css"
];

const scriptFiles = [
  "src/data/balance.js",
  "src/data/i18n.js",
  "src/data/weapons.js",
  "src/data/ships.js",
  "src/data/enemies.js",
  "src/data/stages.js",
  "src/data/upgrades.js",
  "src/core/Collision.js",
  "src/core/StateManager.js",
  "src/core/Input.js",
  "src/core/Renderer.js",
  "src/entities/Bullet.js",
  "src/entities/Particle.js",
  "src/entities/Enemy.js",
  "src/entities/Boss.js",
  "src/entities/Player.js",
  "src/entities/PowerUp.js",
  "src/systems/EffectsSystem.js",
  "src/systems/SaveSystem.js",
  "src/systems/AudioSystem.js",
  "src/systems/SpawnSystem.js",
  "src/systems/StageSystem.js",
  "src/systems/UpgradeSystem.js",
  "src/ui/Hud.js",
  "src/ui/Menu.js",
  "src/ui/UpgradeScreen.js",
  "src/ui/GameOverScreen.js",
  "src/core/Game.js",
  "src/main.js"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function stripModuleSyntax(source) {
  return source
    .replace(/^\s*import\s+.*?;\s*$/gm, "")
    .replace(/\bexport\s+(?=(const|class|function)\b)/g, "");
}

const styles = cssFiles
  .map((file) => `/* ${file} */\n${read(file).trim()}`)
  .join("\n\n");

const scripts = scriptFiles
  .map((file) => `// ${file}\n${stripModuleSyntax(read(file)).trim()}`)
  .join("\n\n");

new Function(scripts);

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
  <title>Sky Thunder</title>
  <style>
${styles}
  </style>
</head>
<body>
  <canvas id="game"></canvas>

  <div class="hud">
    <div class="panel">
      <div class="label" data-i18n="hud.score">Điểm</div>
      <div class="value" id="score">0</div>
      <div class="mini-stat"><span data-i18n="hud.best">Kỷ lục</span> <span id="bestScore">0</span></div>
      <div class="mini-stat"><span data-i18n="hud.kills">Địch hạ</span> <span id="destroyedCount">0</span></div>
      <div class="mini-stat"><span data-i18n="hud.combo">Combo</span> <span id="comboText">x1.00</span></div>
      <div class="combo-bar"><div class="combo-fill" id="comboFill"></div></div>
      <div class="mini-stat" id="endlessText">Vô tận tốt nhất 0s</div>
    </div>

    <div class="panel status-panel">
      <div class="label" data-i18n="hud.health">Máu</div>
      <div class="health-row"><span id="healthText">100 / 100</span></div>
      <div class="bar health-bar"><div class="fill" id="health"></div></div>
      <div class="label" id="energyText">Thunder 0%</div>
      <div class="bar energy-bar"><div class="energy-fill" id="energy"></div></div>
      <div class="power-timers hidden" id="powerTimers"></div>
      <div class="label" id="stageLabel">Stage 1</div>
      <div class="label" id="timeLabel">45s</div>
    </div>

    <div class="panel upgrades-panel">
      <div class="label" data-i18n="hud.upgrades">Nâng cấp</div>
      <div id="upgradeList" class="upgrade-list">Chưa có</div>
    </div>
  </div>

  <button class="mute-button" id="muteBtn" type="button">Sound On</button>
  <button class="skill-button" id="skillBtn" type="button">Thunder</button>
  <button class="pause-button" id="pauseBtn" type="button" aria-label="Pause" data-i18n="controls.pause">Tạm dừng</button>
  <div class="control-dock" id="controlDock">
    <button id="dockPauseBtn" type="button"><kbd>ESC / P</kbd><span data-i18n="controls.pause">Pause</span></button>
    <div><kbd>RMB / Q / E</kbd><span data-i18n="controls.thunder">Thunder</span></div>
    <div><kbd>LMB</kbd><span data-i18n="controls.moveFire">Move + Fire</span></div>
  </div>
  <button class="language-button" id="languageBtn" type="button">VI | EN</button>
  <div class="orientation-hint" id="orientationHint">Rotate to portrait for best experience</div>
  <pre class="debug-overlay hidden" id="debugOverlay"></pre>

  <div class="boss-hud hidden" id="bossHud">
    <div class="label">Boss HP</div>
    <div class="boss-bar"><div class="boss-fill" id="bossHealth"></div></div>
  </div>

  <div class="center" id="overlay">
    <div class="menu">
      <h1 id="menuTitle">Sky Thunder</h1>
      <p class="subtitle" id="menuText">Lái chiến cơ xuyên qua bão mây, sống sót qua 5 chặng và hạ trùm cuối.</p>
      <div class="controls" id="menuControls">
        WASD / phím mũi tên hoặc kéo chuột để di chuyển<br />
        Tự động bắn. Nhấn E hoặc nút Bão Sấm khi đủ 100% năng lượng<br />
        ESC / P để tạm dừng
      </div>
      <div class="upgrade-options hidden" id="upgradeOptions"></div>
      <button id="startBtn">Bắt đầu</button>
      <button id="secondaryBtn" class="secondary hidden">Restart</button>
    </div>
  </div>

  <script>
${scripts}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");
fs.writeFileSync(path.join(root, "Sky-Thunder-Play.html"), html, "utf8");
console.log("Built standalone files: sky-thunder/index.html and sky-thunder/Sky-Thunder-Play.html");
