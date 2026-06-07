export const LANGUAGES = {
  vi: {
    "menu.start": "Bắt đầu", "menu.hangar": "Kho tàu", "menu.intro": "Sống sót qua các đợt tấn công, nạp năng lượng và kích hoạt Bão Sấm.",
    "common.back": "Quay lại", "common.restart": "Chơi lại", "common.mainMenu": "Menu chính", "common.soundOn": "Âm thanh: Bật", "common.soundOff": "Âm thanh: Tắt",
    "language.label": "Ngôn ngữ: Tiếng Việt", "pause.title": "Tạm dừng", "pause.resume": "Tiếp tục", "pause.help": "Chọn thao tác hoặc xem lại hướng dẫn điều khiển.",
    "controls.controls": "Hướng dẫn", "controls.moveFire": "Di chuyển + Bắn", "controls.leftMouse": "Chuột trái", "controls.thunder": "Bão Sấm", "controls.rightKeys": "Chuột phải / Q / E", "controls.pause": "Tạm dừng", "controls.pauseKeys": "ESC / P",
    "hud.score": "Điểm", "hud.best": "Kỷ lục", "hud.kills": "Địch hạ", "hud.combo": "Combo", "hud.endless": "Vô tận", "hud.bestEndless": "Vô tận tốt nhất", "hud.health": "Máu", "hud.upgrades": "Nâng cấp", "hud.stage": "Chặng", "hud.boss": "Trùm", "hud.ship": "Tàu chiến", "hud.gun": "Vũ khí", "hud.none": "Chưa có",
    "thunder.ready": "Bão Sấm sẵn sàng", "thunder.cooldown": "Đang hồi chiêu {seconds}s", "thunder.notReady": "Bão Sấm {percent}%",
    "thunder.noEnergy": "Không đủ năng lượng", "game.over": "Hết trận", "game.overLine": "Phi đội địch vẫn còn trên bầu trời.", "game.victory": "Chiến thắng", "game.victoryLine": "Bạn đã hạ trùm cuối. Tiếp tục vô tận để săn điểm cao hơn.",
    "game.playAgain": "Chơi lại", "game.continueEndless": "Tiếp tục vô tận", "game.summary": "Điểm: {score}. Kỷ lục: {best}. Chặng: {stage}. Địch hạ: {kills}. Combo cao nhất: x{combo}.",
    "upgrade.stageClear": "Hoàn thành chặng", "upgrade.choose": "Chọn 1 nâng cấp để tiếp tục.", "hangar.title": "Kho tàu", "hangar.choose": "Chọn tàu chiến", "hangar.credits": "Tín dụng", "hangar.selected": "Đã chọn", "hangar.unlocked": "Đã mở khóa",
    "power.repair": "HỒI MÁU +18", "power.shield": "KHIÊN +1", "power.bomb": "BOM XUNG KÍCH", "power.rapid": "BẮN NHANH", "power.magnet": "NAM CHÂM", "power.levelUp": "{weapon} LÊN CẤP!", "power.switch": "ĐỔI SANG {weapon}", "power.rapidTimer": "Bắn nhanh", "power.magnetTimer": "Nam châm",
    "orientation": "Xoay dọc màn hình để chơi tốt nhất"
  },
  en: {
    "menu.start": "Start", "menu.hangar": "Hangar", "menu.intro": "Survive enemy waves, charge energy, and unleash Thunder Storm.",
    "common.back": "Back", "common.restart": "Restart", "common.mainMenu": "Main Menu", "common.soundOn": "Sound On", "common.soundOff": "Sound Off",
    "language.label": "Language: English", "pause.title": "Paused", "pause.resume": "Resume", "pause.help": "Choose an action or review the controls.",
    "controls.controls": "Controls", "controls.moveFire": "Move + Fire", "controls.leftMouse": "Left Mouse", "controls.thunder": "Thunder", "controls.rightKeys": "Right Click / Q / E", "controls.pause": "Pause", "controls.pauseKeys": "ESC / P",
    "hud.score": "Score", "hud.best": "Best", "hud.kills": "Kills", "hud.combo": "Combo", "hud.endless": "Endless", "hud.bestEndless": "Best Endless", "hud.health": "HP", "hud.upgrades": "Upgrades", "hud.stage": "Stage", "hud.boss": "Boss", "hud.ship": "Ship", "hud.gun": "Gun", "hud.none": "None",
    "thunder.ready": "Thunder Ready", "thunder.cooldown": "Cooldown {seconds}s", "thunder.notReady": "Thunder {percent}%", "thunder.noEnergy": "Not enough energy",
    "game.over": "Game Over", "game.overLine": "The enemy fleet still controls the sky.", "game.victory": "Victory", "game.victoryLine": "The final boss is down. Continue Endless for a higher score.",
    "game.playAgain": "Play Again", "game.continueEndless": "Continue Endless", "game.summary": "Score: {score}. Best: {best}. Stage: {stage}. Enemies: {kills}. Max combo: x{combo}.",
    "upgrade.stageClear": "Stage Clear", "upgrade.choose": "Choose one upgrade to continue.", "hangar.title": "Hangar", "hangar.choose": "Choose your fighter", "hangar.credits": "Credits", "hangar.selected": "Selected", "hangar.unlocked": "Unlocked",
    "power.repair": "REPAIR +18", "power.shield": "SHIELD +1", "power.bomb": "BOMB BLAST", "power.rapid": "RAPID FIRE", "power.magnet": "MAGNET ON", "power.levelUp": "{weapon} LEVEL UP!", "power.switch": "SWITCHED TO {weapon}", "power.rapidTimer": "Rapid", "power.magnetTimer": "Magnet",
    "orientation": "Rotate to portrait for best experience"
  }
};

let currentLanguage = (() => {
  try { return localStorage.getItem("skyThunderLang") === "en" ? "en" : "vi"; } catch { return "vi"; }
})();

export function getLanguage() { return currentLanguage; }

export function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "vi";
  try { localStorage.setItem("skyThunderLang", currentLanguage); } catch {}
  document.documentElement.lang = currentLanguage;
  window.dispatchEvent(new CustomEvent("skythunderlanguagechange", { detail: currentLanguage }));
  return currentLanguage;
}

export function toggleLanguage() {
  return setLanguage(currentLanguage === "vi" ? "en" : "vi");
}

export function t(key, params = {}) {
  const template = LANGUAGES[currentLanguage]?.[key] || LANGUAGES.vi[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}
