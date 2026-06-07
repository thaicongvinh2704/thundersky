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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
  <title>Sky Thunder</title>
  <style>
${styles}
  </style>
</head>
<body>
  <canvas id="game"></canvas>

  <div class="hud">
    <div class="panel">
      <div class="label">Diem</div>
      <div class="value" id="score">0</div>
      <div class="mini-stat">Best <span id="bestScore">0</span></div>
      <div class="mini-stat">Kills <span id="destroyedCount">0</span></div>
      <div class="mini-stat">Combo <span id="comboText">x1.00</span></div>
      <div class="combo-bar"><div class="combo-fill" id="comboFill"></div></div>
      <div class="mini-stat" id="endlessText">Best Endless 0s</div>
    </div>

    <div class="panel status-panel">
      <div class="label">Mau</div>
      <div class="bar"><div class="fill" id="health"></div></div>
      <div class="label" id="energyText">Thunder 0%</div>
      <div class="bar energy-bar"><div class="energy-fill" id="energy"></div></div>
      <div class="power-timers hidden" id="powerTimers"></div>
      <div class="label" id="stageLabel">Stage 1</div>
      <div class="label" id="timeLabel">45s</div>
    </div>

    <div class="panel upgrades-panel">
      <div class="label">Nang cap</div>
      <div id="upgradeList" class="upgrade-list">Chua co</div>
    </div>
  </div>

  <button class="mute-button" id="muteBtn" type="button">Sound On</button>
  <button class="skill-button" id="skillBtn" type="button">Thunder</button>
  <button class="pause-button" id="pauseBtn" type="button" aria-label="Pause">Pause</button>
  <div class="orientation-hint">Rotate to portrait for best experience</div>
  <pre class="debug-overlay hidden" id="debugOverlay"></pre>

  <div class="boss-hud hidden" id="bossHud">
    <div class="label">Boss HP</div>
    <div class="boss-bar"><div class="boss-fill" id="bossHealth"></div></div>
  </div>

  <div class="center" id="overlay">
    <div class="menu">
      <h1 id="menuTitle">Sky Thunder</h1>
      <p class="subtitle" id="menuText">Lai chien co xuyen qua bao may, song sot qua 5 stage va ha boss cuoi.</p>
      <div class="controls" id="menuControls">
        WASD / mui ten hoac keo chuot de di chuyen<br />
        Auto-fire bat san. Nhan E hoac nut Thunder khi day 100% energy<br />
        P de tam dung. Ha dich va nhat item E de nap Thunder
      </div>
      <div class="upgrade-options hidden" id="upgradeOptions"></div>
      <button id="startBtn">Bat dau</button>
      <button id="secondaryBtn" class="secondary hidden">Restart</button>
    </div>
  </div>

  <script>
${scripts}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);
fs.writeFileSync(path.join(root, "Sky-Thunder-Play.html"), html);
console.log("Built standalone files: sky-thunder/index.html and sky-thunder/Sky-Thunder-Play.html");
